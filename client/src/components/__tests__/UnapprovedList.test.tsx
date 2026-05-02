import React from "react";
import {
    logRoles,
  customRender as render,
  screen,
  waitFor,
} from "../../utils/test-utils";
import UnapprovedList from "../UnapprovedList";
import { coopProposalResonse } from "./mocks/coopProposalResponse";
import { coopAddressSearchResponse } from "./mocks/coopAddressSearchResponse";
//TODO Finish tests
beforeEach(() => {
  sessionStorage.clear();
  global.fetch = jest.fn((url) => {
    const urlStr = typeof url === "string" ? url : url.url;
    if (urlStr.includes("coops/unapproved")) {
      return Promise.resolve({
        ok: true, // Important: your component checks if (!res.ok)
        json: () =>
          Promise.resolve([
            {
              model: "directory.coopproposal",
              pk: 1,
              fields: {
                name: "Test Cooperative", // Added for RenderCoopList

                address: {
                  street_address: "123 Main St",
                  city: "Chicago",
                  state: "IL",
                  postal_code: "60601",
                },

                proposal_status: "APPROVED",
                operation: "CREATE",
                // ... rest of your fields
              },
            },
          ]),
      });
    }
    return Promise.reject(new Error(`Unknown API call: ${urlStr}`));
  }) as jest.Mock;
});

describe("<UnapprovedList/>", () => {
  test("successfully renders list after fetching data", async () => {
   const {container} = render(<UnapprovedList />);
  logRoles(container)
    // 1. Verify loading state appears first
    expect(
      screen.getByText(/Loading unapproved coops.../i),
    ).toBeInTheDocument();

    // 2. Wait for the async data to load and headers to appear
    // findBy methods use waitFor under the hood
    const header1 = await screen.findByRole("columnheader", {
      name: /Unapproved Entities/i,
    });
    const header2 = await screen.findByRole("columnheader", {
      name: /Review/i,
    });

    expect(header1).toBeInTheDocument();
    expect(header2).toBeInTheDocument();

    // 3. Verify that the mocked data is rendered (from coopProposalResonse)
    // Assuming RenderCoopList displays the fields.name or similar
    await waitFor(() => {
      expect(
        screen.queryByText(/Loading unapproved coops.../i),
      ).not.toBeInTheDocument();
    });
  });
});
