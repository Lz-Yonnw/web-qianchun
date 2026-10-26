"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useSyncExternalStore, type MouseEvent as ReactMouseEvent } from "react";
import {
  ChevronDown,
  ChevronsUpDown,
  Info,
  Maximize2,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { PlatformHeader } from "@/components/sites/qianchuan/PlatformHeader";
import { useCurrentTime } from "@/components/sites/qianchuan/currentTime";
import { DateRangePicker } from "@/components/sites/qianchuan/DateRangePicker";
import { buildAccountOverview } from "@/components/sites/qianchuan/accountOverviewData";
import { ChartHoverCard, chartPeriod } from "@/components/sites/qianchuan/ChartHoverCard";
import { getAccountDeliveryProfile } from "@/lib/account-delivery";
import { buildFullDomainHref } from "@/lib/full-domain-route";
import {
  getActiveDemoAccount,
  subscribeToActiveDemoAccount,
} from "@/lib/demo-accounts";

const getServerAccount = () => null;

type DouyinProfile = {
  name: string;
  douyinId: string;
  avatar?: string;
};

function getDouyinProfile(accountId: string, fallbackName: string): DouyinProfile {
  const douyin = getAccountDeliveryProfile(accountId).douyin;
  return douyin ? {
    name: douyin.name,
    douyinId: douyin.id,
    avatar: douyin.avatar,
  } : {
    name: fallbackName,
    douyinId: accountId.slice(-11),
  };
}

type SidebarItem = {
  label: string;
  icon: "chengfang" | "omni" | "live" | "product" | "material" | "search" | "standard";
  active?: boolean;
  collapsible?: boolean;
  children?: string[];
};

type SidebarSection = {
  label: string;
  items: SidebarItem[];
};

const sidebarSections: SidebarSection[] = [
  {
    label: "数据概览",
    items: [
      { label: "乘方数据", icon: "chengfang" },
      { label: "全域投放数据", icon: "omni", active: true },
    ],
  },
  {
    label: "专题数据",
    items: [
      { label: "直播数据", icon: "live" },
      { label: "商品数据", icon: "product" },
      { label: "素材数据", icon: "material" },
      { label: "搜索流量分析", icon: "search" },
    ],
  },
  {
    label: "即将下线",
    items: [{
      label: "标准数据",
      icon: "standard",
      collapsible: true,
      children: ["数据概览", "标准投放数据", "直播分析", "素材分析", "人群洞察", "标签广场", "人群列表"],
    }],
  },
];

const contentTabs = ["直播间画面", "视频", "图文", "其他创意", "标题"];
const reportTypes = ["投后数据", "复盘报告"];
const dimensions = ["抖音号", "直播间", "素材", "调控"];

const columns = [
  "整体展示次数",
  "整体点击次数",
  "整体点击率",
  "整体转化率",
  "整体成交订单数",
  "整体成交金额(元)",
  "整体成交金额转化率",
  "整体消耗(元)",
  "整体消耗占比",
];

function SidebarGlyph({ name, className = "" }: { name: SidebarItem["icon"]; className?: string }) {
  const common = `h-4 w-4 shrink-0 ${className}`;
  if (name === "chengfang") return <svg viewBox="0 0 16 16" className={common} aria-hidden="true"><path fill="currentColor" d="m8 1.2 1.2 1.5 1.9-.3.5 1.8 1.8.7-.3 1.9 1.5 1.2-1.5 1.2.3 1.9-1.8.7-.5 1.8-1.9-.3L8 14.8l-1.2-1.5-1.9.3-.5-1.8-1.8-.7.3-1.9L1.4 8l1.5-1.2-.3-1.9 1.8-.7.5-1.8 1.9.3L8 1.2Z"/><circle cx="8" cy="8" r="2.1" fill="#f4f7fd"/></svg>;
  if (name === "omni") return <svg viewBox="0 0 16 16" className={common} aria-hidden="true"><circle cx="8" cy="8" r="6.2" fill="currentColor"/><path d="m4.7 8.4 2.1-2.1 1.7 1.5 2.8-2.5M9.8 5.3h1.5v1.5" fill="none" stroke="#fff" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (name === "live") return <svg viewBox="0 0 16 16" className={common} aria-hidden="true"><path fill="currentColor" d="M3 4.5h10l.8 8.8H2.2L3 4.5Zm2-1.2a3 3 0 0 1 6 0v1.2H9.8V3.3a1.8 1.8 0 1 0-3.6 0v1.2H5V3.3Z"/><path d="m6.6 7 3.4 2-3.4 2V7Z" fill="#fff"/></svg>;
  if (name === "product") return <svg viewBox="0 0 16 16" className={common} aria-hidden="true"><path fill="currentColor" d="M3.1 4.6h9.8l.9 9H2.2l.9-9ZM5 4.6V3.4a3 3 0 0 1 6 0v1.2H9.8V3.4a1.8 1.8 0 1 0-3.6 0v1.2H5Z"/><circle cx="6" cy="7.2" r=".7" fill="#f4f7fd"/><circle cx="10" cy="7.2" r=".7" fill="#f4f7fd"/></svg>;
  if (name === "material") return <svg viewBox="0 0 16 16" className={common} aria-hidden="true"><path fill="currentColor" d="m8 1.8 6.2 3.4L8 8.6 1.8 5.2 8 1.8Zm-5.5 6L8 10.9l5.5-3.1.7 1.2L8 12.5 1.8 9l.7-1.2Zm0 2.8L8 13.7l5.5-3.1.7 1.2L8 15.2l-6.2-3.4.7-1.2Z"/></svg>;
  if (name === "search") return <svg viewBox="0 0 16 16" className={common} aria-hidden="true"><path fill="currentColor" d="M2 13.5h12v1H2v-1Zm1-4h2.2v3H3v-3Zm3.8-3h2.3v6H6.8v-6Zm3.9-4h2.3v10h-2.3v-10Z"/></svg>;
  return <svg viewBox="0 0 16 16" className={common} aria-hidden="true"><rect x="2" y="2" width="12" height="12" rx="1.6" fill="currentColor"/><path d="M4.5 11V7.8h1.6V11H4.5Zm2.7 0V5.4h1.6V11H7.2Zm2.7 0V8.8h1.6V11H9.9Z" fill="#f4f7fd"/></svg>;
}

function TableToolbarButtons() {
  const buttonClass = "flex h-[30px] w-[30px] items-center justify-center rounded-[4px] bg-[#f6f6f7] text-[#4e5969] transition-colors hover:bg-[#eceef1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a55e5]";
  return (
    <div className="flex items-center gap-2.5">
      <button type="button" className={buttonClass} aria-label="下载数据" title="下载数据">
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true"><path d="M8 2.5v7m0 0 2.4-2.4M8 9.5 5.6 7.1M3 10.5v2.2h10v-2.2" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <button type="button" className={buttonClass} aria-label="重置列宽" title="重置列宽">
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true"><path d="M3.2 4h9.6M5 4v8M11 4v8M3.5 7.2h3M9.5 7.2h3M4.5 6.2l-1 1 1 1M11.5 6.2l1 1-1 1" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <button type="button" className={buttonClass} aria-label="选择列" title="选择列">
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true"><path d="M3 4h10M3 8h10M3 12h10M6 2.8v2.4M10 6.8v2.4M7 10.8v2.4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/><circle cx="6" cy="4" r="1" fill="#f6f6f7" stroke="currentColor" strokeWidth="1.1"/><circle cx="10" cy="8" r="1" fill="#f6f6f7" stroke="currentColor" strokeWidth="1.1"/><circle cx="7" cy="12" r="1" fill="#f6f6f7" stroke="currentColor" strokeWidth="1.1"/></svg>
      </button>
    </div>
  );
}

function buildDateRows(start: string, end: string) {
  const rows: string[] = [];
  const cursor = new Date(`${start}T00:00:00Z`);
  const last = new Date(`${end}T00:00:00Z`);
  while (cursor <= last && rows.length < 31) {
    rows.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return rows;
}

function shiftDate(value: string, days: number) {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function SelectButton({
  children,
  className = "",
  options,
  value,
  onChange,
}: {
  children: React.ReactNode;
  className?: string;
  options?: string[];
  value?: string;
  onChange?: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex h-8 items-center justify-between gap-3 rounded bg-[#f7f8fa] px-3 text-[13px] text-[#4e5969] ${className}`}
      >
        <span className="truncate">{children}</span>
        <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-[#9aa0a9] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && options && (
        <div className="absolute left-0 top-[36px] z-50 min-w-full rounded bg-white py-1 shadow-[0_8px_24px_rgba(29,33,41,0.16)]">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange?.(option);
                setOpen(false);
              }}
              className={`block h-9 w-full px-3 text-left text-[13px] hover:bg-[#f7f8fa] ${option === value ? "text-[#165dff]" : "text-[#323335]"}`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileFilter({
  profile,
  open,
  onToggle,
}: {
  profile: DouyinProfile;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={`flex h-8 w-[240px] items-center justify-between rounded border px-3 text-[13px] text-[#323335] ${open ? "border-[#2a55e5] bg-white shadow-[0_0_0_2px_rgba(42,85,229,0.08)]" : "border-transparent bg-[#f7f8fa]"}`}
      >
        <span className="inline-flex min-w-0 items-center gap-2">
          <span>抖音号：</span>
          <AccountArtwork src={profile.avatar} alt={profile.name} compact />
          <span className="truncate">{profile.name}</span>
        </span>
        <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-[#9aa0a9] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-[36px] z-50 w-[334px] rounded bg-white p-3 shadow-[0_8px_24px_rgba(29,33,41,0.16)]">
          <label className="flex h-8 items-center rounded bg-[#f7f8fa] px-3 text-[#86909c]">
            <Search className="mr-2 h-3.5 w-3.5" />
            <input placeholder="请输入抖音号名称/ID" className="min-w-0 flex-1 bg-transparent text-xs text-[#323335] outline-none placeholder:text-[#a9aeb6]" />
          </label>
          <button type="button" onClick={onToggle} className="mt-3 flex w-full items-center rounded px-1 py-2 text-left hover:bg-[#f7f8fa]">
            <AccountArtwork src={profile.avatar} alt={profile.name} />
            <span className="ml-2 min-w-0">
              <strong className="block truncate text-sm font-medium text-[#323335]">{profile.name}</strong>
              <small className="mt-1 block text-xs text-[#86909c]">{profile.douyinId}</small>
            </span>
            <span className="ml-auto rounded bg-[#edf5ff] px-1.5 py-1 text-[11px] text-[#165dff]">♢ 自运营</span>
          </button>
          <div className="mt-2 text-center text-xs text-[#a9aeb6]">已加载全部数据</div>
        </div>
      )}
    </div>
  );
}

function OptionFilter({
  label,
  value,
  options,
  open,
  onToggle,
  onSelect,
  className = "w-[162px]",
}: {
  label?: string;
  value: string;
  options: string[];
  open: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <button type="button" onClick={onToggle} className={`flex h-8 w-full items-center justify-between rounded border px-3 text-[13px] text-[#323335] ${open ? "border-[#2a55e5] bg-white shadow-[0_0_0_2px_rgba(42,85,229,0.08)]" : "border-transparent bg-[#f7f8fa]"}`}>
        <span>{label}{value}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-[#86909c] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute inset-x-0 top-[36px] z-50 rounded bg-white py-1 shadow-[0_8px_24px_rgba(29,33,41,0.16)]">
          {options.map((option) => (
            <button key={option} type="button" onClick={() => onSelect(option)} className={`block h-9 w-full px-3 text-left text-[13px] hover:bg-[#f7f8fa] ${option === value ? "text-[#165dff]" : "text-[#323335]"}`}>{option}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function Sidebar() {
  const [standardOpen, setStandardOpen] = useState(true);

  return (
    <aside className="w-[188px] shrink-0 px-3 py-5 text-[13px]">
      {sidebarSections.map((section) => (
        <section key={section.label} className="mb-3">
          <div className="mb-2 border-b border-[#e5e6eb] px-2 pb-2 text-xs text-[#9aa0a9]">{section.label}</div>
          <div className="space-y-1">
            {section.items.map((item) => {
              const expanded = item.collapsible && standardOpen;
              const highlighted = item.active || expanded;
              return (
                <div key={item.label}>
                  <button
                    type="button"
                    aria-expanded={item.collapsible ? expanded : undefined}
                    onClick={item.collapsible ? () => setStandardOpen((open) => !open) : undefined}
                    className={`flex h-9 w-full items-center rounded px-3 text-left font-medium transition-colors ${
                      highlighted
                        ? "bg-white text-[#165dff] shadow-[0_1px_3px_rgba(29,33,41,0.04)]"
                        : "text-[#323335] hover:bg-white/70"
                    }`}
                  >
                    <SidebarGlyph name={item.icon} className={`mr-2 ${highlighted ? "text-[#2a55e5]" : "text-[#9298a1]"}`} />
                    <span>{item.label}</span>
                    {item.collapsible && <ChevronDown className={`ml-auto h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />}
                  </button>
                  {expanded && item.children && (
                    <div className="mt-1 space-y-1 pb-1">
                      {item.children.map((child) => (
                        <button
                          key={child}
                          type="button"
                          className="flex h-10 w-full items-center rounded pl-11 pr-3 text-left text-[13px] font-normal text-[#323335] transition-colors hover:bg-white/70 hover:text-[#165dff]"
                        >
                          {child}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </aside>
  );
}

function AccountArtwork({ src, alt = "店铺头像", compact = false }: { src?: string; alt?: string; compact?: boolean }) {
  const frameSize = compact ? "h-5 w-5" : "h-11 w-11";
  if (src) {
    return (
      <span className={`relative flex shrink-0 overflow-hidden rounded-full border border-[#e5e6eb] bg-white ${frameSize}`}>
        <Image src={src} alt={alt} width={44} height={44} className="h-full w-full object-cover" />
      </span>
    );
  }

  const colors = ["#2049eb", "#18a77b", "#7b5be7", "#f08b18", "#16a4c8", "#d84c75"];
  const color = colors[[...alt].reduce((sum, value) => sum + value.charCodeAt(0), 0) % colors.length];
  return (
    <span className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold text-white ${frameSize}`} style={{ backgroundColor: color }}>
      <span className={compact ? "text-[10px]" : "text-lg"}>{alt.slice(0, 1)}</span>
    </span>
  );
}

const materialContentShares: Record<string, number> = {
  "直播间画面": 0.58,
  "视频": 0.22,
  "图文": 0.1,
  "其他创意": 0.06,
  "标题": 0.04,
};

function materialDataShare(accountId: string, businessTab: string, contentTab: string) {
  const seed = [...accountId].reduce((sum, value) => sum + Number(value || 0), 0);
  const liveShare = 0.74 + (seed % 12) / 100;
  const businessShare = businessTab === "推直播" ? liveShare : 1 - liveShare;
  return businessShare * (materialContentShares[contentTab] ?? 1);
}

type DataTableSort = { index: number; direction: "ascending" | "descending" } | null;

function SortableMetricHeader({
  label,
  index,
  sort,
  onSort,
}: {
  label: string;
  index: number;
  sort: DataTableSort;
  onSort: (index: number) => void;
}) {
  const active = sort?.index === index;
  const nextDirection = active && sort.direction === "descending" ? "升序" : "降序";
  return (
    <th
      aria-sort={active ? sort.direction : "none"}
      className={`w-[138px] border-r border-white px-0 text-right font-medium ${active ? "bg-[#eceef1]" : "bg-[#f5f6f7]"}`}
    >
      <button
        type="button"
        onClick={() => onSort(index)}
        className="flex h-10 w-full items-center justify-end gap-[3px] px-3 text-[#1d2129] outline-none hover:bg-[#eceef1] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2a55e5]"
        title={`${label}：点击${nextDirection}排列`}
      >
        <span className="truncate">{label}</span>
        <svg viewBox="0 0 8 12" className="h-3 w-2 shrink-0" aria-hidden="true">
          <path d="M4 1 7 5H1L4 1Z" fill={active && sort.direction === "ascending" ? "#2a55e5" : "#a9afb7"} />
          <path d="m4 11-3-4h6l-3 4Z" fill={active && sort.direction === "descending" ? "#2a55e5" : "#a9afb7"} />
        </svg>
      </button>
    </th>
  );
}

function DataTable({
  storeName,
  accountId,
  dates,
  businessTab,
  contentTab,
  dimension,
}: {
  storeName: string;
  accountId: string;
  dates: string[];
  businessTab: string;
  contentTab: string;
  dimension: string;
}) {
  const [sort, setSort] = useState<DataTableSort>(null);
  const profile = getDouyinProfile(accountId, storeName);
  const dataShare = dimension === "素材" ? materialDataShare(accountId, businessTab, contentTab) : 1;
  const rows = dates.map((date) => {
    const overview = buildAccountOverview(accountId, date, date);
    const metricKey = getAccountDeliveryProfile(accountId).type === "omni" ? "omni" : "standard";
    const deliveryMetric = overview.metrics.find((metric) => metric.key === metricKey);
    const indicator = (key: string) => numeric(deliveryMetric?.indicators.find((item) => item.key === key)?.value);
    const spend = numeric(deliveryMetric?.value) * dataShare;
    const seed = [...`${accountId}-${date}`].reduce((sum, character) => sum + character.charCodeAt(0), 0);
    const reportedImpressions = indicator("impr");
    const impressions = Math.round(reportedImpressions > 0
      ? reportedImpressions * dataShare
      : spend * (15.7 + seed % 25 / 10));
    const reportedClickRate = indicator("click") / 100;
    const clickRate = reportedClickRate > 0 ? reportedClickRate : 0.026 + seed % 52 / 10_000;
    const clicks = Math.round(impressions * clickRate);
    const orders = Math.round(indicator("orders") * dataShare);
    const gmv = indicator("gmv") * dataShare;
    return { date, impressions, clicks, clickRate, orders, gmv, spend };
  });
  const totals = rows.reduce((sum, row) => ({
    impressions: sum.impressions + row.impressions,
    clicks: sum.clicks + row.clicks,
    orders: sum.orders + row.orders,
    gmv: sum.gmv + row.gmv,
    spend: sum.spend + row.spend,
  }), { impressions: 0, clicks: 0, orders: 0, gmv: 0, spend: 0 });
  const totalRow = {
    date: "",
    ...totals,
    clickRate: totals.impressions > 0 ? totals.clicks / totals.impressions : 0,
  };
  const values = (row: typeof totalRow) => [
    row.impressions.toLocaleString("zh-CN"),
    row.clicks.toLocaleString("zh-CN"),
    `${(row.clickRate * 100).toFixed(2)}%`,
    `${(row.clicks > 0 ? row.orders / row.clicks * 100 : 0).toFixed(2)}%`,
    row.orders.toLocaleString("zh-CN"),
    formatMoney(row.gmv),
    `${(row.clicks > 0 ? row.orders / row.clicks * 100 : 0).toFixed(2)}%`,
    formatMoney(row.spend),
    `${(totals.spend > 0 ? row.spend / totals.spend * 100 : 0).toFixed(2)}%`,
  ];
  const sortValues = (row: typeof totalRow) => [
    row.impressions,
    row.clicks,
    row.clickRate,
    row.clicks > 0 ? row.orders / row.clicks : 0,
    row.orders,
    row.gmv,
    row.clicks > 0 ? row.orders / row.clicks : 0,
    row.spend,
    totals.spend > 0 ? row.spend / totals.spend : 0,
  ];
  const sortedRows = sort
    ? [...rows].sort((left, right) => {
        const difference = sortValues(left)[sort.index] - sortValues(right)[sort.index];
        return sort.direction === "ascending" ? difference : -difference;
      })
    : rows;

  function toggleSort(index: number) {
    setSort((current) => current?.index === index
      ? { index, direction: current.direction === "descending" ? "ascending" : "descending" }
      : { index, direction: "descending" });
  }

  return (
    <div className="overflow-x-auto border-b border-[#e5e6eb] [scrollbar-color:#8f9297_#f2f3f5] [scrollbar-width:thin]">
      <table className="min-w-[1540px] table-fixed border-collapse text-[12px] text-[#323335]">
        <thead className="bg-[#f7f8fa] text-[#1d2129]">
          <tr className="h-10">
            <th className="w-[280px] px-4 text-left font-medium">{dimension === "素材" ? contentTab : "调控数据"}</th>
            {columns.map((column, index) => (
              <SortableMetricHeader key={column} label={column} index={index} sort={sort} onSort={toggleSort} />
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="h-[58px] border-b border-[#e5e6eb] bg-white">
            <td className="px-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="h-3.5 w-3.5 accent-[#2a55e5]" aria-label={`选择${profile.name}`} />
                <AccountArtwork src={profile.avatar} alt={profile.name} />
                <span className="min-w-0">
                  <strong className="block truncate font-medium text-[#1d2129]">{profile.name}</strong>
                  <small className="mt-1 block text-[11px] text-[#86909c]">ID：{profile.douyinId}</small>
                </span>
              </div>
            </td>
            {columns.map((column, index) => (
              <td key={column} className="px-3 text-right">{values(totalRow)[index]}</td>
            ))}
          </tr>
          {sortedRows.map((row) => (
            <tr key={row.date} className="h-[38px] border-b border-[#e5e6eb] bg-white hover:bg-[#fafbfc]">
              <td className="pl-[38px] pr-4 text-left">{row.date}</td>
              {columns.map((column, index) => (
                <td key={column} className="px-3 text-right">{values(row)[index]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function numeric(value: string | undefined) {
  return Number((value ?? "0").replaceAll(",", "").replace("%", "")) || 0;
}

function comparisonRate(comparison: { direction: "up" | "down" | "flat"; percentage: string }) {
  const rate = numeric(comparison.percentage) / 100;
  return comparison.direction === "down" ? -rate : comparison.direction === "up" ? rate : 0;
}

function signedPercent(rate: number) {
  return `${rate >= 0 ? "+" : "-"}${Math.abs(rate * 100).toFixed(2)}%`;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

function smoothPath(points: Array<[number, number]>) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M${points[0][0]},${points[0][1]}`;
  let path = `M${points[0][0]},${points[0][1]}`;
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const midpoint = (previous[0] + current[0]) / 2;
    path += ` C${midpoint},${previous[1]} ${midpoint},${current[1]} ${current[0]},${current[1]}`;
  }
  return path;
}

type DouyinRow = {
  date: string;
  spend: number;
  roi: number;
  gmv: number;
  orders: number;
  cost: number;
  netRoi: number;
  netGmv: number;
  netOrders: number;
  netCost: number;
};

function buildDouyinRows(accountId: string, dates: string[]): DouyinRow[] {
  return dates.map((date) => {
    const overview = buildAccountOverview(accountId, date, date);
    const metricKey = getAccountDeliveryProfile(accountId).type === "omni" ? "omni" : "standard";
    const deliveryMetric = overview.metrics.find((metric) => metric.key === metricKey);
    const indicator = (key: string) => deliveryMetric?.indicators.find((item) => item.key === key)?.value;
    const spend = numeric(deliveryMetric?.value);
    const gmv = numeric(indicator("gmv"));
    const roi = spend > 0 ? gmv / spend : 0;
    const orders = Math.max(0, Math.round(numeric(indicator("orders"))));
    const cost = orders > 0 ? spend / orders : 0;
    const qualitySeed = Number(accountId.slice(-4)) % 9;
    const netFactor = 0.87 + qualitySeed / 100;
    const netGmv = gmv * netFactor;
    const netOrders = Math.max(0, Math.round(orders * (0.88 + qualitySeed / 200)));
    return {
      date,
      spend,
      roi,
      gmv,
      orders,
      cost,
      netRoi: spend > 0 ? netGmv / spend : 0,
      netGmv,
      netOrders,
      netCost: netOrders > 0 ? spend / netOrders : 0,
    };
  });
}

function TrendChart({ rows }: { rows: DouyinRow[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const width = 1120;
  const height = 286;
  const left = 42;
  const right = 34;
  const top = 38;
  const bottom = 38;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const maxSpend = Math.max(1, ...rows.map((row) => row.spend));
  const spendCeiling = Math.max(2_000, Math.ceil(maxSpend / 2_000) * 2_000);
  const maxRoi = Math.max(1, ...rows.map((row) => row.roi));
  const roiCeiling = Math.max(4, Math.ceil(maxRoi / 4) * 4);
  const x = (index: number) => left + (rows.length <= 1 ? plotWidth / 2 : index * plotWidth / (rows.length - 1));
  const spendY = (value: number) => top + plotHeight - value / spendCeiling * plotHeight;
  const roiY = (value: number) => top + plotHeight - value / roiCeiling * plotHeight;
  const spendPoints = rows.map((row, index) => [x(index), spendY(row.spend)] as [number, number]);
  const roiPoints = rows.map((row, index) => [x(index), roiY(row.roi)] as [number, number]);

  function handleMouseMove(event: ReactMouseEvent<HTMLDivElement>) {
    if (!rows.length) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const chartX = (event.clientX - rect.left) / rect.width * width;
    const step = plotWidth / Math.max(rows.length - 1, 1);
    const index = rows.length === 1 ? 0 : Math.round((chartX - left) / step);
    setHoveredIndex(Math.max(0, Math.min(rows.length - 1, index)));
  }

  const hoveredRow = hoveredIndex === null ? null : rows[hoveredIndex];
  const hoveredX = hoveredIndex === null ? 0 : x(hoveredIndex);

  return (
    <div className="relative mt-1 h-[286px] w-full" onMouseMove={handleMouseMove} onMouseLeave={() => setHoveredIndex(null)}>
      <svg viewBox={`0 0 ${width} ${height}`} className="block h-full w-full" role="img" aria-label="整体消耗与整体支付ROI数据对比趋势">
        <text x="6" y="17" fontSize="11" fill="#9aa0a9">整体消耗(元)</text>
        <text x={width - 4} y="17" fontSize="11" fill="#9aa0a9" textAnchor="end">整体支付ROI</text>
        {[0, 1, 2, 3, 4].map((step) => {
          const y = top + step * plotHeight / 4;
          const spendLabel = Math.round(spendCeiling * (1 - step / 4));
          const roiLabel = (roiCeiling * (1 - step / 4)).toFixed(0);
          return (
            <g key={step}>
              <line x1={left} x2={width - right} y1={y} y2={y} stroke="#e3e7ed" strokeWidth="1" />
              <text x={left - 10} y={y + 4} fontSize="11" fill="#9aa0a9" textAnchor="end">{spendLabel}</text>
              <text x={width - right + 10} y={y + 4} fontSize="11" fill="#9aa0a9">{roiLabel}</text>
            </g>
          );
        })}
        <path d={smoothPath(spendPoints)} fill="none" stroke="#3568ec" strokeWidth="2.6" strokeLinecap="round" />
        <path d={smoothPath(roiPoints)} fill="none" stroke="#08c6ca" strokeWidth="2.6" strokeLinecap="round" />
        {hoveredIndex !== null && spendPoints[hoveredIndex] && <circle cx={hoveredX} cy={spendPoints[hoveredIndex][1]} r="4" fill="#fff" stroke="#3568ec" strokeWidth="2" />}
        {hoveredIndex !== null && roiPoints[hoveredIndex] && <circle cx={hoveredX} cy={roiPoints[hoveredIndex][1]} r="4" fill="#fff" stroke="#08c6ca" strokeWidth="2" />}
        {rows.map((row, index) => (
          <text key={row.date} x={x(index)} y={height - 12} fontSize="11" fill="#9aa0a9" textAnchor="middle">{row.date}</text>
        ))}
      </svg>
      {hoveredRow && (
        <ChartHoverCard
          xPercent={hoveredX / width * 100}
          title={hoveredRow.date}
          items={[
            { color: "#3568ec", label: "整体消耗(元)", value: formatMoney(hoveredRow.spend) },
            { color: "#08c6ca", label: "整体支付ROI", value: hoveredRow.roi.toFixed(2) },
          ]}
          period={chartPeriod(hoveredRow.date)}
          cardTop={52}
          guideTop={38}
          guideBottom={38}
        />
      )}
    </div>
  );
}

function DouyinDataPanel({ accountId, storeName, dates }: { accountId: string; storeName: string; dates: string[] }) {
  const profile = getDouyinProfile(accountId, storeName);
  const rows = useMemo(() => buildDouyinRows(accountId, dates), [accountId, dates]);
  const overview = useMemo(
    () => buildAccountOverview(accountId, dates[0] ?? "", dates.at(-1) ?? ""),
    [accountId, dates],
  );
  const metricKey = getAccountDeliveryProfile(accountId).type === "omni" ? "omni" : "standard";
  const deliveryMetric = overview.metrics.find((metric) => metric.key === metricKey);
  const indicator = (key: string) => deliveryMetric?.indicators.find((item) => item.key === key);
  const spend = numeric(deliveryMetric?.value);
  const gmv = numeric(indicator("gmv")?.value);
  const roi = spend > 0 ? gmv / spend : 0;
  const orders = Math.round(numeric(indicator("orders")?.value));
  const cost = orders > 0 ? spend / orders : 0;
  const spendChange = comparisonRate(deliveryMetric?.comparison ?? { direction: "flat", percentage: "0%" });
  const orderChange = comparisonRate(indicator("orders")?.comparison ?? { direction: "flat", percentage: "0%" });
  const previousSpend = spendChange > -1 ? spend / (1 + spendChange) : spend;
  const previousOrders = orderChange > -1 ? orders / (1 + orderChange) : orders;
  const previousCost = previousOrders > 0 ? previousSpend / previousOrders : cost;
  const costChange = previousCost > 0 ? (cost - previousCost) / previousCost : 0;
  const cards = [
    { label: "整体消耗(元)", value: formatMoney(spend), change: spendChange, tint: "bg-[#f2f5ff]" },
    { label: "整体支付ROI", value: roi.toFixed(2), change: comparisonRate(indicator("payRoi")?.comparison ?? { direction: "flat", percentage: "0%" }), tint: "bg-[#eefdfe]" },
    { label: "整体成交金额(元)", value: formatMoney(gmv), change: comparisonRate(indicator("gmv")?.comparison ?? { direction: "flat", percentage: "0%" }), tint: "bg-[#f7f7f8]" },
    { label: "整体成交订单数", value: orders.toLocaleString("zh-CN"), change: orderChange, tint: "bg-[#f7f7f8]" },
    { label: "整体成交订单成本(元)", value: formatMoney(cost), change: costChange, tint: "bg-[#f7f7f8]" },
  ];
  const totals = rows.reduce(
    (result, row) => ({
      spend: result.spend + row.spend,
      gmv: result.gmv + row.gmv,
      orders: result.orders + row.orders,
      netGmv: result.netGmv + row.netGmv,
      netOrders: result.netOrders + row.netOrders,
    }),
    { spend: 0, gmv: 0, orders: 0, netGmv: 0, netOrders: 0 },
  );
  const totalRow: DouyinRow = {
    date: "",
    spend: totals.spend,
    roi: totals.spend > 0 ? totals.gmv / totals.spend : 0,
    gmv: totals.gmv,
    orders: totals.orders,
    cost: totals.orders > 0 ? totals.spend / totals.orders : 0,
    netRoi: totals.spend > 0 ? totals.netGmv / totals.spend : 0,
    netGmv: totals.netGmv,
    netOrders: totals.netOrders,
    netCost: totals.netOrders > 0 ? totals.spend / totals.netOrders : 0,
  };
  const detailColumns = [
    { label: "整体消耗(元)", value: (row: DouyinRow) => formatMoney(row.spend) },
    { label: "整体支付ROI", value: (row: DouyinRow) => row.roi.toFixed(2) },
    { label: "整体成交金额(元)", value: (row: DouyinRow) => formatMoney(row.gmv) },
    { label: "整体成交订单数", value: (row: DouyinRow) => row.orders.toLocaleString("zh-CN") },
    { label: "整体成交订单成本(元)", value: (row: DouyinRow) => formatMoney(row.cost) },
    { label: "净成交ROI", value: (row: DouyinRow) => row.netRoi.toFixed(2) },
    { label: "净成交金额(元)", value: (row: DouyinRow) => formatMoney(row.netGmv) },
    { label: "净成交订单数", value: (row: DouyinRow) => row.netOrders.toLocaleString("zh-CN") },
    { label: "净成交订单成本(元)", value: (row: DouyinRow) => formatMoney(row.netCost) },
  ];

  return (
    <>
      <section className="mt-4 overflow-hidden rounded-[10px] bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#1d2129]">数据概览</h2>
          <div className="flex gap-2">
            <button type="button" className="flex h-[30px] w-[30px] items-center justify-center rounded-[4px] bg-[#f7f8fa] text-[#4e5969] hover:bg-[#eef0f3]" aria-label="自定义指标"><SlidersHorizontal className="h-3.5 w-3.5" /></button>
            <button type="button" className="flex h-[30px] w-[30px] items-center justify-center rounded-[4px] bg-[#f7f8fa] text-[#4e5969] hover:bg-[#eef0f3]" aria-label="全屏"><Maximize2 className="h-3.5 w-3.5" /></button>
          </div>
        </div>
        <div className="mt-3 flex h-[34px] items-center rounded-[3px] border border-[#9cc4ff] bg-[#eff7ff] px-4 text-xs text-[#4e5969]">
          <Info className="mr-2 h-3.5 w-3.5 fill-[#2468e8] text-white" />
          计划由全域投放升级到千川乘方后，相关数据会迁移至乘方数据下；若计划由千川乘方转投回全域投放，则计划数据会迁移回全域投放
        </div>
        <div className="mt-[14px] grid grid-cols-5 gap-[14px]">
          {cards.map((card) => (
            <article key={card.label} className={`h-[78px] rounded-[8px] px-[14px] py-[13px] ${card.tint}`}>
              <h3 className="text-xs font-semibold text-[#323335] underline decoration-dashed decoration-[#86909c] underline-offset-4">{card.label}</h3>
              <div className="mt-[9px] flex items-baseline gap-2">
                <strong className="text-lg font-semibold text-[#1d2129]">{card.value}</strong>
                <span className={`text-xs font-medium ${card.change < 0 ? "text-[#07962e]" : "text-[#f53f3f]"}`}>{signedPercent(card.change)}</span>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-[15px] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#1d2129]">数据对比</h3>
          <button type="button" className="inline-flex items-center gap-1 text-xs text-[#323335]">展开对比<span className="text-[13px]">⌃</span></button>
        </div>
        <div className="mt-[7px] flex justify-center gap-7 text-xs text-[#4e5969]">
          <span className="flex items-center"><i className="mr-1.5 h-2.5 w-2.5 rounded-[2px] bg-[#3568ec]" />整体消耗(元)<span className="ml-1 text-[#86909c]">⌄</span></span>
          <span className="flex items-center"><i className="mr-1.5 h-2.5 w-2.5 rounded-[2px] bg-[#08c6ca]" />整体支付ROI<span className="ml-1 text-[#86909c]">⌄</span></span>
        </div>
        <TrendChart rows={rows} />
      </section>

      <section className="mt-4 rounded-xl bg-white px-5 pb-5 pt-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#1d2129]">抖音号数据明细</h2>
          <TableToolbarButtons />
        </div>
        <div className="mt-3 overflow-x-auto border-b border-[#e5e6eb] [scrollbar-color:#8f9297_#f2f3f5] [scrollbar-width:thin]">
          <table className="min-w-[1500px] table-fixed border-collapse text-[12px] text-[#323335]">
            <thead className="bg-[#f7f8fa] text-[#1d2129]">
              <tr className="h-10">
                <th className="w-[280px] px-4 text-left font-medium">抖音号信息</th>
                {detailColumns.map((column) => (
                  <th key={column.label} className="w-[136px] px-3 text-right font-medium"><span className="inline-flex items-center gap-1"><span className="max-w-[110px] truncate">{column.label}</span><ChevronsUpDown className="h-3 w-3 text-[#9aa0a9]" /></span></th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="h-[58px] border-b border-[#dce3f0] bg-[#eef3ff]">
                <td className="px-4">
                  <div className="flex items-center gap-2"><span className="text-[#86909c]">⌄</span><AccountArtwork src={profile.avatar} alt={profile.name} /><span><strong className="block font-medium">{profile.name}</strong><small className="mt-1 block text-[11px] text-[#86909c]">抖音号：{profile.douyinId}</small></span></div>
                </td>
                {detailColumns.map((column) => <td key={column.label} className="px-3 text-right">{column.value(totalRow)}</td>)}
              </tr>
              {rows.map((row) => (
                <tr key={row.date} className="h-[38px] border-b border-[#e5e6eb] bg-white hover:bg-[#fafbfc]">
                  <td className="pl-[38px] pr-4">{row.date}</td>
                  {detailColumns.map((column) => <td key={column.label} className="px-3 text-right">{column.value(row)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex h-12 items-end justify-end gap-2 text-xs text-[#4e5969]">
          <span>共 1 条记录</span><button disabled className="h-7 w-7 rounded bg-[#f7f8fa] text-[#c9cdd4]">‹</button><button className="h-7 w-7 rounded border border-[#2a55e5] text-[#165dff]">1</button><button disabled className="h-7 w-7 rounded bg-[#f7f8fa] text-[#c9cdd4]">›</button><SelectButton className="h-7 w-[90px]">10条/页</SelectButton><span>跳转</span><input aria-label="跳转页码" className="h-7 w-12 rounded bg-[#f7f8fa] px-2 outline-none" />
        </div>
      </section>
    </>
  );
}

function LiveRoomDataPanel({ accountId, storeName, dates }: { accountId: string; storeName: string; dates: string[] }) {
  const profile = getDouyinProfile(accountId, storeName);
  const rows = useMemo(() => {
    const sourceRows = buildDouyinRows(accountId, dates);
    const seed = Number(accountId.slice(-5)) || 1;
    return sourceRows.map((row) => {
      const dateSeed = Number(row.date.replaceAll("-", ""));
      const liveShare = 0.2 + (seed + dateSeed) % 13 / 100;
      const qualityFactor = 0.94 + (seed + dateSeed) % 13 / 100;
      const spend = row.spend * liveShare;
      const gmv = row.gmv * liveShare * qualityFactor;
      const orders = row.orders > 0 ? Math.max(1, Math.round(row.orders * liveShare * qualityFactor)) : 0;
      const roi = spend > 0 ? gmv / spend : 0;
      const cost = orders > 0 ? spend / orders : 0;
      const netFactor = 0.88 + (seed + dateSeed) % 7 / 100;
      const netGmv = gmv * netFactor;
      const netOrders = orders > 0 ? Math.max(1, Math.round(orders * netFactor)) : 0;
      return {
        ...row,
        spend,
        roi,
        gmv,
        orders,
        cost,
        netRoi: spend > 0 ? netGmv / spend : 0,
        netGmv,
        netOrders,
        netCost: netOrders > 0 ? spend / netOrders : 0,
      };
    });
  }, [accountId, dates]);
  const total = rows.reduce(
    (result, row) => ({
      spend: result.spend + row.spend,
      gmv: result.gmv + row.gmv,
      orders: result.orders + row.orders,
      netGmv: result.netGmv + row.netGmv,
      netOrders: result.netOrders + row.netOrders,
    }),
    { spend: 0, gmv: 0, orders: 0, netGmv: 0, netOrders: 0 },
  );
  const totalRoi = total.spend > 0 ? total.gmv / total.spend : 0;
  const totalCost = total.orders > 0 ? total.spend / total.orders : 0;
  const totalRow: DouyinRow = {
    date: dates.at(-1) ?? "",
    spend: total.spend,
    roi: totalRoi,
    gmv: total.gmv,
    orders: total.orders,
    cost: totalCost,
    netRoi: total.spend > 0 ? total.netGmv / total.spend : 0,
    netGmv: total.netGmv,
    netOrders: total.netOrders,
    netCost: total.netOrders > 0 ? total.spend / total.netOrders : 0,
  };
  const firstRow = rows[0] ?? totalRow;
  const lastRow = rows.at(-1) ?? totalRow;
  const rateChange = (current: number, previous: number) => previous > 0 ? (current - previous) / previous : 0;
  const cards = [
    { label: "整体消耗(元)", value: formatMoney(total.spend), change: rateChange(lastRow.spend, firstRow.spend), tint: "bg-[#f2f5ff]" },
    { label: "整体支付ROI", value: totalRoi.toFixed(2), change: rateChange(lastRow.roi, firstRow.roi), tint: "bg-[#eefdfe]" },
    { label: "整体成交金额(元)", value: formatMoney(total.gmv), change: rateChange(lastRow.gmv, firstRow.gmv), tint: "bg-[#f7f7f8]" },
    { label: "整体成交订单数", value: total.orders.toLocaleString("zh-CN"), change: rateChange(lastRow.orders, firstRow.orders), tint: "bg-[#f7f7f8]" },
    { label: "整体成交订单成本(元)", value: formatMoney(totalCost), change: rateChange(lastRow.cost, firstRow.cost), tint: "bg-[#f7f7f8]" },
  ];
  const detailColumns = [
    { label: "整体消耗(元)", value: (row: DouyinRow) => formatMoney(row.spend) },
    { label: "整体支付ROI", value: (row: DouyinRow) => row.roi.toFixed(2) },
    { label: "整体成交金额(元)", value: (row: DouyinRow) => formatMoney(row.gmv) },
    { label: "整体成交订单数", value: (row: DouyinRow) => row.orders.toLocaleString("zh-CN") },
    { label: "整体成交订单成本(元)", value: (row: DouyinRow) => formatMoney(row.cost) },
    { label: "净成交ROI", value: (row: DouyinRow) => row.netRoi.toFixed(2) },
    { label: "净成交金额(元)", value: (row: DouyinRow) => formatMoney(row.netGmv) },
    { label: "净成交订单数", value: (row: DouyinRow) => row.netOrders.toLocaleString("zh-CN") },
    { label: "净成交订单成本(元)", value: (row: DouyinRow) => formatMoney(row.netCost) },
  ];

  return (
    <>
      <section className="mt-4 rounded-xl bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#1d2129]">数据概览</h2>
          <div className="flex gap-2">
            <button type="button" className="flex h-8 w-8 items-center justify-center rounded bg-[#f7f8fa] text-[#4e5969]" aria-label="自定义指标"><SlidersHorizontal className="h-4 w-4" /></button>
            <button type="button" className="flex h-8 w-8 items-center justify-center rounded bg-[#f7f8fa] text-[#4e5969]" aria-label="全屏"><Maximize2 className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="mt-3 flex h-[34px] items-center rounded border border-[#9cc4ff] bg-[#eff7ff] px-4 text-xs text-[#4e5969]">
          <Info className="mr-2 h-3.5 w-3.5 fill-[#2468e8] text-white" />
          计划由全域投放升级到千川乘方后，相关数据会迁移至乘方数据下；若计划由千川乘方转投回全域投放，则计划数据会迁移回全域投放
        </div>
        <div className="mt-3 grid grid-cols-5 gap-3">
          {cards.map((card) => (
            <article key={card.label} className={`rounded-lg px-4 py-4 ${card.tint}`}>
              <h3 className="text-xs font-semibold text-[#323335] underline decoration-dashed decoration-[#86909c] underline-offset-4">{card.label}</h3>
              <div className="mt-3 flex items-baseline gap-2"><strong className="text-lg font-semibold text-[#1d2129]">{card.value}</strong><span className={`text-xs font-medium ${card.change < 0 ? "text-[#07962e]" : "text-[#f53f3f]"}`}>{signedPercent(card.change)}</span></div>
            </article>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#1d2129]">数据对比</h3>
          <button type="button" className="text-xs text-[#323335]">展开对比⌃</button>
        </div>
        <div className="mt-2 flex justify-center gap-7 text-xs text-[#4e5969]">
          <span className="flex items-center"><i className="mr-1.5 h-2.5 w-2.5 rounded-sm bg-[#3568ec]" />整体消耗(元)⌄</span>
          <span className="flex items-center"><i className="mr-1.5 h-2.5 w-2.5 rounded-sm bg-[#0ec5ca]" />整体支付ROI⌄</span>
        </div>
        <TrendChart rows={rows} />
      </section>

      <section className="mt-4 rounded-xl bg-white px-5 pb-5 pt-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#1d2129]">直播间数据明细</h2>
          <TableToolbarButtons />
        </div>
        <div className="mt-3 overflow-x-auto border-b border-[#e5e6eb] [scrollbar-color:#8f9297_#f2f3f5] [scrollbar-width:thin]">
          <table className="min-w-[1500px] table-fixed border-collapse text-[12px] text-[#323335]">
            <thead className="bg-[#f7f8fa] text-[#1d2129]">
              <tr className="h-10">
                <th className="w-[260px] px-4 text-left font-medium">直播间信息</th>
                <th className="w-[220px] px-3 text-left font-medium">开始时间</th>
                <th className="w-[220px] px-3 text-left font-medium">结束时间</th>
                {detailColumns.map((column) => <th key={column.label} className="w-[136px] px-3 text-right font-medium"><span className="inline-flex items-center gap-1"><span className="max-w-[110px] truncate">{column.label}</span><ChevronsUpDown className="h-3 w-3 text-[#9aa0a9]" /></span></th>)}
              </tr>
            </thead>
            <tbody>
              <tr className="h-[58px] border-b border-[#dce3f0] bg-[#eef3ff]">
                <td className="px-4"><div className="flex items-center gap-2"><span className="text-[#86909c]">⌄</span><AccountArtwork src={profile.avatar} alt={profile.name} /><span className="min-w-0"><strong className="block max-w-[155px] truncate font-medium">{profile.name}</strong><small className="mt-1 block max-w-[155px] truncate text-[11px] text-[#86909c]">ID：{profile.douyinId}</small></span><span className="ml-auto text-[#4e5969]">大屏</span></div></td>
                <td className="px-3">{dates[0]} 08:01:25</td><td className="px-3">{dates.at(-1)} 23:59:59</td>
                {detailColumns.map((column) => <td key={column.label} className="px-3 text-right">{column.value(totalRow)}</td>)}
              </tr>
              {rows.map((row) => (
                <tr key={row.date} className="h-[38px] border-b border-[#e5e6eb] bg-white hover:bg-[#fafbfc]">
                  <td className="pl-[38px] pr-4">{row.date}</td><td className="px-3">{row.date} 08:01:25</td><td className="px-3">{row.date} 23:59:59</td>
                  {detailColumns.map((column) => <td key={column.label} className="px-3 text-right">{column.value(row)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex h-12 items-end justify-end gap-2 text-xs text-[#4e5969]">
          <span>共 1 条记录</span><button disabled className="h-7 w-7 rounded bg-[#f7f8fa] text-[#c9cdd4]">‹</button><button className="h-7 w-7 rounded border border-[#2a55e5] text-[#165dff]">1</button><button disabled className="h-7 w-7 rounded bg-[#f7f8fa] text-[#c9cdd4]">›</button><SelectButton className="h-7 w-[90px]">10条/页</SelectButton><span>跳转</span><input aria-label="跳转页码" className="h-7 w-12 rounded bg-[#f7f8fa] px-2 outline-none" />
        </div>
      </section>
    </>
  );
}

export default function FullDomainDataPage() {
  const account = useSyncExternalStore(subscribeToActiveDemoAccount, getActiveDemoAccount, getServerAccount);
  const currentTime = useCurrentTime();
  const [businessTab, setBusinessTab] = useState("推直播");
  const [reportType, setReportType] = useState("投后数据");
  const [dimension, setDimension] = useState("抖音号");
  const [openFilter, setOpenFilter] = useState<"profile" | "platform" | "delivery" | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState("全部");
  const [deliveryMode, setDeliveryMode] = useState("放量投放");
  const [contentTab, setContentTab] = useState("直播间画面");
  const [dateGranularity, setDateGranularity] = useState("分日");
  const [noticeVisible, setNoticeVisible] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const storeName = account?.storeName ?? "巧屋家具精选铺";
  const accountId = account?.accountId ?? "1865682360240256";
  const douyinProfile = getDouyinProfile(accountId, storeName);
  const resolvedStartDate = startDate || (currentTime.today ? shiftDate(currentTime.today, -6) : "");
  const resolvedEndDate = endDate || currentTime.today;
  const dateRows = useMemo(
    () => buildDateRows(resolvedStartDate, resolvedEndDate),
    [resolvedEndDate, resolvedStartDate],
  );

  useEffect(() => {
    if (window.location.pathname === "/data/full-domain") {
      window.history.replaceState(null, "", buildFullDomainHref(accountId));
    }
  }, [accountId]);

  return (
    <div className="min-w-[1180px] bg-[#f4f7fd]">
      <PlatformHeader active="数据" />

      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-[1600px]">
        <Sidebar />

        <main className="min-w-0 flex-1 pb-8">
          <section className="rounded-b-xl bg-white px-5 pb-5 pt-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-7">
                <h1 className="text-lg font-semibold text-[#1d2129]">全域投放数据</h1>
                <span className="text-xs text-[#86909c]">展示全域投放的数据 <button className="ml-1 underline underline-offset-2">了解更多</button></span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-[#a0a5ad]">数据更新于 {currentTime.label}</span>
                <button className="text-[#165dff]">刷新</button>
                <SelectButton
                  className="w-[96px] text-[#1d2129]"
                  options={["汇总","分日", "分时"]}
                  value={dateGranularity}
                  onChange={setDateGranularity}
                >
                  {dateGranularity}
                </SelectButton>
                <DateRangePicker
                  compact
				  showLabel={false}
                  start={resolvedStartDate}
                  end={resolvedEndDate}
                  today={currentTime.today}
                  onChange={(start, end) => {
                    setStartDate(start);
                    setEndDate(end);
                  }}
                />
              </div>
            </div>

            <div className="mt-5 flex h-9 items-end gap-8 border-b border-[#dfe2e7]">
              {["推直播", "推商品"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setBusinessTab(tab)}
                  className={`relative h-9 px-0 text-sm ${businessTab === tab ? "font-medium text-[#1d2129]" : "text-[#4e5969]"}`}
                >
                  {tab}
                  {businessTab === tab && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#2a55e5]" />}
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center text-[13px]">
              <span className="mr-4 text-[#323335]">报告类型</span>
              <div className="flex">
                {reportTypes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setReportType(item)}
                    className={`h-8 min-w-[80px] border px-4 ${reportType === item ? "border-[#2a55e5] bg-white text-[#165dff]" : "border-transparent bg-[#f7f8fa] text-[#323335]"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center text-[13px]">
              <span className="mr-4 text-[#323335]">数据维度</span>
              <div className="flex">
                {dimensions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setDimension(item);
                      setSelectedPlatform(item === "素材" ? "千川PC" : "全部");
                      setDeliveryMode("放量投放");
                      setOpenFilter(null);
                    }}
                    className={`h-8 min-w-[78px] border px-4 ${dimension === item ? "border-[#2a55e5] bg-white text-[#165dff]" : "border-transparent bg-[#f7f8fa] text-[#323335]"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center text-[13px]">
              <span className="mr-4 text-[#323335]">数据筛选</span>
              {dimension === "直播间" ? (
                <button type="button" className="flex h-8 w-[132px] items-center justify-between rounded bg-[#f7f8fa] px-3 text-[13px] text-[#323335]">
                  <span>直播间：已选 <i className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2a55e5] px-1 text-[10px] not-italic text-white">1</i></span>
                  <SlidersHorizontal className="h-3.5 w-3.5 text-[#86909c]" />
                </button>
              ) : (
                <ProfileFilter profile={douyinProfile} open={openFilter === "profile"} onToggle={() => setOpenFilter(openFilter === "profile" ? null : "profile")} />
              )}
              <div className="ml-4">
                <OptionFilter
                  label="下单平台："
                  value={selectedPlatform}
                  options={dimension === "素材" ? ["千川PC", "小店随心推"] : ["全部", "千川PC", "小店随心推"]}
                  open={openFilter === "platform"}
                  onToggle={() => setOpenFilter(openFilter === "platform" ? null : "platform")}
                  onSelect={(value) => { setSelectedPlatform(value); setOpenFilter(null); }}
                />
              </div>
              {dimension === "素材" && (
                <div className="ml-4">
                  <OptionFilter
                    value={deliveryMode}
                    options={["放量投放", "控成本投放"]}
                    open={openFilter === "delivery"}
                    onToggle={() => setOpenFilter(openFilter === "delivery" ? null : "delivery")}
                    onSelect={(value) => { setDeliveryMode(value); setOpenFilter(null); }}
                    className="w-[118px]"
                  />
                </div>
              )}
            </div>
          </section>

          {dimension === "抖音号" ? (
            <DouyinDataPanel accountId={accountId} storeName={storeName} dates={dateRows} />
          ) : dimension === "直播间" ? (
            <LiveRoomDataPanel accountId={accountId} storeName={storeName} dates={dateRows} />
          ) : (
          <section className="mt-4 rounded-xl bg-white px-5 pb-5 pt-5">
            {noticeVisible && (
              <div className="mb-3 flex h-[34px] items-center rounded border border-[#9cc4ff] bg-[#eff7ff] px-4 text-xs text-[#4e5969]">
                <Info className="mr-2 h-3.5 w-3.5 fill-[#2468e8] text-white" />
                <span>全域投放中，判断素材最重要的指标是“整体成交金额(GMV)”，为实现整体GMV最大化，各素材消耗和ROI可能受到其他素材影响动态变化，不能与标准投放直接对比。详见</span>
                <button className="ml-1 text-[#165dff]">全域素材攻略</button>
                <button type="button" onClick={() => setNoticeVisible(false)} className="ml-auto text-[#86909c]" aria-label="关闭提示">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex h-8 items-center rounded bg-[#f7f8fa]">
                {contentTabs.map((tab, index) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setContentTab(tab)}
                    className={`relative h-8 min-w-[82px] border px-4 text-[13px] ${contentTab === tab ? "border-[#2a55e5] bg-white text-[#165dff]" : `border-transparent text-[#323335] ${index < contentTabs.length - 1 ? "after:absolute after:right-0 after:top-1/2 after:h-4 after:w-px after:-translate-y-1/2 after:bg-[#dfe2e7]" : ""}`}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <TableToolbarButtons />
            </div>

            <div className="mt-3">
              <DataTable
                storeName={storeName}
                accountId={accountId}
                dates={dateRows}
                businessTab={businessTab}
                contentTab={contentTab}
                dimension={dimension}
              />
            </div>

            <div className="flex h-12 items-end justify-end gap-2 text-xs text-[#4e5969]">
              <span>共 1 条记录</span>
              <button type="button" disabled className="h-7 w-7 rounded bg-[#f7f8fa] text-[#c9cdd4]">‹</button>
              <button type="button" className="h-7 w-7 rounded border border-[#2a55e5] text-[#165dff]">1</button>
              <button type="button" disabled className="h-7 w-7 rounded bg-[#f7f8fa] text-[#c9cdd4]">›</button>
              <SelectButton className="h-7 w-[90px]">10条/页</SelectButton>
              <span>跳转</span>
              <input aria-label="跳转页码" className="h-7 w-12 rounded bg-[#f7f8fa] px-2 outline-none" />
            </div>
          </section>
          )}
        </main>
      </div>
    </div>
  );
}
