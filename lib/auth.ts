import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getDatabase } from "./mongodb";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "leastpass-super-secure-jwt-secret-key-2026-auth",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        username: { label: "Username or Email", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const inputUser = credentials.username.trim();
        const inputPass = credentials.password;

        // 1. Check direct MongoDB database users collection
        try {
          const db = await getDatabase();
          if (db) {
            const usersCollection = db.collection("users");
            const user = await usersCollection.findOne({
              $or: [
                { username: inputUser },
                { email: inputUser.toLowerCase() },
              ],
            });

            if (user && user.password === inputPass) {
              return {
                id: user._id.toString(),
                name: (user.name as string) || "Neeraj Rekwar",
                email: (user.email as string) || "admin@leastpass.com",
                role: (user.role as string) || "administrator",
              };
            }
          }
        } catch (dbErr) {
          console.warn("MongoDB user auth check error, falling back to local/env:", dbErr);
        }

        // 2. Check local users store (data/users.json)
        try {
          const fs = await import("fs/promises");
          const path = await import("path");
          const usersFilePath = path.join(process.cwd(), "data", "users.json");
          const fileExists = await fs.access(usersFilePath).then(() => true).catch(() => false);
          if (fileExists) {
            const fileData = await fs.readFile(usersFilePath, "utf8");
            const localUsers = JSON.parse(fileData);
            if (Array.isArray(localUsers)) {
              const matched = localUsers.find(
                (u: { username?: string; email?: string; password?: string; name?: string; role?: string }) =>
                  (u.username === inputUser || u.email?.toLowerCase() === inputUser.toLowerCase()) &&
                  u.password === inputPass
              );
              if (matched) {
                return {
                  id: matched.username,
                  name: matched.name || "Administrator",
                  email: matched.email || `${matched.username}@leastpass.com`,
                  role: matched.role || "administrator",
                };
              }
            }
          }
        } catch {
          // Proceed to env fallback
        }

        // 3. Fallback to env / default administrator credentials
        const validUsername = process.env.ADMIN_USER || "admin";
        const validPassword = process.env.ADMIN_PASSWORD || "leastpass2026!";

        const isUserMatch =
          inputUser === validUsername ||
          inputUser.toLowerCase() === "admin@leastpass.com";
        const isPassMatch = inputPass === validPassword;

        if (isUserMatch && isPassMatch) {
          return {
            id: "1",
            name: "Neeraj Rekwar",
            email: "admin@leastpass.com",
            role: "administrator",
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role || "administrator";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = (token.role as string) || "administrator";
      }
      return session;
    },
  },
};
