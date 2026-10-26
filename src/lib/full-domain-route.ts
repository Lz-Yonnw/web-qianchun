const FULL_DOMAIN_PATH = "/dataV2/bidding/site-promotion";

const FULL_DOMAIN_DATE_HASH = [
  "date-range%5BprefixOptionValue%5D=stat_time_day",
  "date-range%5BdateValue%5D%5B0%5D=2026-10-19%2023%3A38%3A52",
  "date-range%5BdateValue%5D%5B1%5D=2026-10-25%2023%3A38%3A52",
].join("&");

export function buildFullDomainHref(accountId: string) {
  const params = new URLSearchParams([
    ["aavid", accountId],
    ["tabs", "live"],
    ["live-report-type", "post_data"],
    ["live-data-dimensions", "aweme"],
    ["live-post-invest-ecp", "0"],
    ["live-material-type", "4"],
    ["live-task-search", ""],
    ["live-raise-target", "0"],
    ["product-assist-task-type", "1"],
    ["product-material-type", "video"],
    ["product-material-search", ""],
    ["product-plan-aggregate-smart-bid-type", ""],
    ["product-task-search", ""],
    ["product-invest-order-platform", "0"],
    ["product-material-order-platform", "0"],
  ]);

  return `${FULL_DOMAIN_PATH}?${params.toString()}#${FULL_DOMAIN_DATE_HASH}`;
}
