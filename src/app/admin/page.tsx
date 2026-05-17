import type { Metadata } from "next";
import AdminPanel from "@/components/AdminPanel";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin — Ali Hamieh Portfolio",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminPanel />;
}
