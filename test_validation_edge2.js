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
    await result.toUIMessageStreamResponse();
    console.log("Success with empty content");
  } catch (e) {
    console.error("Error 3:", e.message);
  }

  try {
    const result = streamText({
      model: provider.chat("test-model"),
      messages: [{ role: undefined, content: 'test' }],
    });
    await result.toUIMessageStreamResponse();
    console.log("Success with undefined role");
  } catch (e) {
    console.error("Error 4:", e.message);
  }

  try {
    const result = streamText({
      model: provider.chat("test-model"),
      messages: [{ role: 'user', content: null }],
    });
    await result.toUIMessageStreamResponse();
    console.log("Success with null content");
  } catch (e) {
    console.error("Error 5:", e.message);
  }
}

run();
