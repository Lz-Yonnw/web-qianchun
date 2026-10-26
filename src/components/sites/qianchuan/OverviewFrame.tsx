"use client";

import { useState, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";
import { DateRangePicker } from "./DateRangePicker";
import { refreshCurrentTime, useCurrentTime } from "./currentTime";
import type { MetricView, PeriodKey } from "./homeData";
import styles from "./OverviewFrame.module.css";
import { ChartHoverCard, chartPeriod } from "./ChartHoverCard";

function formatMoney(value: number) {
  return new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 2 }).format(value);
}

function curvePath(points: { x: number; y: number }[]) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M${points[0].x} ${points[0].y}`;
  let value = `M${points[0].x} ${points[0].y}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const p0 = points[Math.max(0, index - 1)];
    const p1 = points[index];
    const p2 = points[index + 1];
    const p3 = points[Math.min(points.length - 1, index + 2)];
    const cp1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const cp2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    value += ` C${cp1.x} ${cp1.y},${cp2.x} ${cp2.y},${p2.x} ${p2.y}`;
  }
  return value;
}

function ConsumptionChart({ axis, values, startDate }: { axis: string[]; values: number[]; startDate: string }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const maxValue = Math.max(...values, 1);
  const points = values.map((value, index) => ({
    x: values.length > 1 ? index * 1000 / (values.length - 1) : 0,
    y: 300 - value / maxValue * 300,
  }));
  const line = curvePath(points);
  const ticks = [1, 0.75, 0.5, 0.25, 0];
  const fullLabel = (label: string) => /^\d{2}:\d{2}$/.test(label) ? `${startDate} ${label}` : label;

  function handleMouseMove(event: ReactMouseEvent<HTMLDivElement>) {
    if (!axis.length) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    setHovered(axis.length === 1 ? 0 : Math.round(ratio * (axis.length - 1)));
  }

  const hoveredLabel = hovered === null ? "" : fullLabel(axis[hovered] ?? "");
  const hoveredPercent = hovered === null || axis.length <= 1 ? 0 : hovered / (axis.length - 1) * 100;

  return (
    <div className={styles.chart} aria-label="账户整体消耗趋势">
      <span className={styles.unit}>消耗(元)</span>
      <div className={styles.plot} onMouseMove={handleMouseMove} onMouseLeave={() => setHovered(null)}>
        {ticks.map((tick, index) => (
          <div key={tick} className={styles.gridline} style={{ top: `${index * 25}%` }}>
            <span>{formatMoney(maxValue * tick)}</span>
          </div>
        ))}
        {points.length > 0 && (
          <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
            <path d={line} fill="none" stroke="#3156ff" strokeWidth="3" vectorEffect="non-scaling-stroke" />
            {hovered !== null && points[hovered] && <circle cx={points[hovered].x} cy={points[hovered].y} r="5" fill="#fff" stroke="#3156ff" strokeWidth="2" vectorEffect="non-scaling-stroke" />}
          </svg>
        )}
        <div className={styles.points}>
          {axis.map((label, index) => (
            <button
              key={`${label}-${index}`}
              type="button"
              className={styles.point}
              aria-label={`${label}，消耗 ${formatMoney(values[index] ?? 0)} 元`}
              onMouseEnter={() => setHovered(index)}
              onFocus={() => setHovered(index)}
              onBlur={() => setHovered(null)}
            >
              <span className={styles.axisLabel}>{fullLabel(label)}</span>
            </button>
          ))}
        </div>
        {hovered !== null && (
          <ChartHoverCard
            xPercent={hoveredPercent}
            title={hoveredLabel}
            items={[{ color: "#3156ff", label: "消耗(元)", value: formatMoney(values[hovered] ?? 0) }]}
            period={chartPeriod(hoveredLabel)}
            cardTop={20}
            guideTop={0}
            guideBottom={0}
          />
        )}
      </div>
    </div>
  );
}

const METRIC_TOOLTIP_GUIDE: Record<string, string> = {
  chengfang: "如需查看详细数据，可前往数据-乘方数据查看",
  standard: "如需查看详细数据，可前往数据-竞价数据-标准投放数据查看",
  omni: "如需查看详细数据，可前往数据-竞价数据-全域数据查看",
  brand: "如需查看详细数据，可前往数据-品牌数据查看",
};

