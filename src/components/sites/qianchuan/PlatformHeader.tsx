"use client";

import Image from "next/image";
import Link from "next/link";
import { AccountMenu } from "./AccountMenu";
import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  clearActiveDemoAccount,
  getActiveDemoAccount,
  subscribeToActiveDemoAccount,
} from "@/lib/demo-accounts";
import { buildFullDomainHref } from "@/lib/full-domain-route";

/** 巨量千川 平台顶部导航（首页 / 个人中心共用） */

type MenuKey = "brand" | "data" | "tools" | "marketing";

type NavItem = {
  label: string;
  href?: string;
  menu?: MenuKey;
  badge?: string;
  festival?: boolean;
};

type ToolItem = {
  label: string;
  children?: string[];
  external?: boolean;
  plain?: boolean;
};

type ToolGroup = {
  title: string;
  items: ToolItem[];
};

const NAV: NavItem[] = [
  { label: "首页", href: "/home" },
  { label: "乘方", badge: "新升级" },
  { label: "全域投放", href: "/data/full-domain" },
  { label: "品牌投放", menu: "brand" },
  { label: "数据", menu: "data" },
  { label: "工具", menu: "tools" },
  { label: "财务" },
  { label: "营销", menu: "marketing", festival: true },
  { label: "学堂" },
];

const TOOL_GROUPS: ToolGroup[] = [
  {
    title: "创意工具",
    items: [
      { label: "素材管理", children: ["视频库", "图片库", "图文库", "标签管理"] },
      { label: "素材生产" },
      { label: "创意榜单", children: ["营销创意榜", "爆款内容榜"] },
    ],
  },
  {
    title: "审核工具",
    items: [
      { label: "审核管理", children: ["AI过审记录", "广告审核中心"] },
    ],
  },
  {
    title: "投放工具",
    items: [
      { label: "定向管理", children: ["定向包管理"] },
      { label: "智能起量", children: ["账户优选起量"] },
      { label: "评论管理", children: ["评论内容", "屏蔽词", "屏蔽用户", "常用语"] },
    ],
  },
  {
    title: "优化工具",
    items: [
      { label: "自动规则", children: ["规则管理", "运行记录"] },
      { label: "清理助手", children: ["计划清理", "素材清理", "清理记录"] },
      { label: "任务中心", children: ["批量任务", "下载任务"] },
    ],
  },
  {
    title: "账户工具",
    items: [
      { label: "账户查询", children: ["在投计划配额查询", "账户违规管理"] },
    ],
  },
  {
    title: "品牌投放工具",
    items: [
      { label: "品牌词包管理", plain: true },
      { label: "品牌投放素材预审", plain: true },
      { label: "品牌橱窗", plain: true },
      { label: "品牌词量工具", plain: true },
    ],
  },
  {
    title: "第三方工具",
    items: [
      { label: "代理服务优选", external: true, plain: true },
      { label: "创意智能生产", external: true, plain: true },
      { label: "更多千川营销工具", external: true, plain: true },
    ],
  },
];

const DEFAULT_ACCOUNT = {
  name: "ECP_0000000000000_0000",
  id: "10000000000000",
};

