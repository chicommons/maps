import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FourZeroFour from "../404";

describe("<FourZeroFour />", () => {
  test("it should render an header, body text and button", async () => {
    render(<FourZeroFour />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "404-Fancy meeting you here!",
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Let's get you back to the ← Home page and try this again.",
    );
    expect(screen.getByRole("link")).toHaveAttribute("href", "./");
    expect(screen.getByRole("link")).toHaveTextContent("← Home");
  });
});
