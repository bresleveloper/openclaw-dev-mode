import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { o as readSessionUpdatedAtInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { c as readSessionUpdatedAtCore } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { o as resolveAgentRoute } from "./resolve-route-DvaXhzgP.mjs";
import { a as resolveEnvelopeFormatOptions, t as formatAgentEnvelope } from "./envelope-CdZ9UA5I.mjs";
//#region src/channels/inbound-event/envelope.ts
/** @deprecated Await createChannelInboundEnvelopeBuilderAsync. Final compatibility day: 2026-12-31. */
function createChannelInboundEnvelopeBuilder(params) {
	warnPluginSdkDeprecation({
		family: "channel-inbound-envelope",
		method: "createChannelInboundEnvelopeBuilder",
		replacement: "await createChannelInboundEnvelopeBuilderAsync"
	});
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId: params.route.agentId });
	return createEnvelopeFormatter(params.cfg, () => readSessionUpdatedAtCore({
		storePath,
		sessionKey: params.route.sessionKey
	}));
}
/** Prepare once per inbound message; history formatting remains synchronous and SQL-free. */
async function createChannelInboundEnvelopeBuilderAsync(params) {
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId: params.route.agentId });
	const previousTimestamp = await readSessionUpdatedAtInWorker({
		storePath,
		sessionKey: params.route.sessionKey
	});
	return createEnvelopeFormatter(params.cfg, () => previousTimestamp);
}
function createEnvelopeFormatter(cfg, readPreviousTimestamp) {
	const envelope = resolveEnvelopeFormatOptions(cfg);
	return (input) => {
		const previousTimestamp = input.previousTimestamp === null ? void 0 : input.previousTimestamp ?? readPreviousTimestamp();
		return formatAgentEnvelope({
			...input,
			previousTimestamp,
			envelope: input.envelope ?? envelope
		});
	};
}
/** @deprecated Use resolveAgentRoute and await createChannelInboundEnvelopeBuilderAsync. Final compatibility day: 2026-12-31. */
function resolveChannelInboundRouteEnvelope(params) {
	warnPluginSdkDeprecation({
		family: "channel-inbound-envelope",
		method: "resolveChannelInboundRouteEnvelope",
		replacement: "resolveAgentRoute and await createChannelInboundEnvelopeBuilderAsync"
	});
	const route = resolveAgentRoute(params);
	return {
		route,
		buildEnvelope: createChannelInboundEnvelopeBuilder({
			cfg: params.cfg,
			route
		})
	};
}
/** @deprecated Await createChannelInboundEnvelopeBuilderAsync. Final compatibility day: 2026-12-31. */
function createInboundEnvelopeBuilder(params) {
	warnPluginSdkDeprecation({
		family: "channel-inbound-envelope",
		method: "createInboundEnvelopeBuilder",
		replacement: "await createChannelInboundEnvelopeBuilderAsync"
	});
	const storePath = params.resolveStorePath(params.sessionStore, { agentId: params.route.agentId });
	const envelopeOptions = params.resolveEnvelopeFormatOptions(params.cfg);
	return (input) => {
		const previousTimestamp = params.readSessionUpdatedAt({
			storePath,
			sessionKey: params.route.sessionKey
		});
		const body = params.formatAgentEnvelope({
			channel: input.channel,
			from: input.from,
			timestamp: input.timestamp,
			previousTimestamp,
			envelope: envelopeOptions,
			body: input.body
		});
		return {
			storePath,
			body
		};
	};
}
/** @deprecated Use resolveAgentRoute and await createChannelInboundEnvelopeBuilderAsync. Final compatibility day: 2026-12-31. */
function resolveInboundRouteEnvelopeBuilder(params) {
	warnPluginSdkDeprecation({
		family: "channel-inbound-envelope",
		method: "resolveInboundRouteEnvelopeBuilder",
		replacement: "resolveAgentRoute and await createChannelInboundEnvelopeBuilderAsync"
	});
	const route = params.resolveAgentRoute({
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId,
		peer: params.peer
	});
	return {
		route,
		buildEnvelope: createInboundEnvelopeBuilder({
			...params,
			route
		})
	};
}
/** @deprecated Use resolveAgentRoute and await createChannelInboundEnvelopeBuilderAsync. Final compatibility day: 2026-12-31. */
function resolveInboundRouteEnvelopeBuilderWithRuntime(params) {
	warnPluginSdkDeprecation({
		family: "channel-inbound-envelope",
		method: "resolveInboundRouteEnvelopeBuilderWithRuntime",
		replacement: "resolveAgentRoute and await createChannelInboundEnvelopeBuilderAsync"
	});
	return resolveInboundRouteEnvelopeBuilder({
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId,
		peer: params.peer,
		resolveAgentRoute: (routeParams) => params.runtime.routing.resolveAgentRoute(routeParams),
		sessionStore: params.sessionStore,
		resolveStorePath: params.runtime.session.resolveStorePath,
		readSessionUpdatedAt: params.runtime.session.readSessionUpdatedAt,
		resolveEnvelopeFormatOptions: params.runtime.reply.resolveEnvelopeFormatOptions,
		formatAgentEnvelope: params.runtime.reply.formatAgentEnvelope
	});
}
//#endregion
export { resolveInboundRouteEnvelopeBuilder as a, resolveChannelInboundRouteEnvelope as i, createChannelInboundEnvelopeBuilderAsync as n, resolveInboundRouteEnvelopeBuilderWithRuntime as o, createInboundEnvelopeBuilder as r, createChannelInboundEnvelopeBuilder as t };
