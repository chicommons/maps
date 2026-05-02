//TODO
import React from "react";
import {
  customRender as render,
  screen,
  logRoles,
} from "../../utils/test-utils";
import PrivateRoute from "../PrivateRoute";

describe("<PrivateRoute />", () => {
  test("success", () => {
    render(<PrivateRoute component={undefined} authed={undefined} />);
  });
  test("error", () => {
    render(<PrivateRoute component={undefined} authed={undefined} />);
  });
});
