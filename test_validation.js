const { streamText } = require('ai');
const { createOpenRouter } = require('@openrouter/ai-sdk-provider');

const provider = createOpenRouter({
  apiKey: "dummy",
});

async function run() {
  try {
    const result = streamText({
      model: provider.chat("test-model"),
      messages: [{ role: 'user', content: 'test' }],
    });
    console.log("Success with valid format");
  } catch (e) {
    console.error("Error 1:", e.message);
  }

  try {
    const result = streamText({
      model: provider.chat("test-model"),
      messages: [{ role: 'user', content: [{ type: 'text', text: 'hello' }] }],
    });
    console.log("Success with parts array");
  } catch (e) {
    console.error("Error 2:", e.message);
  }
}

run();
