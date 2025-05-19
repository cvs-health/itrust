<!--
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
 -->

# iTrust Identity Platform

The **iTrust Identity Platform** is an open-source initiative by CVS Health to demonstrate the power of Decentralized Identity (DID) and Verifiable Credentials (VC) in enabling secure, user-driven identity experiences.

This repository includes four related projects:

| Repo Name               | Purpose                                              |
|------------------------|------------------------------------------------------|
| `itrust-web`           | Admin console for managing tenants, onboarding, and configurations |
| `itrust-user-console`  | End-user console to manage life events, digital address, and VCs   |
| `itrust-auth-widget`   | Embeddable widget to handle secure user authentication            |
| `itrust-schema`        | Repository of W3C-compliant verifiable credential schemas         |

All services are configurable via `.env` files and integrate with the **DAS (Digital Address Service)** backend.


## Repositories Overview

### 1. [`itrust-web`](./itrust-web)

> **Role**: Public-facing entry point for users and organizations

- **Description**: A React-based application that serves as the main landing zone and dashboard for organizations integrating with the iTrust platform.
- **Features**:
  - Admin dashboard for tenant organizations
  - Integration with Keycloak for authentication
  - Launchpad for identity workflows (enroll, authenticate, delete)
- **Technology**: React, Material UI, Keycloak, Axios



### 2. [`itrust-user-console`](./itrust-user-console)

> **Role**: End-user portal for managing digital identity

- **Description**: A self-service console for individuals to view, update, and manage their **Digital Address (DID)** and associated **Verifiable Credentials (VCs)**.
- **Features**:
  - View digital identity details
  - Timeline of identity-related events
  - QR code and passkey interactions
- **Technology**: React, MUI, Vite, WebSocket & HTTP polling for live updates



### 3. [`itrust-auth-widget`](./itrust-auth-widget)

> **Role**: Embedded face-verification widget for identity flows

- **Description**: A lightweight, embeddable React widget (rendered via iframe) used for:
  - Face scanning
  - Identity proofing
  - Silent or active user login/authentication
- **Features**:
  - Can be embedded in apps, web portals, or even mobile WebViews
  - Works with Keycloak and custom WebSocket/HTTP backends
  - Sends result to parent via `postMessage`
- **Technology**: React, Vite, MUI, `postMessage` API, camera permissions



### 4. [`itrust-schema`](./itrust-schema)

> **Role**: DID + VC schema definitions for identity interoperability

- **Description**: Contains the JSON-LD schema definitions for various verifiable credentials supported by the iTrust platform.
- **Features**:
  - Follows W3C DID and VC standards
  - Provides public schema URIs for issuer and verifier reference
- **Technology**: Pure JSON & JSON-LD, static schema publishing

##  Directory Structure

```bash
.
├── itrust-web/              # Admin/Org dashboard
├── itrust-user-console/     # User self-service portal
├── itrust-auth-widget/      # Embedded identity widget
├── itrust-schema/           # DID + VC schemas
├── LICENSE                  # Apache 2.0 + third-party OSS licenses
└── README.md                # This file

