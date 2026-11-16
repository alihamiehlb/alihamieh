"use client";

import FailureScreen from "@/components/FailureScreen";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <FailureScreen kind="error" onRetry={reset} />;
}
