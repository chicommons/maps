//TODO
import React from "react";
import {
  customRender as render,
  screen,
  logRoles,
} from "../../utils/test-utils";
import Login from "../Login";

describe("<Login />", () => {
  test("success", () => {
    render(<Login />);
  });
  test("error", () => {
    render(<Login />);
  });
});
