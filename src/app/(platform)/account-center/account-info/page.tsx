"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { ExternalLink, HelpCircle, Link2, Mail, Smartphone, UserRoundCog } from "lucide-react";
import { PlatformHeader } from "@/components/sites/qianchuan/PlatformHeader";
import { AccountAvatar } from "@/components/sites/qianchuan/AccountAvatar";
import { getActiveDemoAccount, maskPhone, subscribeToActiveDemoAccount } from "@/lib/demo-accounts";

/** 个人中心 / 账户信息 — 复刻 qianchuan.jinritemai.com/account-center/account-info
 *  源站含真实账户数据，以下均为脱敏占位值。 */

const SIDE_MENU = [
  "账户信息",
  "资质认证",
  "抖音号授权",
  "投放授权",
  "店铺新客授权",
  "账户协作者",
  "操作日志",
];

const DEFAULT_ACCOUNT = {
  name: "ECP_0000000000000_0000",
  subject: "示例主体",
  shop: "示例店铺",
  shopId: "00000000",
  role: "千川超管",
  email: "a***b@example.com",
  phone: "188****0000",
  permission: "可操作",
  adAccountId: "0000000000000000",
};

const AGREEMENTS = ["巨量千川平台服务协议", "巨量千川隐私政策", "巨量引擎工作台账户管理服务协议"];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mb-[27px]">
      <div className="mb-2 text-[13px] font-semibold leading-5 text-[#1d2129]">{label}</div>
      {children}
    </section>
  );
}

export default function AccountInfoPage() {
  const activeAccount = useSyncExternalStore(subscribeToActiveDemoAccount, getActiveDemoAccount, () => null);

  const account = activeAccount
    ? {
        name: activeAccount.storeName,
        subject: activeAccount.companyName,
        shop: activeAccount.storeName,
        shopId: activeAccount.accountId,
        role: "账户管理员",
        email: "未提供",
        phone: maskPhone(activeAccount.phone),
        permission: "可操作",
        adAccountId: activeAccount.accountId,
      }
    : DEFAULT_ACCOUNT;

  return (
    <>
      <PlatformHeader />

      <div className="min-h-[calc(100vh-80px)] bg-[#f3f6fc] px-5 py-4">
        <div className="mx-auto flex max-w-[1600px] items-start gap-3">
        {/* 左侧栏 */}
        <aside className="w-[188px] shrink-0 py-1 text-[13px]">
          <div className="flex h-9 items-center gap-3 px-5 font-semibold text-[#1d2129]">
            <UserRoundCog className="h-5 w-5 text-[#165dff]" strokeWidth={2.2} />
            账户管理
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="ml-auto mr-1">
              <path d="M3 7.5 6 4.5l3 3" stroke="#86909c" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <nav className="mt-1 space-y-1">
            {SIDE_MENU.map((item, i) => {
              const active = i === 0;
              return (
                <button
                  type="button"
                  key={item}
                  className={`flex h-9 w-full items-center rounded-lg pl-[58px] text-left transition-colors ${
                    active ? "bg-white font-medium text-[#165dff] shadow-[0_1px_3px_rgba(29,33,41,0.03)]" : "text-[#646a73] hover:bg-white/60"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* 主体 */}
        <main className="min-w-0 flex-1">
          <div className="flex h-[50px] items-center rounded-lg bg-white px-5">
            <h1 className="text-[15px] font-semibold text-[#1d2129]">账户信息</h1>
          </div>
          <div className="mt-[14px] min-h-[734px] rounded-lg bg-white px-5 pb-7 pt-4">
            <div className="w-[432px] max-w-full">
              <Field label="账户名称">
                <div className="text-[13px] leading-5 text-[#1d2129]">
                  {account.name} <button type="button" className="ml-1 text-[#165dff]">修改</button>
                </div>
              </Field>

              <Field label="主体名称">
                <div className="text-[13px] leading-5 text-[#1d2129]">{account.subject}</div>
              </Field>

              <Field label="绑定店铺">
                <div className="flex h-[66px] w-full items-center gap-3 rounded bg-[#f7f8fa] px-3">
                  <AccountAvatar accountId={account.adAccountId} name={account.shop} size={40} square />
                  <div className="min-w-0">
                    <div className="truncate text-[13px] text-[#1d2129]">{account.shop}</div>
                    <div className="mt-1 text-xs text-[#86909c]">ID:{account.shopId.slice(-10)}</div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-[#4e5969]">当前可投商城的账户ID：{account.adAccountId}</div>
              </Field>

              <Field label="我的角色">
                <div className="-mt-[27px] ml-[55px] flex justify-end">
                  <button type="button" className="text-xs text-[#165dff]">如何找到千川超管?</button>
                </div>
                <div className="mt-[10px] flex items-center gap-1 text-[13px] text-[#1d2129]">
                  管理员 <HelpCircle className="h-3.5 w-3.5 fill-[#aeb3bb] text-white" />
                </div>
                <div className="relative mt-3 overflow-hidden rounded bg-[#f7f8fa] px-3 py-2.5 text-[13px]">
                  <div className="flex h-8 items-center">
                    <span className="flex w-[105px] items-center gap-3 text-[#323335]"><Mail className="h-4 w-4 text-[#676d75]" />邮箱</span>
                    <span className="text-[#4e5969]">{account.email}</span>
                  </div>
                  <div className="flex h-8 items-center">
                    <span className="flex w-[105px] items-center gap-3 text-[#323335]"><Smartphone className="h-4 w-4 text-[#676d75]" />手机号</span>
                    <span className="text-[#4e5969]">{account.phone}</span>
                    <button type="button" className="ml-auto flex items-center gap-1 text-[#165dff]">去修改 <ExternalLink className="h-3.5 w-3.5" /></button>
                  </div>
                  <div className="flex h-8 items-center">
                    <span className="flex w-[105px] items-center gap-3 text-[#323335]"><Link2 className="h-4 w-4 text-[#676d75]" />第三方账号</span>
                    <Image src="/sites/qianchuan/dy.png" alt="抖音" width={22} height={22} className="h-[22px] w-[22px] rounded object-cover" />
                  </div>
                </div>
              </Field>

              <Field label="我的权限">
                <div className="-mt-[27px] ml-[54px]"><HelpCircle className="h-3.5 w-3.5 fill-[#aeb3bb] text-white" /></div>
                <div className="mt-2 text-[13px] text-[#1d2129]">{account.permission}</div>
              </Field>

              <Field label="生意模式标签">
                <div className="-mt-[27px] ml-[68px]"><HelpCircle className="h-3.5 w-3.5 fill-[#aeb3bb] text-white" /></div>
                <p className="mt-2 text-xs leading-5 text-[#a0a5ad]">当前账户还未投放计划或未产生消耗，需要产生消耗后才能产生生意模式标签</p>
              </Field>

              <Field label="签署协议">
                <label className="flex items-start gap-2 text-xs leading-5 text-[#a0a5ad]">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-[#c8cbd1] text-[10px] text-white">
                    ✓
                  </span>
                  <span>
                    我已阅读并同意
                    {AGREEMENTS.map((a, i) => (
                      <span key={a}>
                        <a className="text-[#165dff]">《{a}》</a>
                        {i < AGREEMENTS.length - 1 ? "、" : ""}
                      </span>
                    ))}
                  </span>
                </label>
              </Field>
            </div>
          </div>
        </main>
        </div>
      </div>
    </>
  );
}
