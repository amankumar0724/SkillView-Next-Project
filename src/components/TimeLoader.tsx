"use client";

import { useEffect, useState } from "react";
import LoaderUI from "./LoaderUI";

function TimedLoader({ duration = 2000, children }: { duration?: number; children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, duration);

    return () => clearTimeout(timer); // cleanup on unmount
  }, [duration]);

  return loading ? <LoaderUI /> : <>{children}</>;
}

export default TimedLoader;
