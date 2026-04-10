import React from "react";
import {
  customRender as render,
  screen,
  logRoles,
} from "../../utils/test-utils";
import DirectoryApp from "../DirectoryApp";
import { verifyAcknowledgeModal, verifyLinks } from "../Utils/test-utils";
import {
  FOOTER_LINKS,
  LOGGED_IN_USER_NAVBAR_LINKS,
  NEW_USER_NAVBAR_LINKS,
} from "./utils/constants";

//mocking to fix SyntaxError: Cannot use import statement outside a module for import { WithContext as ReactTags } from "react-tag-input"; in CoopTypes.jsx
jest.mock("react-tag-input", () => ({
  WithContext: () => <div>ReactTags Mock</div>,
}));

beforeEach(async () => {
  sessionStorage.clear();

  //   global.fetch = jest.fn((url) => {
  //     const urlStr = typeof url === "string" ? url : url.url;

  //     if (
  //       urlStr.includes("/api/v1/coops/types/") ||
  //       urlStr.includes("predefined_types")
  //     ) {
  //       return Promise.resolve({
  //         json: () => Promise.resolve(coopTypeResponse),
  //       });
  //     }
  //     if (urlStr.includes("/states/")) {
  //       return Promise.resolve({
  //         json: () => Promise.resolve(statesFetchResponse),
  //       });
  //     }
  //     if (urlStr.includes("/countries/")) {
  //       return Promise.resolve({
  //         json: () => Promise.resolve(countriesSearchResponse),
  //       });
  //     }

  //     return Promise.reject(new Error(`Unknown API call: ${urlStr}`));
  //   }) as jest.Mock;
});

describe("<DirectoryApp/>", () => {
  describe("authorized user", () => {
    test("Navigation through pages", async () => {
      sessionStorage.setItem("token", "valid-web-token");

      const { container } = render(<DirectoryApp />);
      await verifyAcknowledgeModal(true);

      await verifyLinks("navigation", LOGGED_IN_USER_NAVBAR_LINKS);
      await verifyLinks("contentinfo", FOOTER_LINKS);
      logRoles(container);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Chicago's Cooperative and Solidarity Map",
      );
    });
  });

  describe("unauthorized user", () => {
    test("Navigation through pages", async () => {
      const { container } = render(<DirectoryApp />);
      await verifyAcknowledgeModal(true);
      logRoles(container);
      await verifyLinks("navigation", NEW_USER_NAVBAR_LINKS);
      await verifyLinks("contentinfo", FOOTER_LINKS);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Chicago's Cooperative and Solidarity Map",
      );
    });
  });
});
