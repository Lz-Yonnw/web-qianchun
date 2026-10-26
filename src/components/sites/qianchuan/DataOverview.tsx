"use client";

import { useMemo, useState, type MouseEvent as ReactMouseEvent } from "react";
import { getStandardSubTabShare } from "@/lib/account-delivery";
import { buildAccountOverview } from "./accountOverviewData";
import { refreshCurrentTime, useCurrentTime } from "./currentTime";
import { DEFAULT_METRIC_KEY, type IndicatorView, type MetricView } from "./homeData";
import { OverviewFrame } from "./OverviewFrame";
import { ChartHoverCard, chartPeriod } from "./ChartHoverCard";
import styles from "./DataOverview.module.css";

const COLOR_LEFT = "#2f54eb";
const COLOR_RIGHT = "#13c2c2";

function findIndicator(metric: MetricView, key: string) {
  return metric.indicators.find((indicator) => indicator.key === key);
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

function axisNumber(value: number) {
  return new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 2 }).format(value);
}

function DualAxisChart({ axis, left, right }: { axis: string[]; left?: IndicatorView; right?: IndicatorView }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const width = 760;
  const height = 260;
  const padLeft = 56;
  const padRight = 50;
  const padTop = 36;
  const padBottom = 34;
  const innerWidth = width - padLeft - padRight;
  const innerHeight = height - padTop - padBottom;
  const count = Math.max(axis.length, 1);
  const leftSeries = left?.series ?? [];
  const rightSeries = right?.series ?? [];
  const maxLeft = Math.max(...leftSeries, 1);
  const maxRight = Math.max(...rightSeries, 1);
  const x = (index: number) => padLeft + (innerWidth / Math.max(count - 1, 1)) * index;
  const yLeft = (value: number) => padTop + (1 - value / maxLeft) * innerHeight;
  const yRight = (value: number) => padTop + (1 - value / maxRight) * innerHeight;
  const leftPoints = leftSeries.map((value, index) => ({ x: x(index), y: yLeft(value) }));
  const rightPoints = rightSeries.map((value, index) => ({ x: x(index), y: yRight(value) }));
  const ticks = [1, 0.75, 0.5, 0.25, 0];

  function handleMouseMove(event: ReactMouseEvent<HTMLDivElement>) {
    if (count <= 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const chartX = (event.clientX - rect.left) / rect.width * width;
    const step = innerWidth / Math.max(count - 1, 1);
    const index = count === 1 ? 0 : Math.round((chartX - padLeft) / step);
    setHoveredIndex(Math.max(0, Math.min(count - 1, index)));
  }

  const hoveredLabel = hoveredIndex === null ? "" : axis[hoveredIndex] ?? "";
  const hoveredX = hoveredIndex === null ? 0 : x(hoveredIndex);
  const tooltipItems = hoveredIndex === null ? [] : [
    ...(left ? [{ color: COLOR_LEFT, label: left.label, value: axisNumber(leftSeries[hoveredIndex] ?? 0) }] : []),
    ...(right ? [{ color: COLOR_RIGHT, label: right.label, value: axisNumber(rightSeries[hoveredIndex] ?? 0) }] : []),
  ];

  return (
    <div className={styles.dualChart} onMouseMove={handleMouseMove} onMouseLeave={() => setHoveredIndex(null)}>
      <svg viewBox={`0 0 ${width} ${height}`} className={styles.dualChartSvg} aria-label="投放指标趋势图">
        {left && <text x={5} y={20} fontSize="12" fill="#86909c">{left.label}</text>}
        {right && <text x={width - 4} y={20} fontSize="12" fill="#86909c" textAnchor="end">{right.label}</text>}
        {ticks.map((tick) => {
          const y = padTop + (1 - tick) * innerHeight;
          return (
            <g key={tick}>
              <line x1={padLeft} x2={width - padRight} y1={y} y2={y} stroke="#e3e7ed" />
              {left && <text x={padLeft - 12} y={y + 4} fontSize="11" fill="#86909c" textAnchor="end">{axisNumber(maxLeft * tick)}</text>}
              {right && <text x={width - padRight + 12} y={y + 4} fontSize="11" fill="#86909c">{axisNumber(maxRight * tick)}</text>}
            </g>
          );
        })}
        {leftPoints.length > 0 && <path d={curvePath(leftPoints)} fill="none" stroke={COLOR_LEFT} strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />}
        {rightPoints.length > 0 && <path d={curvePath(rightPoints)} fill="none" stroke={COLOR_RIGHT} strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />}
        {hoveredIndex !== null && leftPoints[hoveredIndex] && <circle cx={hoveredX} cy={leftPoints[hoveredIndex].y} r="4" fill="#fff" stroke={COLOR_LEFT} strokeWidth="2" />}
        {hoveredIndex !== null && rightPoints[hoveredIndex] && <circle cx={hoveredX} cy={rightPoints[hoveredIndex].y} r="4" fill="#fff" stroke={COLOR_RIGHT} strokeWidth="2" />}
        {axis.map((label, index) => (
          <text key={`${label}-${index}`} x={x(index)} y={height - 8} fontSize="11" fill="#86909c" textAnchor="middle">{label}</text>
        ))}
      </svg>
      {hoveredIndex !== null && (
        <ChartHoverCard
          xPercent={hoveredX / width * 100}
          title={hoveredLabel}
          items={tooltipItems}
          period={chartPeriod(hoveredLabel)}
          cardTop={58}
          guideTop={36}
          guideBottom={34}
        />
      )}
    </div>
  );
}

function LegendDropdown({ color, current, indicators, otherKey, onPick }: {
  color: string;
  current?: IndicatorView;
  indicators: IndicatorView[];
  otherKey: string;
  onPick: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.legendDropdown}>
      <button type="button" onClick={() => setOpen((value) => !value)} className={styles.legendButton}>
        <span className={styles.legendSwatch} style={{ background: color }} />
        {current?.label ?? "不选"}
        <svg viewBox="0 0 12 12" aria-hidden="true"><path d="m3 4.5 3 3 3-3" /></svg>
      </button>
      {open && (
        <>
          <div className={styles.legendBackdrop} onClick={() => setOpen(false)} />
          <div className={styles.legendMenu}>
            {indicators.map((indicator) => {
              const disabled = indicator.key === otherKey;
              const active = indicator.key === current?.key;
              return (
                <button
                  type="button"
                  key={indicator.key}
                  disabled={disabled}
                  onClick={() => { onPick(indicator.key); setOpen(false); }}
                  className={active ? styles.legendActive : ""}
                >
                  {indicator.label}
                </button>
              );
            })}
            <button type="button" onClick={() => { onPick(""); setOpen(false); }}>不选</button>
          </div>
        </>
      )}
    </div>
  );
}

function DetailIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <rect x="2" y="3" width="12" height="10" rx="1.5" />
      <path d="m4.5 10 2.2-2.1 1.7 1.5 3.1-3" />
    </svg>
  );
}

function CustomIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 4h10M3 8h10M3 12h10" />
      <circle cx="6" cy="4" r="1" />
      <circle cx="10" cy="8" r="1" />
      <circle cx="7" cy="12" r="1" />
    </svg>
  );
}

function indicatorDelta(indicator: IndicatorView) {
  const { direction, percentage } = indicator.comparison;
  const sign = direction === "up" ? "+" : direction === "down" ? "-" : "";
  return { value: `${sign}${percentage}`, direction };
}

const ADDITIVE_INDICATORS = new Set(["consume", "gmv", "orders", "impr", "orders7", "gmv7", "clicks"]);

function formatScaledIndicator(key: string, value: number) {
  if (key === "orders" || key === "orders7" || key === "impr" || key === "clicks") {
    return new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 0 }).format(Math.round(value));
  }
  return new Intl.NumberFormat("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

function numericValue(value: string) {
  const parsed = Number(value.replaceAll(",", "").replace("%", ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function scaleStandardMetric(metric: MetricView, share: number): MetricView {
  if (metric.key !== "standard" || share === 1) return metric;
  return {
    ...metric,
    indicators: metric.indicators.map((indicator) => {
      if (!ADDITIVE_INDICATORS.has(indicator.key)) return indicator;
      return {
        ...indicator,
        value: formatScaledIndicator(indicator.key, numericValue(indicator.value) * share),
        series: indicator.series.map((value) => value * share),
      };
    }),
  };
}

export function DataOverview({ accountId }: { accountId?: string }) {
  const currentTime = useCurrentTime();
  const [range, setRange] = useState<{ start: string; end: string } | null>(null);
  const [metricKey, setMetricKey] = useState(DEFAULT_METRIC_KEY);
  const [subTab, setSubTab] = useState(0);
  const start = range?.start ?? currentTime.today;
  const end = range?.end ?? currentTime.today;
  const overview = useMemo(() => buildAccountOverview(accountId, start, end), [accountId, start, end]);
  const firstMetric = overview.metrics.find((metric) => metric.key === DEFAULT_METRIC_KEY) ?? overview.metrics[0];
  const [leftKey, setLeftKey] = useState(firstMetric.defaultLeft);
  const [rightKey, setRightKey] = useState(firstMetric.defaultRight);
  const selectedMetric = overview.metrics.find((metric) => metric.key === metricKey) ?? firstMetric;
  const standardShare = getStandardSubTabShare(accountId, subTab);
  const activeMetric = scaleStandardMetric(selectedMetric, standardShare);
  const left = findIndicator(activeMetric, leftKey);
  const right = findIndicator(activeMetric, rightKey);
  const chartAxis = overview.axis.map((label) => /^\d{2}:\d{2}$/.test(label) ? `${start} ${label}` : label);

  function selectMetric(metric: MetricView) {
    setMetricKey(metric.key);
    setSubTab(0);
    setLeftKey(metric.defaultLeft);
    setRightKey(metric.defaultRight);
  }

  function applyDates(nextStart: string, nextEnd: string) {
    setRange({ start: nextStart, end: nextEnd });
    refreshCurrentTime();
  }

  return (
    <OverviewFrame
      metrics={overview.metrics}
      metricKey={activeMetric.key}
      selectMetric={selectMetric}
      axis={overview.axis}
      start={start}
      end={end}
      today={currentTime.today}
      onDateChange={applyDates}
    >
      <div className={styles.detailToolbar}>
        <div className={styles.tabs}>
          {activeMetric.subTabs.map((tab, index) => (
            <button type="button" key={tab} onClick={() => setSubTab(index)} className={index === subTab ? styles.tabActive : ""}>
              {tab}
            </button>
          ))}
        </div>
        <div className={styles.actions}>
          <button type="button" data-auth-required className={styles.primaryAction}>{activeMetric.primaryButton}</button>
          {activeMetric.extraDropdown && (
            <button type="button" data-auth-required className={styles.secondaryAction}>{activeMetric.extraDropdown}<span>⌄</span></button>
          )}
          <button type="button" data-auth-required className={styles.secondaryAction}><DetailIcon />{activeMetric.secondaryButton}</button>
          <button type="button" data-auth-required className={styles.secondaryAction}><CustomIcon />自定义数据</button>
        </div>
      </div>

      <div className={styles.detailBody}>
        <div className={styles.indicatorGrid}>
          {activeMetric.indicators.map((indicator) => {
            const leftSelected = indicator.key === leftKey;
            const rightSelected = indicator.key === rightKey;
            const delta = indicatorDelta(indicator);
            const isEmpty = numericValue(indicator.value) === 0;
            return (
              <button
                type="button"
                key={indicator.key}
                onClick={() => {
                  if (indicator.key === rightKey) setRightKey(leftKey);
                  setLeftKey(indicator.key);
                }}
                className={`${styles.indicatorCard} ${leftSelected ? styles.leftSelected : ""} ${rightSelected ? styles.rightSelected : ""}`}
              >
                <span className={styles.indicatorLabel}>{indicator.label}</span>
                <strong>{isEmpty ? "--" : indicator.value}</strong>
                <small className={isEmpty ? styles.flat : styles[delta.direction]}>{isEmpty ? "--" : delta.value}</small>
              </button>
            );
          })}
        </div>

        <div className={styles.chartArea}>
          <div className={styles.legend}>
            <LegendDropdown color={COLOR_LEFT} current={left} indicators={activeMetric.indicators} otherKey={rightKey} onPick={setLeftKey} />
            <LegendDropdown color={COLOR_RIGHT} current={right} indicators={activeMetric.indicators} otherKey={leftKey} onPick={setRightKey} />
          </div>
          <DualAxisChart axis={chartAxis} left={left} right={right} />
        </div>
      </div>
    </OverviewFrame>
  );
}
