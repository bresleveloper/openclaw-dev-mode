/**
 * Effective tool inventory grouping.
 *
 * Tool inventory reports use this to present effective tools in stable source
 * groups while preserving each source's original tool order.
 */
import type { EffectiveToolInventoryEntry, EffectiveToolInventoryGroup } from "./tools-effective-inventory.types.js";
/** Groups effective tool inventory entries by source in UI/report order. */
export declare function buildEffectiveToolInventoryGroups(entries: readonly EffectiveToolInventoryEntry[]): EffectiveToolInventoryGroup[];
