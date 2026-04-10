import React from "react";
import { screen, act, logRoles } from "@testing-library/react";
import "@testing-library/jest-dom";
import { customRender as render } from "../../utils/test-utils";
import { AlertProvider } from "../AlertProvider";
import { coopTypeResponse } from "./mocks/coopTypeResponse";
import { statesFetchResponse } from "./mocks/statesFetchResponse";
import { countriesSearchResponse } from "./mocks/countriesSearchResponse";
import { verifyDirectoryAddUpdateView } from "../Utils/test-utils";
import DirectoryAddUpdate from "../DirectoryAddUpdate";
import { MemoryRouter, Route } from "react-router-dom";

//mocking to fix SyntaxError: Cannot use import statement outside a module for import { WithContext as ReactTags } from "react-tag-input"; in CoopTypes.jsx
jest.mock("react-tag-input", () => ({
  WithContext: () => <div>ReactTags Mock</div>,
}));
beforeEach(() => {
  sessionStorage.clear();

  global.fetch = jest.fn((url) => {
    const urlStr = typeof url === "string" ? url : url.url;

    if (
      urlStr.includes("/api/v1/coops/types/") ||
      urlStr.includes("predefined_types")
    ) {
      return Promise.resolve({
        json: () => Promise.resolve(coopTypeResponse),
      });
    }
    if (urlStr.includes("/states/")) {
      return Promise.resolve({
        json: () => Promise.resolve(statesFetchResponse),
      });
    }
    if (urlStr.includes("/countries/")) {
      return Promise.resolve({
        json: () => Promise.resolve(countriesSearchResponse),
      });
    }

    return Promise.reject(new Error(`Unknown API call: ${urlStr}`));
  }) as jest.Mock;
});

describe("<DirectoryAddUpdate />", () => {
  test("it should render an header, body text and button", async () => {
    //TODO move to own setAuth function possibily
    sessionStorage.setItem("token", "valid-web-token");
    render(
      <MemoryRouter initialEntries={["/directory-additions-updates"]}>
        {/* Notice the :id suffix in the path below */}
        <Route path='/directory-additions-updates'>
          <AlertProvider>
            <DirectoryAddUpdate />
          </AlertProvider>
        </Route>
      </MemoryRouter>,
    );

    const heading = await screen.findByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Directory Form");
    const headingDescription = await screen.findAllByRole("heading", {
      level: 2,
    });
    expect(headingDescription[0]).toHaveTextContent(
      "Use this form to add or request the update of a solidarity entity",
    );
    expect(headingDescription[1]).toHaveTextContent("*");
    await verifyDirectoryAddUpdateView();
    // 2. Verify level 2 heading
  });
  test("TODO verify :id path", async () => {
    render(
      <MemoryRouter initialEntries={["/directory-additions-updates"]}>
        {/* Notice the :id suffix in the path below */}
        <Route path='/directory-additions-updates'>
          <AlertProvider>
            <DirectoryAddUpdate />
          </AlertProvider>
        </Route>
      </MemoryRouter>,
    );

    const heading = await screen.findByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Directory Form");
    const headingDescription = await screen.findAllByRole("heading", {
      level: 2,
    });
    expect(headingDescription[0]).toHaveTextContent(
      "Use this form to add or request the update of a solidarity entity",
    );
    expect(headingDescription[1]).toHaveTextContent("*");
    await verifyDirectoryAddUpdateView();
    // 2. Verify level 2 heading
  });
});
