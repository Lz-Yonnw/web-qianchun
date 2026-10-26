"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { getActiveDemoAccount, subscribeToActiveDemoAccount } from "@/lib/demo-accounts";
import { PlatformHeader } from "./PlatformHeader";
import styles from "./AccountCenterShell.module.css";

const MENU_ITEMS = [
  { label: "账户信息", path: "/account-center/account-info" },
  { label: "资质认证", path: "/account-center/ad-qualifications" },
  { label: "抖音号授权" },
  { label: "投放授权" },
  { label: "店铺新客授权" },
  { label: "操作日志" },
];

function AccountCenterIcon() {
  return (
    <svg viewBox="0 0 30 30" aria-hidden="true">
      <rect x="3" y="4" width="12" height="12" rx="4" fill="#165dff" />
      <path d="M5 24c0-4 2.8-6.5 7-6.5s7 2.5 7 6.5v2H5v-2Z" fill="#165dff" />
      <rect x="20" y="5" width="7" height="9" rx="3" fill="#165dff" />
      <path d="M18.5 25c0-3.2 2.1-5.2 5-5.2 2.2 0 3.9 1.1 4.7 3v3.2h-9.7v-1Z" fill="#165dff" />
    </svg>
  );
}

export function AccountCenterShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const account = useSyncExternalStore(subscribeToActiveDemoAccount, getActiveDemoAccount, () => null);
  const accountId = account?.accountId ?? "1865682360240256";

  return (
    <div className={styles.page}>
      <PlatformHeader />
      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          <div className={styles.sideTitle}>
            <span className={styles.sideIcon}><AccountCenterIcon /></span>
            <strong>账户管理</strong>
            <svg className={styles.up} viewBox="0 0 12 12" aria-hidden="true"><path d="m2 8 4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <nav aria-label="账户管理">
            {MENU_ITEMS.map((item) => item.path ? (
              <Link key={item.label} href={`${item.path}?aavid=${encodeURIComponent(accountId)}`} className={pathname === item.path ? styles.active : ""}>{item.label}</Link>
            ) : (
              <button key={item.label} type="button" data-auth-required>{item.label}</button>
            ))}
          </nav>
        </aside>
        <div className={styles.workspace}>{children}</div>
      </div>
    </div>
  );
}
