import { AuthManager, githubAuth, User } from "../utils/DenoOAuth.ts";
import { DenoRouter } from "../utils/DenoRouter.ts";
import { AuthDBControllers } from "../backend/dbControllers.ts";

type AppState = Record<string | number | symbol, never>;
type RequestState = {
  currentUser: null | User;
  sessionId: string | null;
};

export const app = new DenoRouter<AppState, RequestState>(
  {},
  {
    currentUser: null,
    sessionId: null as string | null,
  }
);

export class MiddleWares {
  static userAuthLocalMiddleware = app.produceLocalMiddleware(
    async (_state, req) => {
      const sessionId = await githubAuth.getSessionId(req);
      if (!sessionId) {
        return {
          currentUser: null,
          sessionId: null,
        };
      }
      const user = await AuthDBControllers.getUserFromSessionId(sessionId);
      if (!user) {
        throw new Error(`User not found from session id ${sessionId}`);
      }
      return {
        currentUser: user,
        sessionId: sessionId,
      };
    }
  );
}

export class ServerUtils {
  static async withTryCatch(cb: () => Promise<void>) {
    try {
      await cb();
      return true;
    } catch (error) {
      console.error("Error in operation", error);
      return false;
    }
  }
}
