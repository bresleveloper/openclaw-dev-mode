import { _t as UserMessage, a as AssistantMessage, at as StreamOptions, d as Context, k as Model, mt as ToolResultMessage, n as Api, ot as TextContent, p as ImageContent, s as AssistantMessageEventStreamContract } from "./types-B1ZIh9Ch.mjs";
import "./index-94l3uJ39.mjs";
import "./types-CeCl7cJZ.mjs";
declare const PROVIDER_CONTEXT_HANDOFF: unique symbol;
declare const PROVIDER_MODEL_INPUT: unique symbol;
/** Callable tools deliberately left out of the request's tool list (Tool Search directory). */
declare const PROVIDER_DEFERRED_TOOL_NAMES: unique symbol;
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
  [PROVIDER_DEFERRED_TOOL_NAMES]?: ReadonlySet<string>;
};
type ProviderStreamFunction<TApi extends Api = Api, TOptions extends StreamOptions = ProviderStreamOptions> = (model: ProviderModel<TApi>, context: ProviderContext, options?: TOptions) => AssistantMessageEventStreamContract;
/** Resolves provider-only context without widening the canonical call contract. */
declare function resolveProviderContext(context: Context | ProviderContext, options?: ProviderStreamOptions): Promise<ProviderContext>;
export { PROVIDER_MODEL_INPUT as a, ProviderMessage as c, ProviderStreamOptions as d, ProviderUserMessage as f, PROVIDER_DEFERRED_TOOL_NAMES as i, ProviderModel as l, resolveProviderContext as m, ModelInputContent as n, ProviderContext as o, VideoContent as p, PROVIDER_CONTEXT_HANDOFF as r, ProviderContextHandoff as s, MediaContent as t, ProviderStreamFunction as u };