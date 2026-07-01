import type { MsgContext } from "../auto-reply/templating.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
type LinkUnderstandingResult = {
    urls: string[];
    outputs: string[];
};
/**
 * Fetches detected links through the SSRF guard and runs configured CLI processors.
 * Returns detected URLs even when processors are absent so callers can report discovery.
 */
export declare function runLinkUnderstanding(params: {
    cfg: OpenClawConfig;
    ctx: MsgContext;
    message?: string;
}): Promise<LinkUnderstandingResult>;
export {};
