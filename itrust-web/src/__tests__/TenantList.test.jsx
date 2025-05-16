/*
 Copyright 2024 CVS Health and/or one of its affiliates

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

import React from "react";
import { render, screen } from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";
import TenantList from "../pages/Tenants/TenantList";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { findTenants } from "../services/TenantService";
import { useAuthContext } from "../context/AuthContext";

vi.mock("../context/AuthContext", () => ({
  useAuthContext: vi.fn(),
}));

vi.mock("../services/TenantService", () => ({
  findTenants: vi.fn(),
}));

vi.mock("../../components/StatusMessage", () => () => (
  <div data-testid="status-message" />
));

vi.mock("@mui/styles", () => ({
  makeStyles: () => () => ({}),
  withStyles: (component) => component,
}));

describe("TenantList Page", () => {
  const mockUser = {
    tenantId: "123",
    tenant: { organization: { did: "did:example:123" } },
  };

  const mockPermissions = ["TENANT_ALL"];

  beforeEach(() => {
    findTenants.mockResolvedValue([]);
    useAuthContext.mockReturnValue({
      user: mockUser,
      permissions: mockPermissions,
      isInitialized: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should display the title of the TenantList page", async () => {
    const theme = createTheme();
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <TenantList />
        </MemoryRouter>
      </ThemeProvider>
    );

    const titleElement = await screen.findByText("Tenants");
    expect(titleElement).toBeInTheDocument();
  });
});
