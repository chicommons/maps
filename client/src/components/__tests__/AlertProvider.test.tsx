//TODO
import React, { act } from "react";
import { customRender as render, screen } from "../../utils/test-utils";
import { AlertProvider, useAlert } from "../AlertProvider";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

describe("<AlertProvider />", () => {
  test("should render alert message when useAlert is called", async () => {
    const mockTimer = jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    const TestComponent = () => {
      const [open, close] = useAlert();
      return (
        <>
          <button onClick={() => open("alert success")}>Open</button>
          <button onClick={() => close()}>Close</button>
        </>
      );
    };

    render(
      <AlertProvider>
        <MemoryRouter initialEntries={["/"]}>
          <TestComponent />
        </MemoryRouter>
      </AlertProvider>,
    );

    const triggerBtn = screen.getByRole("button", { name: "Open" });
    await user.click(triggerBtn);
    expect(screen.getByText("alert success")).toBeInTheDocument();
    act(() => {
      mockTimer.advanceTimersByTime(10000);
    });
    act(() => {
      mockTimer.advanceTimersByTime(500);
    });
    expect(screen.queryByText("alert success")).not.toBeInTheDocument();
  });
  test("should close alert message before 10 seconds when close button is clicked", async () => {
    const mockTimer = jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    const TestComponent = () => {
      const [open, close] = useAlert();
      return (
        <>
          <button onClick={() => open("alert success")}>Open</button>
          <button onClick={() => close()}>Close</button>
        </>
      );
    };

    render(
      <AlertProvider>
        <MemoryRouter initialEntries={["/"]}>
          <TestComponent />
        </MemoryRouter>
      </AlertProvider>,
    );

    const triggerBtn = screen.getByRole("button", { name: "Open" });
    const closeBtn = screen.getByRole("button", { name: "Close" });
    await user.click(triggerBtn);
    expect(screen.getByText("alert success")).toBeInTheDocument();
    await user.click(closeBtn);
    act(() => {
      mockTimer.advanceTimersByTime(500);
    });
    expect(screen.queryByText("alert success")).not.toBeInTheDocument();
  });
});
