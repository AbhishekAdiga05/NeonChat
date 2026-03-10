import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content, model } = await request.json();

  if (!content || !model) {
    return NextResponse.json(
      { error: "Content and model are required" },
      { status: 400 },
    );
  }

  const chat = await db.chat.create({
    data: {
      title: content.slice(0, 100),
      model,
      userId: session.user.id,
      messages: {
        create: {
          content,
          messageRole: "USER",
          messageType: "NORMAL",
          model,
        },
      },
    },
    include: {
      messages: true,
    },
  });

  return NextResponse.json(chat);
}
