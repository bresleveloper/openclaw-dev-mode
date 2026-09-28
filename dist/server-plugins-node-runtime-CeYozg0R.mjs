import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { t as getPluginInstance } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { i as NODE_DUPLEX_INVOKE_IDLE_TIMEOUT_MS } from "./node-commands-BLhGKTZa.mjs";
import { i as capturePluginLifecycleAuthority } from "./registry-lifecycle-xdpzLZzd.mjs";
import { i as getInProcessGatewayRequestContext } from "./server-plugin-in-process-dispatch-BpUBEeez.mjs";
import { t as createNodeDuplexEndpoint } from "./node-duplex-framing-A5ewuqpE.mjs";
import { l as resolveNodeCommandAllowlist, o as isNodeCommandAllowed } from "./node-command-policy-CnGfXM76.mjs";
//#region src/gateway/server-plugins-node-runtime.ts
function hasInProcessGatewayContext(resolveGatewayContext) {
	return Boolean(getInProcessGatewayRequestContext(resolveGatewayContext));
}
/** Opens one lifecycle-fenced binary channel through the canonical node invocation owner. */
async function openGatewayNodeDuplex(options) {
	const { params, resolveGatewayContext, runtimeLifetime, invokeNode } = options;
	const scope = getPluginRuntimeGatewayRequestScope();
	if (!scope?.pluginId?.trim()) throw new Error("Plugin node duplex commands require an active owning plugin identity.");
	const registry = scope.pluginRegistry;
	const record = registry?.plugins.find((entry) => entry.id === scope.pluginId);
	const registrations = registry?.nodeHostCommands.filter((entry) => entry.command.command === params.command);
	if (!registry || !record || registrations?.length !== 1 || registrations[0]?.pluginId !== scope.pluginId || registrations[0]?.command.duplex !== true && registrations[0]?.command.duplex !== "optional") throw new Error(`Node command "${params.command}" must be registered exactly once by plugin "${scope.pluginId}" and declare duplex: true or "optional".`);
	const isPluginCurrent = capturePluginLifecycleAuthority(registry, record, { scopedRuntime: true });
	const callerIdentity = scope.client?.internal?.agentRuntimeIdentity;
	const context = getInProcessGatewayRequestContext(resolveGatewayContext);
	if (!context?.nodeRegistry) throw new Error("Plugin node duplex commands require an active Gateway node registry.");
	return await openOwnedGatewayNodeDuplex({
		params,
		invokeNode,
		context,
		signal: AbortSignal.any([
			runtimeLifetime,
			getPluginInstance(record)?.lifecycle.signal,
			params.signal
		].filter((candidate) => candidate !== void 0)),
		assertCurrent() {
			if (isPluginCurrent?.() !== true || resolveGatewayContext && resolveGatewayContext() !== context || callerIdentity && context.validateAgentRuntimeApprovalAuthority?.(callerIdentity) !== true) throw new Error("Plugin Gateway runtime authority is no longer current.");
		}
	});
}
/** Shared framing for an already-admitted caller or service; never establishes authority. */
async function openOwnedGatewayNodeDuplex(options) {
	const { params, invokeNode, context } = options;
	const controller = new AbortController();
	const signal = AbortSignal.any([controller.signal, options.signal]);
	let invokeId;
	let framedReady = false;
	const ready = createDeferredCore();
	const assertRuntimeCurrent = () => {
		try {
			signal.throwIfAborted();
			options.assertCurrent();
		} catch (error) {
			controller.abort(error);
			throw error;
		}
	};
	const isRuntimeCurrent = () => {
		try {
			assertRuntimeCurrent();
			return true;
		} catch {
			return false;
		}
	};
	assertRuntimeCurrent();
	const endpoint = createNodeDuplexEndpoint({
		requireReady: true,
		maxMessageBytes: params.maxMessageBytes,
		maxOutstandingDeliveryBytes: params.maxOutstandingDeliveryBytes,
		sendFrame(frame) {
			assertRuntimeCurrent();
			if (!invokeId || !framedReady) throw new Error("Node duplex command is not ready for binary messages.");
			context.nodeRegistry.sendInvokeInput(invokeId, frame);
		},
		onReady() {
			if (!invokeId) throw new Error("Node duplex command announced readiness before its dispatch.");
			framedReady = true;
			ready.resolve();
		},
		onError: (error) => controller.abort(error)
	});
	const onAbort = () => endpoint.close();
	signal.addEventListener("abort", onAbort, { once: true });
	const closed = invokeNode(params, {
		onProgress: (chunk) => {
			assertRuntimeCurrent();
			endpoint.receive(chunk);
		},
		onDispatchReady: (id) => {
			assertRuntimeCurrent();
			invokeId = id;
		},
		isRuntimeCurrent,
		idleTimeoutMs: NODE_DUPLEX_INVOKE_IDLE_TIMEOUT_MS
	}, signal).then(async (result) => {
		if (!invokeId || !framedReady) throw new Error("Node command completed without opening a ready duplex invocation.");
		await endpoint.drain();
		return result;
	}).finally(() => {
		signal.removeEventListener("abort", onAbort);
		endpoint.close();
		controller.abort(/* @__PURE__ */ new Error("Node duplex command has closed."));
	});
	closed.catch(ready.reject);
	await ready.promise;
	return {
		send: (message) => endpoint.send(message),
		onMessage: (listener) => {
			assertRuntimeCurrent();
			return endpoint.onMessage(listener);
		},
		closed,
		close: () => controller.abort(/* @__PURE__ */ new Error("Node duplex channel closed by its caller."))
	};
}
function projectGatewayRuntimeNodes(nodes, context) {
	return nodes.map((node) => {
		if (!node || typeof node !== "object" || Array.isArray(node) || !context?.nodeRegistry?.get || !context.getRuntimeConfig) return node;
		const nodeRecord = node;
		const nodeId = typeof nodeRecord.nodeId === "string" ? nodeRecord.nodeId : "";
		const liveNode = nodeId ? context.nodeRegistry.get(nodeId) : void 0;
		if (!liveNode) return node;
		const allowlist = resolveNodeCommandAllowlist(context.getRuntimeConfig(), {
			...liveNode,
			approvedCommands: liveNode.commands
		});
		const invocableCommands = liveNode.commands.filter((command) => isNodeCommandAllowed({
			command,
			declaredCommands: liveNode.commands,
			allowlist
		}).ok);
		return Object.assign({}, nodeRecord, { invocableCommands });
	});
}
function createGatewayHooksRuntime(resolveGatewayContext) {
	return { dispatchHookAgentTurn: async (params) => {
		const pluginId = getPluginRuntimeGatewayRequestScope()?.pluginId;
		const gatewayContext = resolveGatewayContext?.();
		if (!pluginId || !gatewayContext?.dispatchHookAgentTurn) throw new Error("Plugin hook runtime requires an active Gateway and plugin identity.");
		return await gatewayContext.dispatchHookAgentTurn(pluginId, params);
	} };
}
//#endregion
export { projectGatewayRuntimeNodes as a, openOwnedGatewayNodeDuplex as i, hasInProcessGatewayContext as n, openGatewayNodeDuplex as r, createGatewayHooksRuntime as t };
