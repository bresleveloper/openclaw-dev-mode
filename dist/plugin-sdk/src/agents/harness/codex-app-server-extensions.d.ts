import type { CodexAppServerExtensionContext, CodexAppServerExtensionFactory, CodexAppServerToolResultEvent } from "../../plugins/codex-app-server-extension-types.js";
import type { AgentToolResult } from "../runtime/index.js";
/** Creates a runner that applies registered Codex app-server tool-result extensions. */
export declare function createCodexAppServerToolResultExtensionRunner(ctx: CodexAppServerExtensionContext, factories?: CodexAppServerExtensionFactory[]): {
    applyToolResultExtensions(event: CodexAppServerToolResultEvent): Promise<AgentToolResult<unknown>>;
};
