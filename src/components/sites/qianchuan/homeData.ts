/** 首页「数据概览」的展示定义。账户与日期相关的数值由 accountOverviewData.ts 生成。 */

export type PeriodKey = "today" | "yesterday" | "last7" | "last30";

export interface Indicator {
  key: string;
  label: string;
}

export interface Metric {
  key: "total" | "chengfang" | "standard" | "omni" | "brand";
  label: string;
  tooltip: string;
  subTabs: string[];
  primaryButton: string;
  secondaryButton: string;
  extraDropdown?: string;
  indicators: Indicator[];
  defaultLeft: string;
  defaultRight: string;
}

export interface PeriodComparison {
  direction: "up" | "down" | "flat";
  percentage: string;
  estimated: boolean;
}

export interface IndicatorView extends Indicator {
  value: string;
  series: number[];
  comparison: PeriodComparison;
}

export interface MetricView extends Omit<Metric, "indicators"> {
  value: string;
  indicators: IndicatorView[];
  comparison: PeriodComparison;
}

const STD_INDICATORS: Indicator[] = [
  { key: "consume", label: "整体消耗(元)" },
  { key: "roi", label: "净成交ROI" },
  { key: "gmv", label: "净成交金额(元)" },
  { key: "orders", label: "净成交订单数" },
  { key: "settleRate", label: "净成交金额结算率" },
  { key: "refundRate", label: "1小时内退款率" },
];

const BRAND_INDICATORS: Indicator[] = [
  { key: "consume", label: "消耗(元)" },
  { key: "impr", label: "展示次数" },
  { key: "cpm", label: "平均千次展现费用(元)" },
  { key: "payRoi", label: "7日总下单ROI" },
  { key: "orders7", label: "7日总成交订单数" },
  { key: "gmv7", label: "7日总成交金额(元)" },
];

const CHENGFANG_INDICATORS: Indicator[] = [
  { key: "roi", label: "综合营销ROI" },
  { key: "cost", label: "综合成本(元)" },
  { key: "gmv", label: "净成交金额(元)" },
  { key: "orders", label: "净成交订单数" },
];

const STANDARD_INDICATORS: Indicator[] = [
  { key: "consume", label: "消耗(元)" },
  { key: "impr", label: "展示次数" },
  { key: "click", label: "点击率" },
  { key: "payRoi", label: "直接支付ROI" },
  { key: "orders", label: "直接成交订单数" },
  { key: "gmv", label: "直接成交金额(元)" },
];

const STD_TABS = ["全部", "推商品", "推直播间", "小店随心推"];

export const METRICS: Metric[] = [
  {
    key: "total",
    label: "账户整体消耗(元)",
    tooltip:
      "数据范围：包含本账户下，巨量千川计划和小店随心推订单投放数据，巨量千川计划包含标准投放、全域投放、品牌投放以及自然智能券。特殊说明：品牌投放消耗数据每日20点更新；当天数据会有波动，次日稳定。",
    subTabs: STD_TABS,
    primaryButton: "+ 新建计划",
    secondaryButton: "查看计划详情",
    indicators: STD_INDICATORS,
    defaultLeft: "consume",
    defaultRight: "roi",
  },
  {
    key: "chengfang",
    label: "乘方计划消耗(元)",
    tooltip:
      "乘方投放期间产生的消耗。若计划发生转投，则转投前、后计划产生的消耗都纳入乘方消耗统计范围。",
    subTabs: ["全部", "推商品", "推直播间"],
    primaryButton: "+ 新建计划",
    secondaryButton: "查看计划详情",
    extraDropdown: "乘方期间数据",
    indicators: CHENGFANG_INDICATORS,
    defaultLeft: "roi",
    defaultRight: "cost",
  },
  {
    key: "standard",
    label: "标准投放消耗(元)",
    tooltip: "标准投放（含小店随心推）投放期间产生的消耗。",
    subTabs: STD_TABS,
    primaryButton: "+ 新建计划",
    secondaryButton: "查看计划详情",
    indicators: STANDARD_INDICATORS,
    defaultLeft: "consume",
    defaultRight: "impr",
  },
  {
    key: "omni",
    label: "全域投放消耗(元)",
    tooltip: "全域投放期间产生的消耗。",
    subTabs: STD_TABS,
    primaryButton: "+ 新建计划",
    secondaryButton: "查看计划详情",
    indicators: STD_INDICATORS,
    defaultLeft: "consume",
    defaultRight: "roi",
  },
  {
    key: "brand",
    label: "品牌投放消耗(元)",
    tooltip: "品牌投放期间产生的消耗。",
    subTabs: ["品牌合约", "品牌竞价"],
    primaryButton: "+ 新建预定单",
    secondaryButton: "查看预定单",
    indicators: BRAND_INDICATORS,
    defaultLeft: "consume",
    defaultRight: "impr",
  },
];

export const DEFAULT_METRIC_KEY = "total";

export const PLATFORM_NEWS = [
  { tag: "课程", text: "千川实操技能优质课程上新" },
  { tag: "功能", text: "直播全域投放-轻松撬动全局流量" },
  { tag: "功能", text: "商品全域投放-好商品双场推爆" },
  { tag: "功能", text: "商品全店托管-一键托管全店商品" },
  { tag: "功能", text: "开启货款直投-抢量快人一步" },
];

export const FUNDS = { balance: "0.00", welfare: "0.00" };
