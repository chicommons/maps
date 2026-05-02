//TODO
import React from "react";
import {
  customRender as render,
  screen,
  logRoles,
} from "../../utils/test-utils";
import ResetVerify from "../ResetVerify";

describe("<ResetVerify />", () => {
  test("success", () => {
    render(<ResetVerify />);
  });
  test("error", () => {
    render(<ResetVerify />);
  });
});
