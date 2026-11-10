import { o as writeRuntimeJson, r as defaultRuntime } from "../runtime-BazLsT0s.mjs";
import { t as _usingCtx } from "../usingCtx-BhiZp_rS.mjs";
import { a as isPersistentSystemAgentOperation, o as parseSystemAgentOperation } from "../operations-parse-B9TfqALv.mjs";
import { t as executeSystemAgentOperation } from "../operations-6fJefeqF.mjs";
import { r as withProgress } from "../progress-BIOeyA3T.mjs";
import { n as requireSystemAgentPersistentApplyInference, r as SystemAgentInferenceUnavailableError, t as requireSystemAgentInferenceRoute } from "../inference-guard-dpnxA1_N.mjs";
import { i as loadSystemAgentOverview, n as formatSystemAgentOverview } from "../overview-DFEP0f2_.mjs";
import { r as hasCurrentSystemAgentOwnerPluginArtifacts } from "../verified-inference-DGxbE23j.mjs";
import { n as resolveSystemAgentOperation } from "../dialogue-BJ9em-ks.mjs";
import { stdin, stdout } from "node:process";
//#region src/system-agent/system-agent.ts
async function runOneShot(operation, runtime, opts) {
	if (operation.kind === "none" && operation.message === "") return;
	await requireSystemAgentInferenceRoute(opts.verifiedInference, opts.deps, "conversation");
	const approved = opts.yes === true || !isPersistentSystemAgentOperation(operation);
	if (approved && isPersistentSystemAgentOperation(operation)) await requireSystemAgentPersistentApplyInference({
		binding: opts.verifiedInference,
		runtime,
		deps: opts.deps
	}, (failures) => {
		if (failures[0] instanceof SystemAgentInferenceUnavailableError) throw failures[0];
		throw new SystemAgentInferenceUnavailableError("conversation", failures, "route-changed");
	});
	await executeSystemAgentOperation(operation, runtime, {
		approved,
		deps: opts.deps || opts.formatOverview || opts.loadOverview ? {
			...opts.deps,
			...opts.formatOverview ? { formatOverview: opts.formatOverview } : {},
			...opts.loadOverview ? { loadOverview: opts.loadOverview } : {}
		} : void 0
	});
}
async function runSystemAgent(opts, runtime = defaultRuntime) {
	try {
		var _usingCtx$1 = _usingCtx();
		const binding = opts?.verifiedInference;
		if (!binding) throw new SystemAgentInferenceUnavailableError("conversation");
		const boundOpts = {
			...opts,
			verifiedInference: binding
		};
		const run = () => runBoundSystemAgent(boundOpts, runtime);
		const route = binding.execution;
		if (route.runner !== "embedded" || route.agentHarnessRuntimeOverride === "openclaw") return await run();
		const { resolveAgentWorkspaceDir } = await import("../agent-scope-B7r8PTbp.mjs");
		const { loadAgentRuntimePluginRegistryHandle } = await import("../runtime-plugins-DtiBvnib.mjs");
		const { withPluginLifecycleLease } = await import("../plugin-lifecycle-lease-C4DiOvV_.mjs");
		const { createPluginCache, withPluginCache } = await import("../plugin-cache-B1jqWOmJ.mjs");
		const { withPluginRuntimeRegistryScope } = await import("../gateway-request-scope-4yDSzCvx.mjs");
		const cache = _usingCtx$1.a(createPluginCache());
		const readSnapshot = boundOpts.deps?.readConfigFileSnapshot ?? (await import("../config/config.js")).readConfigFileSnapshot;
		await withPluginRuntimeRegistryScope(await withPluginLifecycleLease({}, async (lease) => {
			const snapshot = await readSnapshot();
			if (!await hasCurrentSystemAgentOwnerPluginArtifacts(binding, {
				...boundOpts.deps,
				readConfigFileSnapshot: async () => snapshot
			})) throw new SystemAgentInferenceUnavailableError("conversation", [], "route-changed");
			const config = snapshot.runtimeConfig ?? snapshot.config;
			const workspaceDir = resolveAgentWorkspaceDir(config, route.agentId);
			lease.assertOwned();
			return withPluginCache(cache, () => loadAgentRuntimePluginRegistryHandle({
				basePluginIds: [],
				config,
				workspaceDir,
				selections: [{
					provider: route.provider,
					modelId: route.model,
					runtime: route.agentHarnessRuntimeOverride,
					agentId: route.agentId
				}]
			}));
		}), run);
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
async function runBoundSystemAgent(boundOpts, runtime) {
	await requireSystemAgentInferenceRoute(boundOpts.verifiedInference, boundOpts.deps, "conversation");
	if (boundOpts.json) {
		const overview = await (boundOpts.loadOverview ?? loadSystemAgentOverview)();
		writeRuntimeJson(runtime, overview);
		return;
	}
	if (boundOpts.message?.trim()) {
		const parsed = parseSystemAgentOperation(boundOpts.message);
		if (parsed.kind === "overview") {
			await runOneShot(parsed, runtime, boundOpts);
			return;
		}
		const overview = await withProgress({
			label: "Loading OpenClaw overview…",
			indeterminate: true,
			delayMs: 0,
			fallback: "none"
		}, async () => await (boundOpts.loadOverview ?? loadSystemAgentOverview)());
		runtime.log((boundOpts.formatOverview ?? formatSystemAgentOverview)(overview));
		runtime.log("");
		await runOneShot(await resolveSystemAgentOperation(boundOpts.message, runtime, {
			...boundOpts,
			loadOverview: async () => overview
		}), runtime, boundOpts);
		return;
	}
	if (boundOpts.interactive === false) {
		const overview = await (boundOpts.loadOverview ?? loadSystemAgentOverview)();
		runtime.log((boundOpts.formatOverview ?? formatSystemAgentOverview)(overview));
		return;
	}
	const input = boundOpts.input ?? stdin;
	const output = boundOpts.output ?? stdout;
	const inputIsTty = input.isTTY === true;
	const outputIsTty = output.isTTY === true;
	if (!inputIsTty || !outputIsTty) {
		runtime.error("OpenClaw needs an interactive TTY. Use --message for one command.");
		runtime.exit(1);
		return;
	}
	const runInteractiveTui = boundOpts.runInteractiveTui ?? (await import("../tui-backend-Bq33vjiM.mjs")).runSystemAgentTui;
	boundOpts.onReady?.();
	await runInteractiveTui(boundOpts, runtime);
}
//#endregion
export { runSystemAgent };
