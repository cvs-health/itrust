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

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FacePanel from '../components/FacePanel';
import * as ProcessContext from '../context/ProcessContext';
import * as CryptoService from '../services/CryptoService';
import * as Constants from '../constants';
import { expect } from 'vitest';

vi.mock('../services/CryptoService', () => ({
    decryptMessage: vi.fn(),
}));

vi.mock('../context/ProcessContext', () => ({
    useProcess: vi.fn(),
}));

describe('FacePanel Component', () => {
    const mockNextStep = vi.fn();
    const mockSetStatus = vi.fn();
    const mockPollProcessStepStatus = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        ProcessContext.useProcess.mockReturnValue({
            processId: 'mockProcessId',
            pollProcessStepStatus: mockPollProcessStepStatus,
            connectionKeys: { [Constants.SHARED_SECRET]: 'mockSharedSecret' },
        });
    });


    it('renders the iframe after it loads', async () => {
        render(
            <FacePanel
                operation={Constants.OPERATION_AUTHENTICATE}
                nextStep={mockNextStep}
                launchUrl="https://mockurl.com"
                setStatus={mockSetStatus}
            />
        );

        const iframe = screen.getByTitle('Face Panel');
        fireEvent.load(iframe);

        await waitFor(() => expect(iframe).toBeVisible());
    });

    it('handles SESSION_COMPLETE message from iframe', async () => {
        render(
            <FacePanel
                operation={Constants.OPERATION_AUTHENTICATE}
                nextStep={mockNextStep}
                launchUrl="https://mockurl.com"
                setStatus={mockSetStatus}
            />
        );

        const event = new MessageEvent('message', {
            data: { type: 'SESSION_COMPLETE' },
        });
        window.dispatchEvent(event);

        await waitFor(() => expect(mockPollProcessStepStatus).toHaveBeenCalled());
    });

    
});