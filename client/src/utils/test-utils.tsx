import React from "react";
import { render, type RenderOptions, screen, within } from "@testing-library/react";
import {type ReactNode, type ReactElement } from "react";
import { AuthenticationProvider } from "../context";
import { CookiesProvider } from "react-cookie";
import { AlertProvider } from "../components/AlertProvider";

//TODO verify logic
const AllTheProviders = ({ children }: { children: ReactNode }) => {
  
  return (
    <CookiesProvider>
      <AlertProvider>
      <AuthenticationProvider>
        {children}
      </AuthenticationProvider>
      </AlertProvider>
    </CookiesProvider>
  );
};
export const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });


export * from '@testing-library/react'
