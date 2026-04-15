//TODO
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

const mockPush = jest.fn();
const mockListen = jest.fn().mockReturnValue(() => {});
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // Preserve other exports like <Link />
  useHistory: () => ({
    push: mockPush,
    listen: mockListen,
  }),
}));

describe("<Alert />", () => {
  const defaultProps = {
    id: "default-alert",
    fade: true,
  };
  test("success and alert should be removed when fade is true", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const mockTimer = jest.useFakeTimers();
    const Tester = () => {
      const [open] = useAlert();
      return (
        <button onClick={() => open("this is the alert success")}>
          Trigger
        </button>
      );
    };

    const { container } = render(
      <AlertProvider>
        <MemoryRouter initialEntries={["/"]}>
          <Tester />
        </MemoryRouter>
      </AlertProvider>,
    );

    const triggerBtn = screen.getByRole("button", { name: /trigger/i });
    await user.click(triggerBtn);
    expect(screen.getByText("this is the alert success")).toBeInTheDocument();
 act(() => {
      mockTimer.advanceTimersByTime(12000);
    });
    expect(
      screen.queryByText("this is the alert success"),
    ).not.toBeInTheDocument();
    logRoles(container);
  });

  test("varies errors", () => {});
});
