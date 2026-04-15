import React from "react";
import {
  act,
  logRoles,
  customRender as render,
  screen,
} from "../../utils/test-utils";
import { MemoryRouter } from "react-router-dom";
import { AlertProvider, useAlert } from "../AlertProvider";
import userEvent from "@testing-library/user-event";

describe("<Alert />", () => {
  test("success and alert should when func close from useAlert is clicked", async () => {
    const mockTimer = jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    const Tester = () => {
      const [open, close] = useAlert();
      return (
        <>
          <button onClick={() => open("this is the alert success")}>
            Open
          </button>
          <button onClick={() => close()}>Close</button>
        </>
      );
    };
    const { container } = render(
      <AlertProvider>
        <MemoryRouter initialEntries={["/"]}>
          <Tester />
        </MemoryRouter>
      </AlertProvider>,
    );

    const triggerBtn = screen.getByRole("button", { name: "Open" });
    const closeBtn = screen.getByRole("button", { name: "Close" });
    await user.click(triggerBtn);
    expect(screen.getByText("this is the alert success")).toBeInTheDocument();

    await user.click(closeBtn);
    act(() => {
      mockTimer.advanceTimersByTime(10000);
    });
    expect(
      screen.queryByText("this is the alert success"),
    ).not.toBeInTheDocument();
    logRoles(container);
  });

  test("success and alert should when fade after 10 seconds", async () => {
    const mockTimer = jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    const Tester = () => {
      const [open] = useAlert();
      return (
        <>
          <button onClick={() => open("this is the alert success")}>
            Open
          </button>
        </>
      );
    };
  
    const { container } = render(
      <AlertProvider>
        <MemoryRouter initialEntries={["/"]}>
          <Tester />
        </MemoryRouter>
      </AlertProvider>,
    );

    const triggerBtn = screen.getByRole("button", { name: "Open" });
    await user.click(triggerBtn);
    expect(screen.getByText("this is the alert success")).toBeInTheDocument();
    //await state change on handleOpenCallback  setOpen(false);
    act(() => {
      mockTimer.advanceTimersByTime(11000);
    });
    //await fade effect to unmount component
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(
      screen.queryByText("this is the alert success"),
    ).not.toBeInTheDocument();
    logRoles(container);
  });
});
