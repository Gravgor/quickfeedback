const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get the command line arguments
const args = process.argv.slice(2);
const testPage = args[0] || 'index.html';
const testPort = args[1] || 8080;

// Check if the test file exists
const testFilePath = path.join(__dirname, testPage);
if (!fs.existsSync(testFilePath)) {
  console.error(`Error: Test file '${testPage}' not found.`);
  console.log('Available test files:');
  const files = fs.readdirSync(__dirname).filter(file => file.endsWith('.html'));
  files.forEach(file => console.log(`  - ${file}`));
  process.exit(1);
}

// Command to open the URL in the default browser
const url = `http://localhost:${testPort}/${testPage}`;
let command;

switch (process.platform) {
  case 'darwin': // macOS
    command = `open "${url}"`;
    break;
  case 'win32': // Windows
    command = `start "" "${url}"`;
    break;
  default: // Linux and others
    command = `xdg-open "${url}"`;
    break;
}

console.log(`Opening ${url} in your default browser...`);

// Execute the command
exec(command, (error) => {
  if (error) {
    console.error(`Error opening browser: ${error.message}`);
    console.log('Please manually open the following URL in your browser:');
    console.log(url);
    process.exit(1);
  }
}); 