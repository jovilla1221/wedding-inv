import bgLandscape from "@/assets/bg-landscape.jpg";
import gebyok from "@/assets/gebyok-upper.png";
import tree from "@/assets/tree.png";
import bouquetL from "@/assets/flower-bouquet-left.png";
import bouquetR from "@/assets/flower-bouquet-right.png";

/**
 * Painterly framed scene: pastoral landscape backdrop,
 * gebyok arch up top, vintage trees flanking sides,
 * floral bouquets at bottom corners — mirrors the
 * traditional Javanese gebyok stage composition.
 */
export function SceneDecor({
  variant = "light",
  withLandscape = true,
}: {
  variant?: "light" | "dark";
  withLandscape?: boolean;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {withLandscape && (
        <img
          src={bgLandscape}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
      )}
      {variant === "dark" && (
        <div className="absolute inset-0 bg-navy/55 mix-blend-multiply" />
      )}
      {/* Soft vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,oklch(0.18_0.06_265/0.35)_100%)]" />

      {/* Gebyok arch — top */}
      <img
        src={gebyok}
        alt=""
        aria-hidden
        className="absolute -top-2 left-1/2 -translate-x-1/2 w-[180%] sm:w-[120%] md:w-[100%] max-w-none opacity-95 drop-shadow-[0_6px_20px_rgba(0,0,0,0.25)]"
      />

      {/* Trees — flanking sides */}
      <img
        src={tree}
        alt=""
        aria-hidden
        className="absolute bottom-[18%] -left-12 sm:-left-6 w-44 sm:w-64 md:w-80 opacity-95 animate-[fade-in_1.6s_ease-out_both]"
      />
      <img
        src={tree}
        alt=""
        aria-hidden
        className="absolute bottom-[18%] -right-12 sm:-right-6 w-44 sm:w-64 md:w-80 opacity-95 scale-x-[-1] animate-[fade-in_1.6s_ease-out_both]"
      />

      {/* Floral bouquets — bottom corners */}
      <img
        src={bouquetL}
        alt=""
        aria-hidden
        className="absolute -bottom-6 -left-8 w-56 sm:w-72 md:w-96 opacity-95 animate-[fade-up_1.4s_ease-out_both]"
      />
      <img
        src={bouquetR}
        alt=""
        aria-hidden
        className="absolute -bottom-6 -right-8 w-56 sm:w-72 md:w-96 opacity-95 animate-[fade-up_1.4s_ease-out_both]"
      />
    </div>
  );
}
