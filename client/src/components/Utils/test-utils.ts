import {type ByRoleMatcher, fireEvent, screen, within } from "@testing-library/react";
import {
  coopTypeResponse,
} from "../__tests__/mocks/coopTypeResponse";
import {
  statesFetchResponse,
} from "../__tests__/mocks/statesFetchResponse";
import {
  REQUIRED_DIR_ADD_UPDATE_BUTTONS,
  REQUIRED_DIR_ADD_UPDATE_LABELS,
} from "../__tests__/utils/constants";
import {
  countriesSearchResponse,
} from "../__tests__/mocks/countriesSearchResponse";


export const verifyDropdownOptions = async <T extends { name: string; code?: string }>(
  roleType: ByRoleMatcher,
  labelName: string | RegExp,
  expectedData: T[],
) => {
  // Use a regex for the label to be safe with casing/wildcards
  const selectTag =  screen.getByRole(roleType, {
    name: labelName,
  });
  const options = await within(selectTag).findAllByRole("option") as HTMLOptionElement[];

  const optionTexts = options.map((opt) => opt.textContent);
  const optionValues = options.map((opt) => opt.value);

  expectedData.forEach(({ name, code }) => {
    expect(optionTexts).toContain(name);
    if (code) {
      expect(optionValues).toContain(code);
    }
  });
};

export const verifyButtons = async (buttonNames: string[], isEnabled: boolean)=> {
   buttonNames.forEach((name) => {
    const button = screen.getByRole("button", {
      name: name,
    });
    expect(button).toBeInTheDocument();
    if(isEnabled) {
    expect(button).toBeEnabled();

    }
})
}

export const verifyFormLabels = async (formLabel:string[])=> {
   formLabel.forEach((label) => {
    expect(screen.getByLabelText(label)).toBeInTheDocument();
  });

}

//<DirectoryAddUpdate/> component View
export const verifyDirectoryAddUpdateView = async () => {
  const heading = await screen.findByRole("heading", { level: 1 });
  expect(heading).toBeInTheDocument();

  await verifyFormLabels(REQUIRED_DIR_ADD_UPDATE_LABELS)
  await verifyButtons(REQUIRED_DIR_ADD_UPDATE_BUTTONS, true)
  await verifyDropdownOptions("combobox", /state/i, statesFetchResponse);
  await verifyDropdownOptions("combobox", /country/i, countriesSearchResponse);
  await verifyDropdownOptions("listbox", /entity_types/i, coopTypeResponse);

};
