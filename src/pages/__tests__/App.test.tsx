import { render } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import { App } from "../../App";

describe("<App />", () => {
  test("it will render an text input and a button", async () => {
    const { findByPlaceholderText, findByText } = render(() => <App />);
    expect(await findByPlaceholderText("new todo here")).toBeInTheDocument();
    expect(await findByText("Add Todo")).toBeInTheDocument();
  });

  test("it will add a new todo", async () => {
    const { findByPlaceholderText, getByText } = render(() => <App />);
    const input = (await findByPlaceholderText("new todo here")) as HTMLInputElement;
    const button = getByText("Add Todo") as HTMLButtonElement;
    input.value = "test new todo";
    await userEvent.click(button);
    expect(input.value).toBe("");
    expect(getByText(/test new todo/)).toBeInTheDocument();
  });

  test("it will mark a todo as completed", async () => {
    const { findByPlaceholderText, findByText, getByText, getByRole } = render(() => <App />);
    const input = (await findByPlaceholderText("new todo here")) as HTMLInputElement;
    const button = getByText("Add Todo") as HTMLButtonElement;
    input.value = "mark new todo as completed";
    await userEvent.click(button);

    const completed = getByRole("checkbox") as HTMLInputElement;
    expect(completed.checked).toBe(false);
    await userEvent.click(completed);
    expect(completed.checked).toBe(true);
    const text = (await findByText("mark new todo as completed")) as HTMLSpanElement;
    expect(text).toHaveStyle({ "text-decoration": "line-through" });
  });
});
