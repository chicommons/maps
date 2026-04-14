//TODO
import React from "react";
import {
  logRoles,
  customRender as render,
  screen,
  within,
} from "../../utils/test-utils";
import Country from "../Country";
import { countriesSearchResponse } from "./mocks/countriesSearchResponse";
import userEvent from "@testing-library/user-event";

describe("<Country/>", () => {
  const mockProps = {
    title: "Country",
    name: "country",
    countryCode: "US",
    placeholder: "Select Country",
    options: countriesSearchResponse,
    setCountry: jest.fn(),
    value: "United States",
  };
  test("dropdown renders all countries", async () => {
    const user = userEvent.setup();
    render(<Country {...mockProps} />);
    
    const countryDropDown = screen.getByRole("combobox", { name: "Country" });

    countriesSearchResponse.forEach(async (country) => {
      await user.selectOptions(countryDropDown, country.name);
      expect(mockProps.setCountry).toHaveBeenCalledWith(country.name);
    });
  });
});
