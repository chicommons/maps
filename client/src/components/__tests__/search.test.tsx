import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Search from "../Search.jsx";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ test: 100 }),
  }),
) as jest.Mock;

describe("<Search/>", () => {
  test('test if "loading" message appears after submitting a search', async () => {
    render(<Search />);

    // Wait for MSW to provide the dropdown data
    const typeDropdown = await screen.findByLabelText(/coop type/i);
    expect(typeDropdown).toHaveTextContent("Credit Union");

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Organic" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    // Verify search results appear
    // findBy queries automatically wait for the element to appear
    const result = await screen.findByText("Test Coop 1");
    expect(result).toBeInTheDocument();
  });

  test('test if "loading" message appears after submitting a search', async () => {
    render(<Search />);

    screen.getByRole("textbox", { name: "Name" });
    userEvent.type(screen.getByRole("textbox", { name: "Name" }), "1335 ASTOR");
    userEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() => screen.findByText(/Loading/i));

    expect(screen.getByText(/Loading.../i)).toHaveTextContent("Loading...");
  });
});
