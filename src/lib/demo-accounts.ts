export interface DemoAccount {
  accountId: string;
  storeName: string;
  companyName: string;
  phone: string;
  ownerName: string;
  balance: string;
  dailyBudget: string;
  targetRate: string;
}

export const demoAccounts: DemoAccount[] = [
  { accountId: "1865682360240256", storeName: "巧屋家具精选铺", companyName: "南康区巧屋优选家具销售中心", phone: "18720838370", balance: "60,994.60", ownerName: "邓继刚", dailyBudget: "1,250.00", targetRate: "0.20%" },
  { accountId: "1704795962067971", storeName: "主账户猫千岁", companyName: "广西君宝颜食品有限公司", phone: "18778986998", balance: "90,940.80", ownerName: "黄长云", dailyBudget: "155.00", targetRate: "0.70%" },
  { accountId: "1696541369393160", storeName: "西贡官方旗舰店", companyName: "南宁市西贡咖啡食品有限公司", phone: "18076591886", balance: "129,090.40", ownerName: "陈嘉俊", dailyBudget: "50.00", targetRate: "1.50%" },
  { accountId: "1851377284049928", storeName: "广西冰鲜螺蛳粉", companyName: "广西自由森林食品有限公司", phone: "13760158898", balance: "34,009.30", ownerName: "廖小惠", dailyBudget: "39.90", targetRate: "2.00%" },
  { accountId: "1862077982447620", storeName: "宇峰食品专营店-宇峰1", companyName: "广西宇峰食品有限公司", phone: "18070730864", balance: "40,909.50", ownerName: "杨志坚", dailyBudget: "35.00", targetRate: "3.00%" },
  { accountId: "1756518564967436", storeName: "梵佳洛空压机", companyName: "江西梵佳洛智能科技有限公司", phone: "17679311983", balance: "13,890.80", ownerName: "廖祥明", dailyBudget: "8,999.00", targetRate: "0.10%" },
  { accountId: "1811334523345929", storeName: "圆禾家具", companyName: "南康区圆禾家具销售部(个体工商户)", phone: "18070484988", balance: "6,900.30", ownerName: "赖泽洪", dailyBudget: "1,250.00", targetRate: "0.20%" },
  { accountId: "1793490092342336", storeName: "百慕莱千川户", companyName: "南康区华雅严选家具销售部", phone: "18679675560", balance: "5,903.50", ownerName: "廖静", dailyBudget: "1,250.00", targetRate: "0.20%" },
  { accountId: "1823130023073049", storeName: "ZRX-喜来家-QC", companyName: "南康区喜爱屋家具销售部", phone: "15270768027", balance: "3,243.20", ownerName: "赖琴芳", dailyBudget: "1,250.00", targetRate: "0.20%" },
];

const activeAccountKey = "qianchuan-active-account";
const activeAccountChangeEvent = "qianchuan-active-account-change";

export function findDemoAccount(phone: string) {
  return demoAccounts.find((account) => account.phone === phone.trim());
}

export function getActiveDemoAccount() {
  if (typeof window === "undefined") return null;
  const queryAccountId = new URLSearchParams(window.location.search).get("aavid");
  const queryAccount = demoAccounts.find((account) => account.accountId === queryAccountId);
  if (queryAccount) return queryAccount;
  const accountId = window.localStorage.getItem(activeAccountKey);
  return demoAccounts.find((account) => account.accountId === accountId) ?? null;
}

export function subscribeToActiveDemoAccount(listener: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("storage", listener);
  window.addEventListener("popstate", listener);
  window.addEventListener(activeAccountChangeEvent, listener);
  const hydrationTimer = window.setTimeout(listener, 0);

  return () => {
    window.clearTimeout(hydrationTimer);
    window.removeEventListener("storage", listener);
    window.removeEventListener("popstate", listener);
    window.removeEventListener(activeAccountChangeEvent, listener);
  };
}

export function setActiveDemoAccount(accountId: string) {
  window.localStorage.setItem(activeAccountKey, accountId);
  window.dispatchEvent(new Event(activeAccountChangeEvent));
}

export function clearActiveDemoAccount() {
  window.localStorage.removeItem(activeAccountKey);
  window.dispatchEvent(new Event(activeAccountChangeEvent));
}

export function maskPhone(phone: string) {
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}
