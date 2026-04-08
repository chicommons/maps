import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import "@testing-library/jest-dom";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import App from "./App";
import { verifyFooter, verifyNavBar } from "./utils/test-utils";

//mocking to fix SyntaxError: Cannot use import statement outside a module for import { WithContext as ReactTags } from "react-tag-input"; in CoopTypes.jsx
jest.mock("react-tag-input", () => ({
  WithContext: () => <div>ReactTags Mock</div>,
}));

test("full app rendering/navigating", async () => {
  const history = createMemoryHistory();
  render(
    <Router history={history}>
      <App />
    </Router>,
  );
  const user = userEvent.setup();
  //verify modal pops up
  const closeModalButton = screen.getAllByRole("button", { name: "Close" });

  expect(screen.getByText("Welcome!")).toBeInTheDocument();
  expect(
    screen.getByText(/ChiCommons would like to acknowledge/i),
  ).toBeInTheDocument();
  expect(closeModalButton).toHaveLength(2);
  closeModalButton.forEach((item) => {
    expect(item).toBeEnabled();
  });
  //close modal
  await user.click(closeModalButton[0]);
  expect(
    screen.queryByText(/ChiCommons would like to acknowledge/i),
  ).not.toBeInTheDocument();

  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Chicago's Cooperative and Solidarity Map",
  );
  const mapIframe = screen.getByTitle(
    "Chicago's Cooperative and Solidarity Map",
  );
  expect(mapIframe).toBeInTheDocument();

  //verify navbar and footer links
  verifyNavBar(false);
  verifyFooter();
});

//TODO. Currently does not work due to BrowserRouter ignoring history obj. Update once update to React Router Dom 6
test.skip("landing on a bad page", async () => {
  const history = createMemoryHistory();
  history.push("/some/bad/route");
  render(
    <Router history={history}>
      <App />
    </Router>,
  );

  // verify navigation to "no match" route
  expect(screen.getByText("404-Fancy meeting you here!")).toBeInTheDocument();
});
