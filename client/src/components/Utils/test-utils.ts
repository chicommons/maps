import { fireEvent, screen, within } from "@testing-library/react";
import { coopTypeResponse } from "../__tests__/mocks/coopTypeResponse";
import { statesFetchResponse } from "../__tests__/mocks/statesFetchResponse";

//<Search/> component View
export const verifyCoOpTypeOption = async () => {
  const selectTag = screen.getByRole("listbox", { name: "type" });
  const options = await within(selectTag).findAllByRole("option");

  // 3. Check the text content of the options
  const optionTexts = options.map((opt) => opt.textContent);
  expect(optionTexts).toContain("Credit Union");

  coopTypeResponse.forEach(({ name }) => {
    expect(optionTexts).toContain(name);
  });
};

export const verifyStateTypeOption = async () => {
  const selectTag = screen.getByRole("combobox", { name: "State" });

  const options = await within(selectTag).findAllByRole("option");

  // 3. Check the text content of the options
  const optionTexts = options.map((opt) => opt.textContent);
  expect(optionTexts).toContain("Credit Union");
  console.log("my text options", optionTexts);
  statesFetchResponse.forEach(({ name }) => {
    expect(optionTexts).toContain(name);
  });
};
