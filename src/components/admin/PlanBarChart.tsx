import { niceMax } from "./chart-utils";

// Horizontal bars: plan names vary in length, and each row is already
// labeled directly by name, so identity comes from the label, not the
// color — one brand hue for magnitude is correct here too.
export function PlanBarChart({ data }: { data: { label: string; count: number }[] }) {
  const max = niceMax(Math.max(...data.map((d) => d.count), 1));
  const width = 640;
  const rowHeight = 36;
  const barHeight = 18;
  const labelWidth = 128;
  const valueGutter = 36;
  const height = data.length * rowHeight + 8;
  const trackWidth = width - labelWidth - valueGutter;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      role="img"
      aria-label="Active subscriptions by plan"
    >
      {data.map((d, i) => {
        const barWidth = (d.count / max) * trackWidth;
        const y = 4 + i * rowHeight + (rowHeight - barHeight) / 2;
        return (
          <g key={d.label}>
            <text
              x={labelWidth - 12}
              y={y + barHeight / 2 + 4}
              textAnchor="end"
              fontSize={12}
              fill="var(--ink)"
            >
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
