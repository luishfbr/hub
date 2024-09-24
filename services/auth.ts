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
    // Callback para manipular o token JWT
    async jwt({ token, user }) {
      if (user) {
        // Adiciona o id e email do usuário ao token
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    // Callback para manipular a sessão
    async session({ session, token }) {
      if (token) {
        // Adiciona o id e email do token à sessão do usuário
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
    // Callback para autorização de rotas
    authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      // Lógica para rotas de autenticação (/)
      if (pathname.startsWith("/")) {
        if (isLoggedIn) {
          // Redireciona usuários logados para /app
          return Response.redirect(new URL("/app/sistems", nextUrl));
        }
        return true; // Permite acesso a / para usuários não logados
      }

      // Lógica para outras rotas
      if (!isLoggedIn && !pathname.startsWith("/")) {
        // Redireciona usuários não logados para /
        return Response.redirect(new URL("/", nextUrl));
      }

      return true; // Permite acesso para usuários logados
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
  },
});
