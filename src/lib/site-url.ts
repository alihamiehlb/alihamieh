/** Public site URL — portfolio uses alihamieh.com in production, not *.vercel.app */
export function getSiteUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    process.env.SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3000";
  }

  return "https://alihamieh.com";
}
