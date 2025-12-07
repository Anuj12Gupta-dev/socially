"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import bcrypt from "bcryptjs";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(credentials: SignUpValues) {
  try {
    const { username, email, password } = signUpSchema.parse(credentials);

    const passwordHash = await bcrypt.hash(password, 10);

    const userId = generateIdFromEntropySize(10);

    const existingUsername = await prisma.user.findFirst({
      where: { username: { equals: username, mode: "insensitive" } },
    });
    if (existingUsername) return { error: "Username already taken" };

    const existingEmail = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });
    if (existingEmail) return { error: "Email already taken" };

    // Create user and stream user in parallel
    await Promise.all([
      prisma.user.create({
        data: {
          id: userId,
          username,
          displayName: username,
          email,
          passwordHash,
        },
      }),
      streamServerClient.upsertUser({
        id: userId,
        username,
        name: username,
      })
    ]);

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    redirect("/"); // <-- correct
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
}