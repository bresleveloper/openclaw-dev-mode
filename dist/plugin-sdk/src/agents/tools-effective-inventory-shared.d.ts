import type { EffectiveToolInventoryEntry } from "./tools-effective-inventory.types.js";
import type { AnyAgentTool } from "./tools/common.js";
export declare function resolveEffectiveToolLabel(tool: AnyAgentTool): string;
export declare function resolveEffectiveToolRawDescription(tool: AnyAgentTool): string;
export declare function summarizeEffectiveToolDescription(tool: AnyAgentTool): string;
export declare function disambiguateEffectiveToolLabels(entries: EffectiveToolInventoryEntry[], resolveSuffix: (entry: EffectiveToolInventoryEntry) => string): EffectiveToolInventoryEntry[];
