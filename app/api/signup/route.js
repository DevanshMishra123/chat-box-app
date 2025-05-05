import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  const { email, password } = await req.json();

  if (!email || !password || password.length < 6) {
    return NextResponse.json(
      { message: "Invalid input" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 12);
    await usersCollection.insertOne({ email, password: hashedPassword });

    return NextResponse.json(
      { message: "User created" },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
