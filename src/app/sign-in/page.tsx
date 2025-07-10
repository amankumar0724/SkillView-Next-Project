"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { TriangleAlert } from "lucide-react";

import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.ok) {
        toast.success("Login successful");
        router.push("/");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong during sign in");
    } finally {
      setPending(false);
    }
  };

  const handleProvider = (
    e: React.MouseEvent<HTMLButtonElement>,
    provider: "google" | "github"
  ) => {
    e.preventDefault();
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-md border rounded-2xl p-6">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold">Sign in to SkillView</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Use your email and password or a provider to sign in
          </CardDescription>
        </CardHeader>

        {!!error && (
          <div className="bg-destructive/15 text-destructive text-sm px-4 py-2 mb-4 rounded-md flex items-center gap-2">
            <TriangleAlert className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              disabled={pending}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              disabled={pending}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" size="lg" disabled={pending} className="w-full cursor-pointer">
              {pending ? "Signing in..." : "Continue"}
            </Button>
          </form>

          <Separator className="my-6" />

          <div className="flex justify-center gap-4">
            <Button
              onClick={(e) => handleProvider(e, "google")}
              variant="outline"
              size="icon"
              disabled={pending}
              className="hover:scale-105 transition-transform cursor-pointer"
            >
              <FcGoogle className="w-6 h-6" />
            </Button>
            <Button
              onClick={(e) => handleProvider(e, "github")}
              variant="outline"
              size="icon"
              disabled={pending}
              className="hover:scale-105 transition-transform cursor-pointer"
            >
              <FaGithub className="w-6 h-6" />
            </Button>
          </div>

          <p className="mt-6 text-sm text-center text-muted-foreground">
            Don’t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
