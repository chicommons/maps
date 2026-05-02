import React from "react";
import { screen } from "@testing-library/react";
import { customRender as render } from "../../utils/test-utils";
import Button from "../Button";
import userEvent from "@testing-library/user-event";

describe("<Button/>", () => {
  test("it should be enabled when rendered and disabled is false", () => {
    render(
      <Button
        disabled={false}
        style={{ marginRight: "2em" }}
        className={"buttons"}
        onClick={() => "hello worl"}
        type={"submit"}
        title={"click me"}
      />,
    );
    expect(screen.getByRole("button", { name: "click me" })).toBeEnabled();
    expect(screen.getByRole("button")).toHaveTextContent("click me");
  });
  test("it should be disabled when rendered and disabled is true", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(
      <Button
        disabled={true}
        style={{ marginRight: "2em" }}
        className={"buttons"}
        action={handleClick}
        type={"submit"}
        title={"click me"}
      />,
    );
    const btn = screen.getByRole("button", { name: "click me" });

    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent("click me");
    await user.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(0);
    await user.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(0);
  });
  test("it should be enabled and fire off click event", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(
      <Button
        disabled={false}
        style={{ marginRight: "2em" }}
        className={"buttons"}
        action={handleClick}
        type={"submit"}
        title={"click me"}
      />,
    );

    const btn = screen.getByRole("button", { name: "click me" });
    await user.click(btn);

    expect(handleClick).toHaveBeenCalledTimes(1);
    await user.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(2);
  });
});
