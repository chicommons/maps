//TODO need to complete
import React from "react";
import {
  customRender as render,
  screen,
  act,
  logRoles,
} from "../../utils/test-utils";
import Edit from "../Edit";
import { MemoryRouter, Route } from "react-router-dom";
import { coopTypeResponse } from "./mocks/coopTypeResponse";
import { statesFetchResponse } from "./mocks/statesFetchResponse";
import { countriesSearchResponse } from "./mocks/countriesSearchResponse";

//mocking to fix SyntaxError: Cannot use import statement outside a module for import { WithContext as ReactTags } from "react-tag-input"; in CoopTypes.jsx
jest.mock("react-tag-input", () => ({
  WithContext: () => <div>ReactTags Mock</div>,
}));

beforeEach(async () => {
  sessionStorage.clear();

  global.fetch = jest.fn((url) => {
    console.log(" thisi s the url", url);
    const urlStr = typeof url === "string" ? url : url.url;
    const urlParts = urlStr.split("/");
    const lastVal = urlParts[-1];
    if (urlStr.includes("/api/v1/coops/types/")) {
      return Promise.resolve({
        json: () => Promise.resolve(coopTypeResponse),
      });
    } else if (urlStr.includes("/api/v1/coops/")) {
      return Promise.resolve({
        json: () =>
          Promise.resolve(
            coopTypeResponse.filter((item) => item.id === lastVal),
          ),
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
    if (urlStr.includes("/api/people?coop")) {
      return Promise.resolve({
        id: lastVal,
        first_name: "john",
        last_name: "dough",
        coops: lastVal,
        contact_methods: [
          {
            type: "PHONE",
            phone: "800-588-2300",
          },
          {
            type: "EMAIL",
            email: "example@gmail.com",
          },
        ],
      });
    }

    return Promise.reject(new Error(`Unknown API call: ${urlStr}`));
  }) as jest.Mock;
});

describe("<Edit />", () => {
  test("success", async () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/edit/123/home"]}>
        <Route path='/edit/:id/:tab' component={Edit} />
      </MemoryRouter>,
    );
    logRoles(container);
    // expect(screen.getByRole("heading", { level: 5 })).toHaveTextContent(
    //   "coopName",
    // );
    await screen.findByText(/Expected Coop Name/i);
    expect("coopName").toBeInTheDocument();
  });
  test.skip("error", () => {
    render(
      <MemoryRouter initialEntries={["/directory-additions-updates"]}>
        <Edit />
      </MemoryRouter>,
    );
  });
});
