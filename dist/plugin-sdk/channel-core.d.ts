import { i as OpenClawConfig } from "./types.openclaw-R57aE8ho.js";
import { r as ChannelConfigUiHint } from "./types.config-D1pSqbn8.js";
import { t as ChannelPlugin } from "./types.plugin-CfTU_bVj.js";
import { $n as PluginRuntime } from "./types-CXLy55Xw.js";
import { r as buildChannelConfigSchema } from "./config-schema-CIXTfG6L.js";
import { r as parseOptionalDelimitedEntries } from "./helpers-DT86yyIb.js";
import { L as PluginCommandContext, g as OpenClawPluginApi } from "./plugin-entry-CmAMbKdZ.js";
import { t as clearAccountEntryFields } from "./config-helpers-DvCqH5CU.js";
import { c as tryReadSecretFileSync } from "./secret-file-CjbjgOXf.js";
import { a as buildThreadAwareOutboundSessionRoute, c as defineChannelPluginEntry, f as recoverCurrentThreadSessionId, i as buildChannelOutboundSessionRoute, l as defineSetupPluginEntry, m as stripTargetKindPrefix, o as createChannelPluginBase$1, p as stripChannelTargetPrefix, s as createChatChannelPlugin, t as ChannelOutboundSessionRouteParams } from "./core-BtsQ_2c8.js";

//#region src/plugin-sdk/channel-core.d.ts
/** Creates a channel plugin base while keeping the public import on this SDK subpath. */
declare const createChannelPluginBase: typeof createChannelPluginBase$1;
//#endregion
export { type ChannelConfigUiHint, type ChannelOutboundSessionRouteParams, type ChannelPlugin, type OpenClawConfig, type OpenClawPluginApi, type PluginCommandContext, type PluginRuntime, buildChannelConfigSchema, buildChannelOutboundSessionRoute, buildThreadAwareOutboundSessionRoute, clearAccountEntryFields, createChannelPluginBase, createChatChannelPlugin, defineChannelPluginEntry, defineSetupPluginEntry, parseOptionalDelimitedEntries, recoverCurrentThreadSessionId, stripChannelTargetPrefix, stripTargetKindPrefix, tryReadSecretFileSync };