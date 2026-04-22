import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { zone, message, alertType } = await req.json();
  const em = await prisma.zoneEmergency.create({ data: { zone, message, alertType: alertType ?? "GENERAL", declaredBy: session.user.id } });
  return NextResponse.json(em, { status: 201 });
}
