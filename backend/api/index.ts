import { Elysia } from "elysia";

const api = new Elysia({ prefix: "/api" }).get("/hello", () => ({ message: "Hello World API!" }));

export default api;