function Caret({ open = false }: { open?: boolean }) {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className={`ml-0.5 inline-block transition-transform ${open ? "rotate-180" : ""}`}>
      <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MenuGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0 text-[#969aa0]">
      <rect x="2" y="3" width="12" height="10" rx="2" fill="currentColor" />
      <path d="m4.5 9 2-2 1.7 1.6L11.5 5.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BrandMenu() {
  return (
    <div role="menu" aria-label="品牌投放二级菜单" className="absolute left-1/2 top-full w-[200px] -translate-x-1/2 rounded-b-xl bg-white p-3 shadow-[0_10px_28px_rgba(29,33,41,0.14)]">
      <button type="button" role="menuitem" data-auth-required className="flex w-full gap-2 rounded-lg px-2 py-2 text-left hover:bg-[#f7f8fa]">
        <MenuGlyph />
        <span><strong className="block text-sm font-medium text-[#323335]">品牌竞价</strong><small className="mt-1 block text-xs text-[#969aa0]">人群种草和直播加热</small></span>
      </button>
      <button type="button" role="menuitem" data-auth-required className="mt-1 flex w-full gap-2 rounded-lg px-2 py-2 text-left hover:bg-[#f7f8fa]">
        <MenuGlyph />
        <span><strong className="block text-sm font-medium text-[#323335]">品牌合约</strong><small className="mt-1 block text-xs text-[#969aa0]">曝光&amp;种草&amp;搜索经营</small></span>
      </button>
    </div>
  );
}

function DataMenu({ accountId }: { accountId: string }) {
  const groups: Array<{ title: string; items: Array<{ label: string; href?: string }> }> = [
    { title: "乘方", items: [{ label: "乘方数据" }] },
    { title: "全域投放", items: [{ label: "全域数据", href: buildFullDomainHref(accountId) }] },
    { title: "品牌投放", items: [{ label: "品牌竞价数据" }, { label: "品牌合约数据" }] },
  ];

  return (
    <div role="menu" aria-label="数据二级菜单" className="absolute left-1/2 top-full grid w-[636px] -translate-x-1/2 grid-cols-3 gap-12 rounded-b-xl bg-white px-7 py-6 shadow-[0_10px_28px_rgba(29,33,41,0.14)]">
      {groups.map((group) => (
        <div key={group.title}>
          <div className="flex items-center gap-2 text-sm font-semibold text-[#323335]"><MenuGlyph />{group.title}</div>
          <div className="mt-3 space-y-3 pl-7">
            {group.items.map((item) => item.href ? (
              <Link key={item.label} href={item.href} role="menuitem" className="block text-sm text-[#4e5969] hover:text-[#165dff]">{item.label}</Link>
            ) : (
              <button type="button" role="menuitem" data-auth-required key={item.label} className="block text-sm text-[#4e5969] hover:text-[#165dff]">{item.label}</button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ToolsMenu() {
  return (
    <div role="menu" aria-label="工具二级菜单" className="fixed inset-x-0 top-20 grid max-h-[calc(100vh-80px)] grid-cols-7 gap-6 overflow-y-auto rounded-b-xl bg-white px-6 py-6 shadow-[0_10px_28px_rgba(29,33,41,0.14)]">
      {TOOL_GROUPS.map((group) => (
        <div key={group.title} className="min-w-0">
          <div className="border-b border-[#e5e6eb] pb-3 text-sm font-semibold text-[#86909c]">{group.title}</div>
          <div className="mt-3 space-y-4">
            {group.items.map((item) => (
              <div key={item.label}>
                <button type="button" role="menuitem" data-auth-required className={`flex w-full items-center gap-2 text-left text-sm text-[#323335] hover:text-[#165dff] ${item.plain ? "pl-6 font-normal" : "font-semibold"}`}>
                  {!item.plain && <MenuGlyph />}
                  <span>{item.label}{item.external && <span className="ml-1 text-xs">↗</span>}</span>
                </button>
                {item.children && (
                  <div className="mt-3 space-y-3 pl-7">
                    {item.children.map((child) => <button type="button" role="menuitem" data-auth-required key={child} className="block text-sm text-[#4e5969] hover:text-[#165dff]">{child}</button>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MarketingMenu() {
  return (
    <div role="menu" aria-label="营销二级菜单" className="absolute left-1/2 top-full w-[176px] -translate-x-1/2 rounded-b-xl bg-white p-3 shadow-[0_10px_28px_rgba(29,33,41,0.14)]">
      <button type="button" role="menuitem" data-auth-required className="flex w-full items-center gap-2 whitespace-nowrap rounded-lg px-1.5 py-2 text-sm text-[#323335] hover:bg-[#f7f8fa]"><MenuGlyph />活动中心<span className="shrink-0 whitespace-nowrap rounded-full bg-[#ff3aa0] px-1.5 py-0.5 text-[10px] font-semibold text-white">双11</span></button>
      <button type="button" role="menuitem" data-auth-required className="mt-1 flex w-full items-center gap-2 whitespace-nowrap rounded-lg px-1.5 py-2 text-sm text-[#323335] hover:bg-[#f7f8fa]"><MenuGlyph />福利中心</button>
    </div>
  );
}

function Submenu({ menu, accountId }: { menu: MenuKey; accountId: string }) {
  if (menu === "brand") return <BrandMenu />;
  if (menu === "data") return <DataMenu accountId={accountId} />;
  if (menu === "tools") return <ToolsMenu />;
  return <MarketingMenu />;
}

function TopIcon({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button type="button" data-auth-required aria-label={label} title={label} className="flex h-10 w-9 items-center justify-center rounded-md text-[#9299a2] transition-colors hover:bg-white/70 hover:text-[#6b737c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a55e5] [&_svg]:h-5 [&_svg]:w-5">
      {children}
    </button>
  );
}

const getServerAccount = () => null;

export function PlatformHeader({ active }: { active?: string }) {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const account = useSyncExternalStore(subscribeToActiveDemoAccount, getActiveDemoAccount, getServerAccount);

  const accountName = account?.storeName ?? DEFAULT_ACCOUNT.name;
  const accountId = account?.accountId ?? DEFAULT_ACCOUNT.id;
  const homeHref = `/home?aavid=${encodeURIComponent(accountId)}`;

  function logout() {
    clearActiveDemoAccount();
    router.push("/login");
  }

  return (
    <header
      className="sticky top-0 z-30 flex h-20 min-w-[1180px] items-center bg-[#edf5ff] px-[30px] shadow-[0_1px_0_rgba(29,33,41,0.08)]"
      onMouseLeave={() => setOpenMenu(null)}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpenMenu(null);
      }}
    >
      {/* logo */}
      <Link href={homeHref} className="mr-9 flex shrink-0 items-center">
        <Image src="/sites/qianchuan/home-logo.svg" alt="巨量千川" width={176} height={56} priority className="h-14 w-44" />
      </Link>

      {/* 主导航 */}
      <nav className="flex h-full items-center gap-[18px] text-[16px]" aria-label="平台主导航">
        {NAV.map((item) => {
          const isActive = item.label === active;
          const menuOpen = item.menu === openMenu;
          const inner = (
            <span
              className={`relative flex h-14 items-center whitespace-nowrap rounded-md px-3 transition-colors ${
                isActive ? "font-semibold text-[#165dff]" : "text-[#323335] hover:text-[#165dff]"
              } ${menuOpen ? "bg-[#e4eaff] text-[#323335]" : ""} ${
                item.festival ? "px-2" : ""
              }`}
            >
              {item.festival ? (
                <span className="rounded-full bg-[#ff3aa0] px-2 py-1 text-[12px] font-semibold italic leading-none text-white">双11</span>
              ) : item.label}
              {item.menu && <Caret open={menuOpen} />}
              {item.badge && (
                <span className="ml-1 rounded-full bg-[#ff7d3b] px-1.5 py-0.5 text-[10px] leading-none text-white">
                  {item.badge}
                </span>
              )}
              {isActive && (
                <span className="absolute inset-x-0 -bottom-2 mx-auto h-1 w-5 rounded-full bg-[#165dff]" />
              )}
            </span>
          );

          return (
            <div
              key={item.label}
              className="relative flex h-full items-center"
              onMouseEnter={() => setOpenMenu(item.menu ?? null)}
            >
              {item.href ? (
                <Link href={item.href === "/home" ? homeHref : item.href === "/data/full-domain" ? buildFullDomainHref(accountId) : item.href}>{inner}</Link>
              ) : item.menu ? (
                <button
                  type="button"
                  aria-label={item.festival ? "营销活动" : item.label}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  onFocus={() => setOpenMenu(item.menu ?? null)}
                  onClick={() => setOpenMenu(item.menu ?? null)}
                >
                  {inner}
                </button>
              ) : (
                <button type="button" data-auth-required onFocus={() => setOpenMenu(null)}>{inner}</button>
              )}
              {item.menu && menuOpen && <Submenu menu={item.menu} accountId={accountId} />}
            </div>
          );
        })}
      </nav>

      {/* 右侧工具区 */}
      <div className="ml-auto flex items-center gap-1">
        <TopIcon label="福利中心">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 8h18v4H3V8Zm2 5h14v8H5v-8ZM9.8 7.2H5.7C4.2 7.2 3.4 5.6 4.2 4.4c.7-1.1 2.2-1.2 3.2-.4l2.4 2v1.2Zm4.4 0h4.1c1.5 0 2.3-1.6 1.5-2.8-.7-1.1-2.2-1.2-3.2-.4l-2.4 2v1.2Z"/><path d="M11 8h2v13h-2z" fill="#edf5ff"/></svg>
        </TopIcon>
        <TopIcon label="任务中心">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 2h12.2L21 5.8V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"/><path d="M16.8 2v4h4M7 8.2h7M7 12h5" fill="none" stroke="#edf5ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="m10.8 18.3 1.1-3.1 4.7-4.7 2 2-4.7 4.7-3.1 1.1Z" fill="#edf5ff"/></svg>
        </TopIcon>
        <TopIcon label="移动端">
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="1.5" width="14" height="21" rx="2.4" fill="currentColor"/><rect x="10" y="18.5" width="4" height="1.4" rx=".7" fill="#edf5ff"/></svg>
        </TopIcon>
        <TopIcon label="帮助">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M9.2 9.2a2.9 2.9 0 1 1 4 2.7c-.8.3-1.2.8-1.2 1.7" fill="none" stroke="#edf5ff" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="16.9" r="1.1" fill="#edf5ff"/></svg>
        </TopIcon>
        <span className="relative">
          <TopIcon label="通知">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a2 2 0 0 1 2 1.65A6 6 0 0 1 18 9v3.1c0 1.6.6 3.15 1.7 4.3l.3.3V18H4v-1.3l.3-.3A6.1 6.1 0 0 0 6 12.1V9a6 6 0 0 1 4-5.35A2 2 0 0 1 12 2Zm-2.2 17h4.4a2.3 2.3 0 0 1-4.4 0Z"/></svg>
          </TopIcon>
          <span className="absolute -right-1 -top-0.5 min-w-[30px] rounded-full bg-[#f04444] px-1.5 text-center text-[10px] font-semibold leading-[17px] text-white">99+</span>
        </span>

        <AccountMenu name={accountName} accountId={accountId} onLogout={logout} />

        {/* 刷新 + 九宫格 */}
        <div className="ml-3 border-l border-[#c4c8ce] pl-5">
          <div className="flex h-8 w-[60px] items-center rounded-[4px] bg-white/90 text-[#727a84] shadow-[0_1px_2px_rgba(29,33,41,0.04)]">
            <button type="button" data-auth-required aria-label="刷新" title="刷新" className="flex h-8 w-[30px] items-center justify-center rounded-l-[4px] hover:bg-[#f5f7fa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2a55e5]">
              <svg viewBox="0 0 16 16" className="h-[18px] w-[18px]" aria-hidden="true"><path fill="currentColor" d="m7.2 1.2 2.7 1.5-.8 1.4-1-.6L6.6 6 4.7 4.9l1.5-2.5-1-.6.8-1.4 1.2.8Zm4.1 4.2 2.4 4.1-1.4.8-.6-1-2.9.1V7.2l2.9-.1-.6-1 1.4-.8.8 1.1ZM7.2 14.8H2.6v-1.6h1.2L2.4 10.7l1.9-1.1 1.4 2.5.6-1 1.4.8-.5.9Z"/><circle cx="7.9" cy="8" r="1.4" fill="currentColor"/></svg>
            </button>
            <span className="h-4 w-px bg-[#e3e6eb]" aria-hidden="true" />
            <button type="button" data-auth-required aria-label="应用菜单" title="应用菜单" className="flex h-8 w-[29px] items-center justify-center rounded-r-[4px] hover:bg-[#f5f7fa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2a55e5]">
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true"><circle cx="4" cy="4" r="1.15"/><circle cx="8" cy="4" r="1.15"/><circle cx="12" cy="4" r="1.15"/><circle cx="4" cy="8" r="1.15"/><circle cx="8" cy="8" r="1.15"/><circle cx="12" cy="8" r="1.15"/><circle cx="4" cy="12" r="1.15"/><circle cx="8" cy="12" r="1.15"/><circle cx="12" cy="12" r="1.15"/></svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
