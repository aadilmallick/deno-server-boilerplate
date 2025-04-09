import { KVDB } from "../utils/DenoKV.ts";
import {
  AuthManager,
  GitHubUser,
  GoogleUser,
  User,
} from "../utils/DenoOAuth.ts";

export const kvdb = await KVDB.init();

const usersTable = kvdb.getTable<[string], User>(["users"]);
const sessionsTable = kvdb.getTable<
  [string],
  {
    userId: string;
  }
>(["sessions"]);

export class AuthDBControllers {
  static async storeUser(sessionId: string, userData: GitHubUser | GoogleUser) {
    const user = AuthManager.validateUser(userData);
    // 1. store ["sessions", sessionId] -> userId
    // 2. store ["users", userId] -> user
    const response = await kvdb.atomic([
      sessionsTable.produceSetAction([sessionId], { userId: user.userId }),
      usersTable.produceSetAction([user.userId], user),
    ]);
    return response.ok;
  }

  static async getUserFromSessionId(sessionId: string) {
    const session = await sessionsTable.get([sessionId]);
    if (!session.value) {
      return null;
    }
    const user = await usersTable.get([session.value.userId]);
    return user.value;
  }

  static async removeSession(sessionId: string) {
    await sessionsTable.delete([sessionId]);
  }
}
