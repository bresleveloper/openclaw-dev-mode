import type { OpenClawConfig } from "../../../config/types.openclaw.js";
type CodexNativeAssetHit = {
    /** Native Codex asset category discovered under Codex or personal agent homes. */
    kind: "skill" | "plugin" | "config" | "hooks";
    /** Absolute path to the asset or asset container. */
    path: string;
};
/** Discover personal Codex skills, plugins, config, and hooks relevant to Codex-mode agents. */
export declare function scanCodexNativeAssets(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
}): Promise<CodexNativeAssetHit[]>;
/** Build an informational doctor note when personal Codex CLI assets need migration review. */
export declare function collectCodexNativeAssetInfoNotes(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
}): Promise<string[]>;
export {};
