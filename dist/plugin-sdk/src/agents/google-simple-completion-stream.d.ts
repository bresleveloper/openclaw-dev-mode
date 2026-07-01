import type { Api, Model } from "../llm/types.js";
/** Rewrites Google generative-ai models to the simple-completion adapter when needed. */
export declare function prepareGoogleSimpleCompletionModel<TApi extends Api>(model: Model<TApi>): Model;
