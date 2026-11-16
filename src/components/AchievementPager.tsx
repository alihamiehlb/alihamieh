"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, List } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type AchievementItem = { id: string; title: string };

export default function AchievementPager({
  items,
  currentId,
}: {
  items: AchievementItem[];
  currentId: string;
}) {
  const router = useRouter();
  const currentIndex = items.findIndex((item) => item.id === currentId);
  const previous = currentIndex >= 0 && items.length > 1
    ? items[(currentIndex - 1 + items.length) % items.length]
    : null;
  const next = currentIndex >= 0 && items.length > 1
    ? items[(currentIndex + 1) % items.length]
    : null;

  useEffect(() => {
    if (!previous || !next) return;
    let start: { x: number; y: number; target: EventTarget | null } | null = null;
    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      const touch = event.touches[0];
      start = { x: touch.clientX, y: touch.clientY, target: event.target };
    };
    const onTouchEnd = (event: TouchEvent) => {
      const origin = start;
      const touch = event.changedTouches[0];
      start = null;
      if (!origin || !touch) return;
      const target = origin.target instanceof Element ? origin.target : null;
      if (target?.closest("a, button, input, textarea, select, [data-no-swipe]")) return;
      const dx = touch.clientX - origin.x;
      const dy = touch.clientY - origin.y;
      if (Math.abs(dx) < 72 || Math.abs(dx) < Math.abs(dy) * 1.35) return;
      router.push(`/achievement/${dx < 0 ? next.id : previous.id}`);
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [next?.id, previous?.id, router]);

  if (!previous || !next) return null;

  return (
    <nav className="achievement-pager" aria-label="Browse achievements">
      <Link href={`/achievement/${previous.id}`} className="achievement-pager-link">
        <ArrowLeft size={17} aria-hidden="true" />
        <span><small>Previous</small><strong>{previous.title}</strong></span>
      </Link>
      <span className="achievement-pager-count">{currentIndex + 1} <i>/</i> {items.length}</span>
      <Link href={`/achievement/${next.id}`} className="achievement-pager-link achievement-pager-link--next">
        <span><small>Next</small><strong>{next.title}</strong></span>
        <ArrowRight size={17} aria-hidden="true" />
      </Link>
      <Link href="/#achievements" className="achievement-pager-all" aria-label="All achievements">
        <List size={17} aria-hidden="true" /><span>All achievements</span>
      </Link>
    </nav>
  );
}
