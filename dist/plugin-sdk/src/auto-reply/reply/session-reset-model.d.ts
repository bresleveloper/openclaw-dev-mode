import type { ModelCatalogEntry } from "../../agents/model-catalog.types.js";
import type { SessionEntry } from "../../config/sessions.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { MsgContext, TemplateContext } from "../templating.js";
import { type ModelAliasIndex, type ModelDirectiveSelection } from "./model-selection-directive.js";
import type { ReplySessionEntryHandle } from "./session-entry-handle.js";
/** Result of applying a reset-message model override. */
type ResetModelResult = {
    selection?: ModelDirectiveSelection;
    cleanedBody?: string;
};
/** Applies a model override embedded in a reset command body. */
/** Applies a valid reset model override to session state and returns the cleaned body. */
export declare function applyResetModelOverride(params: {
    cfg: OpenClawConfig;
    agentId?: string;
    resetTriggered: boolean;
    bodyStripped?: string;
    sessionCtx: TemplateContext;
    ctx: MsgContext;
    sessionEntry?: SessionEntry;
    sessionEntryHandle?: ReplySessionEntryHandle;
    sessionStore?: Record<string, SessionEntry>;
    sessionKey?: string;
    storePath?: string;
    defaultProvider: string;
    defaultModel: string;
    aliasIndex: ModelAliasIndex;
    modelCatalog?: ModelCatalogEntry[];
}): Promise<ResetModelResult>;
export {};
