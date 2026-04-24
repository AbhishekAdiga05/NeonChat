const { streamText } = require('ai');
const { createOpenRouter } = require('@openrouter/ai-sdk-provider');

const provider = createOpenRouter({
  apiKey: "dummy",
});

async function run() {
  try {
    const result = streamText({
      model: provider.chat("test-model"),
      messages: [{ role: 'user', content: '' }],
    });
    console.log("Success with empty content");
  } catch (e) {
    console.error("Error 3:", e.message);
  }

  try {
    const result = streamText({
      model: provider.chat("test-model"),
      messages: [{ role: undefined, content: 'test' }],
    });
    console.log("Success with undefined role");
  } catch (e) {
    console.error("Error 4:", e.message);
  }
}

run();
