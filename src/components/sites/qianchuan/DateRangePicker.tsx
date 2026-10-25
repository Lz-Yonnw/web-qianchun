"use client";

import { useEffect, useRef, useState } from "react";
import type { PeriodKey } from "./homeData";
import styles from "./DateRangePicker.module.css";

const WEEKDAYS = ["一", "二", "三", "四", "五", "六", "日"];
const iso = (date: Date) => date.toISOString().slice(0, 10);
const parse = (value: string) => new Date(`${value}T00:00:00Z`);
function shiftDay(value: string, amount: number) {
  const date = parse(value);
  date.setUTCDate(date.getUTCDate() + amount);
  return iso(date);
}
function shiftMonth(value: string, amount: number) {
  const date = parse(value.slice(0, 7) + "-01");
  date.setUTCMonth(date.getUTCMonth() + amount);
  return iso(date);
}
function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = parse(value);
  return !Number.isNaN(date.getTime()) && iso(date) === value;
}

function presets(today: string): { label: string; start: string; end: string; period: PeriodKey }[] {
  const monday = shiftDay(today, -((parse(today).getUTCDay() + 6) % 7));
  const month = today.slice(0, 7) + "-01";
  return [
    { label: "今天", start: today, end: today, period: "today" },
    { label: "昨天", start: shiftDay(today, -1), end: shiftDay(today, -1), period: "yesterday" },
    { label: "最近3天", start: shiftDay(today, -2), end: today, period: "last7" },
    { label: "最近7天", start: shiftDay(today, -6), end: today, period: "last7" },
    { label: "最近30天", start: shiftDay(today, -29), end: today, period: "last30" },
    { label: "上周", start: shiftDay(monday, -7), end: shiftDay(monday, -1), period: "last7" },
    { label: "本月", start: month, end: today, period: "last30" },
    { label: "上月", start: shiftMonth(month, -1), end: shiftDay(month, -1), period: "last30" },
  ];
}

