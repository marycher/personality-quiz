import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { saveQuizResult } from "@/lib/models";

const quizResultSchema = z.object({
  name: z.string().min(1).max(200),
  percentage: z.number().min(0).max(100),
  wish: z.string().max(5000).optional().default(""),
  story: z.string().max(5000).optional().default(""),
  answers: z.array(z.object({
    questionId: z.string(),
    selectedIndex: z.number(),
    isCorrect: z.boolean(),
  })),
});

export async function POST(request: NextRequest) {
  const parsed = quizResultSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Некорректные данные", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const result = await saveQuizResult(parsed.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save result" },
      { status: 500 }
    );
  }
}
