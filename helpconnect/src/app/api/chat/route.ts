import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const [needsCount, volunteersCount, criticalCount] = await Promise.all([
      prisma.communityNeed.count({ where: { status: { not: "RESOLVED" } } }),
      prisma.volunteer.count(),
      prisma.communityNeed.count({ where: { severity: "CRITICAL", status: { not: "RESOLVED" } } }),
    ]);

    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      return NextResponse.json({
        reply: `I'm NEXUS-ALLOC. Right now there are ${needsCount} active needs, ${volunteersCount} volunteers, and ${criticalCount} critical situations. Add GEMINI_API_KEY to enable live AI responses.`,
      });
    }

    const systemPrompt = `You are NEXUS-ALLOC, the AI coordination layer for HelpConnect. Context: ${needsCount} active needs, ${volunteersCount} volunteers, ${criticalCount} critical needs. Prioritize proximity, wellbeing flags, and urgency. Keep guidance concise and practical.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL ?? "gemini-2.0-flash"}:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: "user", parts: [{ text: message }] }],
        }),
      },
    );

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "I could not generate a response. Please try again.";

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: "Error processing request." }, { status: 500 });
  }
}
