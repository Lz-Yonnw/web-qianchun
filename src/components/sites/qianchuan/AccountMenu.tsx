"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AccountAvatar } from "./AccountAvatar";
import styles from "./AccountMenu.module.css";

export function AccountMenu({ name, accountId, onLogout }: {
  name: string;
  accountId: string;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const logout = useRef<HTMLButtonElement>(null);
  const accountCenterHref = `/account-center/account-info?aavid=${encodeURIComponent(accountId)}`;
  const qualificationsHref = `/account-center/ad-qualifications?aavid=${encodeURIComponent(accountId)}`;

  useEffect(() => {
    if (!open) return;
    function dismiss(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  return (
    <div ref={root} className={styles.root}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        if (!root.current?.contains(document.activeElement)) setOpen(false);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          trigger.current?.focus();
          setOpen(false);
        }
      }}>
      <button ref={trigger} type="button" className={`${styles.trigger} ${open ? styles.expanded : ""}`}
        aria-label={`当前账户：${name}，ID：${accountId}`} aria-expanded={open} aria-controls="current-account-panel"
        onFocus={() => setOpen(true)} onClick={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
            logout.current?.focus();
          }
        }}>
        <AccountAvatar accountId={accountId} name={name} size={38} />
        <span className={styles.triggerInfo}>
          <span className={styles.triggerName} title={name}>{name}</span>
          <span className={styles.triggerId}>ID：{accountId}</span>
        </span>
        <svg className={styles.caret} width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="m1 4 5 5 5-5" fill="currentColor" /></svg>
      </button>
      {open && (
        <div className={styles.bridge}>
          <div id="current-account-panel" className={styles.panel} aria-label="当前登录账户">
            <div className={styles.summary}>
              <div className={styles.topline}>
                <span>当前登录账户</span>
                <button ref={logout} type="button" onClick={() => { setOpen(false); onLogout(); }}>退出登录</button>
              </div>
              <div className={styles.identity}>
                <AccountAvatar accountId={accountId} name={name} size={46} />
                <div className={styles.identityText}>
                  <div className={styles.fullName} title={name}>{name}</div>
                  <div className={styles.accountId}>千川ID {accountId}</div>
                </div>
              </div>
            </div>
            <div className={styles.actions}>
              <Link href={qualificationsHref} className={styles.entry} onClick={() => setOpen(false)}>资质认证</Link>
              <div className={styles.entry}>抖音号授权</div>
              <div className={styles.entry}>全域投放授权</div>
              <Link href={accountCenterHref} className={styles.manage} onClick={() => setOpen(false)}>去账户管理</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
