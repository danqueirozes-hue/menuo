import Image from "next/image";

type LogoProps = {
  variant?: "primary" | "negative";
  className?: string;
};

const SRC = {
  primary: "/brand/menuo-wordmark.png",
  negative: "/brand/menuo-wordmark-negative.png",
};

export function Logo({ variant = "primary", className = "h-8" }: LogoProps) {
  return (
    <Image
      src={SRC[variant]}
      alt="MENUO"
      width={604}
      height={155}
      priority
      className={`w-auto ${className}`}
    />
  );
}
