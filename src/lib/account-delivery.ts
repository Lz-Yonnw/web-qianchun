export type AccountDeliveryType = "standard" | "omni";

export interface StandardDeliveryShares {
  product: number;
  live: number;
  shop: number;
}

export interface AccountDeliveryProfile {
  type: AccountDeliveryType;
  standardShares: StandardDeliveryShares;
  douyin?: {
    id: string;
    name: string;
    avatar: string;
  };
}

const STANDARD_PRODUCT: StandardDeliveryShares = { product: 1, live: 0, shop: 0 };

export const ACCOUNT_DELIVERY_PROFILES: Record<string, AccountDeliveryProfile> = {
  "1865682360240256": { type: "standard", standardShares: { product: 0, live: 0.9, shop: 0.1 } },
  "1704795962067971": {
    type: "omni",
    standardShares: STANDARD_PRODUCT,
    douyin: { id: "3528342315", name: "猫千岁官方旗舰店", avatar: "/sites/qianchuan/douyin-maoqiansui.png" },
  },
  "1696541369393160": {
    type: "omni",
    standardShares: STANDARD_PRODUCT,
    douyin: { id: "3596078129", name: "西贡官方旗舰店", avatar: "/sites/qianchuan/douyin-xigong.png" },
  },
  "1851377284049928": { type: "standard", standardShares: STANDARD_PRODUCT },
  "1862077982447620": {
    type: "omni",
    standardShares: STANDARD_PRODUCT,
    douyin: { id: "58318847965", name: "宇峰食品旗舰店", avatar: "/sites/qianchuan/douyin-yufeng.png" },
  },
  "1756518564967436": { type: "standard", standardShares: STANDARD_PRODUCT },
  "1811334523345929": { type: "standard", standardShares: { product: 0, live: 0.9, shop: 0.1 } },
  "1793490092342336": { type: "standard", standardShares: { product: 0, live: 0.8, shop: 0.2 } },
  "1823130023073049": { type: "standard", standardShares: { product: 0, live: 0.85, shop: 0.15 } },
};

const DEFAULT_PROFILE: AccountDeliveryProfile = {
  type: "standard",
  standardShares: STANDARD_PRODUCT,
};

export function getAccountDeliveryProfile(accountId?: string) {
  return accountId ? ACCOUNT_DELIVERY_PROFILES[accountId] ?? DEFAULT_PROFILE : DEFAULT_PROFILE;
}

export function getStandardSubTabShare(accountId: string | undefined, subTabIndex: number) {
  const shares = getAccountDeliveryProfile(accountId).standardShares;
  return [1, shares.product, shares.live, shares.shop][subTabIndex] ?? 1;
}
