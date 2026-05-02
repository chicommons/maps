//TODO
import React from "react";
import {
  customRender as render,
  act,
  logRoles,
  screen,
} from "../../utils/test-utils";
import TextAreaInput from "../TextAreaInput";

describe("<TextAreaInput />", () => {
  test.skip("success", () => {
    const { container } = render(
      <TextAreaInput
        type={"textarea"}
        as={"textarea"}
        title={"Entity Description (English)"}
        name={"description"}
        value={""}
        placeholder={"Enter entity description (English)"}
        handleChange={jest.fn()}
        errors={[]}
      />,
    );

    logRoles(container);
    expect(
      screen.getByRole("textbox", { name: "Entity Description (English)" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Entity Description (English)"));
    expect(
      screen.getByPlaceholderText("Enter entity description (English)"),
    ).toBeInTheDocument();
  });
  test("error", () => {
    const { container } = render(
      <TextAreaInput
        type={"textarea"}
        as={"textarea"}
        title={"Entity Description (English)"}
        name={"description"}
        value={""}
        placeholder={"Enter entity description (English)"}
        handleChange={jest.fn()}
        errors={["password too short", "throw an error"]}
      />,
    );

    logRoles(container);
    expect(
      screen.getByRole("textbox", { name: "Entity Description (English)" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Entity Description (English)"));
    expect(
      screen.getByPlaceholderText("Enter entity description (English)"),
    ).toBeInTheDocument();
    expect(screen.getByText("password too short")).toBeInTheDocument();
    expect(screen.getByText("throw an error")).toBeInTheDocument();
  });
});
