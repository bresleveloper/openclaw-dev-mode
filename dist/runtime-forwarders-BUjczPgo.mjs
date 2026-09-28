import { r as PlatformMessageNotDispatchedError } from "./deliver-types-Diy-VQKA.mjs";
//#region src/channels/plugins/runtime-forwarders.ts
async function resolveForwardedMethod(params) {
	try {
		const runtime = await params.getRuntime();
		const method = params.resolve(runtime);
		if (method) return method;
		throw new Error(params.unavailableMessage ?? "Runtime method is unavailable");
	} catch (error) {
		if (!params.notDispatched || error instanceof PlatformMessageNotDispatchedError) throw error;
		const message = params.unavailableMessage ?? (error instanceof Error && error.message.trim() ? error.message : "Runtime method is unavailable");
		throw new PlatformMessageNotDispatchedError(message, { cause: error });
	}
}
function createRuntimeForwarder(resolveParams) {
	return async (ctx) => await (await resolveForwardedMethod(resolveParams()))(ctx);
}
/**
* Creates a directory adapter whose methods forward to a lazily resolved runtime.
*/
function createRuntimeDirectoryLiveAdapter(params) {
	const adapter = {};
	if (params.self) adapter.self = createRuntimeForwarder(() => ({
		getRuntime: params.getRuntime,
		resolve: params.self
	}));
	if (params.listPeersLive) adapter.listPeersLive = createRuntimeForwarder(() => ({
		getRuntime: params.getRuntime,
		resolve: params.listPeersLive
	}));
	if (params.listGroupsLive) adapter.listGroupsLive = createRuntimeForwarder(() => ({
		getRuntime: params.getRuntime,
		resolve: params.listGroupsLive
	}));
	if (params.listGroupMembers) adapter.listGroupMembers = createRuntimeForwarder(() => ({
		getRuntime: params.getRuntime,
		resolve: params.listGroupMembers
	}));
	return adapter;
}
/**
* Creates outbound delegates whose methods forward to a lazily resolved runtime.
*/
function createRuntimeOutboundDelegates(params) {
	return {
		renderPresentation: params.renderPresentation ? createRuntimeForwarder(() => ({
			getRuntime: params.getRuntime,
			resolve: params.renderPresentation.resolve,
			unavailableMessage: params.renderPresentation.unavailableMessage
		})) : void 0,
		sendPayload: params.sendPayload ? createRuntimeForwarder(() => ({
			getRuntime: params.getRuntime,
			notDispatched: true,
			resolve: params.sendPayload.resolve,
			unavailableMessage: params.sendPayload.unavailableMessage
		})) : void 0,
		sendText: params.sendText ? createRuntimeForwarder(() => ({
			getRuntime: params.getRuntime,
			notDispatched: true,
			resolve: params.sendText.resolve,
			unavailableMessage: params.sendText.unavailableMessage
		})) : void 0,
		sendMedia: params.sendMedia ? createRuntimeForwarder(() => ({
			getRuntime: params.getRuntime,
			notDispatched: true,
			resolve: params.sendMedia.resolve,
			unavailableMessage: params.sendMedia.unavailableMessage
		})) : void 0,
		sendPoll: params.sendPoll ? createRuntimeForwarder(() => ({
			getRuntime: params.getRuntime,
			notDispatched: true,
			resolve: params.sendPoll.resolve,
			unavailableMessage: params.sendPoll.unavailableMessage
		})) : void 0
	};
}
//#endregion
export { createRuntimeOutboundDelegates as n, createRuntimeDirectoryLiveAdapter as t };
