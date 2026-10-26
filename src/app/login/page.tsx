"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { findDemoAccount, setActiveDemoAccount } from "@/lib/demo-accounts";

/**
 * 登录页 — 复刻 business.oceanengine.com/login
 * 左侧整屏主视觉图（标语文字已烤入图中），右侧浮动登录白卡。
 */

const AGREEMENTS = [
  "巨量千川平台服务协议",
  "巨量千川隐私政策",
  "巨量引擎账号用户协议",
];

const OTHER_LOGINS = [
  { label: "抖音", icon: "/sites/qianchuan/dy.png" },
  { label: "西瓜视频", icon: "/sites/qianchuan/xg.png" },
  { label: "TikTok", icon: "/sites/qianchuan/tt.png" },
  { label: "火山", icon: "/sites/qianchuan/hs.png" },
];

function HelpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline-block align-middle">
      <path
        fill="#969AA0"
        fillRule="evenodd"
        d="M8 .667A7.333 7.333 0 1 0 8 15.333 7.333 7.333 0 0 0 8 .667M5.333 6.208a2.667 2.667 0 1 1 3.334 2.583v.542a.667.667 0 0 1-1.334 0V8.21c0-.52.38-.93.86-1.02a1.333 1.333 0 1 0-1.526-1.31.667.667 0 1 1-1.334 0M8 11.333a.833.833 0 1 0 0-1.666.833.833 0 0 0 0 1.666"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const [authFailed, setAuthFailed] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("authError") !== "1") return;

    window.history.replaceState(null, "", window.location.pathname);
    const showTimer = window.setTimeout(() => setAuthFailed(true), 0);
    const hideTimer = window.setTimeout(() => setAuthFailed(false), 3600);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  function sendCode() {
    if (countdown > 0) return;
    if (!findDemoAccount(phone)) {
      setError("请输入已登记的手机号");
      return;
    }

    setError("");
    setCountdown(60);
    const timer = window.setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
  }

  function login() {
    const account = findDemoAccount(phone);
    if (!account) {
      setError("该手机号不在已配置的本地演示账户中");
      return;
    }
    if (!/^\d{6}$/.test(code)) {
      setError("请输入 6 位验证码");
      return;
    }
    if (!agreed) {
      setError("请先阅读并同意平台协议");
      return;
    }

    setActiveDemoAccount(account.accountId);
    router.push(`/home?aavid=${encodeURIComponent(account.accountId)}`);
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {authFailed && (
        <div role="alert" className="fixed right-10 top-14 z-[100] flex h-12 min-w-[142px] items-center gap-2 rounded-lg bg-white px-4 text-sm text-[#323335] shadow-[0_8px_28px_rgba(29,33,41,0.14)]">
          <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#f53f3f] text-[10px] font-bold leading-none text-white">×</span>
          用户鉴权失败
        </div>
      )}
      {/* 主视觉背景图 */}
      <Image
        src="/sites/qianchuan/login-hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* 顶部 logo */}
      <div className="absolute left-10 top-6 z-10">
        <Image
          src="/sites/qianchuan/login-logo.png"
          alt="巨量引擎 巨量千川"
          width={330}
          height={40}
          className="h-10 w-[330px] object-contain"
        />
      </div>

      {/* 语言切换 */}
      <div className="absolute right-10 top-7 z-10 flex items-center gap-1 text-[13px] text-[#4e5969]">
        中文
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 4.5 6 8l3.5-3.5" stroke="#86909c" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* 登录卡片 */}
      <div className="absolute right-[7%] top-1/2 z-10 w-[400px] -translate-y-1/2">
        <div className="relative overflow-hidden rounded-xl bg-white px-10 pb-9 pt-8 shadow-[0_8px_40px_rgba(31,45,61,0.12)]">
          {/* 右上角扫码三角 */}
          <div className="group absolute right-0 top-0">
            <div
              className="flex h-16 w-16 items-start justify-end"
              style={{
                background: "linear-gradient(225deg, #2a55e5 50%, transparent 50%)",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="mr-1.5 mt-1.5">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="#fff" strokeWidth="1.6" />
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="#fff" strokeWidth="1.6" />
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="#fff" strokeWidth="1.6" />
                <path d="M14 14h3v3h-3zM20 14h1v1h-1zM14 20h3v1h-3zM20 17h1v4h-4v-1" stroke="#fff" strokeWidth="1.4" />
              </svg>
            </div>
          </div>

          {/* 标题 */}
          <h1 className="flex items-center gap-1 text-lg font-medium text-[#1d2129]">
            登录巨量引擎账号
            <HelpIcon />
          </h1>

          {/* Tabs */}
          <div className="mt-6 flex gap-7 border-b border-[#f2f3f5]">
            <button className="relative pb-3 text-[15px] font-medium text-[#1d2129]">
              手机登录
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded bg-[#2a55e5]" />
            </button>
            <button className="pb-3 text-[15px] text-[#86909c]">邮箱登录</button>
          </div>

          {/* 手机号 */}
          <div className="mt-6 flex h-11 items-center rounded border border-[#e5e6eb] px-3 focus-within:border-[#2a55e5]">
            <input
              type="tel"
              placeholder="请输入手机号码"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value);
                setError("");
              }}
              className="w-full bg-transparent text-sm text-[#1d2129] outline-none placeholder:text-[#c9cdd4]"
            />
          </div>

          {/* 验证码 */}
          <div className="mt-4 flex h-11 items-center rounded border border-[#e5e6eb] px-3 focus-within:border-[#2a55e5]">
            <input
              type="text"
              placeholder="验证码"
              value={code}
              maxLength={6}
              onChange={(event) => {
                setCode(event.target.value);
                setError("");
              }}
              className="w-full bg-transparent text-sm text-[#1d2129] outline-none placeholder:text-[#c9cdd4]"
            />
            <button onClick={sendCode} className="shrink-0 whitespace-nowrap border-l border-[#e5e6eb] pl-3 text-sm text-[#2a55e5] disabled:text-[#c9cdd4]" disabled={!phone || countdown > 0}>
              {countdown > 0 ? `${countdown}s 后重试` : "发送验证码"}
            </button>
          </div>

          {error && <p className="mt-2 text-xs text-[#f53f3f]">{error}</p>}

          {/* 协议 */}
          <label className="mt-4 flex cursor-pointer items-start gap-2 text-xs leading-5 text-[#86909c]">
            <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} className="sr-only" />
            <span className={`mt-0.5 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm border ${agreed ? "border-[#2a55e5] bg-[#2a55e5] text-white" : "border-[#c9cdd4]"}`}>
              {agreed && "✓"}
            </span>
            <span>
              我已阅读并同意
              {AGREEMENTS.map((a, i) => (
                <span key={a}>
                  <a className="text-[#2a55e5]" href="#">
                    {a}
                  </a>
                  {i < AGREEMENTS.length - 1 ? "、" : ""}
                </span>
              ))}
            </span>
          </label>

          {/* 登录按钮 */}
          <button onClick={login} disabled={!phone || !code || !agreed} className="mt-5 h-10 w-full rounded bg-[#2a55e5] text-base text-white disabled:cursor-not-allowed disabled:bg-[#2a55e5]/50">
            登录
          </button>

          {/* 辅助链接 */}
          <div className="mt-3 flex gap-4 text-[13px] text-[#86909c]">
            <a href="#" className="hover:text-[#2a55e5]">
              收不到验证码
            </a>
            <a href="#" className="hover:text-[#2a55e5]">
              无法登录
            </a>
          </div>

          {/* 其他方式 */}
          <div className="mt-6 flex items-center gap-3">
            <span className="text-[13px] text-[#86909c]">其他方式</span>
            <div className="flex gap-2.5">
              {OTHER_LOGINS.map((o) => (
          <span
            key={o.label}
            title={o.label}
            className="flex h-6 w-6 items-center justify-center"
          >
            <Image
              src={o.icon}
              alt={o.label}
              width={24}
              height={24}
              className="h-6 w-6 object-contain"
            />
          </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
