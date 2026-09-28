import { t as index_d_exports } from "./index-C25RT6bP.mjs";
import { O as Model, X as TextContent, Y as StreamOptions, a as AssistantMessage, d as Context, f as ImageContent, it as ToolResultMessage, n as Api, s as AssistantMessageEventStreamContract, st as UserMessage } from "./types-qZFbaDbK.mjs";
import "./types-DTvddOfm.mjs";
//#region packages/ai/src/provider-types.d.ts
declare const PROVIDER_CONTEXT_HANDOFF: unique symbol;
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
};
type ProviderStreamFunction<TApi extends Api = Api, TOptions extends StreamOptions = ProviderStreamOptions> = (model: ProviderModel<TApi>, context: ProviderContext, options?: TOptions) => AssistantMessageEventStreamContract;
/** Resolves provider-only context without widening the canonical call contract. */
declare function resolveProviderContext(context: Context | ProviderContext, options?: ProviderStreamOptions): Promise<ProviderContext>;
//#endregion
export { ProviderContextHandoff as a, ProviderStreamFunction as c, VideoContent as d, resolveProviderContext as f, ProviderContext as i, ProviderStreamOptions as l, ModelInputContent as n, ProviderMessage as o, PROVIDER_CONTEXT_HANDOFF as r, ProviderModel as s, MediaContent as t, ProviderUserMessage as u };