import NextAuth from "next-auth";
import Kakao from "next-auth/providers/kakao";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

declare module "next-auth" {
  interface Session {
    parentId?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Kakao({
      clientId: process.env.AUTH_KAKAO_ID,
      clientSecret: process.env.AUTH_KAKAO_SECRET,
    }),
    // 카카오 로그인 설정 전, 테스트로 앱을 써볼 수 있도록 만든 임시 로그인입니다.
    // 실제 비밀번호 확인 없이 이름만으로 부모 계정을 만들거나 불러옵니다.
    Credentials({
      id: "guest",
      name: "테스트 로그인",
      credentials: {
        name: { label: "이름", type: "text" },
      },
      async authorize(credentials) {
        const name = credentials?.name?.toString().trim();
        if (!name) return null;

        const kakaoId = `guest:${name}`;
        const parent = await prisma.parent.upsert({
          where: { kakaoId },
          update: {},
          create: { kakaoId, name },
        });

        return { id: parent.id, name: parent.name };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (account?.provider === "kakao" && profile) {
        const kakaoId = profile.id?.toString() ?? account.providerAccountId;
        const parent = await prisma.parent.upsert({
          where: { kakaoId },
          update: {
            name: token.name ?? undefined,
            email: token.email ?? undefined,
          },
          create: {
            kakaoId,
            name: token.name,
            email: token.email,
          },
        });
        token.parentId = parent.id;
      } else if (account?.provider === "guest" && user) {
        token.parentId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (typeof token.parentId === "string") {
        session.parentId = token.parentId;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
