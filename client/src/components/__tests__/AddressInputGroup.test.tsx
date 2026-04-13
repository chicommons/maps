//TODO

import React from "react";
import {
  fireEvent,
  logRoles,
  customRender as render,
  screen,
  within,
} from "../../utils/test-utils";
import AddressInputGroup from "../AddressInputGroup";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { click } from "@testing-library/user-event/dist/cjs/convenience/click.js";

describe("AddressInputGroup", () => {
  const mockProps = {
    street: "123 React Lane",
    city: "Chicago",
    state: "Il",
    zip: "60642",
    index: 0,
    county: "Cook",
    country: "US",
    addressPublic: "yes",
    setStreet: jest.fn(),
    setCity: jest.fn(),
    setState: jest.fn(),
    setZip: jest.fn(),
    setCounty: jest.fn(),
    setCountry: jest.fn(),
    setAddressPublic: jest.fn(),
    errors: {},
    provinces: [{ id: "CA", name: "California" }],
    countries: [{ id: "US", name: "United States" }],
  };

  const renderComponent = (props = mockProps) => {
    return render(
      <MemoryRouter>
        <AddressInputGroup {...props} />
      </MemoryRouter>,
    );
  };

  test("renders all input fields with initial values", () => {
    renderComponent();
    expect(screen.getByRole("textbox", { name: "Street Address" })).toHaveValue(
      "123 React Lane",
    );
    expect(screen.getByRole("textbox", { name: "City" })).toHaveValue(
      "Chicago",
    );
    expect(screen.getByRole("textbox", { name: "Zip Code" })).toHaveValue(
      "60642",
    );
    expect(screen.getByRole("textbox", { name: "County" })).toHaveValue("Cook");
  });

  test("calls setStreet when the street address changes", () => {
    renderComponent();
    const streetInput = screen.getByPlaceholderText(/Address street/i);
    fireEvent.change(streetInput, { target: { value: "456 New St" } });

    expect(mockProps.setStreet).toHaveBeenCalledWith("456 New St");
  });

  test("calls setAddressPublic when the dropdown changes", async () => {
    const user = userEvent.setup();
    const { container } = renderComponent();
    logRoles(container);
    const publicDropdown = screen.getByRole("combobox", {
      name: "address_public",
    });
    // await user.click(publicDropdown);
    expect(screen.getByRole("option", { name: "Yes" })).toBeVisible();

    expect(screen.getByRole("option", { name: "No" })).toBeVisible();
    // 1. You select "Yes"
    await user.selectOptions(publicDropdown, "Yes");

    expect(mockProps.setAddressPublic).toHaveBeenCalledWith("Yes");
    await user.selectOptions(publicDropdown, "No");

    expect(mockProps.setAddressPublic).toHaveBeenCalledWith("No");
  });

  test("displays error messages if passed in the errors prop", () => {
    const propsWithErrors = {
      ...mockProps,
      errors: { street: "Street is required" },
    };

    renderComponent(propsWithErrors);

    expect(screen.getByText("Street is required")).toBeInTheDocument();
  });
});
