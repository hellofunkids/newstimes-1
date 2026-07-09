import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-b from-sky-100 to-white px-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold text-slate-800">📰 리딩 타임</h1>
        <p className="text-slate-500">
          최신 영어 스토리를 듣고, 따라 읽고, AI 발음 분석까지!
        </p>
      </div>
      <form
        action={async () => {
          "use server";
          await signIn("kakao", { redirectTo: "/profiles" });
        }}
      >
        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl bg-[#FEE500] px-6 py-3 font-semibold text-[#191919] shadow-sm transition hover:brightness-95"
        >
          카카오로 로그인 (부모님/선생님)
        </button>
      </form>
      <p className="max-w-sm text-center text-xs text-slate-400">
        부모님 또는 선생님 계정으로 로그인한 뒤, 아이들 프로필을 여러 개
        만들어 함께 사용할 수 있어요.
      </p>

      <div className="flex w-full max-w-xs items-center gap-3 text-xs text-slate-400">
        <div className="h-px flex-1 bg-slate-200" />
        카카오 설정 전 테스트용
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <form
        action={async (formData: FormData) => {
          "use server";
          await signIn("guest", {
            name: formData.get("name"),
            redirectTo: "/profiles",
          });
        }}
        className="flex w-full max-w-xs gap-2"
      >
        <input
          name="name"
          required
          placeholder="이름 입력 (예: 테스트)"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          시작하기
        </button>
      </form>
    </main>
  );
}
