import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const assignments = await prisma.assignment.findMany({
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
