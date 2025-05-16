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
import { render, screen, fireEvent } from "@testing-library/react";
import { useKeycloak } from "@react-keycloak/web";
import Landing from "../pages/Landing";

vi.mock("@react-keycloak/web", () => ({
    useKeycloak: vi.fn(),
}));

describe("Landing Page", () => {
    const mockLogin = vi.fn();
    const mockRegister = vi.fn();

    beforeEach(() => {
        useKeycloak.mockReturnValue({
            keycloak: {
                login: mockLogin,
                register: mockRegister,
            },
            initialized: true,
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders the landing page with the logo and welcome message", () => {
        render(<Landing />);
        expect(screen.getByText(/Welcome to iTrust/i)).toBeInTheDocument();
    });

    it("renders login and register buttons", () => {
        render(<Landing />);

        expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Register/i })).toBeInTheDocument();
    });

    it("calls keycloak login when login button is clicked", () => {
        render(<Landing />);

        const loginButton = screen.getByRole("button", { name: /Login/i });
        fireEvent.click(loginButton);

        expect(mockLogin).toHaveBeenCalledTimes(1);
    });

    it("calls keycloak register when register button is clicked", () => {
        render(<Landing />);

        const registerButton = screen.getByRole("button", { name: /Register/i });
        fireEvent.click(registerButton);

        expect(mockRegister).toHaveBeenCalledTimes(1);
    });

    it("does not render buttons if keycloak is not initialized", () => {
        useKeycloak.mockReturnValue({
            keycloak: {},
            initialized: false,
        });

        render(<Landing />);

        expect(screen.queryByRole("button", { name: /Login/i })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /Register/i })).not.toBeInTheDocument();
    });
});