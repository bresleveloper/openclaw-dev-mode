import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ProviderRuntimeModel } from "../../plugins/provider-runtime-model.types.js";
import type { ExtensionFactory, SessionManager } from "../sessions/index.js";
export declare function buildEmbeddedExtensionFactories(params: {
    cfg: OpenClawConfig | undefined;
    sessionManager: SessionManager;
    workspaceDir?: string;
    provider: string;
    modelId: string;
    model: ProviderRuntimeModel | undefined;
    runId?: string;
}): ExtensionFactory[];
