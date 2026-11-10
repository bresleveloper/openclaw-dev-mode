import { n as resolveOpenClawPackageRoot } from "./openclaw-root-CPodxfi3.mjs";
import { n as isTruthyEnvValue } from "./env-DbG527wb.mjs";
import { a as requestNodeHostLauncherRestart, n as isNodeHostLauncherChild } from "./launcher-client-DNBTHwUk.mjs";
import { s as redactSensitiveText } from "./redact-BcXJu5HP.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { d as sleepWithAbort } from "./src-Bzfi3cQM.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { t as VERSION } from "./version-jg_14gWz.mjs";
import { l as resolveEffectiveUpdateChannel } from "./update-channels-l0GQCX9n.mjs";
import { t as createConfigIO } from "./io.factory-B5D3Sy_M.mjs";
import "./io-DIF-KW3P.mjs";
import { i as runCommandWithTimeout } from "./exec-Bf6uhUA7.mjs";
import { c as resolveUpdateInstallKind, l as resolveUpdateRegistryTarget, n as compareSemverStrings, o as resolveNpmChannelTag } from "./update-check-hpRujh0z.mjs";
import fs from "node:fs/promises";
import path from "node:path";
//#region src/node-host/auto-update.ts
const CHECK_INTERVAL_MS = 36e5;
const IDLE_CHECK_INTERVAL_MS = 3e4;
const MIN_ACTIVATION_INTERVAL_MS = 12 * CHECK_INTERVAL_MS;
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
			enabled: snapshot.config.nodeHost?.autoUpdate?.enabled !== false && snapshot.config.update?.checkOnStart !== false && !isTruthyEnvValue(env.OPENCLAW_NO_AUTO_UPDATE) && !isTruthyEnvValue(env.OPENCLAW_NO_RESPAWN) && (channel === "stable" || channel === "beta"),
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
		if (!candidate) return CHECK_INTERVAL_MS;
		signal.throwIfAborted();
		if (!await params.runtime.tryPauseForUpdate()) {
			if (!waitingLogged) {
				params.log(`node auto-update ${candidate.version} is ready; waiting for active work to finish`);
				waitingLogged = true;
			}
			return IDLE_CHECK_INTERVAL_MS;
		}
		try {
			const { assertNodeRuntimeUpdateCompatible } = await import("./auto-update-compatibility-4gmP2JZD.mjs");
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
			await requestNodeHostLauncherRestart({
				runtimeRoot: candidate.runtimeRoot,
				version: candidate.version
			});
			handedOff = true;
			params.log(`node auto-update restarting into ${candidate.version}`);
			params.onRestartAccepted();
			return CHECK_INTERVAL_MS;
		} finally {
			if (!handedOff) params.runtime.resumeAfterUpdate();
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
			signal,
			...process.versions.bun ? resolveUpdateRegistryTarget({ env }) : {},
			runCommand: process.versions.bun ? void 0 : (argv, options) => runCommandWithTimeout(argv, {
				...options,
				signal
			})
		});
		signal.throwIfAborted();
		if (available.error) throw new Error(`Node auto-update discovery failed: ${available.error}`);
		if (!available.version || (compareSemverStrings(available.version, VERSION) ?? 0) <= 0) return CHECK_INTERVAL_MS;
		if (!await activationAllowed()) return CHECK_INTERVAL_MS;
		params.log(`node auto-update preparing ${available.version}`);
		const { prepareNodeRuntimeUpdate } = await import("./auto-update-install-DTu_j64E.mjs");
		signal.throwIfAborted();
		const candidate = await prepareNodeRuntimeUpdate({
			targetVersion: available.version,
			stateDir,
			signal
		});
		signal.throwIfAborted();
		for (const warning of candidate.warnings ?? []) params.log(redactSensitiveText(warning));
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
	});
	return { stop: async () => {
		controller.abort();
		await task;
	} };
}
//#endregion
export { startNodeHostAutoUpdate };
