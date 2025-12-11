const fs = require('fs');
const path = require('path');

// Manually parse .env.local because dotenv might not be installed or configured for this specific file path in the same way
try {
  const envPath = path.resolve('.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    let keyFound = false;
    for (const line of lines) {
      if (line.trim().startsWith('APOLLO_API_KEY=')) {
        keyFound = true;
        const value = line.split('=')[1].trim();
        console.log('APOLLO_API_KEY is present');
        console.log('Length:', value.length);
        if (value.includes('placeholder') || value.includes('your_key') || value === '') {
           console.log('Key seems to be a placeholder or empty');
        } else {
           console.log('Key looks potentially valid (not a simple placeholder)');
        }
        break;
      }
    }
    if (!keyFound) {
      console.log('APOLLO_API_KEY is missing in .env.local');
    }
  } else {
    console.log('.env.local file not found');
  }
} catch (e) {
  console.error('Error reading .env.local:', e);
}
