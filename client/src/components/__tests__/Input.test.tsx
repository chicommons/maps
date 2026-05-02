//TODO
import React from "react";
import {
  customRender as render,
  screen,
  logRoles,
} from "../../utils/test-utils";
import Input from "../Input";

describe("<Input />", () => {
  test("success", () => {
    render(<Input />);
  });
  test("error", () => {
    render(<Input />);
  });
});