export function DateRangePicker({ start, end, today, onChange, compact = false }: {
  start: string;
  end: string;
  today: string;
  onChange: (start: string, end: string, period: PeriodKey) => void;
  compact?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [draftStart, setDraftStart] = useState(start);
  const [draftEnd, setDraftEnd] = useState(end);
  const [active, setActive] = useState<"start" | "end">("start");
  const [month, setMonth] = useState("");
  const [hover, setHover] = useState("");
  const [error, setError] = useState("");
  const [popupLeft, setPopupLeft] = useState(0);

  useEffect(() => {
    if (!open) return;
    function dismiss(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  function show(which: "start" | "end") {
    if (!today) return;
    if (!open) {
      const left = root.current?.getBoundingClientRect().left ?? 0;
      const viewport = window.innerWidth;
      const preferredWidth = compact ? 650 : viewport <= 940 ? 740 : 872;
      const width = viewport <= 640 ? viewport - 64 : Math.min(preferredWidth, viewport - 40);
      setPopupLeft(Math.max(20 - left, Math.min(0, viewport - 20 - left - width)));
      setDraftStart(start);
      setDraftEnd(end);
      setMonth((validDate(start) ? start : today).slice(0, 7) + "-01");
      setError("");
      setHover("");
    }
    setActive(which);
    setOpen(true);
  }

  function apply(first: string, last: string, period: PeriodKey = first === last ? "today" : "last30") {
    if (!validDate(first) || !validDate(last) || first > last || last > today) {
      setError("请选择有效的起止日期，结束日期不能晚于今天");
      return;
    }
    onChange(first, last, period);
    setOpen(false);
    setError("");
    trigger.current?.focus();
  }

  function pick(value: string) {
    setError("");
    if (active === "start" || !validDate(draftStart)) {
      setDraftStart(value);
      setDraftEnd("");
      setActive("end");
      setHover("");
    } else {
      apply(value < draftStart ? value : draftStart, value < draftStart ? draftStart : value);
    }
  }

  function calendar(monthStart: string, side: "left" | "right") {
    const date = parse(monthStart);
    const first = shiftDay(monthStart, -((date.getUTCDay() + 6) % 7));
    const pendingEnd = draftEnd || hover;
    const lower = pendingEnd && pendingEnd < draftStart ? pendingEnd : draftStart;
    const upper = pendingEnd && pendingEnd < draftStart ? draftStart : pendingEnd;
    return (
      <div className={styles.month}>
        <div className={styles.monthHeader}>
          <div className={styles.arrows}>{side === "left" && <>
            <button type="button" aria-label="上一年" onClick={() => setMonth(shiftMonth(month, -12))}>«</button>
            <button type="button" aria-label="上一月" onClick={() => setMonth(shiftMonth(month, -1))}>‹</button>
          </>}</div>
          <strong>{date.getUTCFullYear()}年&nbsp; {date.getUTCMonth() + 1}月</strong>
          <div className={styles.arrows}>{side === "right" && <>
            <button type="button" aria-label="下一月" onClick={() => setMonth(shiftMonth(month, 1))}>›</button>
            <button type="button" aria-label="下一年" onClick={() => setMonth(shiftMonth(month, 12))}>»</button>
          </>}</div>
        </div>
        <div className={styles.days}>
          {WEEKDAYS.map((day) => <span key={day} className={styles.weekday}>{day}</span>)}
          {Array.from({ length: 42 }, (_, index) => {
            const value = shiftDay(first, index);
            const outside = value.slice(0, 7) !== monthStart.slice(0, 7);
            const disabled = value > today;
            const selected = value === draftStart || value === draftEnd;
            const inRange = !!upper && value > lower && value < upper;
            return <button type="button" key={value} disabled={disabled} aria-label={value} aria-pressed={selected} aria-current={value === today ? "date" : undefined}
              className={`${styles.day} ${outside ? styles.outside : ""} ${inRange ? styles.inRange : ""} ${selected ? styles.selected : ""}`}
              onClick={() => pick(value)} onMouseEnter={() => { if (active === "end") setHover(value); }}>
              <span>{parse(value).getUTCDate()}</span>
            </button>;
          })}
        </div>
      </div>
    );
  }

  return (
    <div ref={root} className={`${styles.picker} ${compact ? styles.compact : ""}`} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
    }} onKeyDown={(event) => {
      if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
    }}>
      <div className={`${styles.field} ${open ? styles.open : ""}`}>
        <span className={styles.label}>统计周期:</span>
        <input aria-label="开始日期" placeholder="YYYY-MM-DD" value={open ? draftStart : start} className={open && active === "start" ? styles.activeInput : ""}
          onFocus={() => show("start")} onClick={() => show("start")} onChange={(event) => setDraftStart(event.target.value)}
          onKeyDown={(event) => { if (event.key === "Enter") apply(draftStart, draftEnd); }} />
        <span className={styles.separator}>－</span>
        <input aria-label="结束日期" placeholder="YYYY-MM-DD" value={open ? draftEnd : end} className={open && active === "end" ? styles.activeInput : ""}
          onFocus={() => show("end")} onClick={() => show("end")} onChange={(event) => setDraftEnd(event.target.value)}
          onKeyDown={(event) => { if (event.key === "Enter") apply(draftStart, draftEnd); }} />
        <button ref={trigger} type="button" aria-label="选择统计日期" aria-expanded={open} aria-controls="overview-calendar" disabled={!today} onClick={() => open ? setOpen(false) : show("start")}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="2.5" y="3.5" width="11" height="10" rx="1.5" stroke="currentColor" /><path d="M5.5 2v3M10.5 2v3M3 6.5h10" stroke="currentColor" /></svg>
        </button>
      </div>
      {open && month && <div id="overview-calendar" role="dialog" aria-label="选择日期范围" className={styles.popup} style={{ left: popupLeft }}>
        <div className={styles.shortcuts}>{presets(today).map((preset) => <button type="button" key={preset.label} onClick={() => apply(preset.start, preset.end, preset.period)}>{preset.label}</button>)}</div>
        <div className={styles.calendars} onMouseLeave={() => setHover("")}>
          {calendar(month, "left")}{calendar(shiftMonth(month, 1), "right")}
          {error && <p className={styles.error} role="alert">{error}</p>}
        </div>
      </div>}
    </div>
  );
}
