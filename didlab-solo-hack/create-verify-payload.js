const fs = require('fs');

const message = fs.readFileSync('siwe-trimmed.txt', 'utf8');
const signature = fs.readFileSync('signature.txt', 'utf8').trim();

const payload = {
  message: message,
  signature: signature
};

fs.writeFileSync('verify-payload.json', JSON.stringify(payload, null, 2));
console.log('Payload created');
