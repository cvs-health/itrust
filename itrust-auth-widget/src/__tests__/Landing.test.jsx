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
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { useProcess } from "../context/ProcessContext";
import Landing from "../pages/Landing";
import * as Constants from "../constants";


vi.mock("../context/ProcessContext", () => ({
    useProcess: vi.fn(),
}));

describe("Landing Page", () => {
    const mockInitializeKeys = vi.fn();
    const mockStartProcess = vi.fn();
    const mockPollProcessStepStatus = vi.fn();
    const mockClearProcess = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        useProcess.mockReturnValue({
            initializeKeys: mockInitializeKeys,
            startProcess: mockStartProcess,
            pollProcessStepStatus: mockPollProcessStepStatus,
            clearProcess: mockClearProcess,
            connectionId: "mockConnectionId",
            processId: "mockProcessId",
        });
    });

    it("renders loading state initially", () => {
        render(
            <BrowserRouter>
                <Landing />
            </BrowserRouter>
        );

        expect(screen.getByText("Initializing ...")).toBeInTheDocument();
    });

    it("calls initializeKeys and clearProcess on mount", async () => {
        render(
            <BrowserRouter>
                <Landing />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(mockInitializeKeys).toHaveBeenCalled();
            expect(mockClearProcess).toHaveBeenCalled();
        });
    });

    it("handles successful launch URL fetch", async () => {
        mockPollProcessStepStatus.mockResolvedValueOnce({
            stepStatus: Constants.PROCESS_COMPLETED,
            stepData: JSON.stringify({ launchUrl: "https://mock-launch-url.com" }),
        });

        render(
            <BrowserRouter>
                <Landing />
            </BrowserRouter>
        );

        expect(screen.getByText("Initializing ...")).toBeInTheDocument();
        await waitFor(() => {
            expect(mockPollProcessStepStatus).toHaveBeenCalled();
        });
    });


    it("renders FacePanel when launchUrl is available", async () => {
        mockPollProcessStepStatus.mockResolvedValueOnce({
            stepStatus: Constants.PROCESS_COMPLETED,
            stepData: JSON.stringify({ launchUrl: "https://mock-launch-url.com" }),
        });

        render(
            <BrowserRouter>
                <Landing />
            </BrowserRouter>
        );

        expect(screen.getByText("Initializing ...")).toBeInTheDocument();
        await waitFor(() => {
            // expect an iframe with id itrust-face
            expect(screen.getByTitle("Face Panel")).toBeInTheDocument();
        });
    });
    
});
