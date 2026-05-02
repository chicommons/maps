import React from "react";
import { MemoryRouter, Route, Switch } from "react-router-dom";
import { screen } from "@testing-library/react";
import CancelButton from "../CancelButton";
import { customRender as render } from "../../utils/test-utils";
import userEvent from "@testing-library/user-event";

describe("<CancelButton />", () => {
  test("navigates to home when no id is provided", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/cancel-page"]}>
        <Switch>
          <Route path='/cancel-page'>
            <CancelButton />
          </Route>
          <Route path='/'>
            <div>Home Page</div>
          </Route>
        </Switch>
      </MemoryRouter>,
    );

    const btn = screen.getByRole("button", { name: /cancel/i });
    await user.click(btn);

    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });
  test("returns to previous page when id is provided", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={["/previous-page", "/current-page"]}
        initialIndex={1}
      >
        <Switch>
          <Route path='/previous-page'>
            <div>Back at Previous Page</div>
          </Route>
          <Route path='/current-page'>
            <CancelButton id='123' />
          </Route>
          <Route path='/'>
            <div>Home Page</div>
          </Route>
        </Switch>
      </MemoryRouter>,
    );

    const btn = screen.getByRole("button", { name: /cancel/i });
    await user.click(btn);

    expect(screen.getByText(/back at previous page/i)).toBeInTheDocument();
  });
});
