import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { levelLabel } from "@/lib/level";
import { setActiveChildProfile } from "@/lib/activeProfile";

export default async function ProfilesPage() {
  const session = await auth();
  if (!session?.parentId) redirect("/login");

  const children = await prisma.childProfile.findMany({
    where: { parentId: session.parentId },
    orderBy: { createdAt: "asc" },
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-slate-950 px-4 py-16">
      <h1 className="text-2xl font-semibold text-white">
        누가 읽을까요?
      </h1>
      <div className="flex flex-wrap justify-center gap-6">
        {children.map((child) => (
          <form
            key={child.id}
            action={async () => {
              "use server";
              await setActiveChildProfile(child.id);
              redirect("/home");
            }}
          >
            <button
              type="submit"
              className="group flex flex-col items-center gap-3"
            >
              <span className="flex h-28 w-28 items-center justify-center rounded-2xl bg-slate-800 text-5xl transition group-hover:ring-4 group-hover:ring-sky-400">
                {child.avatar ?? "🙂"}
              </span>
              <span className="text-lg text-white">{child.name}</span>
              <span className="text-sm text-slate-400">
                {levelLabel(child.level)}
              </span>
            </button>
          </form>
        ))}

        <Link
          href="/profiles/new"
          className="flex flex-col items-center gap-3"
        >
          <span className="flex h-28 w-28 items-center justify-center rounded-2xl border-2 border-dashed border-slate-600 text-4xl text-slate-500 transition hover:border-sky-400 hover:text-sky-400">
            +
          </span>
          <span className="text-lg text-slate-300">프로필 추가</span>
        </Link>
      </div>
    </main>
  );
}
