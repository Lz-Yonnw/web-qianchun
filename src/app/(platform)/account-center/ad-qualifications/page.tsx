"use client";

import Image from "next/image";
import { useRef, useState, useSyncExternalStore } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  MoveHorizontal,
  MoveVertical,
  RotateCcw,
  RotateCw,
  Undo2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  getAccountQualificationProfile,
  maskQualificationPhone,
  maskQualificationRepresentative,
  qualificationCertificateType,
  type AccountQualificationProfile,
} from "@/lib/account-qualifications";
import { getActiveDemoAccount, subscribeToActiveDemoAccount } from "@/lib/demo-accounts";
import styles from "./page.module.css";

type IconName = "subject" | "verification" | "seal" | "delivery";

function CardIcon({ name }: { name: IconName }) {
  if (name === "subject") {
    return (
      <svg viewBox="0 0 72 72" aria-hidden="true">
        <defs>
          <linearGradient id="subject-sheet" x1="11" y1="8" x2="48" y2="63" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F6FAFF" />
            <stop offset=".52" stopColor="#C5E0FF" />
            <stop offset="1" stopColor="#83B9FA" />
          </linearGradient>
          <linearGradient id="subject-back" x1="34" y1="22" x2="63" y2="59" gradientUnits="userSpaceOnUse">
            <stop stopColor="#68BDFF" />
            <stop offset=".48" stopColor="#3281F9" />
            <stop offset="1" stopColor="#1857E8" />
          </linearGradient>
        </defs>
        <path d="M35 21.5 55 25c4 .7 6.5 3.6 6.5 7.2v26.3c0 2.5-2 4.5-4.5 4.5H35V21.5Z" fill="url(#subject-back)" />
        <path d="M15.5 13.5 39 10.2c4.3-.6 7.2 2 7.2 6.3V59c0 3-2.1 5-5.1 5H15.5c-3 0-5-2-5-5V19c0-3 2-5.1 5-5.5Z" fill="url(#subject-sheet)" />
        <path d="M17 16.5 38.8 13.4c2.5-.4 4.3 1 4.3 3.7v38.4" fill="none" stroke="#FFF" strokeOpacity=".42" strokeWidth="1.2" />
        <rect x="19" y="28" width="20" height="5.5" rx="2.75" fill="#FFF" />
        <rect x="19" y="39" width="20" height="5.5" rx="2.75" fill="#FFF" />
      </svg>
    );
  }
  if (name === "verification") {
    return (
      <svg viewBox="0 0 72 72" aria-hidden="true">
        <defs>
          <linearGradient id="wallet-card" x1="19" y1="16" x2="57" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2191FF" />
            <stop offset="1" stopColor="#2454E9" />
          </linearGradient>
          <linearGradient id="wallet-body" x1="12" y1="29" x2="58" y2="61" gradientUnits="userSpaceOnUse">
            <stop stopColor="#EAF6FF" />
            <stop offset=".56" stopColor="#C3E0FF" />
            <stop offset="1" stopColor="#8DBEFF" />
          </linearGradient>
          <linearGradient id="wallet-clasp" x1="43" y1="36" x2="64" y2="52" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E9F5FF" />
            <stop offset="1" stopColor="#A9D0FF" />
          </linearGradient>
        </defs>
        <path d="M18 24.5 51.5 16c3-.8 5.5 1.3 5.5 4.3v13.3H18V24.5Z" fill="url(#wallet-card)" />
        <path d="M14.5 28.5h40c4.7 0 7.5 2.8 7.5 7.5v18c0 4-3 7-7 7H14.5c-4.2 0-7.5-3.3-7.5-7.5V36c0-4.2 3.3-7.5 7.5-7.5Z" fill="url(#wallet-body)" />
        <path d="M44.5 36H64v17H44.5a8.5 8.5 0 0 1 0-17Z" fill="url(#wallet-clasp)" stroke="#D4E9FF" />
        <circle cx="48" cy="44.5" r="3.2" fill="#FFF" />
        <path d="M12.5 32.5h38" stroke="#FFF" strokeOpacity=".55" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "seal") {
    return (
      <svg viewBox="0 0 72 72" aria-hidden="true">
        <defs>
          <linearGradient id="seal-orb" x1="20" y1="10" x2="53" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A8D4FF" />
            <stop offset=".45" stopColor="#4A92F7" />
            <stop offset="1" stopColor="#244FE4" />
          </linearGradient>
          <linearGradient id="seal-stem" x1="22" y1="31" x2="50" y2="61" gradientUnits="userSpaceOnUse">
            <stop stopColor="#EDF7FF" />
            <stop offset="1" stopColor="#A9CEFF" />
          </linearGradient>
        </defs>
        <circle cx="38.5" cy="23.5" r="15.5" fill="url(#seal-orb)" />
        <path d="M24.5 23.5c0-7.7 6.2-14 14-14 3.2 0 6.1 1.1 8.5 2.9-2.1-1-4.4-1.5-6.8-1.5-8.8 0-15.9 7.1-15.9 15.9 0 2.2.4 4.2 1.2 6.1a13.8 13.8 0 0 1-1-9.4Z" fill="#DDF0FF" fillOpacity=".78" />
        <path d="M26 23.5a8.5 8.5 0 0 1 8.5-8.5" fill="none" stroke="#FFF" strokeWidth="4" strokeLinecap="round" />
        <path d="M29 34.5h19l4 15.5H25l4-15.5Z" fill="url(#seal-stem)" />
        <rect x="14" y="48" width="44" height="11" rx="4" fill="url(#seal-stem)" />
        <rect x="10" y="58" width="52" height="7" rx="3.5" fill="#B4D5FF" />
        <path d="M18 51.5h36" stroke="#FFF" strokeOpacity=".48" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 72 72" aria-hidden="true">
      <defs>
        <linearGradient id="screen-panel" x1="10" y1="10" x2="60" y2="55" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EDF8FF" />
          <stop offset=".52" stopColor="#C3E0FF" />
          <stop offset="1" stopColor="#81B7FA" />
        </linearGradient>
        <linearGradient id="screen-base" x1="25" y1="51" x2="49" y2="66" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3782FF" />
          <stop offset="1" stopColor="#2251DF" />
        </linearGradient>
      </defs>
      <rect x="8" y="10" width="56" height="43" rx="7" fill="url(#screen-panel)" />
      <rect x="11" y="13" width="50" height="37" rx="5" fill="#D8EBFF" fillOpacity=".2" stroke="#FFF" strokeOpacity=".32" />
      <path d="m20 39.5 10.5-10 8.5 7 12.5-13 7 5.7" fill="none" stroke="#FFF" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28 52h17.5L52 61.5c1.1 1.7-.1 3.5-2.1 3.5H23.6c-2.1 0-3.2-1.9-2-3.6L28 52Z" fill="url(#screen-base)" />
    </svg>
  );
}

const CARDS: Array<{
  title: string;
  icon: IconName;
  certified?: boolean;
  lines: string[];
  action: string;
}> = [
  {
    title: "主体资质",
    icon: "subject",
    certified: true,
    lines: ["企业身份请提前准备好营业执照", "个人身份请提前准备好个人身份证"],
    action: "查看",
  },
  {
    title: "对公验证",
    icon: "verification",
    certified: true,
    lines: ["适用于企业身份", "可法定代表人/经营者人脸识别或银行打款或账户授权完成核验"],
    action: "查看",
  },
  {
    title: "申请电子签章",
    icon: "seal",
    lines: ["完成数字证书和电子签章申请，可进行电子合同签署", "法定代表人/代理人可申请，请提前准备好身份证"],
    action: "去认证",
  },
  {
    title: "投放资质",
    icon: "delivery",
    lines: ["根据营销投放需要上传资质证明，如明星肖像授权书、商标证、证明材料", "提交成功后，预计24小时内审核完毕"],
    action: "查看",
  },
];

function QualificationCard({ card, onOpen }: { card: (typeof CARDS)[number]; onOpen?: () => void }) {
  return (
    <article className={styles.card}>
      <div className={styles.cardIcon}><CardIcon name={card.icon} /></div>
      <div className={styles.cardBody}>
        <div className={styles.cardHeading}>
          <h3>{card.title}</h3>
          {card.certified && <span>已认证</span>}
        </div>
        <ul>
          {card.lines.map((line) => <li key={line}>{line}</li>)}
        </ul>
        <button type="button" data-auth-required={onOpen ? undefined : ""} onClick={onOpen}>{card.action}</button>
      </div>
      <button type="button" data-auth-required className={styles.help}>
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2.5a6.2 6.2 0 0 0-4.6 10.4v2.2c0 .7.6 1.3 1.3 1.3h1.6v-4.1H6.5a4.7 4.7 0 1 1 7 0h-1.8v4.1h1.6c.7 0 1.3-.6 1.3-1.3V13A6.2 6.2 0 0 0 10 2.5Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M8.2 17.5h3.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        如何认证
      </button>
    </article>
  );
}

function LicenseThumbnail({
  profile,
  onOpen,
}: {
  profile: AccountQualificationProfile;
  onOpen: () => void;
}) {
  return (
    <button type="button" className={styles.licenseThumb} onClick={onOpen} aria-label={`查看${profile.companyName}营业执照`}>
      <Image src={profile.licenseImage} alt={`${profile.companyName}营业执照`} width={150} height={150} sizes="150px" />
      <span>点击查看</span>
    </button>
  );
}

function LicensePreview({ profile, onClose }: { profile: AccountQualificationProfile; onClose: () => void }) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  function resetView() {
    setZoom(1);
    setRotation(0);
  }

  return (
    <aside className={styles.licensePreview} role="dialog" aria-modal="false" aria-label={`${profile.companyName}营业执照预览`}>
      <div className={styles.previewCounter}>一共 1 张，当前第 1 张</div>
      <button type="button" className={styles.previewClose} onClick={onClose} aria-label="关闭营业执照预览">×</button>
      <div className={styles.previewImage}>
        <Image
          src={profile.licenseImage}
          alt={`${profile.companyName}营业执照大图`}
          fill
          sizes="(max-width: 1500px) calc(100vw - 250px), calc(100vw - 310px)"
          priority
          style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
        />
      </div>
      <div className={styles.previewToolbar} aria-label="营业执照查看工具">
        <button type="button" title="放大" aria-label="放大" onClick={() => setZoom((value) => Math.min(2.5, value + 0.15))}><ZoomIn /></button>
        <button type="button" title="缩小" aria-label="缩小" onClick={() => setZoom((value) => Math.max(.45, value - 0.15))}><ZoomOut /></button>
        <button type="button" title="向左旋转90°" aria-label="向左旋转90度" onClick={() => setRotation((value) => value - 90)}><RotateCcw /></button>
        <button type="button" title="向右旋转90°" aria-label="向右旋转90度" onClick={() => setRotation((value) => value + 90)}><RotateCw /></button>
        <button type="button" title="还原" aria-label="还原" onClick={resetView}><Undo2 /></button>
        <button type="button" title="上一张" aria-label="上一张" disabled><ChevronLeft /></button>
        <button type="button" title="下一张" aria-label="下一张" disabled><ChevronRight /></button>
        <button type="button" title="适应宽度" aria-label="适应宽度" onClick={() => setZoom(1.08)}><MoveHorizontal /></button>
        <button type="button" title="适应高度" aria-label="适应高度" onClick={() => setZoom(.92)}><MoveVertical /></button>
        <button type="button" title="适应窗口" aria-label="适应窗口" onClick={resetView}><Maximize2 /></button>
        <a href={profile.licenseImage} download title="下载" aria-label="下载营业执照"><Download /></a>
      </div>
      <div className={styles.previewThumb} aria-hidden="true">
        <Image src={profile.licenseImage} alt="" fill sizes="52px" />
      </div>
    </aside>
  );
}

function SubjectDetails({ profile, onBack }: { profile: AccountQualificationProfile; onBack: () => void }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const rows = [
    ["公司名称", profile.companyName],
    ["证件类型", qualificationCertificateType(profile)],
    ["营业执照类型", "纸质营业执照"],
  ];

  return (
    <>
      <div className={styles.detailTitleBar}>
        <button type="button" onClick={onBack} aria-label="返回认证中心">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m12.5 4-6 6 6 6M7 10h9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <h1>主体资质</h1>
      </div>
      <section className={styles.details}>
        <div className={styles.detailHeading}>
          <h2>主体资质</h2>
          <button type="button" data-auth-required>修改主体资质</button>
        </div>
        <div className={styles.approved}>
          <span className={styles.check}>✓</span>
          <strong>主体资质审核已通过。</strong>
          <button type="button" data-auth-required>
            <svg viewBox="0 0 18 18" aria-hidden="true"><path d="M4 3.5h8v7.2L9 14H4V3.5Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="m7 7 1.3 1.3L11 5.7M9 14v-3.3h3" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            审核评价
          </button>
        </div>
        <dl className={styles.detailList}>
          {rows.map(([label, value]) => (
            <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
          ))}
          <div className={styles.photoRow}><dt>营业执照照片</dt><dd><LicenseThumbnail profile={profile} onOpen={() => setPreviewOpen(true)} /></dd></div>
          <div><dt>统一社会信用代码</dt><dd>{profile.licenseNumber}</dd></div>
          <div><dt>证件有效日期</dt><dd>{profile.certificateValidity}</dd></div>
          <div><dt>注册地</dt><dd>{profile.registeredAddress}</dd></div>
          <div><dt>法定代表人/经营者</dt><dd>{maskQualificationRepresentative(profile.representative)}</dd></div>
        </dl>
      </section>
      <div className={styles.detailFooter}>
        <button type="button" onClick={onBack}>回认证首页</button>
      </div>
      {previewOpen && <LicensePreview profile={profile} onClose={() => setPreviewOpen(false)} />}
    </>
  );
}

function EmptyCertificateIllustration() {
  return (
    <svg className={styles.emptyIllustration} viewBox="0 0 240 150" aria-hidden="true">
      <path d="M64 94 113 68l61 28-50 29-60-31Z" fill="#fff" stroke="#59606a" strokeWidth="1.5"/>
      <path d="m113 68 12 57M64 94v25l60 28 50-29V96" fill="#fff" stroke="#59606a" strokeWidth="1.5"/>
      <path d="M90 105v28l14 7v-28l-14-7Zm19 9v28l14 6v-28l-14-6Z" fill="#54ded0"/>
      <path d="M131 119v24l15-8v-24l-15 8Zm20-11v24l9-5v-24l-9 5Z" fill="#f8fafc" stroke="#59606a" strokeWidth="1"/>
      <path d="M115 68 142 38l58 5-28 53-57-28Z" fill="#fff" stroke="#59606a" strokeWidth="1.5"/>
      <path d="m122 65 25-21 44 4-20 39-49-22Z" fill="#fff" stroke="#a6abb2" strokeWidth="1"/>
      <path d="M81 88c-6-14 1-29 18-31 15-2 18-14 12-23" fill="none" stroke="#7e848d" strokeWidth="1.2" strokeDasharray="4 4"/>
      <path d="M174 75c24 5 35 18 27 30-5 8-15 11-26 13" fill="none" stroke="#7e848d" strokeWidth="1.2"/>
      <circle cx="61" cy="74" r="4" fill="#3159ea"/><circle cx="204" cy="83" r="4" fill="#50ddce"/><circle cx="197" cy="128" r="4" fill="#3159ea"/>
      <path d="m44 121 4 2 2 5 2-5 5-2-5-2-2-5-2 5-4 2Z" fill="#323335"/>
    </svg>
  );
}

function SignatureDetails({ onBack }: { onBack: () => void }) {
  return (
    <>
      <div className={styles.detailTitleBar}>
        <button type="button" onClick={onBack} aria-label="返回认证中心">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m12.5 4-6 6 6 6M7 10h9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <h1>申请电子签章</h1>
      </div>

      <section className={styles.reminder}>
        <div className={styles.reminderIcon}>
          <svg viewBox="0 0 54 54" aria-hidden="true"><defs><linearGradient id="reminder-gradient" x1="5" y1="7" x2="48" y2="49"><stop stopColor="#2459e8"/><stop offset="1" stopColor="#a8c9ff"/></linearGradient></defs><circle cx="27" cy="27" r="26" fill="url(#reminder-gradient)"/><path d="M19 20h13l6 7-6 7H19l-4-7 4-7Z" fill="white"/><path d="m34 22 8 5-8 5" fill="none" stroke="#dceaff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div>
          <h2>重要提醒</h2>
          <p>根据工信部监管要求，2026年10月30日起数字证书须满足“一证一核验”要求。您必须先申请数字证书，才能使用电子签章进行电子合同签署。 <button type="button" data-auth-required>查看详情</button></p>
          <p>当前系统检测到您没有可用的数字证书，请您尽快点击“申请电子签章”前往申请，审核通过后您将获得数字证书和一份新的电子签章，以保障您在10月30日后正常签署电子合同。</p>
        </div>
      </section>

      <section className={styles.certificateSummary}>
        <h2>数字证书</h2>
        <div className={styles.rule} />
        <div className={styles.certName}>南康区巧屋优选家具销售中心 <span>待申请</span></div>
        <p>暂无可用的数字证书，请您尽快点击“申请电子签章”前往申请。审核通过后您将获得数字证书和一份新的电子签章。</p>
      </section>

      <section className={styles.applicationPanel}>
        <div className={styles.applicationTopline}>
          <button type="button" data-auth-required>申请电子签章</button>
          <p>目前“南康区巧屋优选家具销售中心”可使用的电子签章共：0 个，2026.10.30后可用签章数为0个</p>
        </div>
        <div className={styles.tableHeader}>
          <span>申请人姓名</span><span>签约手机号码</span><span>身份</span><span>平台类型</span><span>账户ID</span><span>申请时间</span><span>状态</span><span>操作</span>
        </div>
        <div className={styles.emptyState}>
          <EmptyCertificateIllustration />
          <span>暂无数据</span>
        </div>
      </section>
    </>
  );
}

function DeliveryQualificationDetails({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<"product" | "qualification">("product");
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("");
  const [audit, setAudit] = useState("");

  function resetFilters() {
    setQuery("");
    setIndustry("");
    setAudit("");
  }

  return (
    <>
      <section className={styles.deliveryFilters}>
        <div className={styles.deliveryHeading}>
          <div className={styles.deliveryTitle}>
            <button type="button" onClick={onBack} aria-label="返回认证中心">
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m12.5 4-6 6 6 6M7 10h9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <h1>投放资质</h1>
          </div>
          <button type="button" data-auth-required className={styles.manualLink}>
            <svg viewBox="0 0 18 18" aria-hidden="true"><rect x="3" y="2" width="11" height="14" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M6 6h5M6 9h5M6 12h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
            操作手册
          </button>
        </div>
        <div className={styles.deliveryDivider} />
        <div className={styles.filterRow}>
          <div className={styles.segmented}>
            <button type="button" className={mode === "product" ? styles.selected : ""} onClick={() => setMode("product")}>按营销产品</button>
            <button type="button" className={mode === "qualification" ? styles.selected : ""} onClick={() => setMode("qualification")}>按资质类型</button>
          </div>
          <label className={styles.searchBox}>
            <svg viewBox="0 0 18 18" aria-hidden="true"><circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="m12.2 12.2 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="输入产品名称/描述/资质ID" />
          </label>
          <label className={styles.selectBox}>行业类型：
            <select value={industry} onChange={(event) => setIndustry(event.target.value)} aria-label="行业类型">
              <option value="">行业类型</option><option value="家具">家具</option>
            </select>
          </label>
          <label className={styles.selectBox}>审核状态：
            <select value={audit} onChange={(event) => setAudit(event.target.value)} aria-label="审核状态">
              <option value="">选择审核状态</option><option value="通过">审核通过</option><option value="审核中">审核中</option>
            </select>
          </label>
          <button type="button" data-auth-required className={styles.allFilters}>
            <svg viewBox="0 0 18 18" aria-hidden="true"><path d="M2.5 3.5h13l-5 5.7v4.4l-3 1V9.2l-5-5.7Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>
            所有筛选
          </button>
        </div>
        <button type="button" className={styles.resetFilters} onClick={resetFilters}>重置</button>
      </section>

      <section className={styles.deliveryTablePanel}>
        <div className={styles.deliveryActions}>
          <button type="button" data-auth-required className={styles.addQualification}>＋ 新增资质</button>
          <button type="button" data-auth-required className={styles.disabledAction}>⌘ 从共享资质库选择</button>
          <button type="button" data-auth-required className={styles.groupAction}>分组管理 <span>⌄</span></button>
          <button type="button" data-auth-required className={styles.disabledAction}>批量操作 <span>⌄</span></button>
          <button type="button" data-auth-required className={styles.protocolLink}>
            <svg viewBox="0 0 18 18" aria-hidden="true"><rect x="3" y="2" width="11" height="14" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.4"/><path d="M6 12h5M6 9h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            电子协议中心
          </button>
        </div>
        <div className={styles.updateNotice}>
          <span>i</span>
          <p><strong>功能上新</strong> 针对 <b>审核通过</b> 的营销产品资质支持快速复制一组并新增，无需重复上传相同的基础资质，您可以通过列表操作中的 <b>复制</b> 完成</p>
          <button type="button" aria-label="关闭提示">×</button>
        </div>
        <div className={styles.deliveryTableWrap}>
          <div className={styles.deliveryTableHeader}>
            <span><i /></span><span>资质</span><span>所属行业</span><span>审核状态</span><span>资质有效期</span><span>分组</span><span>加入共享资质库</span><span>操作</span>
          </div>
          <div className={styles.tableScrollBar}><span /></div>
          <div className={styles.deliveryEmpty}>
            <EmptyCertificateIllustration />
            <span>暂无相关资质</span>
          </div>
        </div>
      </section>
    </>
  );
}

function CorporateVerificationDetails({ profile, onBack }: { profile: AccountQualificationProfile; onBack: () => void }) {
  const rows = [
    ["验证方式", "授权验证"],
    ["验证类型", profile.entityType],
    ["公司名称", profile.companyName],
    ["授权账户", `${maskQualificationPhone(profile.phone)}（抖店商家后台）`],
    ["通过时间", profile.approvedAt],
  ];

  return (
    <>
      <div className={styles.detailTitleBar}>
        <button type="button" onClick={onBack} aria-label="返回认证中心">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m12.5 4-6 6 6 6M7 10h9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <h1>对公验证</h1>
      </div>
      <section className={styles.verificationDetails}>
        <div className={styles.detailHeading}>
          <h2>对公验证</h2>
          <button type="button" data-auth-required>重新发起验证</button>
        </div>
        <div className={styles.approved}>
          <span className={styles.check}>✓</span>
          <strong>对公验证已通过。</strong>
        </div>
        <dl className={styles.verificationList}>
          {rows.map(([label, value]) => (
            <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
          ))}
          <div>
            <dt className={styles.expiryLabel}>有效期至 <span title="对公验证有效期">i</span></dt>
            <dd>9999-12-31 23:59:59</dd>
          </div>
        </dl>
      </section>
      <div className={styles.detailFooter}>
        <button type="button" onClick={onBack}>回认证首页</button>
      </div>
    </>
  );
}

export default function AdQualificationsPage() {
  const [panel, setPanel] = useState<"overview" | "subject" | "verification" | "signature" | "delivery">("overview");
  const mainRef = useRef<HTMLDivElement>(null);
  const activeAccount = useSyncExternalStore(subscribeToActiveDemoAccount, getActiveDemoAccount, () => null);
  const profile = getAccountQualificationProfile(activeAccount?.accountId);

  function showPanel(nextPanel: "overview" | "subject" | "verification" | "signature" | "delivery") {
    setPanel(nextPanel);
    requestAnimationFrame(() => mainRef.current?.scrollTo({ top: 0, behavior: "auto" }));
  }

  return (
    <div ref={mainRef} className={styles.main}>
          {panel === "subject" ? (
            <SubjectDetails profile={profile} onBack={() => showPanel("overview")} />
          ) : panel === "verification" ? (
            <CorporateVerificationDetails profile={profile} onBack={() => showPanel("overview")} />
          ) : panel === "signature" ? (
            <SignatureDetails onBack={() => showPanel("overview")} />
          ) : panel === "delivery" ? (
            <DeliveryQualificationDetails onBack={() => showPanel("overview")} />
          ) : (
            <>
              <div className={styles.titleBar}><h1>认证中心</h1></div>
              <section className={styles.content}>
                <h2><span />客户入驻</h2>
                <div className={styles.grid}>
                  <QualificationCard card={CARDS[0]} onOpen={() => showPanel("subject")} />
                  <QualificationCard card={CARDS[1]} onOpen={() => showPanel("verification")} />
                </div>
                <h2 className={styles.secondaryTitle}><span />补充资质</h2>
                <div className={styles.grid}>
                  <QualificationCard card={CARDS[2]} onOpen={() => showPanel("signature")} />
                  <QualificationCard card={CARDS[3]} onOpen={() => showPanel("delivery")} />
                </div>
              </section>
            </>
          )}
    </div>
  );
}
