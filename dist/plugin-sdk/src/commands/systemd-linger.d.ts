import type { RuntimeEnv } from "../runtime.js";
type LingerPrompter = {
    confirm?: (params: {
        message: string;
        initialValue?: boolean;
    }) => Promise<boolean>;
    note: (message: string, title?: string) => Promise<void> | void;
};
/** Ensures systemd user lingering interactively, prompting before sudo when requested. */
export declare function ensureSystemdUserLingerInteractive(params: {
    runtime: RuntimeEnv;
    prompter?: LingerPrompter;
    env?: NodeJS.ProcessEnv;
    title?: string;
    reason?: string;
    prompt?: boolean;
    requireConfirm?: boolean;
}): Promise<void>;
/** Best-effort non-interactive lingering enablement for install scripts and CI-like flows. */
export declare function ensureSystemdUserLingerNonInteractive(params: {
    runtime: RuntimeEnv;
    env?: NodeJS.ProcessEnv;
}): Promise<void>;
export {};
