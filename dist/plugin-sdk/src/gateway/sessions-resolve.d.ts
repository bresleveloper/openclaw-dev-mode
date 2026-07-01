import { type ErrorShape, type SessionsResolveParams } from "../../packages/gateway-protocol/src/index.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
export type SessionsResolveResult = {
    ok: true;
    key: string;
} | {
    ok: true;
    missing: true;
} | {
    ok: false;
    error: ErrorShape;
};
export declare function resolveSessionKeyFromResolveParams(params: {
    cfg: OpenClawConfig;
    p: SessionsResolveParams;
}): Promise<SessionsResolveResult>;
