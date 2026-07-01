import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ImageContent } from "../../llm/types.js";
import type { PromptImageOrderEntry } from "../../media/prompt-image-order.js";
import type { MsgContext } from "../templating.js";
/** Resolves current-turn image attachments that were not already described by media understanding. */
export declare function resolveCurrentTurnImages(params: {
    ctx: MsgContext;
    cfg: OpenClawConfig;
    images?: ImageContent[];
    imageOrder?: PromptImageOrderEntry[];
}): Promise<{
    images?: ImageContent[];
    imageOrder?: PromptImageOrderEntry[];
}>;
