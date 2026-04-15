//TODO

import React from "react";
import { customRender as render, screen, act } from "../../utils/test-utils";
import CoopTypes from "../CoopTypes";
import { CoopType } from "./mocks/coopTypeResponse";

//   className={"required"}
//             name={"types"}
//             suggestions={coopTypes}
//             values={coop.types}
//             placeholder={"Enter coop type(s)"}
//             handleAddition={handleCoopTypeAddition}
//             handleDeletion={handleCoopTypeDeletion}
//             errors={errors}
//             style={inputStyle}

type Props = {
  suggestions: CoopType | CoopType[];
  values: string;
  placeholder: string;
  handleAddition: typeof jest.fn;
  handleDeletion: typeof jest.fn;
  errors: string | string[];
};
describe("<CoopTypes />", () => {
  const defaultProps: Props = {
    suggestions: { id: 123, name: "coopType name" },
    values: "test TODO ",
    placeholder: "Enter coop type(s)",
    handleAddition: jest.fn(),
    handleDeletion: jest.fn(),
    errors: "",
  };
  test("success", () => {
    render(<CoopTypes {...defaultProps} />);
  });
  test("errors", () => {
    render(<CoopTypes {...defaultProps} />);
  });
});
