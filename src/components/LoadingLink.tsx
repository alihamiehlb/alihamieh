"use client";

import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type LoadingLinkProps = LinkProps & {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export default function LoadingLink({ children, className, href, ...rest }: LoadingLinkProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    startTransition(() => {
      router.push(href.toString());
    });
  };

  return (
    <a
      href={href.toString()}
      className={`${className || ""} ${isPending ? "is-loading" : ""}`}
      onClick={handleClick}
      style={rest.style}
    >
      {children}
    </a>
  );
}
