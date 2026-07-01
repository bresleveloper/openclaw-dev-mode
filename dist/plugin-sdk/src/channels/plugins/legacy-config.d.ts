/**
 * Channel legacy config rule collector.
 *
 * Gathers channel-owned doctor migration rules from public artifacts and plugin hooks.
 */
import type { LegacyConfigRule } from "../../config/legacy.shared.js";
import type { ChannelId } from "./types.public.js";
export declare function collectChannelLegacyConfigRules(raw?: unknown, touchedPaths?: ReadonlyArray<ReadonlyArray<string>>, excludedChannelIds?: ReadonlySet<ChannelId>): LegacyConfigRule[];
