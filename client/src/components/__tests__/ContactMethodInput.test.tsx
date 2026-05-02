//TODO
import React from "react";
import {
  customRender as render,
  screen,
  logRoles,
  act,
} from "../../utils/test-utils";
import userEvent from "@testing-library/user-event";
import ContactMethodInput from "../ContactMethodInput";

type Props = {
  contactMethod: {
    type: "EMAIL" | "PHONE";
    is_public: boolean;
    phone: string;
    email: string;
    id: number;
  };
  prefix: string;
  index: number;
  handleContactMethodChange: typeof jest.fn;
  errors: string | string[];
};

describe("<ContactMethodInput />", () => {
  const defaultProps: Props = {
    contactMethod: {
      type: "EMAIL",
      is_public: true,
      phone: "708-444-1234",
      email: "test@hotmail.com",
      id: 12345,
    },
    prefix: "General",
    index: 1,
    handleContactMethodChange: jest.fn(),
    errors: "",
  };
  test("should success", () => {
    render(
      <ContactMethodInput
        contactMethod={undefined}
        index={undefined}
        handleContactMethodChange={undefined}
        errors={undefined}
        parent={undefined}
      />,
    );
  });
  test("should error", () => {
    render(
      <ContactMethodInput
        contactMethod={undefined}
        index={undefined}
        handleContactMethodChange={undefined}
        errors={undefined}
        parent={undefined}
      />,
    );
  });
});
