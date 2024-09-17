import { treaty } from "@elysiajs/eden";
import { describe, expect, it } from "vitest";

import { app } from "../server";

const api = treaty(app);

describe("Elysia", () => {
  it("return a response", async () => {
    const { data } = await api.api.hello.get();
    expect(data).toEqual({ message: "Hello World API!" });
  });
});
