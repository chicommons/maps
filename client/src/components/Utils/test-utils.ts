import {type ByRoleMatcher, screen, within } from "@testing-library/react";
import {
  coopTypeResponse,
} from "../__tests__/mocks/coopTypeResponse";
import {
  statesFetchResponse,
} from "../__tests__/mocks/statesFetchResponse";
import {
  FOOTER_LINKS,
  NEW_USER_NAVBAR_LINKS,
  REQUIRED_DIR_ADD_UPDATE_BUTTONS,
  REQUIRED_DIR_ADD_UPDATE_LABELS,
} from "../__tests__/utils/constants";
import {
  countriesSearchResponse,
} from "../__tests__/mocks/countriesSearchResponse";
import userEvent from "@testing-library/user-event";


export const verifyDropdownOptions = async <T extends { name: string; code?: string }>(
  roleType: ByRoleMatcher,
  labelName: string | RegExp,
  expectedData: T[],
) => {
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

export const verifyLinks = async(parentRoleContainer:ByRoleMatcher,linkArr: {name:string | RegExp, href:string}[])=>{
   const container = screen.getByRole(parentRoleContainer);

  linkArr.forEach(({ name, href }) => {
  expect(within(container).getByRole("link", { name })).toHaveAttribute(
      "href",
      href,
    );
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


//Modal from home page
export const verifyAcknowledgeModal = async(closeAfterVerify: boolean)=> {
  const user = userEvent.setup();
  const closeModalButton = screen.getAllByRole("button", { name: "Close" });
  
    expect(screen.getByText("Welcome!")).toBeInTheDocument();
    expect(
      screen.getByText(/ChiCommons would like to acknowledge/i),
    ).toBeInTheDocument();
    expect(closeModalButton).toHaveLength(2);
    closeModalButton.forEach((item) => {
      expect(item).toBeEnabled();
    });
    //close modal
    if(closeAfterVerify) {
  await user.click(closeModalButton[0]);
    expect(
      screen.queryByText(/ChiCommons would like to acknowledge/i),
    ).not.toBeInTheDocument();
    }
  
}

//Login page

export const verifyLoginPage = async () => {
     expect(screen.getByRole("heading", {level:1})).toHaveTextContent("Login")
      expect(screen.getByText("Please login with your username and password.")).toBeInTheDocument()
     expect(screen.getByLabelText("Username")).toBeInTheDocument()
     expect(screen.getByLabelText("Password")).toBeInTheDocument()
     expect(screen.getByRole("button", {name:"Login"}))
     expect(screen.getByText("Forgot password? Reset it")).toBeInTheDocument()
     await verifyLinks("navigation", NEW_USER_NAVBAR_LINKS);
        await verifyLinks("contentinfo", FOOTER_LINKS);

}
