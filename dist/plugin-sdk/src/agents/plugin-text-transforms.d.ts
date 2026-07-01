import type { PluginTextReplacement, PluginTextTransforms } from "../plugins/cli-backend.types.js";
import type { StreamFn } from "./runtime/index.js";
/** Merge multiple plugin text-transform sets. */
export declare function mergePluginTextTransforms(...transforms: Array<PluginTextTransforms | undefined>): PluginTextTransforms | undefined;
/** Apply sequential plugin text replacements to one string. */
export declare function applyPluginTextReplacements(text: string, replacements?: PluginTextReplacement[]): string;
/** Wrap a stream function with plugin input/output text transforms. */
export declare function wrapStreamFnTextTransforms(params: {
    streamFn: StreamFn;
    input?: PluginTextReplacement[];
    output?: PluginTextReplacement[];
    transformSystemPrompt?: boolean;
}): StreamFn;
