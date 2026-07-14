import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const password = body.password;

  if (password === "admin123") {
    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_token", "logged_in", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    return response;
  }

  return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
}
