import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json([], { status: 401 });

    if (session.user.role === "ADMIN" || session.user.role === "NGO_COORDINATOR") {
      const logs = await prisma.hoursLog.findMany({
        include: {
          assignment: { include: { need: { select: { title: true } } } },
          volunteer: { include: { user: { select: { name: true } } } },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      });

      return NextResponse.json(logs);
    }

    const volunteer = await prisma.volunteer.findUnique({ where: { userId: session.user.id } });
    if (!volunteer) return NextResponse.json([]);

    const logs = await prisma.hoursLog.findMany({
      where: { volunteerId: volunteer.id },
      include: { assignment: { include: { need: { select: { title: true } } } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(logs);
  } catch {
    return NextResponse.json([]);
  }
}
