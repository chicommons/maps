import React from "react";
import { screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Add from "../Add";
import { customRender as render } from "../../utils/test-utils";
import { AlertProvider } from "../AlertProvider";
import { coopTypeResponse } from "./mocks/coopTypeResponse";
import { statesFetchResponse } from "./mocks/statesFetchResponse";
import { countriesSearchResponse } from "./mocks/countriesSearchResponse";
import { verifyAddViewForm } from "../Utils/test-utils";

//mocking to fix SyntaxError: Cannot use import statement outside a module for import { WithContext as ReactTags } from "react-tag-input"; in CoopTypes.jsx
jest.mock("react-tag-input", () => ({
  WithContext: () => <div>ReactTags Mock</div>,
}));
//TODO Verify if /add is a valid path anymore. Test my not be needed.
beforeEach(() => {
  sessionStorage.clear(); // Execute directly

  global.fetch = jest.fn((url) => {
    const urlStr = typeof url === "string" ? url : url.url;

    if (urlStr.includes("/api/v1/coops/types/")) {
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

describe("<Add />", () => {
  test("it should render an header, body text and button", async () => {
    sessionStorage.setItem("token", "valid-web-token");
    render(
      <AlertProvider>
        <Add />
      </AlertProvider>,
    );

    const heading = await screen.findByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Directory Form");

    // 2. Verify level 2 heading
    verifyAddViewForm();
  });
});
