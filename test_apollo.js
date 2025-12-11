const fs = require('fs');
const path = require('path');
const https = require('https');

// Read API Key
let apiKey = '';
try {
  const envPath = path.resolve('.env.local');
  const content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split('\n');
  for (const line of lines) {
    if (line.trim().startsWith('APOLLO_API_KEY=')) {
      apiKey = line.split('=')[1].trim();
      break;
    }
  }
} catch (e) {
  console.error('Error reading .env.local');
  process.exit(1);
}

if (!apiKey) {
  console.error('API Key not found');
  process.exit(1);
}

console.log('Testing Apollo API with key length:', apiKey.length);

const data = JSON.stringify({
  api_key: apiKey,
  q_organization_domains: null,
  page: 1,
  person_titles: ["Directeur"],
  organization_locations: ["Paris"],
  per_page: 5
});

const options = {
  hostname: 'api.apollo.io',
  path: '/v1/mixed_people/search',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  
  let responseBody = '';

  res.on('data', (chunk) => {
    responseBody += chunk;
  });

  res.on('end', () => {
    console.log('Response Body:');
    console.log(responseBody);
  });
});

req.on('error', (error) => {
  console.error('Request Error:', error);
});

req.write(data);
req.end();
