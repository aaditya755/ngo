import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const volunteers = await prisma.volunteer.findMany({
    orderBy: { totalPoints: "desc" },
    take: 20,
    include: {
      user: { select: { name: true, image: true } },
      badges: { include: { badge: true } },
    },
  });
  return NextResponse.json(volunteers);
}
