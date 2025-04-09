import { ComponentChildren } from "npm:preact";
import { FileManager } from "../utils/FileManager.ts";

const css = await FileManager.readFile(`${import.meta.dirname}/style.css`);

class ServerURLManager {
  static readonly serverUrl =
    Deno.env.get("MODE") === "production"
      ? Deno.env.get("SERVER_URL")
      : "http://localhost:8000";

  static formatUrl(path: string) {
    return `${this.serverUrl}${path}`;
  }
}

const Layout = (props: { children: ComponentChildren }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My App</title>
        <style>{css}</style>
      </head>
      <body>{props.children}</body>
    </html>
  );
};

export const HomePage = ({ darkMode }: { darkMode: boolean }) => {
  return (
    <Layout>{darkMode ? <h1>In dark mode</h1> : <h1>In light mode</h1>}</Layout>
  );
};
