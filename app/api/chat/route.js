import { convertToModelMessages, streamText } from "ai";
import { CHAT_SYSTEM_PROMPT } from "@/lib/prompt";
import db from "@/lib/db";
import { MessageRole } from "@prisma/client";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const provider = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

function convertStoredMessageToUI(msg) {
  try {
    const parts = JSON.parse(msg.content);

    const validParts = parts.filter((part) => {
      return part.type === "text";
    });

    if (validParts.length === 0) {
      return null;
    }

    return {
      id: msg.id,
      role: msg.messageRole.toLowerCase(),
      parts: validParts,
      createdAt: msg.createdAt,
    };
  } catch (e) {
    return {
      id: msg.id,
      role: msg.messageRole.toLowerCase(),
      parts: [{ type: "text", text: msg.content }],
      createdAt: msg.createdAt,
    };
  }
}

function extractPartsAsJSON(message) {
  if (message.parts && Array.isArray(message.parts)) {
    return JSON.stringify(message.parts);
  }

  const content = message.content || "";
  return JSON.stringify([{ type: "text", text: content }]);
}

export async function POST(req) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const {
      chatId,
      messages: newMessages,
      model,
      skipUserMessage,
    } = await req.json();

    const normalizedNewMessages = Array.isArray(newMessages)
      ? newMessages
      : [newMessages];

    const allUIMessages = normalizedNewMessages;
    // Cap the context window to the last 20 messages to prevent hitting token limits
    const messagesForContext = allUIMessages.slice(-20);

    // ✅ CRITICAL FIX: convertToModelMessages might fail with tool parts
    // We need to ensure only valid messages are converted
    let modelMessages;
    try {
      modelMessages = convertToModelMessages(messagesForContext);
    } catch (conversionError) {
      console.error("Message conversion error:", conversionError);
      // Fallback: extract plain text from parts
      modelMessages = messagesForContext
        .map((msg) => ({
          role: msg.role,
          content: msg.parts
            .filter((p) => p.type === "text")
            .map((p) => p.text)
            .join("\n"),
        }))
        .filter((m) => m.content);
    }

    // ✅ FIXED: Proper streamText configuration
    const result = streamText({
      model: provider.chat(model),
      messages: modelMessages,
      system: CHAT_SYSTEM_PROMPT,
    });

    return result.toUIMessageStreamResponse({
      sendReasoning: true,
      originalMessages: allUIMessages,
      onFinish: async ({ responseMessage }) => {
        try {
          const messagesToSave = [];

          if (!skipUserMessage) {
            const latestUserMessage =
              normalizedNewMessages[normalizedNewMessages.length - 1];

            if (latestUserMessage?.role === "user") {
              const userPartsJSON = extractPartsAsJSON(latestUserMessage);

              messagesToSave.push({
                chatId,
                content: userPartsJSON,
                messageRole: MessageRole.USER,
                model,
                messageType: "NORMAL",
              });
            }
          }

          // Save assistant response
          if (responseMessage?.parts && responseMessage.parts.length > 0) {
            const assistantPartsJSON = extractPartsAsJSON(responseMessage);

            messagesToSave.push({
              chatId,
              content: assistantPartsJSON,
              messageRole: MessageRole.ASSISTANT,
              model,
              messageType: "NORMAL",
            });
          }

          if (messagesToSave.length > 0) {
            await db.message.createMany({
              data: messagesToSave,
            });
          }
        } catch (error) {
          console.error("❌ Error saving messages:", error);
        }
      },
    });
  } catch (error) {
    console.error("❌ API Route Error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Internal server error",
        details: error.toString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
