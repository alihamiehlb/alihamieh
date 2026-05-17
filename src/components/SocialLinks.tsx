"use client";

import { motion } from "framer-motion";
import type { ProfileData } from "@/lib/content";

type SocialLinksProps = {
  profile: ProfileData;
  compact?: boolean;
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.4 },
  }),
};

export default function SocialLinks({ profile, compact }: SocialLinksProps) {
  const links = [
    {
      id: "github",
      label: "GitHub",
      href: profile.github,
      sub: profile.githubBio || "Repositories & code",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: profile.linkedin,
      sub: "Professional profile",
    },
    {
      id: "instagram",
      label: "Instagram",
      href: profile.instagram,
      sub: "@alihamiehlb",
    },
    {
      id: "linktree",
      label: "Linktree",
      href: profile.linktree,
      sub: "All links in one place",
    },
    {
      id: "prints",
      label: profile.printsLb?.name || "printsLB",
      href: profile.printsLb?.url,
      sub: profile.printsLb?.tagline || "Founder · 3D printing Lebanon",
      founder: true,
    },
  ].filter((l) => Boolean(l.href));

  return (
    <motion.div
      className={`social-links${compact ? " social-links--compact" : ""}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
    >
      {links.map((link, i) => (
        <motion.a
          key={link.id}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className={`social-link glass${link.founder ? " social-link--founder" : ""}`}
          variants={fadeUp}
          custom={i}
          whileHover={{ y: -4, scale: 1.02 }}
        >
          <span className="social-link-label">
            {link.label}
            {link.founder && <span className="founder-badge">Founder</span>}
          </span>
          {!compact && <span className="social-link-sub">{link.sub}</span>}
        </motion.a>
      ))}
    </motion.div>
  );
}
