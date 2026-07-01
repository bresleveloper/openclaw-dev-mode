import type { BundleMcpServerConfig } from "../../plugins/bundle-mcp.js";
/** Re-exported record guard for adapter modules that share loose JSON inputs. */
export { isRecord } from "../../../packages/normalization-core/src/record-coerce.js";
/** Normalize a string-valued record, dropping non-string entries. */
export declare function normalizeStringRecord(value: unknown): Record<string, string> | undefined;
/** Decode supported `${ENV}` and `Bearer ${ENV}` header placeholders. */
export declare function decodeHeaderEnvPlaceholder(value: string): {
    envVar: string;
    bearer: boolean;
} | null;
/** Copy common MCP server config fields into a CLI adapter config object. */
export declare function applyCommonServerConfig(next: Record<string, unknown>, server: BundleMcpServerConfig): void;
