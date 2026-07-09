import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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

/** Returns null instead of redirecting - use in API routes. */
export async function getActiveChildProfile() {
  const cookieStore = await cookies();
  const childProfileId = cookieStore.get(COOKIE_NAME)?.value;
  if (!childProfileId) return null;

  return prisma.childProfile.findUnique({ where: { id: childProfileId } });
}

/** Same as getActiveChildProfile, but redirects instead - use in pages. */
export async function requireActiveChildProfile() {
  const cookieStore = await cookies();
  const childProfileId = cookieStore.get(COOKIE_NAME)?.value;
  if (!childProfileId) redirect("/profiles");

  const childProfile = await prisma.childProfile.findUnique({
    where: { id: childProfileId },
  });
  if (!childProfile) redirect("/profiles");

  return childProfile;
}
