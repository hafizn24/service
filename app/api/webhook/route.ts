import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Parse form data or JSON
    let formData;
    const contentType = req.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      formData = await req.json();
    } else {
      const data = await req.formData();
      formData = Object.fromEntries(data);
    }

    const { name, email, phone, hostel, numberPlate, brandModel, productPackage, timeslot, receipt } = formData;

    // Validate required fields
    if (!name || !email || !phone || !hostel || !numberPlate || !brandModel || !productPackage || !timeslot) {
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

    // Format message for Discord
    const messageContent = `
    📋 **New Service Request**
    👤 Name: ${name}
    📧 Email: ${email}
    📱 Phone: ${phone}
    🏢 Hostel: ${hostel}
    🚗 Number Plate: ${numberPlate}
    🔧 Brand/Model: ${brandModel}
    📦 Package: ${productPackage}
    ⏰ Timeslot: ${timeslot}
    ${receipt ? `📄 Receipt: Attached` : ""}
    `.trim();

    // Send to Discord webhook
    const discordResponse = await fetch(process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: messageContent,
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