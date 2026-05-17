import Link from "next/link";

type CvOpenButtonProps = {
  variant?: "primary" | "ghost" | "nav" | "card";
  className?: string;
};

export default function CvOpenButton({
  variant = "primary",
  className = "",
}: CvOpenButtonProps) {
  const base = `cv-open-btn cv-open-btn--${variant}`;
  return (
    <Link
      href="/cv"
      className={`${base}${className ? ` ${className}` : ""}`}
    >
      <span className="cv-open-btn-icon" aria-hidden>
        📄
      </span>
      Open CV
    </Link>
  );
}
