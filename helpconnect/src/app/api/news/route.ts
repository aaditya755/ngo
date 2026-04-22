import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const news = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { author: { select: { name: true } }, ngo: { select: { orgName: true } } },
    });

    return NextResponse.json(news);
  } catch {
    return NextResponse.json([]);
  }
}
