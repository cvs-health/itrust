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

# iTrust-Web

iTrust-Web is a client interface to the iTrust platform services, providing easy access to APIs for interacting with the iTrust ecosystem. This project includes sample applications that demonstrate how to use the iTrust services, offering developers a solid foundation for building their own integrations.

## Key Features
- Access iTrust APIs: Seamlessly interact with the full range of iTrust services through easy-to-use APIs.
- Sample Applications: Explore a collection of sample applications that illustrate how to leverage iTrust services in real-world scenarios.
Open-Source: The source code is fully open-source, giving developers the freedom to modify and extend the functionality as needed.

## Important Note
Please note that iTrust-Web is not production-ready code. The project is intended as a reference and learning tool. Developers are encouraged to use this code as a base for their own projects, but additional testing, customization, and security measures are required for any production environment.

# Getting Started

## Development
To get started, follow these steps:

1. Clone the repository: 
```
git clone https://github.com/your-repo/itrust-web.git
```

2. Install dependencies: 
```
npm install
```

3. Configure the API keys and settings in the .env file.

4. Run the sample application:
```
npm start
```

## Docker Images

1. Create Deployment with the correct build - local dev (build) or production build (build:prod)
```
    npm run build 
    npm run build:prod
```

2. Build Docker Image for DEV
```
docker build --platform=linux/arm64 --tag itrust/itrust-web . --build-arg BUILD_FOR=dev  
```

3. Build Docker Image for PROD
```
docker build --tag itrust/itrust-web . --build-arg BUILD_FOR=prod   
```

# Generating Manifest 
1. Install license-checker
```
npm install -g license-checker
```
2. Generate the licenses file
```
license-checker --json > ./licenses.json
```
3. Generate the dependency information 
```
npm list --prod --depth=0 --json > installed-packages.json
```
4. Run the manifest script and view output in manifest.json 
```
node generateManifest.js
```
5. Use a tool like https://tableconvert.com/json-to-excel to convert to Excel if required 
or 
```
npm install son2csv
node jsonToCSV.js
```
 
# Contributor Guide

1. Before contributing to this CVS Health sponsored project, you will need to sign the associated [Contributor License Agreement](https://forms.office.com/r/HvYxTheDG5).
2. See [contributing](CONTRIBUTING.md) page.