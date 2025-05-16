import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import CompletePanel from "../components/CompletePanel";
import * as Constants from "../constants";
import { useProcess } from "../context/ProcessContext";

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

vi.mock("../context/ProcessContext", () => ({
  useProcess: vi.fn(),
}));

describe("CompletePanel Component", () => {
  const mockClearProcess = vi.fn();

  beforeEach(() => {
    useProcess.mockReturnValue({
      clearProcess: mockClearProcess,
    });
    vi.clearAllMocks();
  });

  it("renders digital address and DID when operation is OPERATION_REGISTER", async () => {
    const mockPayload = {
      data: {
        digitalAddress: "test@example.com",
        did: "did:example:123456789",
      },
    };

    render(
      <CompletePanel
        operation={Constants.OPERATION_REGISTER}
        payload={mockPayload}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
      expect(screen.getByText("did:example:123456789")).toBeInTheDocument();
    });
  });

  it("fires event to parent when operation is not OPERATION_REGISTER", async () => {
    const mockPayload = {
      type: "testType",
      status: "success",
      statusDescription: "Test description",
      data: {
        did: "did:example:123456789",
        digitalAddress: "test@example.com",
        identityInformation: "Test Identity",
        contactInformation: "Test Contact",
      },
    };

    const postMessageSpy = vi
      .spyOn(window.parent, "postMessage")
      .mockImplementation(() => {});

    render(<CompletePanel operation="OTHER_OPERATION" payload={mockPayload} />);

    await waitFor(() => {
      expect(postMessageSpy).toHaveBeenCalledWith(
        {
          type: Constants.ITRUST_EVENT,
          payload: {
            type: "testType",
            status: "success",
            statusDescription: "Test description",
            data: {
              did: "did:example:123456789",
              digitalAddress: "test@example.com",
              identityInformation: "Test Identity",
              contactInformation: "Test Contact",
            },
          },
        },
        "*"
      );
    });

    postMessageSpy.mockRestore();
  });

  
});
