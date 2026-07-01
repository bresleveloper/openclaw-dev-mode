/** Canonical client ids accepted in gateway hello/connect payloads. */
export declare const GATEWAY_CLIENT_IDS: {
    readonly WEBCHAT_UI: "webchat-ui";
    readonly CONTROL_UI: "openclaw-control-ui";
    readonly TUI: "openclaw-tui";
    readonly WEBCHAT: "webchat";
    readonly CLI: "cli";
    readonly GATEWAY_CLIENT: "gateway-client";
    readonly MACOS_APP: "openclaw-macos";
    readonly IOS_APP: "openclaw-ios";
    readonly ANDROID_APP: "openclaw-android";
    readonly NODE_HOST: "node-host";
    readonly TEST: "test";
    readonly FINGERPRINT: "fingerprint";
    readonly PROBE: "openclaw-probe";
};
/** Stable gateway client ids used on the wire during hello/connect handshakes. */
export type GatewayClientId = (typeof GATEWAY_CLIENT_IDS)[keyof typeof GATEWAY_CLIENT_IDS];
export declare const GATEWAY_CLIENT_NAMES: {
    readonly WEBCHAT_UI: "webchat-ui";
    readonly CONTROL_UI: "openclaw-control-ui";
    readonly TUI: "openclaw-tui";
    readonly WEBCHAT: "webchat";
    readonly CLI: "cli";
    readonly GATEWAY_CLIENT: "gateway-client";
    readonly MACOS_APP: "openclaw-macos";
    readonly IOS_APP: "openclaw-ios";
    readonly ANDROID_APP: "openclaw-android";
    readonly NODE_HOST: "node-host";
    readonly TEST: "test";
    readonly FINGERPRINT: "fingerprint";
    readonly PROBE: "openclaw-probe";
};
/** Compatibility alias for internal callers that still use "name" terminology. */
export type GatewayClientName = GatewayClientId;
/** Coarse modes let policy group clients without matching every product id. */
export declare const GATEWAY_CLIENT_MODES: {
    readonly WEBCHAT: "webchat";
    readonly CLI: "cli";
    readonly UI: "ui";
    readonly BACKEND: "backend";
    readonly NODE: "node";
    readonly PROBE: "probe";
    readonly TEST: "test";
};
/** Coarse client category used for gateway policy and diagnostics. */
export type GatewayClientMode = (typeof GATEWAY_CLIENT_MODES)[keyof typeof GATEWAY_CLIENT_MODES];
/** Client metadata sent during gateway connection setup. */
export type GatewayClientInfo = {
    /** Stable product/client identifier from `GATEWAY_CLIENT_IDS`. */
    id: GatewayClientId;
    /** Human-readable label for diagnostics; not used for policy decisions. */
    displayName?: string;
    /** Client app or package version reported by the connecting process. */
    version: string;
    /** Runtime platform string, such as `darwin`, `ios`, `android`, or `web`. */
    platform: string;
    /** Optional device family used by native clients for display and routing hints. */
    deviceFamily?: string;
    /** Native hardware/model identifier when available. */
    modelIdentifier?: string;
    /** Coarse category from `GATEWAY_CLIENT_MODES` for policy and diagnostics. */
    mode: GatewayClientMode;
    /** Per-installation or per-process id used to distinguish same-product clients. */
    instanceId?: string;
};
/** Capability flags a client may advertise during the gateway handshake. */
export declare const GATEWAY_CLIENT_CAPS: {
    readonly TOOL_EVENTS: "tool-events";
};
/** Optional capability advertised by clients during gateway handshake. */
export type GatewayClientCap = (typeof GATEWAY_CLIENT_CAPS)[keyof typeof GATEWAY_CLIENT_CAPS];
/** Normalizes untrusted client ids and rejects unknown values. */
export declare function normalizeGatewayClientId(raw?: string | null): GatewayClientId | undefined;
/** Normalizes legacy client-name fields through the canonical client-id registry. */
export declare function normalizeGatewayClientName(raw?: string | null): GatewayClientName | undefined;
/** Normalizes untrusted client modes and rejects unknown values. */
export declare function normalizeGatewayClientMode(raw?: string | null): GatewayClientMode | undefined;
/** Checks a client-advertised capability list without treating missing caps as errors. */
export declare function hasGatewayClientCap(caps: string[] | null | undefined, cap: GatewayClientCap): boolean;