function MetricTooltipContent({ metric }: { metric: MetricView }) {
  if (metric.key === "total") {
    return (
      <>
        <strong className={styles.tooltipTitle}>{metric.label}</strong>
        <span className={styles.tooltipSection}>数据范围</span>
        <p>包含本账户下，巨量千川计划和小店随心推订单投放数据，巨量千川计划包含标准投放、全域投放、品牌投放以及自然智能券。</p>
        <span className={styles.tooltipSection}>特殊说明：</span>
        <p>1. 品牌投放消耗数据每日20点更新，因此所选时间周期包含“今日”时，“消耗”“ROI类数据”统计值不会即时按秒发生变化；2. 当天数据会有波动，次日稳定。</p>
      </>
    );
  }

  return (
    <>
      <strong className={styles.tooltipTitle}>{metric.label}</strong>
      <p>{metric.key === "chengfang" ? "乘方投放期间产生的消耗。" : metric.tooltip}</p>
      <p className={styles.tooltipGuide}>
        {metric.key === "chengfang" && "注：若计划发生了转投（如全域转投乘方），则转投前、后计划产生的消耗都纳入乘方消耗统计范围。"}
        {metric.key === "chengfang" && <br />}
        {METRIC_TOOLTIP_GUIDE[metric.key]}
        <button type="button" data-auth-required>查看详情</button>
      </p>
    </>
  );
}

export function OverviewFrame({
  metrics,
  metricKey,
  selectMetric,
  axis,
  start,
  end,
  today,
  onDateChange,
  children,
}: {
  metrics: MetricView[];
  metricKey: string;
  selectMetric: (metric: MetricView) => void;
  axis: string[];
  start: string;
  end: string;
  today: string;
  onDateChange: (start: string, end: string, period: PeriodKey) => void;
  children: ReactNode;
}) {
  const [personalOnly, setPersonalOnly] = useState(false);
  const currentTime = useCurrentTime();
  const totalMetric = metrics.find((metric) => metric.key === "total");
  const consumption = totalMetric?.indicators.find((indicator) => indicator.key === "consume")?.series ?? [];

  return (
    <section className={styles.overview} aria-labelledby="data-overview-title">
      <div className={styles.toolbar}>
        <div className={styles.headingGroup}>
          <h2 id="data-overview-title">数据概览</h2>
          <span className={styles.help} title="查看所选统计周期内的账户投放数据">?</span>
          <label className={styles.personal}>
            <input type="checkbox" checked={personalOnly} onChange={(event) => setPersonalOnly(event.target.checked)} />
            仅看个人数据
          </label>
        </div>
        <div className={styles.filters}>
          <span className={styles.updated}>更新于：{currentTime.label}</span>
          <button type="button" className={styles.refresh} onClick={refreshCurrentTime}>刷新</button>
          <DateRangePicker start={start} end={end} today={today} onChange={onDateChange} />
        </div>
      </div>
      <div className={styles.panel}>
        <div
          className={styles.metrics}
          aria-label="消耗分类"
          style={{ gridTemplateColumns: `repeat(${metrics.length}, minmax(0, 1fr))` }}
        >
          {metrics.map((metric, index) => (
            <div key={metric.key} className={styles.metricWrapper}>
              {index > 0 && <span className={styles.operator} aria-hidden="true">{index === 1 ? "=" : "+"}</span>}
              <button type="button" className={`${styles.metric} ${metricKey === metric.key ? styles.active : ""}`} aria-pressed={metricKey === metric.key} onClick={() => selectMetric(metric)}>
                <span className={styles.metricName}>{metric.label}</span>
                <span className={styles.value}>{metric.value}</span>
                <span
                  className={styles.comparison}
                  title={metric.comparison.estimated ? "根据相近历史数据估算" : "根据所选周期的上一等长周期计算"}
                >
                  相比上周期
                  <strong className={styles[metric.comparison.direction]}>
                    {Number(metric.value.replaceAll(",", "")) === 0 && metric.key !== "total"
                      ? "--"
                      : `${metric.comparison.direction === "up" ? "+" : metric.comparison.direction === "down" ? "-" : ""}${metric.comparison.percentage}`}
                  </strong>
                </span>
              </button>
              <div className={styles.metricTooltip} role="tooltip"><MetricTooltipContent metric={metric} /></div>
            </div>
          ))}
        </div>
        {metricKey === "total" ? <ConsumptionChart axis={axis} values={consumption} startDate={start} /> : <div className={styles.details}>{children}</div>}
      </div>
    </section>
  );
}
