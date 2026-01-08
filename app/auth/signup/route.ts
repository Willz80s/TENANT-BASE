import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, tenantName } = body;

  if (!email || !password || !tenantName) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    return NextResponse.json(
      { error: "User already exists" },
      { status: 409 }
    );
  }

  const hashed = await bcrypt.hash(password, 12);

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        password: hashed,
      },
    });

    const tenant = await tx.tenant.create({
      data: {
        name: tenantName,
      },
    });

    await tx.membership.create({
      data: {
        userId: user.id,
        tenantId: tenant.id,
        role: "OWNER",
      },
    });
  });

  return NextResponse.json({ success: true });
}
