import { n as resolveOpenClawPackageRoot } from "./openclaw-root-Cur9Uhkp.mjs";
import { n as isTruthyEnvValue } from "./env-C4a8LL2I.mjs";
import { a as requestNodeHostLauncherRestart, n as isNodeHostLauncherChild } from "./launcher-client-DNBTHwUk.mjs";
import { s as sleepWithAbort } from "./src-D4OikzaT.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { u as resolveEffectiveUpdateChannel } from "./update-channels-BDINqyML.mjs";
import { t as createConfigIO } from "./io.factory-ChIex6Yh.mjs";
import "./io-DuIKUcsW.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { c as resolveUpdateInstallKind, n as compareSemverStrings, o as resolveNpmChannelTag } from "./update-check-DLHVC0Oo.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/node-host/auto-update.ts
const CHECK_INTERVAL_MS = 36e5;
const IDLE_CHECK_INTERVAL_MS = 3e4;
const MIN_ACTIVATION_INTERVAL_MS = 12 * CHECK_INTERVAL_MS;
function updatesEnabled(config, env) {
	return config.nodeHost?.autoUpdate?.enabled !== false && config.update?.checkOnStart !== false && !isTruthyEnvValue(env.OPENCLAW_NO_AUTO_UPDATE) && !isTruthyEnvValue(env.OPENCLAW_NO_RESPAWN);
}
/** Owns discovery and idle admission; the launcher owns executable activation. */
function startNodeHostAutoUpdate(params) {
	const controller = new AbortController();
	const signal = AbortSignal.any([params.signal, controller.signal]);
	const env = process.env;
	const stateDir = resolveStateDir(env);
	const configIO = createConfigIO({
		env,
		observe: false,
		pluginValidation: "skip"
	});
	let pending;
	let paused = false;
	let handedOff = false;
	let waitingLogged = false;
	const readPolicy = async () => {
		const snapshot = await configIO.readConfigFileSnapshot();
		signal.throwIfAborted();
		if (!snapshot.valid) throw new Error("Node auto-update deferred: fix the invalid OpenClaw configuration first.");
		const channel = resolveEffectiveUpdateChannel({
			configChannel: snapshot.config.update?.channel,
			currentVersion: VERSION,
			installKind: "package"
		}).channel;
		return {
			enabled: updatesEnabled(snapshot.config, env) && (channel === "stable" || channel === "beta"),
			channel
		};
	};
	const activationAllowed = async () => {
		try {
			const current = await fs.lstat(path.join(stateDir, "node-runtime", "current"));
			signal.throwIfAborted();
			return Date.now() - current.mtimeMs >= MIN_ACTIVATION_INTERVAL_MS;
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT")) return true;
			throw error;
		}
	};
	const tryActivate = async () => {
		const candidate = pending;
		if (!candidate || !await activationAllowed()) return CHECK_INTERVAL_MS;
		signal.throwIfAborted();
		if (!await params.runtime.tryPauseForUpdate()) {
			if (!waitingLogged) {
				params.log(`node auto-update ${candidate.version} is ready; waiting for active work to finish`);
				waitingLogged = true;
			}
			return IDLE_CHECK_INTERVAL_MS;
		}
		paused = true;
		try {
			const { assertNodeRuntimeUpdateCompatible } = await import("./auto-update-compatibility-DmzodDyj.mjs");
			signal.throwIfAborted();
			await assertNodeRuntimeUpdateCompatible({
				packageRoot: candidate.packageRoot,
				stateDir,
				signal
			});
			const intervalAllowed = await activationAllowed();
			const policy = await readPolicy();
			signal.throwIfAborted();
			if (!policy.enabled || policy.channel !== candidate.channel || !intervalAllowed) {
				pending = void 0;
				return CHECK_INTERVAL_MS;
			}
			signal.throwIfAborted();
			await requestNodeHostLauncherRestart({
				runtimeRoot: candidate.runtimeRoot,
				version: candidate.version
			});
			handedOff = true;
			params.log(`node auto-update restarting into ${candidate.version}`);
			params.onRestartAccepted();
			return CHECK_INTERVAL_MS;
		} finally {
			if (!handedOff) {
				params.runtime.resumeAfterUpdate();
				paused = false;
			}
		}
	};
	const check = async () => {
		const policy = await readPolicy();
		if (!policy.enabled) {
			pending = void 0;
			return CHECK_INTERVAL_MS;
		}
		if (pending) {
			if (pending.channel !== policy.channel) {
				pending = void 0;
				return CHECK_INTERVAL_MS;
			}
			return await tryActivate();
		}
		const available = await resolveNpmChannelTag({
			channel: policy.channel,
			env,
			runCommand: (argv, options) => runCommandWithTimeout(argv, {
				...options,
				signal
			})
		});
		signal.throwIfAborted();
		if (available.error) throw new Error(`Node auto-update discovery failed: ${available.error}`);
		if (!available.version || (compareSemverStrings(available.version, VERSION) ?? 0) <= 0) return CHECK_INTERVAL_MS;
		if (!await activationAllowed()) return CHECK_INTERVAL_MS;
		params.log(`node auto-update preparing ${available.version}`);
		const { prepareNodeRuntimeUpdate } = await import("./auto-update-install-HNwcZxgS.mjs");
		const installPolicy = await readPolicy();
		if (!installPolicy.enabled || installPolicy.channel !== policy.channel) return CHECK_INTERVAL_MS;
		signal.throwIfAborted();
		const candidate = await prepareNodeRuntimeUpdate({
			targetVersion: available.version,
			stateDir,
			signal
		});
		signal.throwIfAborted();
		for (const warning of candidate.warnings ?? []) params.log(redactSensitiveText(warning));
		const currentPolicy = await readPolicy();
		if (!currentPolicy.enabled || currentPolicy.channel !== policy.channel) return CHECK_INTERVAL_MS;
		pending = {
			...candidate,
			channel: policy.channel
		};
		waitingLogged = false;
		return await tryActivate();
	};
	const task = (async () => {
		if (!isNodeHostLauncherChild()) return;
		const root = await resolveOpenClawPackageRoot({
			moduleUrl: import.meta.url,
			argv1: process.argv[1]
		});
		if (!root || await resolveUpdateInstallKind(root, { signal }) !== "package") return;
		while (!signal.aborted) {
			let delay = CHECK_INTERVAL_MS;
			try {
				delay = await check();
			} catch (error) {
				if (signal.aborted) break;
				pending = void 0;
				params.log(redactSensitiveText(String(error)));
			}
			if (handedOff) break;
			await sleepWithAbort(delay, signal, { ref: false });
		}
	})().catch((error) => {
		if (!signal.aborted) params.log(`node auto-update stopped: ${redactSensitiveText(String(error))}`);
	}).finally(() => {
		if (paused && !handedOff) params.runtime.resumeAfterUpdate();
	});
	return { stop: async () => {
		controller.abort();
		await task;
	} };
}
//#endregion
export { startNodeHostAutoUpdate };
