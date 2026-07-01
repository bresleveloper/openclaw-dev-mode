import { type ExecAsk, type ExecSecurity, type ExecTarget } from "../../../infra/exec-approvals.js";
/** Parsed `/exec` directive state used to override execution policy for one turn. */
type ExecDirectiveParse = {
    cleaned: string;
    hasDirective: boolean;
    execHost?: ExecTarget;
    execSecurity?: ExecSecurity;
    execAsk?: ExecAsk;
    execNode?: string;
    rawExecHost?: string;
    rawExecSecurity?: string;
    rawExecAsk?: string;
    rawExecNode?: string;
    hasExecOptions: boolean;
    invalidHost: boolean;
    invalidSecurity: boolean;
    invalidAsk: boolean;
    invalidNode: boolean;
};
/** Extracts and removes `/exec` options from message text. */
export declare function extractExecDirective(body?: string): ExecDirectiveParse;
export {};
