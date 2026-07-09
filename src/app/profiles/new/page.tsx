import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LEVELS } from "@/lib/level";
import { setActiveChildProfile } from "@/lib/activeProfile";
import { Level } from "@prisma/client";

const AVATARS = ["🐣", "🦉", "🚀", "🐯", "🦊", "🐼", "🐸", "🦄"];

async function createChildProfile(formData: FormData) {
  "use server";

  const name = String(formData.get("name") ?? "").trim();
  const level = String(formData.get("level") ?? "") as Level;
  const avatar = String(formData.get("avatar") ?? AVATARS[0]);

  if (!name || !LEVELS.some((l) => l.value === level)) {
    return;
  }

  const child = await prisma.childProfile.create({
    data: { name, level, avatar },
  });

  await setActiveChildProfile(child.id);
  redirect("/home");
}

export default function NewProfilePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-slate-950 px-4 py-16">
      <h1 className="text-2xl font-semibold text-white">프로필 만들기</h1>

      <form
        action={createChildProfile}
        className="flex w-full max-w-sm flex-col gap-6"
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-300">이름</label>
          <input
            name="name"
            required
            maxLength={20}
            placeholder="예) 민준"
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm text-slate-300">아바타</span>
          <div className="flex flex-wrap gap-2">
            {AVATARS.map((emoji, i) => (
              <label key={emoji} className="cursor-pointer">
                <input
                  type="radio"
                  name="avatar"
                  value={emoji}
                  defaultChecked={i === 0}
                  className="peer sr-only"
                />
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-2xl peer-checked:ring-2 peer-checked:ring-sky-400">
                  {emoji}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm text-slate-300">레벨</span>
          <div className="flex gap-3">
            {LEVELS.map((l, i) => (
              <label key={l.value} className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="level"
                  value={l.value}
                  defaultChecked={i === 0}
                  className="peer sr-only"
                />
                <span className="flex flex-col items-center gap-1 rounded-xl border border-slate-700 bg-slate-900 px-2 py-3 text-white peer-checked:border-sky-400 peer-checked:bg-slate-800">
                  <span className="text-2xl">{l.emoji}</span>
                  <span className="text-sm">{l.label}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-sky-500 px-4 py-3 font-semibold text-white transition hover:bg-sky-400"
        >
          만들기
        </button>
      </form>
    </main>
  );
}
