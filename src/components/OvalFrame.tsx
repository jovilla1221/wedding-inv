import corner from "@/assets/frame-corner.png";

/** Oval photo frame with four ornate gold corner ornaments. */
export function OvalFrame({
  src,
  alt,
  className = "",
  imgClassName = "",
  size = "lg",
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  size?: "md" | "lg";
}) {
  const dims = size === "lg" ? "oval-lg" : "oval-md";
  return (
    <div className={`relative inline-block ${className}`}>
      <div className={`${dims} oval-photo overflow-hidden rounded-[50%] bg-ivory`}>
        <img src={src} alt={alt} className={`w-full h-full object-cover ${imgClassName}`} />
      </div>
      <img src={corner} alt="" aria-hidden className="absolute -top-4 -left-4 w-16 sm:w-20" />
      <img
        src={corner}
        alt=""
        aria-hidden
        className="absolute -top-4 -right-4 w-16 sm:w-20 scale-x-[-1]"
      />
      <img
        src={corner}
        alt=""
        aria-hidden
        className="absolute -bottom-4 -left-4 w-16 sm:w-20 scale-y-[-1]"
      />
      <img
        src={corner}
        alt=""
        aria-hidden
        className="absolute -bottom-4 -right-4 w-16 sm:w-20 scale-x-[-1] scale-y-[-1]"
      />
    </div>
  );
}
