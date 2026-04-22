import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      where: { status: "ACTIVE" },
      include: { ngo: { select: { orgName: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(campaigns);
  } catch {
    return NextResponse.json([]);
  }
}
