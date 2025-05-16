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
import StatusPanel from "../components/StatusPanel";
import * as ProcessContext from "../context/ProcessContext";
import * as CryptoService from "../services/CryptoService";
import * as Constants from "../constants";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";

vi.mock("../context/ProcessContext", () => ({
  useProcess: vi.fn(),
}));

vi.mock("../services/CryptoService", () => ({
  decryptMessage: vi.fn(),
}));

describe("StatusPanel Component", () => {
  const mockSetStatus = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    ProcessContext.useProcess.mockReturnValue({
      processId: "mockProcessId",
      pollProcessStepStatus: vi.fn(),
      connectionKeys: { [Constants.SHARED_SECRET]: "mockSharedSecret" },
    });
  });

  it("renders status panel", () => {
    render(
      <MemoryRouter>
        <StatusPanel
          operation={Constants.OPERATION_REGISTER}
          nextStep={vi.fn()}
          payload={{ statusDescription: "Test Status", icon: <div>Icon</div> }}
          setStatus={mockSetStatus}
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId("status-panel")).toBeInTheDocument();
  });

  it("handles digital address creation successfully", async () => {
    const mockPollProcessStepStatus = vi.fn().mockResolvedValue({
      clientResponse: JSON.stringify({ data: "encryptedData", nonce: "nonce" }),
    });
    ProcessContext.useProcess.mockReturnValue({
      processId: "mockProcessId",
      pollProcessStepStatus: mockPollProcessStepStatus,
      connectionKeys: { [Constants.SHARED_SECRET]: "mockSharedSecret" },
    });
    CryptoService.decryptMessage.mockReturnValue(
      JSON.stringify({ data: "decryptedData" })
    );

    render(
      <MemoryRouter>
        <StatusPanel
          operation={Constants.OPERATION_REGISTER}
          nextStep={vi.fn()}
          payload={{}}
          setStatus={mockSetStatus}
        />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockPollProcessStepStatus).toHaveBeenCalledWith(
        "create.digital_address",
        Constants.REGISTRATION_MAX_WAIT_TIME,
        Constants.POLL_INTERVAL_1S
      );
    });
  });

  it("displays error message on failure", async () => {
    const mockPollProcessStepStatus = vi
      .fn()
      .mockRejectedValue(new Error("Error"));
    ProcessContext.useProcess.mockReturnValue({
      processId: "mockProcessId",
      pollProcessStepStatus: mockPollProcessStepStatus,
      connectionKeys: { [Constants.SHARED_SECRET]: "mockSharedSecret" },
    });

    render(
      <MemoryRouter>
        <StatusPanel
          operation={Constants.OPERATION_REGISTER}
          nextStep={vi.fn()}
          payload={{}}
          setStatus={mockSetStatus}
        />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockSetStatus).toHaveBeenCalledWith({
        open: true,
        type: "error",
        message: "Failed to fetch process status",
      });
    });
  });

  it("navigates on failure when payload has enroll", async () => {
    render(
      <MemoryRouter>
        <StatusPanel
          operation={Constants.OPERATION_REGISTER}
          nextStep={vi.fn()}
          payload={{ enroll: true, statusDescription: "Error occurred" }}
          setStatus={mockSetStatus}
        />
      </MemoryRouter>
    );

    const button = screen.getByText("Register Digital Address");
    userEvent.click(button);

    await waitFor(() => {
      expect(mockSetStatus).toHaveBeenCalledWith({
        open: true,
        type: "error",
        message: "Error occurred",
      });
    });
  });
});
