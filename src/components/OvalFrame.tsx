import corner from "@/assets/frame-corner.png";

/** Oval photo frame with four ornate gold corner ornaments. */
export function OvalFrame({
  src,
  alt,
  className = "",
  size = "lg",
}: {
  src: string;
  alt: string;
  className?: string;
  size?: "md" | "lg";
}) {
  const dims =
    size === "lg"
      ? "w-64 h-80 sm:w-72 sm:h-[22rem]"
      : "w-44 h-56 sm:w-52 sm:h-64";
  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`${dims} overflow-hidden rounded-[50%] border-2 border-[oklch(0.74_0.12_80)] shadow-[0_25px_60px_-20px_oklch(0.18_0.06_265/0.6)] bg-ivory`}
      >
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </div>
      <img src={corner} alt="" aria-hidden className="absolute -top-4 -left-4 w-16 sm:w-20" />
      <img src={corner} alt="" aria-hidden className="absolute -top-4 -right-4 w-16 sm:w-20 scale-x-[-1]" />
      <img src={corner} alt="" aria-hidden className="absolute -bottom-4 -left-4 w-16 sm:w-20 scale-y-[-1]" />
      <img src={corner} alt="" aria-hidden className="absolute -bottom-4 -right-4 w-16 sm:w-20 scale-x-[-1] scale-y-[-1]" />
    </div>
  );
}
