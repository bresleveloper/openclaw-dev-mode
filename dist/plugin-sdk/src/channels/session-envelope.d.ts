import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Resolves envelope options and previous timestamp for one inbound channel session. */
export declare function resolveInboundSessionEnvelopeContext(params: {
    cfg: OpenClawConfig;
    agentId: string;
    sessionKey: string;
}): {
    storePath: string;
    envelopeOptions: import("../auto-reply/envelope.js").EnvelopeFormatOptions;
    previousTimestamp: number | undefined;
};
