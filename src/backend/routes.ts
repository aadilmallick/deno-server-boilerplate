import { githubAuth, googleAuth } from "../utils/DenoOAuth.ts";
import { AuthDBControllers } from "./dbControllers.ts";
import { app, MiddleWares } from "./serverControllers.ts";
import { render } from "npm:preact-render-to-string";
import { HomePage } from "../jsx/index.tsx";

export class Routes {
  static initAuthRoutes() {
    app.get("/oauth/github/signin", async (req) => {
      return await githubAuth.signIn(req);
    });

    app.getWithLocalMiddleware(
      "/oauth/github/signout",
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

    app.get("/oauth/google/signin", async (req) => {
      return await googleAuth.signIn(req);
    });

    app.getWithLocalMiddleware(
      "/oauth/google/signout",
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
