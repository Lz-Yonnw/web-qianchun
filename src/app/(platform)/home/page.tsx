"use client";

import Image from "next/image";
import { useMemo, useSyncExternalStore } from "react";
import { PlatformHeader } from "@/components/sites/qianchuan/PlatformHeader";
import { DataOverview } from "@/components/sites/qianchuan/DataOverview";
import { FUNDS, PLATFORM_NEWS } from "@/components/sites/qianchuan/homeData";
import { getActiveDemoAccount, subscribeToActiveDemoAccount } from "@/lib/demo-accounts";
import { useCurrentTime } from "@/components/sites/qianchuan/currentTime";
import { buildAccountBrief } from "@/components/sites/qianchuan/accountOverviewData";
import { getAccountDeliveryProfile } from "@/lib/account-delivery";

/** 首页 — 复刻 qianchuan.jinritemai.com/home */

const FEATURES = [
  { icon: "/sites/qianchuan/roi2-icon-1.svg", text: "调控全域流量，\n撬动自然流量" },
  { icon: "/sites/qianchuan/roi2-icon-2.svg", text: "一条“超级”计划\n全程省心投放" },
  { icon: "/sites/qianchuan/roi2-icon-3.svg", text: "ROI稳定达成，\n扩大GMV规模" },
];

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-lg bg-white ${className}`}>{children}</div>;
}

type SuggestionTag = {
  label: string;
  tone: "green" | "red" | "blue";
};

type SuggestionCardProps = {
  title: string;
  description: React.ReactNode;
  action: string;
  extra?: React.ReactNode;
  tags?: SuggestionTag[];
};

const tagToneClasses: Record<SuggestionTag["tone"], string> = {
  green: "border-[#8ad995] bg-[#effff2] text-[#18a739]",
  red: "border-[#ffb8b8] bg-[#fff1f0] text-[#f04444]",
  blue: "border-[#a9c7ff] bg-[#eef4ff] text-[#2468e8]",
};

function NoticeBar() {
  return (
    <div className="flex min-h-8 items-center rounded border border-[#ffd591] bg-[#fffbe8] px-4 text-xs text-[#4e5969]">
      <span className="mr-2 flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-[#f08b18] text-[9px] font-bold text-white">
        !
      </span>
      <span>
        根据工信部新规要求，2026年10月30日起签署电子合同必须先申请数字证书，请您尽快完成数字证书申请，证书申请后电子签将为您签发电子签章。
        <button className="ml-2 text-[#165dff]">链接</button>
      </span>
    </div>
  );
}

function CampaignBanner({ timestamp }: { timestamp: number }) {
  const target = new Date(2026, 10, 12, 0, 0, 0).getTime();
  const remaining = timestamp ? Math.max(0, target - timestamp) : 17 * 86_400_000 + 9 * 3_600_000;
  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor(remaining % 86_400_000 / 3_600_000);

  return (
    <section className="relative h-[100px] overflow-hidden rounded-sm bg-[#ff176c] [container-type:inline-size]">
      <Image
        src="/sites/qianchuan/home-campaign-banner.png"
        alt="千川双11限时扶持，采纳扶持出价建议享流量加券"
        fill
        preload
        sizes="(min-width: 1700px) 1200px, calc(100vw - 370px)"
        className="object-cover object-center"
      />
      <span className="absolute left-[calc(50%+max(6.476cqw,78.75px))] top-[calc(50%-max(1.419cqw,17.25px))] z-10 flex h-[max(1.768cqw,21.5px)] w-[max(2.056cqw,25px)] -translate-x-1/2 -translate-y-1/2 items-center justify-center text-[clamp(16px,1.3cqw,20px)] font-semibold leading-none text-[#ff176c]">
        {String(days).padStart(2, "0")}
      </span>
      <span className="absolute left-[calc(50%+max(10.485cqw,127.5px))] top-[calc(50%-max(1.419cqw,17.25px))] z-10 flex h-[max(1.768cqw,21.5px)] w-[max(2.056cqw,25px)] -translate-x-1/2 -translate-y-1/2 items-center justify-center text-[clamp(16px,1.3cqw,20px)] font-semibold leading-none text-[#ff176c]">
        {String(hours).padStart(2, "0")}
      </span>
    </section>
  );
}

function SuggestionCard({ title, description, action, extra, tags = [] }: SuggestionCardProps) {
  return (
    <article className="relative flex min-h-[180px] flex-col overflow-hidden rounded-lg bg-[#f3f8ff] px-6 py-4">
      <span className="absolute left-0 top-5 h-3 w-1 rounded-r bg-[#3156ff]" />
      <div className="relative z-10 flex items-center gap-1 text-[15px] font-semibold text-[#1d2129]">
        <span>{title}</span>
        {extra}
      </div>
      <p className="relative z-10 mt-2 text-[13px] leading-[21px] text-[#646c7a]">{description}</p>
      {tags.length > 0 && (
        <div className="relative z-10 mt-2 flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span key={tag.label} className={`rounded border px-1 py-px text-xs ${tagToneClasses[tag.tone]}`}>
              {tag.label}
            </span>
          ))}
        </div>
      )}
      <button className="relative z-10 mt-auto w-fit rounded border border-[#d8dbe2] bg-white px-4 py-1.5 text-[13px] text-[#1d2129]">
        {action}
      </button>
      <div className="pointer-events-none absolute -bottom-3 right-2 flex h-16 w-16 items-center justify-center rounded-xl bg-white/45 text-5xl font-bold text-white/90">
        ✓
      </div>
    </article>
  );
}

function accountSeed(accountId?: string) {
  return [...(accountId ?? "0")].reduce((sum, value) => sum + Number(value), 0);
}

function accountWelfare(accountId?: string) {
  if (!accountId) return FUNDS.welfare;
  return new Intl.NumberFormat("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .format(320 + accountSeed(accountId) * 17.35);
}

function DiagnosisPanel({ updatedAt, accountId }: { updatedAt: string; accountId?: string }) {
  const approvalRate = (96.2 + accountSeed(accountId) % 37 / 10).toFixed(2);
  const isOmni = getAccountDeliveryProfile(accountId).type === "omni";
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-base font-bold italic text-[#1d2129]">
            专属<span className="bg-[linear-gradient(135deg,#1e62ff,#ff5757)] bg-clip-text text-transparent">诊断</span>建议
          </span>
          <span className="text-[13px] text-[#86909c]">为更好的投放，我们建议你：</span>
        </div>
        <span className="text-xs text-[#86909c]">更新于：{updatedAt}</span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <SuggestionCard
          title="一键托管全店，提升店铺生意"
          description="系统自动筛选店铺可投的潜力商品和抖音号，投放即享"
          action="立即投放"
          extra={<button className="text-xs font-normal text-[#1677ff]">🌐 了解更多</button>}
          tags={[
            { label: "保障福利", tone: "green" },
            { label: "智能优惠券", tone: "red" },
          ]}
        />
        <SuggestionCard
          title="素材审核通过率正常"
          description={
            <>
              您的账户近七日素材通过率 <span className="font-medium text-[#1d2129]">{approvalRate}%</span>，高于同行平均水平，可关注行业审核规则指南
            </>
          }
          action="查看详情"
        />
        <SuggestionCard
          title={isOmni ? "全域投放运行稳定" : "申请抖音号商品全域推广权限"}
          description={isOmni ? "当前账号已开通全域投放，系统正持续优化付费与自然流量。" : "您还缺少合作抖音号商品全域权限，立即申请开启省心高效投放"}
          action={isOmni ? "查看全域数据" : "立即申请"}
          tags={[{ label: isOmni ? "全域账户" : "同行成单量约+20~30%", tone: "blue" }]}
        />
      </div>
    </Card>
  );
}

function DataBrief({ accountId, today }: { accountId?: string; today: string }) {
  const brief = useMemo(() => buildAccountBrief(accountId, today), [accountId, today]);
  const peerColor = brief?.peerDirection === "up"
    ? "text-[#f53f3f]"
    : brief?.peerDirection === "down"
      ? "text-[#07962e]"
      : "text-[#4e5969]";

  return (
    <section className="relative z-[1] flex min-h-[68px] items-center rounded-xl border border-[#91bcff] bg-[#f1f6ff] px-5 text-[13px] text-[#4e5969]">
      <Image src="/sites/qianchuan/floatball.png" alt="" width={22} height={22} className="mr-2 h-[22px] w-[22px] object-contain" />
      <strong className="mr-4 shrink-0 text-base text-[#1d2129]">数据简报</strong>
      <p className="min-w-0">
        近7日，您的账户消耗 <strong className="text-base text-[#3d4757]">{brief?.spend ?? "--"}元</strong>，其中整体支付ROI
        {brief?.roiTrend ?? "--"}，{brief?.peerRelation ?? "--"}智能家居同行均值
        <strong className={`ml-1 text-base ${peerColor}`}>{brief?.peerDifference ?? "--"}</strong>。
      </p>
      <button className="ml-auto shrink-0 rounded-full bg-white px-5 py-2 text-[#165dff] shadow-sm">查看详情</button>
    </section>
  );
}

const getServerAccount = () => null;

export default function HomePage() {
  const currentTime = useCurrentTime();
  const account = useSyncExternalStore(subscribeToActiveDemoAccount, getActiveDemoAccount, getServerAccount);

  return (
    <>
      <PlatformHeader active="首页" />

      <div className="flex flex-col gap-5 bg-[linear-gradient(110deg,#f0f5ff,#deebff)] px-4 py-4 lg:flex-row lg:px-[30px]">
        {/* 左主列 */}
        <main className="min-w-0 flex-1 space-y-[30px]">
          <div className="space-y-4">
            <NoticeBar />
          <CampaignBanner timestamp={currentTime.timestamp} />
          </div>

          <DiagnosisPanel updatedAt={currentTime.label} accountId={account?.accountId} />

          {/* 数据简报 + 数据概览（交互） */}
          <div className="space-y-0">
            <DataBrief accountId={account?.accountId} today={currentTime.today} />
            <div className="-mt-px">
              <DataOverview accountId={account?.accountId} />
            </div>
          </div>

          {/* 更多投放机会 */}
          <Card className="p-5">
            <h2 className="text-base font-semibold text-[#1d2129]">更多投放机会</h2>
            <div className="mt-4 grid grid-cols-2 gap-8 rounded-lg border border-[#eef0f3] p-6">
              {/* 左：全域投放 */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2a55e5]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="m5 12 14-7-5 14-2.5-5.5z" strokeLinejoin="round"/></svg>
                  </span>
                  <span className="text-lg font-bold italic text-[#1d2129]">
                    全域投放，助力<span className="text-[#2a55e5]">生意爆发</span>
                  </span>
                  <span className="text-[13px] text-[#86909c]">打通付费和自然流量，放大直播生意</span>
                </div>
                <div className="mt-6 flex gap-8">
                  {FEATURES.map((f) => (
                    <div key={f.text} className="flex items-start gap-2">
                      <Image src={f.icon} alt="" width={22} height={22} />
                      <span className="whitespace-pre-line text-[13px] leading-5 text-[#4e5969]">{f.text}</span>
                    </div>
                  ))}
                </div>
                <button className="mt-6 w-full rounded bg-[#2a55e5] py-2.5 text-sm text-white">创建全域投放</button>
              </div>
              {/* 右：GMV 对比图 */}
              <div>
                <div className="text-center text-lg font-bold text-[#2a55e5]">完成有效投放，效果才更显著</div>
                <div className="mt-1 flex justify-center gap-4 text-xs text-[#86909c]">
                  <span>⊘ 不超过系统推荐ROI目标</span>
                  <span>⊘ 投放消耗至少200元</span>
                  <span>⊘ 投放时长大于直播时长一半</span>
                </div>
                <svg viewBox="0 0 400 150" className="mt-3 w-full">
                  <text x="8" y="30" fontSize="11" fill="#86909c">GMV效果</text>
                  <line x1="30" y1="20" x2="30" y2="130" stroke="#e5e6eb" />
                  <line x1="30" y1="130" x2="390" y2="130" stroke="#e5e6eb" />
                  <path d="M30 128 C150 125 250 110 390 35" fill="none" stroke="#2a55e5" strokeWidth="2.5" strokeDasharray="2 3" />
                  <path d="M30 128 C150 122 250 118 390 100" fill="none" stroke="#7fd4c9" strokeWidth="2.5" />
                  <text x="170" y="78" fontSize="11" fill="#2a55e5" className="font-medium">持续有效投放</text>
                  <text x="300" y="112" fontSize="10" fill="#86909c">未持续有效投放</text>
                </svg>
              </div>
            </div>
          </Card>

          {/* 页脚 */}
          <footer className="py-6 text-center text-xs leading-6 text-[#a8acb3]">
            <p>营业执照　沪ICP备2021017807号-10　增值电信业务经营许可证：沪B2-20220149　沪公网安备31011002006450号　沪网药信备字〔2025〕00219号</p>
            <p>（沪）网械平台备字〔2022〕第00002号　（沪）网药平台备字：〔2023〕第000004-007号　沪集邮备006　沪网食备0000515号（第三方平台）</p>
            <p>Copyright ©2026 上海格物致品网络科技有限公司 All rights reserved.</p>
          </footer>
        </main>

        {/* 右侧栏 */}
        <aside className="w-full shrink-0 space-y-4 lg:w-[300px] min-[1700px]:w-[400px]">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-[#1d2129]">我的资金</span>
              <a className="text-xs text-[#86909c]">账户明细 ›</a>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[13px] text-[#86909c]">账户余额 ⓘ</span>
              <span className="text-base font-semibold text-[#1d2129]">{account?.balance ?? FUNDS.balance} <span className="text-xs font-normal">元</span></span>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-base font-semibold text-[#1d2129]">活动福利</span>
              <a className="text-xs text-[#86909c]">福利明细 ›</a>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[13px] text-[#86909c]">福利可用总余额(元) ⓘ</span>
              <span className="text-base font-semibold text-[#1d2129]">{accountWelfare(account?.accountId)} <span className="text-xs font-normal">元</span></span>
            </div>

            <button className="mt-4 w-full rounded bg-[#2a55e5] py-2.5 text-sm text-white">立即充值</button>
          </Card>

          <Card className="p-5">
            <div className="text-base font-semibold text-[#1d2129]">平台动态</div>
            <ul className="mt-3 space-y-3">
              {PLATFORM_NEWS.map((n) => (
                <li key={n.text} className="flex items-center gap-2 text-[13px]">
                  <span className="rounded bg-[#eef2ff] px-1.5 py-0.5 text-[11px] text-[#2a55e5]">{n.tag}</span>
                  <span className="truncate text-[#4e5969]">{n.text}</span>
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>
    </>
  );
}
