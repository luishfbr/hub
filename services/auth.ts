import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import Credentials from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts";
import { loginSchema } from "@/app/types/zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        let user = null;

        const parsedCredentials = loginSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          console.error("Invalid credentials:", parsedCredentials.error.errors);
          return null;
        }

        user = await prisma.user.findUnique({
          where: {
            email: parsedCredentials.data.email,
          },
        });

        if (!user) {
          console.log("Usuário não encontrado");
          return null;
        }

        const comparePassword = compareSync(
          parsedCredentials.data.password,
          user.password as string
        );

        if (!comparePassword) {
          console.log("Senha incorreta");
          return null;
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },

    authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      if (pathname.startsWith("/")) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/app/sistems", nextUrl));
        }
        return true;
      }

      if (!isLoggedIn && !pathname.startsWith("/")) {
        return Response.redirect(new URL("/", nextUrl));
      }

      return true;
    },
  },
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
    newUser: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 120 * 60,
    updateAge: 60 * 60,
  },
  jwt: {
    maxAge: 120 * 60,
  },
});
