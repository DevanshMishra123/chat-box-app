import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    const user = await users.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isValid = await compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = sign(
        { userId: user._id.toString(), email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    const response = NextResponse.json({ message: "Login successful" });
    response.headers.set(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, 
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      })
    );

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }finally {
    if (client) {
      await client.close();
    }
  }
}
