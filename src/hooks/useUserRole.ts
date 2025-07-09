// ✅ useUserRole.ts
"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";

type Role = "candidate" | "interviewer" | "admin" | null;

export const useUserRole = () => {
  const { data: session, status } = useSession();

  const [role, setRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserRole = useCallback(async () => {
    if (status === "loading") return;

    if (status !== "authenticated" || !session?.user) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);

      const userId = session.user.id;
      console.log("Fetching user role for ID:", userId);
      const res = await fetch(`/api/users/byId?id=${userId}`);
      const data = await res.json();
      console.log("User role data:", data);
      if (res.ok) {
        setRole(data.role || "candidate");
      } else if (res.status === 404) {
        const createRes = await fetch("/api/users/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: userId,
            email: session.user.email || "",
            name: session.user.name || "Unknown",
            role: "candidate",
          }),
        });

        if (createRes.ok) {
          const newUser = await createRes.json();
          setRole(newUser.role || "candidate");
          console.log("✅ User created successfully with role:", newUser.role);
        } else {
          setError("Failed to create user record");
        }
      } else {
        setError(data.error || "Failed to fetch user role");
      }
    } catch (err) {
      console.error("Error fetching/creating user:", err);
      setError("Network error while fetching user role");
    } finally {
      setIsLoading(false);
    }
  }, [session, status]);

  useEffect(() => {
    fetchUserRole();
  }, [fetchUserRole]);

  return {
    isLoading,
    isInterviewer: role === "interviewer",
    isCandidate: role === "candidate",
    isAdmin: role === "admin",
    role,
    error,
  };
};