//TODO
//TODO
import React from "react";
import {
  customRender as render,
  screen,
  logRoles,
} from "../../utils/test-utils";
import ResetPassword from "../ResetPassword";

describe("<ResetPassword />", () => {
  test("success", () => {
    render(<ResetPassword />);
  });
  test("error", () => {
    render(<ResetPassword />);
  });
});
