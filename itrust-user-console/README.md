# Itrust User Console
Consumer facing web applications. Authentication is using Digital Address. All other operations shall be with DIDs and Verifiable Credentials 

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
  
# Docker Images
1. Create Deployment with the correct build - local dev (build) or production build (build:prod)
```
    npm run build 
    npm run build:prod
```

2. Build Docker Image for DEV
```
docker build --tag itrust/itrust-user-console . --build-arg BUILD_FOR=dev  
```

3. Build Docker Image for PROD
```
docker build --tag itrust/itrust-user-console . --build-arg BUILD_FOR=prod   
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
npm install json2csv
node jsonToCSV.js
```

# Contributor Guide

1. Before contributing to this CVS Health sponsored project, you will need to sign the associated [Contributor License Agreement](https://forms.office.com/r/HvYxTheDG5).
2. See [contributing](CONTRIBUTING.md) page.