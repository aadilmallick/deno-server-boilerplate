import { Routes } from "./src/backend/routes.ts";
import { app } from "./src/backend/serverControllers.ts";

app.serveStatic("/public");
Routes.initAuthRoutes();
Routes.initUnprotectedRoutes();

app.initServer();
