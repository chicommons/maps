//TODO
import React from "react";
import {
  customRender as render,
  screen,
  logRoles,
  act,
} from "../../utils/test-utils";
import userEvent from "@testing-library/user-event";
import ContactPersonInput from "../ContactPersonInput";

type Props = {
  person: {
    first_name: string;
    last_name: string;
    is_public: boolean;
    contact_methods: [] | string[];
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
        person={undefined}
        index={undefined}
        handlePersonChange={undefined}
        handleContactMethodChange={undefined}
        errors={undefined}
      />,
    );
  });

  test("error state", () => {
    render(
      <ContactPersonInput
        person={undefined}
        index={undefined}
        handlePersonChange={undefined}
        handleContactMethodChange={undefined}
        errors={undefined}
      />,
    );
  });
});
