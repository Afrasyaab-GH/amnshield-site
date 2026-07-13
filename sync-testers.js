const crypto = require('crypto');
const fs = require('fs');
const https = require('https');
const path = require('path');

// ==============================================================================
// SECURE BETA TESTERS SYNC & LOCAL DATABASE MANAGER (NODE.JS VERSION)
// ==============================================================================
// This script runs securely on Node.js with ZERO external dependencies!
// It connects to your Google Sheet by ID, downloads submissions, and syncs
// them into a local JSON database file ("testers.json").
// ==============================================================================

// Configurations
const DB_FILE = path.join(__dirname, 'testers.json');
const CREDENTIALS_FILE = path.join(__dirname, 'service_account.json');
const SPREADSHEET_ID = '1zmc3gN83r6cOpobdIR2hFdNJbcMiM_JA8TOdKbVw7TE';

// Initialize Local JSON Database
function initializeDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf8');
    console.log('✓ Local JSON database (testers.json) initialized.');
  } else {
    console.log('✓ Connected to local JSON database.');
  }
}

// Generate JWT token and exchange it for a Google Sheets API access token
function getAccessToken(creds) {
  return new Promise((resolve, reject) => {
    const header = JSON.stringify({ alg: 'RS256', typ: 'JWT' });
    const payload = JSON.stringify({
      iss: creds.client_email,
      scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000)
    });

    const base64Header = Buffer.from(header).toString('base64url');
    const base64Payload = Buffer.from(payload).toString('base64url');
    const signatureInput = `${base64Header}.${base64Payload}`;

    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signatureInput);
    const signature = sign.sign(creds.private_key, 'base64url');

    const jwt = `${signatureInput}.${signature}`;
    const postData = `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`;

    const req = https.request({
      hostname: 'oauth2.googleapis.com',
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const tokenRes = JSON.parse(data);
          if (tokenRes.access_token) {
            resolve(tokenRes.access_token);
          } else {
            reject(new Error(tokenRes.error_description || `Failed to authenticate: ${data}`));
          }
        } catch (e) {
          reject(new Error(`JSON Parse Error: ${e.message}. Data: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Fetch values from Google Sheets API
function getSheetValues(accessToken, spreadsheetId) {
  return new Promise((resolve, reject) => {
    const range = encodeURIComponent('A1:E500'); // Fetch first sheet, columns A through E, up to 500 rows
    const req = https.get({
      hostname: 'sheets.googleapis.com',
      path: `/v4/spreadsheets/${spreadsheetId}/values/${range}`,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const valRes = JSON.parse(data);
          if (valRes.values) {
            resolve(valRes.values);
          } else {
            reject(new Error(valRes.error?.message || `Failed to get values: ${data}`));
          }
        } catch (e) {
          reject(new Error(`JSON Parse Error: ${e.message}`));
        }
      });
    });
    req.on('error', reject);
  });
}

// Main execution flow
async function main() {
  initializeDatabase();

  if (!fs.existsSync(CREDENTIALS_FILE)) {
    console.error(`❌ Error: Credentials file 'service_account.json' not found.`);
    console.error(`Please make sure you downloaded and placed it in: ${CREDENTIALS_FILE}`);
    return;
  }

  const creds = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, 'utf8'));

  try {
    console.log('🔄 Authenticating with Google APIs...');
    const token = await getAccessToken(creds);
    console.log('✓ Authentication successful.');

    console.log('🔄 Fetching Google Sheet submissions...');
    const rows = await getSheetValues(token, SPREADSHEET_ID);
    console.log(`✓ Fetched ${rows.length} rows (including headers).`);

    if (rows.length <= 1) {
      console.log('🎉 No submissions found yet.');
      return;
    }

    const headers = rows[0].map(h => h.toLowerCase().trim());
    
    // Find index of columns
    const emailIdx = headers.findIndex(h => h.includes('email'));
    const nameIdx = headers.findIndex(h => h.includes('name'));
    const deviceIdx = headers.findIndex(h => h.includes('device') || h.includes('model'));

    if (emailIdx === -1) {
      console.error('❌ Error: Could not find an "email" column in the sheet headers:', rows[0]);
      return;
    }

    // Load existing local testers
    const testers = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    const existingEmails = new Set(testers.map(t => t.email));

    let addedCount = 0;
    let skippedCount = 0;

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const email = (row[emailIdx] || '').trim().toLowerCase();
      if (!email) continue;

      if (existingEmails.has(email)) {
        skippedCount++;
        continue;
      }

      const name = nameIdx !== -1 ? (row[nameIdx] || 'Unknown').trim() : 'Unknown';
      const device = deviceIdx !== -1 ? (row[deviceIdx] || 'Not Specified').trim() : 'Not Specified';
      const signupDate = row[0] || new Date().toISOString(); // Default to Timestamp column (column A)

      testers.push({
        name,
        email,
        device_model: device,
        priority_user: true,
        status: 'Pending',
        signup_date: signupDate
      });
      existingEmails.add(email);
      addedCount++;
    }

    // Save updated list
    fs.writeFileSync(DB_FILE, JSON.stringify(testers, null, 2), 'utf8');
    console.log(`✓ Sync complete: Added ${addedCount} new testers, skipped ${skippedCount} existing.`);

    // Print pending emails
    const pending = testers.filter(t => t.status === 'Pending');
    if (pending.length === 0) {
      console.log('\n🎉 No pending testers! All users have been added to the Play Store.');
    } else {
      console.log(`\n📢 Found ${pending.length} pending testers.`);
      console.log('==================================================');
      console.log('Copy-paste these emails directly into Google Play Console:');
      console.log('--------------------------------------------------');
      console.log(pending.map(t => t.email).join(', '));
      console.log('==================================================');
    }

  } catch (error) {
    console.error('❌ Execution Error:', error.message);
  }
}

main();
