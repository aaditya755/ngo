import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    let ngoId: string | undefined;
    if (session?.user?.role === "NGO_COORDINATOR") {
      const ngoProfile = await prisma.nGOProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      });
      ngoId = ngoProfile?.id;
    }

    const campaigns = await prisma.campaign.findMany({
      where: ngoId ? { ngoId } : { status: "ACTIVE" },
      include: { ngo: { select: { orgName: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(campaigns);
  } catch {
    return NextResponse.json([]);
  }
}
