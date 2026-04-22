import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json([], { status: 401 });
    const notifs = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" }, take: 50,
    });
    return NextResponse.json(notifs);
  } catch (e) { return NextResponse.json([]); }
}

export async function PATCH() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await prisma.notification.updateMany({ where: { userId: session.user.id, read: false }, data: { read: true } });
    return NextResponse.json({ success: true });
  } catch (e) { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
