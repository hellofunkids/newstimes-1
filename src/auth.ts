import NextAuth from "next-auth";
import Kakao from "next-auth/providers/kakao";
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
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
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
