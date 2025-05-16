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
import MyDAS from "../pages/Das/MyDAS";
import { useAuthContext } from "../context/AuthContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { findDASById } from "../services/DASService";


vi.mock("@mui/styles", () => ({
    makeStyles: () => () => ({}),
    withStyles: (component) => component,
  }));

vi.mock("../context/AuthContext", () => ({
    useAuthContext: vi.fn(),
}));

vi.mock("../services/CodelistService", () => ({
    findCodelistByName: vi.fn(),
}))

vi.mock("react-router-dom", () => ({
    useLocation: vi.fn(),
    useNavigate: vi.fn(),
    useParams: vi.fn(),
}));

vi.mock("../services/DASService", () => ({
    findDASById: vi.fn(),
}));


  
describe("MyDAS Component", () => {
    beforeEach(() => {
        useAuthContext.mockReturnValue({
            user: { dasId: "123" },
            permissions: [],
        });
        useLocation.mockReturnValue({ state: {} });
        useNavigate.mockReturnValue(vi.fn());
        useParams.mockReturnValue({ id: "123" });
        findDASById.mockResolvedValue(null);
    });

    it("should render the title 'My DAS'", async () => {
        render(<MyDAS />);
        const title = await screen.findByText("My DAS");
        expect(title).toBeInTheDocument();
    });
});