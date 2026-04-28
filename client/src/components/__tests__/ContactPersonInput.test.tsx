//TODO
import React from "react";
import {
  customRender as render,
  screen,
  logRoles,
  act,
  getByRole,
} from "../../utils/test-utils";
import userEvent from "@testing-library/user-event";
import ContactPersonInput from "../ContactPersonInput";

type Props = {
  person: {
    first_name: string;
    last_name: string;
    is_public: boolean;
    contact_methods:
      | []
      | {
          type: string;
          is_public: "yes" | "no";
          phone: string;
          email: string;
        }[];
  };

  index: number;
  handlePersonChange: typeof jest.fn;
  handleContactMethodChange: typeof jest.fn;
  errors: string | string[];
};

describe("<ContactPersonInput />", () => {
  const defaultProps: Props = {
    person: {
      first_name: "jon",
      last_name: "smith",
      is_public: true,
      contact_methods: [],
    },
    index: 1,
    handlePersonChange: jest.fn(),
    handleContactMethodChange: jest.fn(),
    errors: "",
  };

  test("success", () => {
    render(
      <ContactPersonInput
        person={defaultProps.person}
        index={1}
        handlePersonChange={defaultProps.handlePersonChange}
        handleContactMethodChange={defaultProps.handleContactMethodChange}
        errors={defaultProps.errors}
      />,
    );

    expect(
      screen.getByRole("textbox", {
        name: "Cooperative/Entity Contact First Name",
      }),
    ).toHaveValue("jon");
    expect(
      screen.getByRole("textbox", {
        name: "Cooperative/Entity Contact Last Name",
      }),
    ).toHaveValue("smith");
    expect(
      screen.getByRole("textbox", {
        name: "Contact Person Contact Phone Number",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", {
        name: "contact_person_public1",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", {
        name: "contact_method_type10",
      }),
    ).toBeInTheDocument();
  });

  test.skip("error state", () => {
    render(
      <ContactPersonInput
        person={""}
        index={1}
        handlePersonChange={defaultProps.handlePersonChange}
        handleContactMethodChange={defaultProps.handleContactMethodChange}
        errors={["opps something went wrong"]}
      />,
    );

    expect(
      screen.getByRole("textbox", {
        name: "Cooperative/Entity Contact First Name",
      }),
    ).toHaveTextContent("");
    expect(
      screen.getByRole("textbox", {
        name: "Cooperative/Entity Contact Last Name",
      }),
    ).toHaveTextContent("");
    expect(
      screen.getByRole("textbox", {
        name: "Contact Person Contact Phone Number",
      }),
    ).toHaveTextContent("");
    expect(
      screen.getByRole("combobox", {
        name: "contact_person_public1",
      }),
    ).toHaveTextContent("SelectYesNo");
    expect(
      screen.getByRole("combobox", {
        name: "contact_method_type10",
      }),
    ).toHaveTextContent("SelectPHONEEMAIL");
  });
});
