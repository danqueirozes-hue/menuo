import { niceMax, roundedTopBarPath } from "./chart-utils";

// Magnitude over time, one series — color's job here is "this is the data,"
// not identity, so a single brand hue is correct (no categorical palette
// needed since there's only one thing being measured).
export function SignupsBarChart({ data }: { data: { label: string; count: number }[] }) {
  const max = niceMax(Math.max(...data.map((d) => d.count), 1));
  const width = 640;
  const height = 200;
  const paddingLeft = 28;
  const paddingTop = 20;
  const paddingBottom = 22;
  const chartWidth = width - paddingLeft;
  const chartHeight = height - paddingTop - paddingBottom;
  const bandWidth = chartWidth / data.length;
  const barWidth = Math.min(24, bandWidth - 8);
  const gridValues = [0, max / 2, max];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="New accounts per week">
      {gridValues.map((v) => {
        const y = paddingTop + chartHeight - (v / max) * chartHeight;
        return (
          <g key={v}>
            <line x1={paddingLeft} x2={width} y1={y} y2={y} stroke="var(--border)" strokeWidth={1} />
            <text x={paddingLeft - 6} y={y + 3} textAnchor="end" fontSize={10} fill="var(--ink-soft)">
              {Math.round(v)}
            </text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const barHeight = (d.count / max) * chartHeight;
        const x = paddingLeft + i * bandWidth + (bandWidth - barWidth) / 2;
        const y = paddingTop + chartHeight - barHeight;
        const isLast = i === data.length - 1;
        return (
          <g key={d.label}>
            <path d={roundedTopBarPath(x, y, barWidth, barHeight, 4)} fill="var(--amber)">
              <title>{`${d.label}: ${d.count} new account${d.count === 1 ? "" : "s"}`}</title>
            </path>
            {isLast && d.count > 0 && (
              <text
                x={x + barWidth / 2}
                y={y - 6}
                textAnchor="middle"
                fontSize={11}
                fontWeight={600}
                fill="var(--ink)"
              >
                {d.count}
              </text>
            )}
            <text x={x + barWidth / 2} y={height - 4} textAnchor="middle" fontSize={9} fill="var(--ink-soft)">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
