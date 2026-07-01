import { i as OpenClawConfig } from "../../types.openclaw-DlpCUWMr.js";
import { T as ChannelMeta, c as ChannelCapabilities, g as ChannelLogSink, r as ChannelAccountSnapshot, v as ChannelMessageActionAdapter, y as ChannelMessageActionContext } from "../../types.core-DDKBE3_n.js";
import { n as RuntimeEnv } from "../../runtime-Bxifh4bY.js";
import { i as WizardPrompter } from "../../prompts-DgKIGa-v.js";
import { L as ChannelResolveKind, R as ChannelResolveResult, U as ChannelStatusAdapter, k as ChannelGatewayContext } from "../../types.adapters-DTX0gDI1.js";
import { b as OutboundDeliveryResult, i as ChannelOutboundContext, n as ChannelOutboundAdapter } from "../../outbound.types-BRIWiS6p.js";
import { t as ChannelPlugin } from "../../types.plugin-DvEuFaxA.js";
import { $n as PluginRuntime } from "../../types-BVLQjFJF.js";
import { t as twitchPlugin } from "../../plugin-iSfV87_f.js";

//#region extensions/twitch/src/runtime.d.ts
declare const setTwitchRuntime: (next: PluginRuntime) => void, getTwitchRuntime: () => PluginRuntime;
//#endregion
export { type ChannelAccountSnapshot, type ChannelCapabilities, type ChannelGatewayContext, type ChannelLogSink, type ChannelMessageActionAdapter, type ChannelMessageActionContext, type ChannelMeta, type ChannelOutboundAdapter, type ChannelOutboundContext, type ChannelPlugin, type ChannelResolveKind, type ChannelResolveResult, type ChannelStatusAdapter, type OpenClawConfig, type OutboundDeliveryResult, type RuntimeEnv, type WizardPrompter, setTwitchRuntime, twitchPlugin };