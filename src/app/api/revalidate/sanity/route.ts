import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { getSanityRevalidationTargets, type SanityWebhookPayload } from "@/sanity/lib/revalidation";

function isAuthorized(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    return false;
  }

  const header = request.headers.get("authorization");
  const bearer = header?.startsWith("Bearer ") ? header.slice(7) : "";

  if (!bearer) {
    return false;
  }

  const secretBuffer = Buffer.from(secret);
  const tokenBuffer = Buffer.from(bearer);

  if (secretBuffer.length !== tokenBuffer.length) {
    return false;
  }

  return timingSafeEqual(secretBuffer, tokenBuffer);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  let payload: SanityWebhookPayload;

  try {
    payload = (await request.json()) as SanityWebhookPayload;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const targets = getSanityRevalidationTargets(payload);

  for (const tag of targets.tags) {
    revalidateTag(tag, "max");
  }

  for (const path of targets.paths) {
    revalidatePath(path);
  }

  return NextResponse.json({
    ok: true,
    revalidated: {
      tags: targets.tags,
      paths: targets.paths,
    },
  });
}
