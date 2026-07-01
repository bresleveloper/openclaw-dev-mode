import type { ReplyPayload } from "../types.js";
import type { HandleDirectiveOnlyParams } from "./directive-handling.params.js";
/** Handles inline directives that can be acknowledged without a model turn. */
export declare function handleDirectiveOnly(params: HandleDirectiveOnlyParams): Promise<ReplyPayload | undefined>;
