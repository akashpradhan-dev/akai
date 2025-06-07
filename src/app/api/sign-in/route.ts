import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Missing email or password" },
      { status: 400 }
    );
  }

  try {
    if (
      (email === process.env.ADMIN_EMAIL ||
        process.env.NEXT_PUBLIC_GUEST_EMAIL) &&
      (password === process.env.ADMIN_PASSWORD ||
        process.env.NEXT_PUBLIC_GUEST_PASSWORD)
    ) {
      const token = "";

      return NextResponse.json(
        {
          message: "Sign in successful",
          token,
          data: {
            email,
            name:
              email === process.env.NEXT_PUBLIC_GUEST_EMAIL ? "Guest" : "Akash",
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error signing in" }, { status: 500 });
  }
}
