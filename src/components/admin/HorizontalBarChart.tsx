import { niceMax } from "./chart-utils";

export type HorizontalBarDatum = { label: string; count: number; iconSrc?: string };

// Horizontal bars: each row is already labeled directly by name, so identity
// comes from the label, not the color — one brand hue for magnitude is
// correct (this is what backed the admin's original "active subscriptions by
// plan" chart; generalized here so top-pages/top-links/top-countries/
// top-referrers all share one implementation).
export function HorizontalBarChart({ data, ariaLabel }: { data: HorizontalBarDatum[]; ariaLabel: string }) {
  if (data.length === 0) {
    return <p className="py-6 text-center text-sm text-ink-soft">No data yet.</p>;
  }

  const max = niceMax(Math.max(...data.map((d) => d.count), 1));
  const width = 640;
  const rowHeight = 36;
  const barHeight = 18;
  const hasIcons = data.some((d) => d.iconSrc);
  const labelWidth = hasIcons ? 168 : 148;
  const valueGutter = 36;
  const height = data.length * rowHeight + 8;
  const trackWidth = width - labelWidth - valueGutter;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label={ariaLabel}>
      {data.map((d, i) => {
        const barWidth = (d.count / max) * trackWidth;
        const y = 4 + i * rowHeight + (rowHeight - barHeight) / 2;
        const textX = hasIcons ? labelWidth - 32 : labelWidth - 12;
        return (
          <g key={`${d.label}-${i}`}>
            {d.iconSrc && (
              <image href={d.iconSrc} x={labelWidth - 26} y={y - 1} width={20} height={20} />
            )}
            <text x={textX} y={y + barHeight / 2 + 4} textAnchor="end" fontSize={12} fill="var(--ink)">
              {d.label}
            </text>
            <rect x={labelWidth} y={y} width={trackWidth} height={barHeight} rx={4} fill="var(--border)" opacity={0.4} />
            {d.count > 0 && (
              <rect x={labelWidth} y={y} width={Math.max(barWidth, 6)} height={barHeight} rx={4} fill="var(--navy)">
                <title>{`${d.label}: ${d.count}`}</title>
              </rect>
            )}
            <text
              x={labelWidth + trackWidth + 8}
              y={y + barHeight / 2 + 4}
              fontSize={12}
              fontWeight={600}
              fill="var(--ink)"
            >
              {d.count}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
