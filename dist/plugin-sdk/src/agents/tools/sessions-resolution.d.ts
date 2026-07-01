import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { callGateway } from "../../gateway/call.js";
type GatewayCaller = typeof callGateway;
export declare function resolveMainSessionAlias(cfg: OpenClawConfig): {
    mainKey: string;
    alias: string;
    scope: import("../../config/types.base.ts").SessionScope;
};
export declare function resolveDisplaySessionKey(params: {
    key: string;
    alias: string;
    mainKey: string;
}): string;
export declare function resolveInternalSessionKey(params: {
    key: string;
    alias: string;
    mainKey: string;
    requesterInternalKey?: string;
}): string;
export declare function resolveCurrentSessionClientAlias(params: {
    key: string;
    requesterInternalKey?: string;
}): string | undefined;
export declare function looksLikeSessionKey(value: string): boolean;
export declare function shouldResolveSessionIdInput(value: string): boolean;
type SessionReferenceResolution = {
    ok: true;
    key: string;
    displayKey: string;
    resolvedViaSessionId: boolean;
} | {
    ok: false;
    status: "error" | "forbidden";
    error: string;
};
type VisibleSessionReferenceResolution = {
    ok: true;
    key: string;
    displayKey: string;
} | {
    ok: false;
    status: "forbidden";
    error: string;
    displayKey: string;
};
export declare function resolveSessionReference(params: {
    sessionKey: string;
    alias: string;
    mainKey: string;
    requesterInternalKey?: string;
    restrictToSpawned: boolean;
}): Promise<SessionReferenceResolution>;
export declare function resolveVisibleSessionReference(params: {
    resolvedSession: Extract<SessionReferenceResolution, {
        ok: true;
    }>;
    requesterSessionKey: string;
    restrictToSpawned: boolean;
    visibilitySessionKey: string;
}): Promise<VisibleSessionReferenceResolution>;
export declare const testing: {
    setDepsForTest(overrides?: Partial<{
        callGateway: GatewayCaller;
    }>): void;
};
export { testing as __testing };
