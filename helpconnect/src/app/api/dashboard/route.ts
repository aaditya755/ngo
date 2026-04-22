import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [needs, volunteers, events, emergencies] = await Promise.all([
      prisma.communityNeed.count(),
      prisma.volunteer.count(),
      prisma.event.count({ where: { date: { gte: new Date() } } }),
      prisma.zoneEmergency.findMany({
        where: { active: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
    ]);

    const resolved = await prisma.communityNeed.count({ where: { status: "RESOLVED" } });
    const critical = await prisma.communityNeed.count({
      where: { severity: "CRITICAL", status: { not: "RESOLVED" } },
    });
    const recentNeeds = await prisma.communityNeed.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { ngo: { select: { orgName: true } } },
    });

    return NextResponse.json({ needs, volunteers, events, resolved, critical, emergencies, recentNeeds });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
