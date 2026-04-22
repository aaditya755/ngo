import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: { date: { gte: new Date() } },
      include: { ngo: { select: { orgName: true } }, _count: { select: { signups: true } } },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(events);
  } catch {
    return NextResponse.json([]);
  }
}
