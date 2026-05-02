//TODO
import React from "react";
import {
  customRender as render,
  screen,
  logRoles,
} from "../../utils/test-utils";
import ModalUpdate from "../ModalUpdate";

describe("<ModalUpdate />", () => {
  test("success", () => {
    render(<ModalUpdate />);
  });
  test("error", () => {
    render(<ModalUpdate />);
  });
});
