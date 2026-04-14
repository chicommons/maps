import React from "react";
import { screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Search from "../Search.jsx";
import { customRender as render } from "../../utils/test-utils";
import { coopTypeResponse } from "./mocks/coopTypeResponse";
import { statesFetchResponse } from "./mocks/statesFetchResponse";
import { verifyDropdownOptions } from "../Utils/test-utils";
//TODO finish up testing

beforeEach(() => {
  () => sessionStorage.clear();
  // Standard default success mock
  global.fetch = jest.fn((url) => {
    console.log("this is the url", url);
    if (typeof url === "string" && url.includes("v1/coops/types/"))
      return Promise.resolve({
        json: () => act(() => Promise.resolve(coopTypeResponse)),
      });
    if (typeof url === "string" && url.includes("/states/"))
      return Promise.resolve({
        json: () => Promise.resolve(statesFetchResponse),
      });
    return Promise.reject(new Error("Unknown"));
  }) as jest.Mock;
});

describe("<Search/>", () => {
  test.only("it should render all inputs and options ", async () => {
    sessionStorage.setItem("token", "valid-web-token");
    render(<Search />);

    // 2. Look specifically inside that select
    await verifyDropdownOptions("listbox", /CoOp Type/i, coopTypeResponse);
    await verifyDropdownOptions("combobox", /state/i, statesFetchResponse);
  });
  test.skip("it should render loading when fetching submission", () => {});
  test.skip("it should render results when button is submitted", () => {});
  test.skip("it should render filtered results", () => {});
  test.skip("it should show spreadsheet when user is authenticated", () => {});

  test.skip('test if "loading" message appears after submitting a search', async () => {
    render(<Search />);

    screen.getByRole("textbox", { name: "Name" });
    userEvent.type(screen.getByRole("textbox", { name: "Name" }), "1335 ASTOR");
    userEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() => screen.findByText(/Loading/i));

    expect(screen.getByText(/Loading.../i)).toHaveTextContent("Loading...");
  });
});
