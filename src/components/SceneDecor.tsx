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
      {variant === "dark" && <div className="absolute inset-0 bg-navy/55 mix-blend-multiply" />}
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
        style={{ transformOrigin: "bottom center" }}
        className="scene-tree scene-tree-left absolute bottom-[18%] -left-12 sm:-left-6 w-44 sm:w-64 md:w-80 opacity-95 motion-reduce:animate-none"
      />
      <img
        src={tree}
        alt=""
        aria-hidden
        style={{ transformOrigin: "bottom center" }}
        className="scene-tree scene-tree-right absolute bottom-[18%] -right-12 sm:-right-6 w-44 sm:w-64 md:w-80 opacity-95 motion-reduce:animate-none"
      />

      {/* Floral bouquets — bottom corners */}
      <img
        src={bouquetL}
        alt=""
        aria-hidden
        style={{ transformOrigin: "bottom left" }}
        className="scene-bouquet scene-bouquet-left absolute -bottom-6 -left-8 w-56 sm:w-72 md:w-96 opacity-95 motion-reduce:animate-none"
      />
      <img
        src={bouquetR}
        alt=""
        aria-hidden
        style={{ transformOrigin: "bottom right" }}
        className="scene-bouquet scene-bouquet-right absolute -bottom-6 -right-8 w-56 sm:w-72 md:w-96 opacity-95 motion-reduce:animate-none"
      />

      {/* Floating flower glints around bouquets */}
      <div className="absolute inset-x-0 bottom-0 h-64 overflow-hidden motion-reduce:hidden">
        {Array.from({ length: 12 }).map((_, i) => {
          const fromLeft = i % 2 === 0;
          return (
            <span
              key={i}
              aria-hidden
              className="flower-glint absolute rounded-full"
              style={{
                left: fromLeft ? `${3 + (i % 6) * 5}%` : `${72 + (i % 6) * 4}%`,
                bottom: `${8 + (i % 4) * 12}%`,
                width: `${7 + (i % 3) * 3}px`,
                height: `${7 + (i % 3) * 3}px`,
                animationDelay: `${i * 0.45}s`,
                animationDuration: `${5.2 + (i % 4) * 0.8}s`,
              }}
            />
          );
        })}
      </div>

      {/* Falling petals */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            aria-hidden
            className="absolute top-0 block w-2.5 h-2.5 rounded-full bg-[oklch(0.86_0.08_20)] opacity-70 motion-reduce:hidden"
            style={{
              left: `${(i * 13 + 5) % 100}%`,
              animation: `petal-fall ${10 + (i % 5) * 2}s linear ${i * 1.3}s infinite`,
              filter: "blur(0.5px)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
