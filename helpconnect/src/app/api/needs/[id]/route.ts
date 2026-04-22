import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const need = await prisma.communityNeed.findUnique({
      where: { id },
      include: {
        ngo: { select: { orgName: true, description: true } },
        _count: { select: { assignments: true } },
      },
    });

    if (!need) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(need);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
