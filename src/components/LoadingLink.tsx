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
        style={rest.style}
      >
        {children}
      </a>
    );
  }
);

LoadingLink.displayName = "LoadingLink";

export default LoadingLink;
