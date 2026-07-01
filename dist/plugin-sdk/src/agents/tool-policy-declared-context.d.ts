import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { DeclaredToolAllowlistContext } from "./tool-policy.js";
export declare function buildDeclaredToolAllowlistContext(params: {
    config?: OpenClawConfig;
    workspaceDir?: string;
    toolDenylist?: string[];
    env?: NodeJS.ProcessEnv;
}): DeclaredToolAllowlistContext | undefined;
