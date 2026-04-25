const { convertToModelMessages } = require('ai');

const uiMessages = [
  { id: '1', role: 'user', content: 'Hello' },
  { id: '2', role: 'assistant', content: 'Hi' },
  { id: '3', role: 'user', content: '[{"type":"text","text":"Hello"}]' }
];

try {
  console.log(JSON.stringify(convertToModelMessages(uiMessages), null, 2));
} catch (e) {
  console.error(e);
}
