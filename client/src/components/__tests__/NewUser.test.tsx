//TODO
import React from "react";
import userEvent from "@testing-library/user-event";
import { customRender as render, screen } from "../../utils/test-utils";
import NewUser from "../NewUser";
import { MemoryRouter } from "react-router-dom";

global.fetch = jest.fn();
describe("<NewUser />", () => {
  const requireInputs = [
    "First Name",
    "Last Name",
    "Username",
    "Password",
    "Confirm Password",
    "Email",
  ];
  test("should render success when all inputs are filled out", async () => {
    sessionStorage.setItem("token", "valid-web-token");
    const user = userEvent.setup();
    // Mock a successful fetch response
    //TODO fix ts error
    //@ts-ignore
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(
      <MemoryRouter>
        <NewUser />
      </MemoryRouter>,
    );

    const signupButton = screen.getByRole("button", { name: "Sign Up" });
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Sign Up",
    );
    requireInputs.forEach((item) => {
      expect(
        screen.queryByRole("textbox", { name: item }) ||
          screen.getByLabelText(item),
      ).toBeInTheDocument();
    });
    await user.type(
      screen.getByRole("textbox", { name: requireInputs[0] }),
      "Jo",
    );
    await user.type(
      screen.getByRole("textbox", { name: requireInputs[1] }),
      "Smith",
    );
    await user.type(
      screen.getByRole("textbox", { name: requireInputs[2] }),
      "jsmith",
    );
    await user.type(screen.getByLabelText(requireInputs[3]), "password123");
    await user.type(screen.getByLabelText(requireInputs[4]), "password123");
    await user.type(
      screen.getByRole("textbox", { name: requireInputs[5] }),
      "userName@hotmail.com",
    );
    await user.click(signupButton);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/auth/register/"),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Token valid-web-token",
        }),
        body: expect.stringContaining(
          '{"first_name":"Jo","last_name":"Smith","username":"jsmith","password":"password123","email":"userName@hotmail.com"}',
        ),
      }),
    );
  });

  test("should render an error message when passwords don't match", async () => {
    sessionStorage.setItem("token", "valid-web-token");
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <NewUser />
      </MemoryRouter>,
    );
    const signupButton = screen.getByRole("button", { name: "Sign Up" });
    await user.type(
      screen.getByRole("textbox", { name: requireInputs[0] }),
      "Jo",
    );
    await user.type(
      screen.getByRole("textbox", { name: requireInputs[1] }),
      "Smith",
    );
    await user.type(
      screen.getByRole("textbox", { name: requireInputs[2] }),
      "jsmith",
    );
    await user.type(screen.getByLabelText(requireInputs[3]), "password123");
    await user.type(screen.getByLabelText(requireInputs[4]), "password1234");
    await user.type(
      screen.getByRole("textbox", { name: requireInputs[5] }),
      "userName@hotmail.com",
    );
    await user.click(signupButton);

    expect(fetch).toHaveBeenCalledTimes(0);
    expect(screen.getByText("Must match password")).toBeInTheDocument();
  });
  test.skip("should display an error message submit button is clicked but required forms are missing", async () => {
    //TODO NewUser component needs to be updated to reflect error states
    sessionStorage.setItem("token", "valid-web-token");
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <NewUser />
      </MemoryRouter>,
    );
    const signupButton = screen.getByRole("button", { name: "Sign Up" });
    // await user.type(
    //   screen.getByRole("textbox", { name: requireInputs[0] }),
    //   "Jo",
    // );
    await user.type(
      screen.getByRole("textbox", { name: requireInputs[1] }),
      "Smith",
    );
    await user.type(
      screen.getByRole("textbox", { name: requireInputs[2] }),
      "jsmith",
    );
    await user.type(screen.getByLabelText(requireInputs[3]), "password123");
    await user.type(screen.getByLabelText(requireInputs[4]), "password123");
    await user.type(
      screen.getByRole("textbox", { name: requireInputs[5] }),
      "userName@hotmail.com",
    );
    await user.click(signupButton);
    // expect(screen.getByText("Must match password")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(0);
  });
});
