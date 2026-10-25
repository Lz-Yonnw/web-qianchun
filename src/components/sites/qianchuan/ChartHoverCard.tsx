type ChartHoverItem = {
  color: string;
  label: string;
  value: string;
};

export function chartPeriod(label: string) {
  const match = label.match(/^(\d{4}-\d{2}-\d{2})(?:\s+(\d{2}):(\d{2}))?$/);
  if (!match) return `${label} 的数据`;
  const [, date, hour, minute] = match;
  if (hour && minute) {
    return `${date} ${hour}:${minute}:00 - ${date} ${hour}:59:59 的数据`;
  }
  return `${date} 00:00:00 - ${date} 23:59:59 的数据`;
}

export function ChartHoverCard({
  xPercent,
  title,
  items,
  period,
  cardTop = 54,
  guideTop = 34,
  guideBottom = 34,
}: {
  xPercent: number;
  title: string;
  items: ChartHoverItem[];
  period: string;
  cardTop?: number;
  guideTop?: number;
  guideBottom?: number;
}) {
  const transform = xPercent < 24
    ? "translateX(10px)"
    : xPercent > 76
      ? "translateX(calc(-100% - 10px))"
      : "translateX(-50%)";

  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute z-10 border-l border-dashed border-[#d9dde5]"
        style={{ left: `${xPercent}%`, top: guideTop, bottom: guideBottom }}
      />
      <div
        role="tooltip"
        className="pointer-events-none absolute z-30 w-[310px] rounded-[3px] border border-[#e5e6eb] bg-white px-3 py-2.5 text-left shadow-[0_4px_14px_rgba(29,33,41,0.18)]"
        style={{ left: `${xPercent}%`, top: cardTop, transform }}
      >
        <strong className="block text-[12px] font-semibold leading-5 text-[#1d2129]">{title}</strong>
        <div className="mt-0.5 space-y-0.5">
          {items.map((item) => (
            <div key={item.label} className="flex h-5 items-center text-[12px] text-[#4e5969]">
              <span className="mr-2 h-[2px] w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span>{item.label}</span>
              <strong className="ml-auto font-semibold text-[#1d2129]">{item.value}</strong>
            </div>
          ))}
        </div>
        <div className="mt-1 border-t border-[#f2f3f5] pt-1.5 text-[11px] leading-4 text-[#9aa0a9]">
          统计 {period}
        </div>
      </div>
    </>
  );
}
