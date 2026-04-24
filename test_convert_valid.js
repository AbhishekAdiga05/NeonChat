const { convertToModelMessages } = require('ai');

const uiMessages = [
  { id: '1', role: 'user', content: 'Hello', parts: [{ type: 'text', text: 'Hello' }] },
];

try {
  console.log("Converted:", JSON.stringify(convertToModelMessages(uiMessages), null, 2));
} catch (e) {
  console.error("Error:", e.message);
}
