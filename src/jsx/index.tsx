import { ComponentChildren } from "npm:preact";

const Layout = (props: { children: ComponentChildren }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My App</title>
        <link rel="stylesheet" href="/public/css/style.css" />
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
