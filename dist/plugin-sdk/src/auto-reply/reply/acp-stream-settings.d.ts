/** ACP streaming and projection settings derived from config. */
import type { AcpSessionUpdateTag } from "@openclaw/acp-core/runtime/types";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
/** ACP delivery strategy for projected assistant output. */
type AcpDeliveryMode = "live" | "final_only";
export type AcpHiddenBoundarySeparator = "none" | "space" | "newline" | "paragraph";
/** Normalized ACP projection settings consumed by stream projectors. */
export type AcpProjectionSettings = {
    deliveryMode: AcpDeliveryMode;
    hiddenBoundarySeparator: AcpHiddenBoundarySeparator;
    repeatSuppression: boolean;
    maxOutputChars: number;
    maxSessionUpdateChars: number;
    tagVisibility: Partial<Record<AcpSessionUpdateTag, boolean>>;
};
/** Resolves ACP projection settings with bounded defaults. */
export declare function resolveAcpProjectionSettings(cfg: OpenClawConfig): AcpProjectionSettings;
/** Resolves ACP streaming chunk/coalescing settings. */
export declare function resolveAcpStreamingConfig(params: {
    cfg: OpenClawConfig;
    provider?: string;
    accountId?: string;
    deliveryMode?: AcpDeliveryMode;
}): {
    chunking: {
        minChars: number;
        maxChars: number;
        breakPreference: "paragraph" | "newline" | "sentence";
        flushOnParagraph?: boolean;
    };
    coalescing: import("./block-streaming.js").BlockStreamingCoalescing;
};
export declare function isAcpTagVisible(settings: AcpProjectionSettings, tag: string | undefined): boolean;
export {};
