import type { ExecAsk, ExecMode, ExecSecurity } from "./exec-approvals.js";
export type ExecPolicyLayer = {
    mode?: ExecMode;
    security?: ExecSecurity;
    ask?: ExecAsk;
};
export declare function applyExecPolicyLayer<TBase extends ExecPolicyLayer>(base: TBase, layer?: ExecPolicyLayer): TBase & ExecPolicyLayer;
