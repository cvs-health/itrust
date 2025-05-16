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

# Itrust Authentication Widget
Light-weight embedding of Private ID and Digital Address widget 

## Port configuration
Runs on Port 3005

## Run dev locally 
```
npm start dev
```
 
### Build Docker Image for DEV
```
docker build --tag itrust/itrust-auth-widget . --build-arg BUILD_FOR=dev  
```
 
### Build Docker Image for PROD
```
docker build --tag itrust/itrust-auth-widget . --build-arg BUILD_FOR=prod   
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
 
## Upgrade npm libraries 

1. Install check updates
```
npm install -g npm-check-updates
```

2. Check what upgrades are available 
```
ncu
```

3. Upgrade all dependencies inside package.json
```
ncu -u
```

4. Install npm libraries
```
npm install
```

# Contributor Guide

1. Before contributing to this CVS Health sponsored project, you will need to sign the associated [Contributor License Agreement](https://forms.office.com/r/HvYxTheDG5).
2. See [contributing](CONTRIBUTING.md) page.