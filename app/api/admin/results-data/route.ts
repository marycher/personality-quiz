import { NextResponse } from "next/server";
import { getQuizResults } from "@/lib/models";

export async function GET() {
  try {
    const items = await getQuizResults();
    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

