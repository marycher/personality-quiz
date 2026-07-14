import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminToken } from "@/lib/admin-auth";

const verifySchema = z.object({
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const parsed = verifySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Некорректные данные" },
      { status: 400 }
    );
  }

  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (parsed.data.password !== adminPassword) {
    return NextResponse.json(
      { error: "Неверный пароль" },
      { status: 401 }
    );
  }

  const token = createAdminToken();
  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return response;
}
