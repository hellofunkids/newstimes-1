import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "activeChildProfileId";

export async function setActiveChildProfile(childProfileId: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, childProfileId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function clearActiveChildProfile() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Verifies the logged-in parent, the active child profile cookie, and that
 * the profile actually belongs to this parent (prevents cross-account access).
 * Returns null instead of redirecting - use in API routes.
 */
export async function getActiveChildProfile() {
  const session = await auth();
  if (!session?.parentId) return null;

  const cookieStore = await cookies();
  const childProfileId = cookieStore.get(COOKIE_NAME)?.value;
  if (!childProfileId) return null;

  return prisma.childProfile.findFirst({
    where: { id: childProfileId, parentId: session.parentId },
  });
}

/** Same as getActiveChildProfile, but redirects instead - use in pages. */
export async function requireActiveChildProfile() {
  const session = await auth();
  if (!session?.parentId) redirect("/login");

  const cookieStore = await cookies();
  const childProfileId = cookieStore.get(COOKIE_NAME)?.value;
  if (!childProfileId) redirect("/profiles");

  const childProfile = await prisma.childProfile.findFirst({
    where: { id: childProfileId, parentId: session.parentId },
  });
  if (!childProfile) redirect("/profiles");

  return childProfile;
}
