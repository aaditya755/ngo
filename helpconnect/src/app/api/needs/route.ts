import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const zone = searchParams.get("zone");
  const severity = searchParams.get("severity");
  const category = searchParams.get("category");
  const status = searchParams.get("status") ?? undefined;

  const needs = await prisma.communityNeed.findMany({
    where: {
      ...(zone ? { zone } : {}),
      ...(severity ? { severity } : {}),
      ...(category ? { category } : {}),
      ...(status ? { status } : {}),
    },
    include: {
      ngo: { select: { orgName: true, logoUrl: true } },
      _count: { select: { assignments: true } },
    },
    orderBy: [{ urgencyScore: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(needs);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, zone, lat, lng, category, severity, urgencyScore, ngoId } = body;

    if (!title || !description || !zone || !ngoId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const need = await prisma.communityNeed.create({
      data: {
        title,
        description,
        zone,
        lat,
        lng,
        category: category ?? "HEALTHCARE",
        severity: severity ?? "MEDIUM",
        urgencyScore: urgencyScore ?? 50,
        ngoId,
      },
    });

    return NextResponse.json(need, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create need" }, { status: 500 });
  }
}
