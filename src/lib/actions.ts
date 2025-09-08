"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;

  // Check if user already exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    return { error: "User with this email already exists." };
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert new user
  await db.insert(users).values({
    id: crypto.randomUUID(),
    email,
    name: firstName,
    hashedPassword,
  });

  return { success: "Account created successfully! Please log in." };
}
