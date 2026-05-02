//TODO
import React from "react";
import {
  customRender as render,
  screen,
  logRoles,
} from "../../utils/test-utils";
import HomePageWithModal from "../HomePageWithModal";

describe("<HomePageWithModal/>", () => {
  test("success", () => {
    render(<HomePageWithModal />);
  });
  test("error", () => {
    render(<HomePageWithModal />);
  });
});
