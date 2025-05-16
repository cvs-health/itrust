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

# iTrust Platform – Decentralized Identity & Credential Management

The **iTrust Project** is a modular, extensible platform for managing decentralized identities and verifiable credentials (VCs) using modern authentication and verification standards.

It consists of the following core components:

| Repo Name               | Purpose                                              |
|------------------------|------------------------------------------------------|
| `itrust-web`           | Admin console for managing tenants, onboarding, and configurations |
| `itrust-user-console`  | End-user console to manage life events, digital address, and VCs   |
| `itrust-auth-widget`   | Embeddable widget to handle secure user authentication            |
| `itrust-schema`        | Repository of W3C-compliant verifiable credential schemas         |

All services are configurable via `.env` files and integrate with the **DAS (Digital Address Service)** backend.


## 🔧 Repository Breakdown

### 1. `itrust-web` – Admin Console
- Tenant onboarding and configuration
- Role-based access (DAS Admin / Tenant Admin)
- User management and reporting
- Built with **React + Tailwind + Vite**

```bash
cd itrust-web
npm install
cp .env.sample .env  # Update with DAS API endpoint
npm run dev


# Contributor Guide

1. Before contributing to this CVS Health sponsored project, you will need to sign the associated [Contributor License Agreement](https://forms.office.com/r/HvYxTheDG5).
2. See [contributing](CONTRIBUTING.md) page.