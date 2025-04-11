import { githubAuth, googleAuth } from "../utils/DenoOAuth.ts";
import { AuthDBControllers } from "./dbControllers.ts";
import { app, MiddleWares } from "./serverControllers.ts";
import { render } from "npm:preact-render-to-string";
import { HomePage } from "../jsx/index.tsx";
import { ServerURLManager } from "../utils/ServerUtils.ts";

export class Routes {
  static initAuthRoutes() {
    app.get(ServerURLManager.AuthRoutes.githubSignIn, async (req) => {
      return await githubAuth.signIn(req);
    });

    app.getWithLocalMiddleware(
      ServerURLManager.AuthRoutes.githubSignOut,
      [MiddleWares.userAuthLocalMiddleware],
      async (req) => {
        const { sessionId } = app.getRequestPayload(req);
        if (sessionId) {
          await AuthDBControllers.removeSession(sessionId);
        }
        return await githubAuth.signOut(req);
      }
    );

    app.get(githubAuth.redirectUriPath, async (req: Request) => {
      const response = await githubAuth.onGithubCallback(
        req,
        async (sessionId, userData) => {
          await AuthDBControllers.storeUser(sessionId, userData);
        }
      );
      return response;
    });

    app.get(ServerURLManager.AuthRoutes.googleSignIn, async (req) => {
      return await googleAuth.signIn(req);
    });

    app.getWithLocalMiddleware(
      ServerURLManager.AuthRoutes.googleSignOut,
      [MiddleWares.userAuthLocalMiddleware],
      async (req) => {
        const { sessionId } = app.getRequestPayload(req);
        if (sessionId) {
          await AuthDBControllers.removeSession(sessionId);
        }

        return await googleAuth.signOut(req);
      }
    );
    app.get(googleAuth.redirectUriPath, async (req: Request) => {
      const response = await googleAuth.onGoogleCallback(
        req,
        async (sessionId, userData) => {
          await AuthDBControllers.storeUser(sessionId, userData);
        }
      );
      return response;
    });

    app.getWithLocalMiddleware(
      "/logout",
      [MiddleWares.userAuthLocalMiddleware],
      (req) => {
        const { currentUser } = app.getRequestPayload(req);
        if (!currentUser) {
          return app.json(
            {
              message: "No user logged in",
            },
            401
          );
        }
        if (currentUser.type === "github") {
          return app.redirect(ServerURLManager.AuthRoutes.githubSignOut);
        } else if (currentUser.type === "google") {
          return app.redirect(ServerURLManager.AuthRoutes.googleSignOut);
        } else {
          return app.redirect(ServerURLManager.AuthRoutes.googleSignOut);
        }
      }
    );
  }

  static initUnprotectedRoutes() {
    app.get("/", () => {
      const html = render(
        HomePage({
          darkMode: false,
        })
      );
      return app.renderHTML(html, 200);
    });
  }
}
