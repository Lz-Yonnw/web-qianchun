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
  { label: "全域投放" },
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
      <button type="button" role="menuitem" className="flex w-full gap-2 rounded-lg px-2 py-2 text-left hover:bg-[#f7f8fa]">
        <MenuGlyph />
        <span><strong className="block text-sm font-medium text-[#323335]">品牌竞价</strong><small className="mt-1 block text-xs text-[#969aa0]">人群种草和直播加热</small></span>
      </button>
      <button type="button" role="menuitem" className="mt-1 flex w-full gap-2 rounded-lg px-2 py-2 text-left hover:bg-[#f7f8fa]">
        <MenuGlyph />
        <span><strong className="block text-sm font-medium text-[#323335]">品牌合约</strong><small className="mt-1 block text-xs text-[#969aa0]">曝光&amp;种草&amp;搜索经营</small></span>
      </button>
    </div>
  );
}

function DataMenu({ accountId }: { accountId: string }) {
  const groups: Array<{ title: string; items: Array<{ label: string; href?: string }> }> = [
    { title: "乘方", items: [{ label: "乘方数据" }] },
    { title: "全域投放", items: [{ label: "全域数据", href: `/data/full-domain?aavid=${encodeURIComponent(accountId)}` }] },
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
              <button type="button" role="menuitem" key={item.label} className="block text-sm text-[#4e5969] hover:text-[#165dff]">{item.label}</button>
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
                <button type="button" role="menuitem" className={`flex w-full items-center gap-2 text-left text-sm text-[#323335] hover:text-[#165dff] ${item.plain ? "pl-6 font-normal" : "font-semibold"}`}>
                  {!item.plain && <MenuGlyph />}
                  <span>{item.label}{item.external && <span className="ml-1 text-xs">↗</span>}</span>
                </button>
                {item.children && (
                  <div className="mt-3 space-y-3 pl-7">
                    {item.children.map((child) => <button type="button" role="menuitem" key={child} className="block text-sm text-[#4e5969] hover:text-[#165dff]">{child}</button>)}
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
      <button type="button" role="menuitem" className="flex w-full items-center gap-2 whitespace-nowrap rounded-lg px-1.5 py-2 text-sm text-[#323335] hover:bg-[#f7f8fa]"><MenuGlyph />活动中心<span className="shrink-0 whitespace-nowrap rounded-full bg-[#ff3aa0] px-1.5 py-0.5 text-[10px] font-semibold text-white">双11</span></button>
      <button type="button" role="menuitem" className="mt-1 flex w-full items-center gap-2 whitespace-nowrap rounded-lg px-1.5 py-2 text-sm text-[#323335] hover:bg-[#f7f8fa]"><MenuGlyph />福利中心</button>
    </div>
  );
}

function Submenu({ menu, accountId }: { menu: MenuKey; accountId: string }) {
  if (menu === "brand") return <BrandMenu />;
  if (menu === "data") return <DataMenu accountId={accountId} />;
  if (menu === "tools") return <ToolsMenu />;
  return <MarketingMenu />;
}

function TopIcon({ children }: { children: React.ReactNode }) {
  return (
    <button type="button" className="flex h-10 w-10 items-center justify-center rounded-md text-[#8b929a] transition-colors hover:bg-white/70 hover:text-[#4e5969] [&_svg]:h-[22px] [&_svg]:w-[22px]">
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
                <Link href={item.href === "/home" ? homeHref : item.href}>{inner}</Link>
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
                <button type="button" onFocus={() => setOpenMenu(null)}>{inner}</button>
              )}
              {item.menu && menuOpen && <Submenu menu={item.menu} accountId={accountId} />}
            </div>
          );
        })}
      </nav>

      {/* 右侧工具区 */}
      <div className="ml-auto flex items-center gap-1">
        <span className="relative">
          <TopIcon>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 12v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8M3 7h18v5H3zM12 21V7M12 7S8 3 5.5 4.5 10 7 12 7m0 0s4-4 6.5-2.5S14 7 12 7" strokeLinejoin="round"/></svg>
          </TopIcon>
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#f53f3f] ring-2 ring-[#edf5ff]" />
        </span>
        <span className="relative">
          <TopIcon>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5" strokeLinecap="round"/></svg>
          </TopIcon>
        </span>
        <TopIcon>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2" strokeLinecap="round"/></svg>
        </TopIcon>
        <TopIcon>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.3 2.4c-.6.2-.8.6-.8 1.1v.5M12 16.5h.01" strokeLinecap="round"/></svg>
        </TopIcon>
        <span className="relative">
          <TopIcon>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 19a2 2 0 0 0 4 0" strokeLinejoin="round"/></svg>
          </TopIcon>
          <span className="absolute -right-1 -top-1 rounded-full bg-[#f04444] px-1.5 text-[11px] leading-[20px] text-white">99+</span>
        </span>

        <AccountMenu name={accountName} accountId={accountId} onLogout={logout} />

        {/* 刷新 + 九宫格 */}
        <div className="ml-3 border-l border-[#c4c8ce] pl-[29px]">
          <div className="flex h-10 items-center gap-0.5 rounded-md bg-white px-1 text-[#687078] shadow-[0_1px_3px_rgba(29,33,41,0.04)]">
            <TopIcon>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 11a8 8 0 1 0-.9 4.5M20 5v4h-4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </TopIcon>
            <TopIcon>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="5" r="1.6"/><circle cx="12" cy="5" r="1.6"/><circle cx="19" cy="5" r="1.6"/><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/><circle cx="5" cy="19" r="1.6"/><circle cx="12" cy="19" r="1.6"/><circle cx="19" cy="19" r="1.6"/></svg>
            </TopIcon>
          </div>
        </div>
      </div>
    </header>
  );
}
