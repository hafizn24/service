import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, details } = await req.json();

    // Validate required fields
    if (!name || !email || !details) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if Discord webhook URL is configured
    if (!process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL) {
      console.error("DISCORD_WEBHOOK_URL is not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Send to Discord webhook
    const discordResponse = await fetch(process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `📋 New Service Request\n👤 Name: ${name}\n📧 Email: ${email}\n🛠️ Details: ${details}`,
      }),
    });

    if (!discordResponse.ok) {
      console.error(
        "Discord webhook failed:",
        discordResponse.status,
        await discordResponse.text()
      );
      return NextResponse.json(
        { error: "Failed to process request" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}