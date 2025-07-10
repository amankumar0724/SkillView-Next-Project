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

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(data.message);
      router.push("/sign-in");
    } else {
      setError(data.message);
    }

    setPending(false);
  };

  const handleProvider = (
    e: React.MouseEvent<HTMLButtonElement>,
    provider: "github" | "google"
  ) => {
    e.preventDefault();
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-md border rounded-2xl p-6">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold">Sign up to SkillView</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Create your account with email or continue with a provider
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
              type="text"
              placeholder="Full name"
              disabled={pending}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              type="email"
              placeholder="Email"
              disabled={pending}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              disabled={pending}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <Input
              type="password"
              placeholder="Confirm password"
              disabled={pending}
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              required
            />
            <Button
              type="submit"
              size="lg"
              disabled={pending}
              className="w-full cursor-pointer"
            >
              {pending ? "Creating account..." : "Continue"}
            </Button>
          </form>

          <Separator className="my-6" />

          <div className="flex justify-center gap-4">
            <Button
              onClick={(e) => handleProvider(e, "google")}
              variant="outline"
              size="icon"
              disabled={pending}
              className="cursor-pointer hover:scale-105 transition-transform"
            >
              <FcGoogle className="w-6 h-6" />
            </Button>
            <Button
              onClick={(e) => handleProvider(e, "github")}
              variant="outline"
              size="icon"
              disabled={pending}
              className="cursor-pointer hover:scale-105 transition-transform"
            >
              <FaGithub className="w-6 h-6" />
            </Button>
          </div>

          <p className="mt-6 text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
