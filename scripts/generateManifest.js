const fs = require('fs');
const path = require('path');
const licenses = require('./licenses.json');
const installedPackages = require('./installed-packages.json');
const packageJson = require('./package.json');
const nodeModulesPath = './node_modules'; // Path to node_modules

const manifest = {
  applicationName: packageJson.name,
  version: packageJson.version,
  dependencies: Object.entries(installedPackages.dependencies || {}).map(([key, details]) => createManifestEntry(key, details)),
  devDependencies: Object.entries(installedPackages.devDependencies || {}).map(([key, details]) => createManifestEntry(key, details))
};

function createManifestEntry(key, details) {
  const packageName = `${key}@${details.version}`;
  const licenseInfo = licenses[packageName] || {};
  return {
    name: key,
    version: details.version,
    license: licenseInfo.licenses || 'Unknown',
    repository: licenseInfo.repository || 'Unknown',
    publisher: licenseInfo.publisher || 'Unknown', // Assume the publisher info is stored directly
    description: getPackageInfo(key).description,
    path: licenseInfo.path ? licenseInfo.path.replace(process.cwd(), '') : 'Unknown', // Relative to project root
    licenseFile: licenseInfo.licenseFile ? licenseInfo.licenseFile.replace(process.cwd(), '') : 'Unknown' // Relative to project root
  };
}

// Function to read the description from a package.json file
function getPackageInfo(packageName) {
    const packagePath = path.join(nodeModulesPath, packageName, 'package.json');
    try {
        const packageJsonData = fs.readFileSync(packagePath, 'utf8');
        const packageData = JSON.parse(packageJsonData);
        return {
            description: packageData.description || 'No description available',
            licenseFile: packageData.licenseFile || 'No license file',
            repository: packageData.repository ? packageData.repository.url : 'No repository',
            publisher: packageData.author ? packageData.author.name : 'Unknown publisher'
        };
    } catch (error) {
        console.error(`Error reading or parsing package.json for ${packageName}: ${error}`);
        return {
            description: 'Description not found',
            licenseFile: 'License file not found',
            repository: 'Repository not found',
            publisher: 'Publisher not found'
        };
    }
}

fs.writeFileSync('./manifest.json', JSON.stringify(manifest, null, 2), 'utf8');
