import { a as writeRuntimeJson, r as defaultRuntime } from "../runtime-BC29JSZp.mjs";
import { t as _usingCtx } from "../usingCtx-CoYZqMqE.mjs";
import { a as isPersistentSystemAgentOperation, o as parseSystemAgentOperation } from "../operations-parse-B6VcQhEV.mjs";
import { t as executeSystemAgentOperation } from "../operations-BIpdn-VT.mjs";
import { r as withProgress } from "../progress-BQygak_O.mjs";
import { t as SystemAgentInferenceUnavailableError } from "../inference-error-C-Vf2B5Y.mjs";
import { i as loadSystemAgentOverview, n as formatSystemAgentOverview } from "../overview-DJH3LymW.mjs";
import { a as resolveSystemAgentVerifiedInferenceRoute, r as hasCurrentSystemAgentOwnerPluginArtifacts } from "../verified-inference-BKhGtG5v.mjs";
import { n as resolveSystemAgentOperation } from "../dialogue-hTUMZY7m.mjs";
import { stdin, stdout } from "node:process";
//#region src/system-agent/system-agent.ts
function systemAgentCommandDepsFromOptions(opts) {
	if (!opts.deps && !opts.formatOverview && !opts.loadOverview) return;
	return {
		...opts.deps,
		...opts.formatOverview ? { formatOverview: opts.formatOverview } : {},
		...opts.loadOverview ? { loadOverview: opts.loadOverview } : {}
	};
}
async function requireVerifiedInference(opts) {
	if (!opts.verifiedInference) throw new SystemAgentInferenceUnavailableError("conversation");
	try {
		if (await resolveSystemAgentVerifiedInferenceRoute(opts.verifiedInference, opts.deps)) return;
	} catch (error) {
		throw new SystemAgentInferenceUnavailableError("conversation", [error]);
	}
	throw new SystemAgentInferenceUnavailableError("conversation");
}
async function requirePersistentApplyInference(opts, runtime) {
	if (!opts.verifiedInference) throw new SystemAgentInferenceUnavailableError("conversation");
	try {
		const { resolvePersistentApplyInference } = await import("./setup-inference.js");
		if (await resolvePersistentApplyInference({
			binding: opts.verifiedInference,
			runtime,
			deps: opts.deps
		})) return;
	} catch (error) {
		if (error instanceof SystemAgentInferenceUnavailableError) throw error;
		throw new SystemAgentInferenceUnavailableError("conversation", [error]);
	}
	throw new SystemAgentInferenceUnavailableError("conversation");
}
async function runOneShot(operation, runtime, opts) {
	if (operation.kind === "none" && operation.message === "") return;
	await requireVerifiedInference(opts);
	const approved = opts.yes === true || !isPersistentSystemAgentOperation(operation);
	if (approved && isPersistentSystemAgentOperation(operation)) await requirePersistentApplyInference(opts, runtime);
	await executeSystemAgentOperation(operation, runtime, {
		approved,
		deps: systemAgentCommandDepsFromOptions(opts)
	});
}
/** Run OpenClaw in JSON, one-shot message, or interactive TUI mode. */
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
		const { resolveAgentWorkspaceDir } = await import("../agent-scope-C4CYkKyC.mjs");
		const { loadAgentRuntimePluginRegistryHandle } = await import("../runtime-plugins-AcO__uT6.mjs");
		const { withPluginLifecycleLease } = await import("../plugin-lifecycle-lease-DTJKSqdR.mjs");
		const { createPluginCache, withPluginCache } = await import("../plugin-cache-B8iOCWkW.mjs");
		const { withPluginRuntimeRegistryScope } = await import("../gateway-request-scope-YnkE23gw.mjs");
		const cache = _usingCtx$1.a(createPluginCache());
		const readSnapshot = boundOpts.deps?.readConfigFileSnapshot ?? (await import("../config/config.js")).readConfigFileSnapshot;
		await withPluginRuntimeRegistryScope(await withPluginLifecycleLease({}, async (lease) => {
			const snapshot = await readSnapshot();
			if (!await hasCurrentSystemAgentOwnerPluginArtifacts(binding, {
				...boundOpts.deps,
				readConfigFileSnapshot: async () => snapshot
			})) throw new SystemAgentInferenceUnavailableError("conversation");
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
	await requireVerifiedInference(boundOpts);
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
	const runInteractiveTui = boundOpts.runInteractiveTui ?? (await import("../tui-backend-DcPDXLM2.mjs")).runSystemAgentTui;
	boundOpts.onReady?.();
	await runInteractiveTui(boundOpts, runtime);
}
//#endregion
export { runSystemAgent };
