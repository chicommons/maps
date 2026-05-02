//TODO
import React from "react";
import {
  customRender as render,
  screen,
  logRoles,
} from "../../utils/test-utils";
import RenderCoopList from "../RenderCoopList";

describe("<RenderCoopList />", () => {
  test("success", () => {
    render(<RenderCoopList />);
  });
  test("error", () => {
    render(<RenderCoopList />);
  });
});
