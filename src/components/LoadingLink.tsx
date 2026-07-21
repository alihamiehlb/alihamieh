"use client";

import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, forwardRef } from "react";

type LoadingLinkProps = LinkProps & {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
};

const LoadingLink = forwardRef<HTMLAnchorElement, LoadingLinkProps>(
  ({ children, className, href, onClick, ...rest }, ref) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      if (onClick) onClick(e);
      e.preventDefault();
      startTransition(() => {
        router.push(href.toString());
      });
    };

    return (
      <a
        ref={ref}
        href={href.toString()}
        className={`${className || ""} ${isPending ? "is-loading" : ""}`}
        onClick={handleClick}
        style={{ ...rest.style, position: "relative" }}
        aria-busy={isPending}
      >
        {children}
        {isPending && (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(10, 12, 20, 0.45)",
              backdropFilter: "blur(4px)",
              borderRadius: "inherit",
              zIndex: 10,
            }}
          >
            <span
              style={{
                width: "1.6rem",
                height: "1.6rem",
                border: "2.5px solid rgba(255,255,255,0.2)",
                borderTopColor: "var(--aqua)",
                borderRadius: "50%",
                animation: "spin 0.75s linear infinite",
              }}
            />
          </span>
        )}
      </a>
    );
  }
);

LoadingLink.displayName = "LoadingLink";

export default LoadingLink;
