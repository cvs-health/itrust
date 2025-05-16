const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');
const manifestPath = './manifest.json';


try {
    // Read and parse the JSON file
    const rawData = fs.readFileSync(manifestPath, 'utf8');
    const json = JSON.parse(rawData);

    // Get the dependencies and devDependencies from the file 
    const dependencies = json.dependencies || [];
    const devDependencies = json.devDependencies || [];

    const alldependencies = dependencies.concat(devDependencies);

    // Convert to CSV
    const parser = new Parser();
    const csv = parser.parse(alldependencies);

    // Determine output path
    const outputFile = path.basename(manifestPath, path.extname(manifestPath)) + '.csv';
    fs.writeFileSync(outputFile, csv);

    console.log(`CSV file created: ${outputFile}`);
} catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
}