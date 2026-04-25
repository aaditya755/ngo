import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json([], { status: 401 });

    if (session.user.role === "DONOR") {
      const donations = await prisma.donation.findMany({
        where: { donorId: session.user.id },
        include: {
          campaign: {
            include: {
              ngo: { select: { orgName: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(donations);
    }

    if (session.user.role === "NGO_COORDINATOR") {
      const ngoProfile = await prisma.nGOProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      });

      if (!ngoProfile) {
        return NextResponse.json([]);
      }

      const donations = await prisma.donation.findMany({
        where: { campaign: { ngoId: ngoProfile.id } },
        include: {
          campaign: {
            include: {
              ngo: { select: { orgName: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(donations);
    }

    if (session.user.role === "ADMIN") {
      const donations = await prisma.donation.findMany({
        include: {
          campaign: {
            include: {
              ngo: { select: { orgName: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      });

      return NextResponse.json(donations);
    }

    return NextResponse.json([]);
  } catch {
    return NextResponse.json([]);
  }
}
