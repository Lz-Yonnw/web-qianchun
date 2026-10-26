"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { ExternalLink, HelpCircle, Link2, Mail, Smartphone } from "lucide-react";
import { AccountAvatar } from "@/components/sites/qianchuan/AccountAvatar";
import { getActiveDemoAccount, maskPhone, subscribeToActiveDemoAccount } from "@/lib/demo-accounts";
import styles from "./page.module.css";

const DEFAULT_ACCOUNT = {
  name: "巧屋家具精选铺-ZJ",
  subject: "南康区巧屋优选家具销售中心",
  shop: "巧屋家具精选铺",
  shopId: "54577360",
  email: "-",
  phone: "136****1535",
  permission: "可操作",
  adAccountId: "1823130023073049",
};

const AGREEMENTS = ["巨量千川平台服务协议", "巨量千川隐私政策", "巨量引擎工作台账户管理服务协议"];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <section className={styles.field}><div className={styles.label}>{label}</div>{children}</section>;
}

export default function AccountInfoPage() {
  const activeAccount = useSyncExternalStore(subscribeToActiveDemoAccount, getActiveDemoAccount, () => null);
  const account = activeAccount ? {
    name: activeAccount.storeName,
    subject: activeAccount.companyName,
    shop: activeAccount.storeName,
    shopId: activeAccount.accountId.slice(-8),
    email: "-",
    phone: maskPhone(activeAccount.phone),
    permission: "可操作",
    adAccountId: activeAccount.accountId,
  } : DEFAULT_ACCOUNT;

  return (
    <div className={styles.main}>
      <div className={styles.titleBar}><h1>账户信息</h1></div>
      <div className={styles.content}>
        <div className={styles.form}>
          <Field label="账户名称">
            <div>{account.name}<button type="button" data-auth-required className={styles.link}>修改</button></div>
          </Field>
          <Field label="主体名称"><div>{account.subject}</div></Field>
          <Field label="绑定店铺">
            <div className={styles.shopCard}>
              <AccountAvatar accountId={account.adAccountId} name={account.shop} size={48} square />
              <div><div>{account.shop}</div><div className={styles.muted}>ID:{account.shopId}</div></div>
            </div>
            <div className={styles.accountId}>当前可投商城的账户ID：{account.adAccountId}</div>
          </Field>
          <Field label="我的角色">
            <button type="button" data-auth-required className={styles.superAdmin}>如何找到千川超管?</button>
            <div className={styles.roleLine}>管理员 <HelpCircle /></div>
            <div className={styles.contactCard}>
              <div><span><Mail />邮箱</span><em>{account.email}</em></div>
              <div><span><Smartphone />手机号</span><em>{account.phone}</em><button type="button" data-auth-required>去修改 <ExternalLink /></button></div>
              <div><span><Link2 />第三方账号</span><Image src="/sites/qianchuan/dy.png" alt="抖音" width={30} height={30} /></div>
            </div>
          </Field>
          <Field label="我的权限"><HelpCircle className={styles.helpIcon} /><div className={styles.fieldValue}>{account.permission}</div></Field>
          <Field label="生意模式标签"><HelpCircle className={styles.helpIcon} /><p className={styles.description}>当前账户还未投放计划或未产生消耗，需要产生消耗后才能产生生意模式标签</p></Field>
          <Field label="签署协议">
            <div className={styles.agreement}><span>✓</span><p>我已阅读并同意 {AGREEMENTS.map((item, index) => <span key={item}><button type="button" data-auth-required>《{item}》</button>{index < AGREEMENTS.length - 1 ? "、" : ""}</span>)}</p></div>
          </Field>
        </div>
      </div>
    </div>
  );
}
