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

export class ServerURLManager {
  static readonly serverUrl =
    Deno.env.get("MODE") === "production"
      ? Deno.env.get("SERVER_URL")
      : "http://localhost:8000";

  static formatUrl(path: string) {
    return `${this.serverUrl}${path}`;
  }

  static readonly AuthRoutes = Object.freeze({
    githubSignIn: "/oauth/github/signin",
    githubSignOut: "/oauth/github/signout",
    googleSignIn: "/oauth/google/signin",
    googleSignOut: "/oauth/google/signout",
  });
}

export class Intellisense {
  static html(strings: TemplateStringsArray, ...values: any[]) {
    let str = "";
    strings.forEach((string, i) => {
      str += string + (values[i] || "");
    });
    return str;
  }

  static css(strings: TemplateStringsArray, ...values: any[]) {
    let str = "";
    strings.forEach((string, i) => {
      str += string + (values[i] || "");
    });
    return str;
  }
}
