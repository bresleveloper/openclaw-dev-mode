import { t as index_d_exports } from "./index-DSprYWaz.mjs";
import { a as AssistantMessage, d as Context, dt as ToolResultMessage, k as Model, mt as UserMessage, n as Api, nt as StreamOptions, p as ImageContent, rt as TextContent, s as AssistantMessageEventStreamContract } from "./types-CVYzKrMl.mjs";
import "./types-CBJthzJX.mjs";
//#region packages/ai/src/provider-types.d.ts
declare const PROVIDER_CONTEXT_HANDOFF: unique symbol;
declare const PROVIDER_MODEL_INPUT: unique symbol;
type VideoContent = Omit<ImageContent, "type"> & {
  type: "video";
};
type MediaContent = ImageContent | VideoContent;
type ModelInputContent = TextContent | MediaContent;
type ProviderUserMessage = Omit<UserMessage, "content"> & {
  content: string | ModelInputContent[];
};
type ProviderMessage = ProviderUserMessage | AssistantMessage | ToolResultMessage;
type ProviderContext = Omit<Context, "messages"> & {
  messages: ProviderMessage[];
};
type ProviderModel<TApi extends Api = Api> = Omit<Model<TApi>, "input"> & {
  input: ModelInputContent["type"][];
};
type ProviderContextHandoff = () => Promise<ProviderContext>;
type ProviderStreamOptions = StreamOptions & {
  [PROVIDER_CONTEXT_HANDOFF]?: ProviderContextHandoff;
  [PROVIDER_MODEL_INPUT]?: ProviderModel["input"];
};
type ProviderStreamFunction<TApi extends Api = Api, TOptions extends StreamOptions = ProviderStreamOptions> = (model: ProviderModel<TApi>, context: ProviderContext, options?: TOptions) => AssistantMessageEventStreamContract;
/** Resolves provider-only context without widening the canonical call contract. */
declare function resolveProviderContext(context: Context | ProviderContext, options?: ProviderStreamOptions): Promise<ProviderContext>;
//#endregion
export { ProviderContext as a, ProviderModel as c, ProviderUserMessage as d, VideoContent as f, PROVIDER_MODEL_INPUT as i, ProviderStreamFunction as l, ModelInputContent as n, ProviderContextHandoff as o, resolveProviderContext as p, PROVIDER_CONTEXT_HANDOFF as r, ProviderMessage as s, MediaContent as t, ProviderStreamOptions as u };