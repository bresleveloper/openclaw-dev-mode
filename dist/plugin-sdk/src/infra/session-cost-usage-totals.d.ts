import type { CostUsageTotals } from "./session-cost-usage.types.js";
export declare function createEmptyCostUsageTotals(): CostUsageTotals;
export declare function cloneCostUsageTotals(totals: CostUsageTotals): CostUsageTotals;
export declare function addCostUsageTotals(target: CostUsageTotals, source: CostUsageTotals): void;
