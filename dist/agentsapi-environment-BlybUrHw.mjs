import "./agentsapi-client-DzhjNWzN.mjs";
import { t as agentsApiExecutorBindingSchema } from "./agentsapi-executor-binding-DQMt0WQ-.mjs";
import { isDeepStrictEqual } from "node:util";
import { setTimeout } from "node:timers/promises";
//#region extensions/agentsapi/agentsapi-environment.ts
/** The plugin owns native environment identity; deployments own executor processes. */
async function ensureAgentsApiEnvironment(params) {
	params.assertCurrent();
	params.signal.throwIfAborted();
	const session = await params.client.session(params.binding.sessionId, params.signal);
	params.assertCurrent();
	if (session.status !== "requires_action" || !session.required_actions.some((action) => action.type === "environment_connection" && action.environment_id === params.environmentId)) return;
	const environment = session.environment;
	if (environment.type !== "self_hosted") throw new Error("Agents API environment changed; reset the OpenClaw session before continuing");
	if (environment.workspace_directory !== params.workspaceDirectory || params.environmentId !== environment.id) throw new Error("Agents API self-hosted environment does not match its session workspace or connection action");
	const executor = agentsApiExecutorBindingSchema.parse({
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		nativeSessionId: session.id,
		environmentId: environment.id,
		remoteUrl: environment.remote_url,
		workspaceDirectory: environment.workspace_directory
	});
	if (params.binding.executor) {
		if (!isDeepStrictEqual(params.binding.executor, executor)) throw new Error("Agents API executor binding changed; reset the OpenClaw session before continuing");
	} else {
		await params.bind({
			...params.binding,
			executor
		});
		params.assertCurrent();
	}
	params.signal.throwIfAborted();
	await params.controller.ensure(executor, {
		signal: params.signal,
		assertCurrent: params.assertCurrent
	});
	params.assertCurrent();
	while (true) {
		params.signal.throwIfAborted();
		const connected = await params.client.environment(executor.environmentId, params.signal);
		params.assertCurrent();
		if (connected.type !== "self_hosted") throw new Error("Agents API returned a different environment type");
		if (connected.status === "connected") return;
		if (connected.status === "failed" || connected.status === "expired") throw new Error(`Agents API environment ${executor.environmentId} is ${connected.status}`);
		await setTimeout(500, void 0, { signal: params.signal });
		params.assertCurrent();
	}
}
async function retireAgentsApiExecutor(controller, executor, assertCurrent) {
	const signal = AbortSignal.timeout(6e4);
	const assertRetireCurrent = () => {
		assertCurrent();
		signal.throwIfAborted();
	};
	assertRetireCurrent();
	await controller.retire(executor, {
		signal,
		assertCurrent: assertRetireCurrent
	});
	assertRetireCurrent();
}
//#endregion
export { retireAgentsApiExecutor as n, ensureAgentsApiEnvironment as t };
