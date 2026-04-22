import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const volunteers = await prisma.volunteer.findMany({
      include: {
        user: { select: { name: true, email: true } },
        badges: { include: { badge: true } },
      },
      orderBy: { totalPoints: "desc" },
    });

    return NextResponse.json(volunteers);
  } catch {
    return NextResponse.json([]);
  }
}
