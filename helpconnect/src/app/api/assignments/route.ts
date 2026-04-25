import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json([], { status: 401 });

    let volunteerId: string | undefined;

    if (session.user.role === "VOLUNTEER") {
      const volunteer = await prisma.volunteer.findUnique({ where: { userId: session.user.id } });
      volunteerId = volunteer?.id;

      if (!volunteerId) {
        return NextResponse.json([]);
      }
    }

    const assignments = await prisma.assignment.findMany({
      where: volunteerId ? { volunteerId } : undefined,
      include: {
        need: { select: { title: true, zone: true, severity: true } },
        volunteer: { include: { user: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(assignments);
  } catch {
    return NextResponse.json([]);
  }
}
