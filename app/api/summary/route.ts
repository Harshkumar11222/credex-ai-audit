import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        summary: "OpenAI API key missing.",
      });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Generate a short professional AI audit summary for:
Team size: ${body.teamSize}
Use case: ${body.useCase}
Monthly savings: ${body.monthlySavings}
Annual savings: ${body.annualSavings}`,
        },
      ],
    });

    return NextResponse.json({
      summary: completion.choices[0]?.message?.content || "Summary generated.",
    });
  } catch (error) {
    console.log("SUMMARY API ERROR:", error);

    return NextResponse.json({
      summary: "AI summary unavailable. Using fallback summary.",
    });
  }
}