import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered." }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const validRoles = ["ADMIN", "NGO_COORDINATOR", "FIELD_WORKER", "VOLUNTEER", "DONOR"];
    const userRole = validRoles.includes(role) ? role : "VOLUNTEER";

    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: userRole },
    });

    // Auto-create role profile
    if (userRole === "VOLUNTEER") {
      await prisma.volunteer.create({
        data: { userId: user.id, skills: "[]" },
      });
      await prisma.onboardingProgress.create({
        data: { userId: user.id, currentStep: 1 },
      });
    }

    return NextResponse.json({ success: true, userId: user.id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
