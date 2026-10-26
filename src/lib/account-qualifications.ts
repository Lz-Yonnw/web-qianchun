export interface AccountQualificationProfile {
  accountId: string;
  companyName: string;
  licenseNumber: string;
  certificateValidity: string;
  registeredAddress: string;
  approvedAt: string;
  email: string;
  phone: string;
  representative: string;
  entityType: "个体工商户" | "企业";
  licenseImage: string;
}

export const ACCOUNT_QUALIFICATION_PROFILES: Record<string, AccountQualificationProfile> = {
  "1865682360240256": {
    accountId: "1865682360240256",
    companyName: "南康区巧屋优选家具销售中心",
    licenseNumber: "92360782MABPUH6249",
    certificateValidity: "无截止日期",
    registeredAddress: "中国-江西-赣州",
    approvedAt: "2026-05-20 13:02:31",
    email: "未提供",
    phone: "18720838370",
    representative: "邓继刚",
    entityType: "个体工商户",
    licenseImage: "/sites/qianchuan/licenses/92360782MABPUH6249.jpeg",
  },
  "1704795962067971": {
    accountId: "1704795962067971",
    companyName: "广西君宝颜食品有限公司",
    licenseNumber: "91451481MA5NAUCY8M",
    certificateValidity: "无截止日期",
    registeredAddress: "中国-广西-崇左",
    approvedAt: "2020-07-11 14:05:00",
    email: "未提供",
    phone: "18778986998",
    representative: "黄长云",
    entityType: "企业",
    licenseImage: "/sites/qianchuan/licenses/91451481MA5NAUCY8M.png",
  },
  "1696541369393160": {
    accountId: "1696541369393160",
    companyName: "南宁市西贡咖啡食品有限公司",
    licenseNumber: "91450100581996802K",
    certificateValidity: "无截止日期",
    registeredAddress: "中国-广西-南宁",
    approvedAt: "2020-09-21 15:10:00",
    email: "未提供",
    phone: "18076591886",
    representative: "陈嘉俊",
    entityType: "企业",
    licenseImage: "/sites/qianchuan/licenses/91450100581996802K.png",
  },
  "1851377284049928": {
    accountId: "1851377284049928",
    companyName: "广西自由森林食品有限公司",
    licenseNumber: "91450304MAK3CCB63E",
    certificateValidity: "无截止日期",
    registeredAddress: "中国-广西-南宁",
    approvedAt: "2026-06-23 13:09:00",
    email: "未提供",
    phone: "13760158898",
    representative: "廖小惠",
    entityType: "企业",
    licenseImage: "/sites/qianchuan/licenses/91450304MAK3CCB63E.jpeg",
  },
  "1862077982447620": {
    accountId: "1862077982447620",
    companyName: "广西宇峰食品有限公司",
    licenseNumber: "91451423MA5NP6HN6G",
    certificateValidity: "无截止日期",
    registeredAddress: "中国-广西-崇左",
    approvedAt: "2022-10-23 14:04:00",
    email: "未提供",
    phone: "18070730864",
    representative: "杨志坚",
    entityType: "企业",
    licenseImage: "/sites/qianchuan/licenses/91451423MA5NP6HN6G.jpg",
  },
  "1756518564967436": {
    accountId: "1756518564967436",
    companyName: "江西梵佳洛智能科技有限公司",
    licenseNumber: "91360104MA397P5M9N",
    certificateValidity: "2020-05-09 至 2070-05-08",
    registeredAddress: "中国-江西-南昌",
    approvedAt: "2023-11-12 15:07:00",
    email: "未提供",
    phone: "17679311983",
    representative: "廖祥明",
    entityType: "企业",
    licenseImage: "/sites/qianchuan/licenses/91360104MA397P5M9N.png",
  },
  "1811334523345929": {
    accountId: "1811334523345929",
    companyName: "南康区圆禾家具销售部(个体工商户)",
    licenseNumber: "92360782MADQD1FM3U",
    certificateValidity: "无截止日期",
    registeredAddress: "中国-江西-赣州",
    approvedAt: "2025-07-10 16:29:00",
    email: "未提供",
    phone: "18070484988",
    representative: "赖泽洪",
    entityType: "个体工商户",
    licenseImage: "/sites/qianchuan/licenses/92360782MADQD1FM3U.png",
  },
  "1793490092342336": {
    accountId: "1793490092342336",
    companyName: "南康区华雅严选家具销售部",
    licenseNumber: "92360782MAD1H0E03W",
    certificateValidity: "无截止日期",
    registeredAddress: "中国-江西-赣州",
    approvedAt: "2025-09-13 14:08:00",
    email: "未提供",
    phone: "18679675560",
    representative: "廖静",
    entityType: "个体工商户",
    licenseImage: "/sites/qianchuan/licenses/92360782MAD1H0E03W.png",
  },
  "1823130023073049": {
    accountId: "1823130023073049",
    companyName: "南康区喜爱屋家具销售部",
    licenseNumber: "92360782MABMNF3378",
    certificateValidity: "无截止日期",
    registeredAddress: "中国-江西-赣州",
    approvedAt: "2023-08-20 16:35:00",
    email: "未提供",
    phone: "15270768027",
    representative: "赖琴芳",
    entityType: "个体工商户",
    licenseImage: "/sites/qianchuan/licenses/92360782MABMNF3378.png",
  },
};

const DEFAULT_ACCOUNT_ID = "1865682360240256";

export function getAccountQualificationProfile(accountId?: string) {
  return ACCOUNT_QUALIFICATION_PROFILES[accountId ?? ""] ?? ACCOUNT_QUALIFICATION_PROFILES[DEFAULT_ACCOUNT_ID];
}

export function qualificationCertificateType(profile: AccountQualificationProfile) {
  return profile.entityType === "企业"
    ? "企业/企业营业执照统一社会信用代码"
    : "个体工商户/个体工商户营业执照统一社会信用代码";
}

export function maskQualificationPhone(phone: string) {
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}

export function maskQualificationRepresentative(representative: string) {
  if (!representative) return "--";
  return `${representative.slice(0, 1)}${"*".repeat(Math.max(1, representative.length - 1))}`;
}
