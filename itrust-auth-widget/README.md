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

# iTrust Auth Widget

The **iTrust Auth Widget** is a lightweight React component that allows applications to integrate secure, standards-based authentication using Decentralized Identity (DID) principles. It is built using React, Material UI, and Vite.


## 🛠️ Tech Stack

- **React** (v18+)
- **Vite** (for fast dev/build experience)
- **Material UI** (MUI v5+)
- **Environment-based configuration** via `.env` files

---

## 📦 Project Structure
```
itrust-auth-widget/
├── public/
├── src/
│ ├── components/ # Widget UI components
│ ├── contexts/ # React contexts for auth state
│ ├── hooks/ # Custom React hooks
│ ├── services/ # API calls and business logic
│ ├── App.jsx
│ └── main.jsx
├── .env # Default env vars
├── vite.config.js
├── package.json
└── README.md
```

---

## ⚙️ Installation

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Source code
```
# Clone the repository
git clone https://github.com/cvs-health/itrust-auth-widget.git
cd itrust-auth-widget
```
# Install dependencies
```
npm install
# or
yarn install
```

# Run the Widget
```
npm run dev
# or
yarn dev
```

# Operations 

1. Start Registration Flow 
```
open http://localhost:3005/itrust-auth-widget/?op=reg&withIdentityInfo=true
```
2. Start Authentication Flow 
```
open http://localhost:3005/itrust-auth-widget/?op=auth&withIdentityInfo=true
```
1. Delete your profile
```
open http://localhost:3005/itrust-auth-widget/?op=del
```

