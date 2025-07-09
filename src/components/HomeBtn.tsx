"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useUserRole } from "@/hooks/useUserRole";

function HomeBtn() {
  const { isCandidate, isLoading } = useUserRole();

  if (isCandidate || isLoading) return null;

  return (
    <Link href={"/"}>
      <Button className="gap-2 font-medium" size={"sm"}>
        Home
      </Button>
    </Link>
  );
}
export default HomeBtn;