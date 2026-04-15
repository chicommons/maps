//TODO
import React, { JSX } from "react";
import DropDownInput from "../DropDownInput";
import { customRender as render, screen, act } from "../../utils/test-utils";

type Props = {
  as?: keyof JSX.IntrinsicElements;
  handleChange: typeof jest.fn;
  index: number;
  parent?: string;
  multiple: boolean;
  options: { id: string; name: string } | { id: string; name: string }[];
  title: string;
  type?: string;
  value: string | boolean;
  errors: string | string[];
};

describe("<DropDownInput />", () => {
  const defaultProps: Props = {
    as: "input",
    value: "test TODO ",
    title: "Type",
    index: 23,
    handleChange: jest.fn(),
    multiple: false,
    options: { id: "email", name: "EMAIL" },
    errors: "",
  };
  test("success", () => {
    render(
      <DropDownInput
        as={"select"}
        className={"required"}
        handleChange={jest.fn()}
        index={1}
        parent={parent}
        multiple={""}
        name={"contact_method_type" + 1}
        options={[
          { id: "phone", name: "PHONE" },
          { id: "email", name: "EMAIL" },
        ]}
        title={`Type`}
        type={"select"}
        value={"Phone"}
      />,
    );
  });
  test("errors", () => {
    render(<DropDownInput />);
  });
});
