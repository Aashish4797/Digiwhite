import User from "../models/User";
import dbConnect from "../lib/dbConnect";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: "read:user user:email"
        }
      },
      httpOptions: {
        timeout: 40000,
        headers: {
          Accept: "application/json",
          "User-Agent": "next-auth"
        }
      },
      profile(profile) {
        if (!profile.email) {
          console.error("GitHub profile is missing an email.");
          throw new Error("GitHub email is required");
        }
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url
        };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile"
        }
      }
    })
  ],
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/user-auth",
    error: "/user-auth"
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (!user?.email) {
          console.error("❌ No email provided by", account?.provider);
          return false;
        }

        console.log("Sign-in attempt:", {
          user: { name: user.name, email: user.email },
          provider: account.provider
        });

        await dbConnect();

        const existingUser = await User.findOne({ email: user.email });

        if (existingUser) {
          await User.findByIdAndUpdate(existingUser._id, {
            lastLogin: new Date(),
            name: user.name || existingUser.name,
            image: user.image || existingUser.image,
            $set: { provider: account.provider }
          });
          console.log("✅ Existing user updated:", existingUser.email);
          return true;
        }

        const newUser = await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
          provider: account.provider,
          lastLogin: new Date()
        });

        console.log("✅ New user created:", newUser.email);
        return true;
      } catch (error) {
        console.error("❌ SignIn Error:", error);
        return false;
      }
    },
    async session({ session, token }) {
      try {
        if (session?.user) {
          session.user.id = token.sub;
        }
        return session;
      } catch (error) {
        console.error("❌ Session Error:", error);
        return session;
      }
    },
    async jwt({ token, account }) {
      try {
        if (account) {
          token.provider = account.provider;
        }
        return token;
      } catch (error) {
        console.error("❌ JWT Error:", error);
        return token;
      }
    }
  }
};

export default authOptions;