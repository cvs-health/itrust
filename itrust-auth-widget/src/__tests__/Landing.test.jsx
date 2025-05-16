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
