import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    let volunteerId: string | undefined;

    if (session?.user?.role === "VOLUNTEER") {
      const volunteer = await prisma.volunteer.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      });
      volunteerId = volunteer?.id;
    }

    const events = await prisma.event.findMany({
      where: { date: { gte: new Date() } },
      include: {
        ngo: { select: { orgName: true } },
        _count: { select: { signups: true } },
        ...(volunteerId
          ? {
              signups: {
                where: { volunteerId },
                select: { id: true },
              },
            }
          : {}),
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(
      events.map((event) => ({
        ...event,
        joined: "signups" in event ? event.signups.length > 0 : false,
      })),
    );
  } catch {
    return NextResponse.json([]);
  }
}
