import { r as getAsyncWorkSignal } from "./async-work-scope-BH2yUdBz.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as parseProviderModelRef } from "./model-catalog-refs-D3xvQZh0.mjs";
import { m as resolveAmbientOwnerAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { r as resolveModelRuntimePolicy } from "./model-runtime-policy-DSkspt0X.mjs";
import { n as createMergePatch, t as applyMergePatch } from "./merge-patch-D-eANYlX.mjs";
import { s as readConfigFileSnapshot } from "./io.runtime-Ds5uC0Bf.mjs";
import "./config-B3oiWDlr.mjs";
import { r as resolveConfiguredPrimaryModelForAgent } from "./utility-model-nsnbR10X.mjs";
import { c as transformConfigWithPendingPluginInstalls } from "./install-record-commit-zYfMjC8g.mjs";
import { i as appendSystemAgentAuditEntry } from "./audit-DxyhTU4L.mjs";
import { f as redactSetupInferenceError, o as SetupInferenceOwnerDriftError, r as SetupInferenceActivationIndeterminateError } from "./setup-inference-core-CZLQ-ncs.mjs";
import { i as setupConfigPatchConflicts, n as commitSetupInferenceActivation, t as captureSetupInferenceFileUndo } from "./setup-inference-transition-BIutiuYm.mjs";
import { a as applySetupNativeSessionCatalogPreference, l as rankSetupInferenceCandidates, r as detectSetupInference, t as prepareAutomaticSetupCodex } from "./setup-inference-codex-BgyzC41F.mjs";
import { i as runExclusiveSystemAgentSetupActivation } from "./setup-admission-Cra7-OqR.mjs";
import { n as createSystemAgentGatewayRuntime, r as runSystemAgentGatewayTask, t as activateGatewaySetupInference } from "./system-agent-execution-DAJfPE1K.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/server-methods/system-agent-setup-auto.ts
const runs = /* @__PURE__ */ new WeakMap();
function present(candidate) {
	const { kind, label, detail, modelRef, brandId, icon } = candidate;
	return {
		kind,
		label,
		detail,
		modelRef,
		...brandId ? { brandId } : {},
		...icon ? { icon } : {}
	};
}
/** Accepted setup belongs to the Gateway; disconnecting a joining caller does not cancel it. */
function runGatewayAutomaticSetup(context, assertAuthority) {
	assertAuthority();
	const previous = runs.get(context.wizardSessions);
	if (previous) return previous;
	const run = runExclusiveSystemAgentSetupActivation(() => autoSetup(assertAuthority));
	runs.set(context.wizardSessions, run);
	run.finally(() => runs.delete(context.wizardSessions)).catch(() => {});
	return run;
}
async function autoSetup(assertAuthority) {
	const runtime = createSystemAgentGatewayRuntime();
	const signal = getAsyncWorkSignal();
	const assertCurrent = () => {
		signal?.throwIfAborted();
		assertAuthority();
	};
	const detection = await runSystemAgentGatewayTask(() => detectSetupInference());
	let ranked = rankSetupInferenceCandidates(detection.candidates);
	const attempts = [];
	const failed = /* @__PURE__ */ new Set();
	const installedPlugins = [];
	let codexNeedsSignIn = false;
	let shared = false;
	let authOptions = detection.authOptions;
	const result = (status, selected) => {
		assertCurrent();
		const separateSignIn = shared ? authOptions.find((option) => option.brandId === "openai" && (option.kind === "oauth" || option.kind === "device-code")) : void 0;
		return {
			status,
			...selected ? { selected: {
				...present(selected),
				...shared ? { shared: true } : {}
			} } : {},
			...separateSignIn ? { separateSignIn: {
				authOptionId: separateSignIn.id,
				label: separateSignIn.label
			} } : {},
			alternatives: ranked.filter((candidate) => candidate !== selected && !failed.has(candidate.kind)).map(present),
			attempts,
			installedPlugins
		};
	};
	const initialSnapshot = await readConfigFileSnapshot();
	if (detection.setupComplete) {
		const config = initialSnapshot.runtimeConfig ?? initialSnapshot.config;
		const agentId = resolveAmbientOwnerAgentId(config);
		const modelRef = resolveConfiguredPrimaryModelForAgent({
			cfg: config,
			agentId
		});
		const ref = modelRef ? parseProviderModelRef(modelRef) : void 0;
		const appServer = config.plugins?.entries?.codex?.config?.appServer;
		shared = Boolean(ref && isRecord(appServer) && appServer.homeScope === "user" && resolveModelRuntimePolicy({
			config,
			agentId,
			provider: ref.provider,
			modelId: ref.model
		}).policy?.id === "codex");
		const selected = ranked.find((candidate) => candidate.kind === "existing-model");
		if (selected) return result("configured", selected);
		if (modelRef) return result("configured", {
			kind: "existing-model",
			label: "Current model",
			detail: "Already configured",
			modelRef,
			recommended: true,
			credentials: true
		});
		throw new Error("The configured model changed during automatic setup. Retry setup.");
	}
	const codexWasEnabled = resolvePluginMetadataSnapshot({
		config: initialSnapshot.config,
		workspaceDir: detection.workspace
	}).index.plugins.some((plugin) => plugin.pluginId === "codex" && plugin.enabled);
	const recordCodexInstall = () => {
		if (!codexWasEnabled && !installedPlugins.includes("codex")) installedPlugins.push("codex");
	};
	const activate = async (candidate) => {
		assertCurrent();
		let commitStarted = false;
		const activation = await activateGatewaySetupInference({
			kind: candidate.kind,
			modelRef: candidate.modelRef,
			surface: "gateway",
			runtime,
			signal,
			automaticSetup: true,
			activationConfirmed: true,
			nativeSessionCatalogsEnabled: false,
			beforePersistentEffect: assertCurrent,
			isCancelled: () => {
				assertCurrent();
				return false;
			},
			onCommitStarted: () => {
				commitStarted = true;
			}
		}).catch(async (error) => {
			assertCurrent();
			if (commitStarted || error instanceof SetupInferenceActivationIndeterminateError || signal?.aborted) throw error;
			return {
				ok: false,
				status: "unavailable",
				error: await redactSetupInferenceError(error)
			};
		});
		if (activation.ok) {
			candidate.modelRef = activation.modelRef;
			if (candidate.kind === "codex-cli") {
				shared = true;
				recordCodexInstall();
			}
			return true;
		}
		failed.add(candidate.kind);
		if (candidate.kind === "codex-cli" && activation.status === "auth") codexNeedsSignIn = true;
		attempts.push({
			kind: candidate.kind,
			label: candidate.label,
			error: activation.error
		});
		return false;
	};
	for (const candidate of ranked.slice(0, 3)) if (await activate(candidate)) return result("activated", candidate);
	try {
		let complete;
		try {
			await runSystemAgentGatewayTask(async () => {
				const snapshot = await readConfigFileSnapshot();
				assertCurrent();
				const prepared = await prepareAutomaticSetupCodex({
					cfg: snapshot.runtimeConfig ?? snapshot.config,
					workspace: detection.workspace,
					runtime,
					signal,
					beforePersistentEffect: assertCurrent,
					beforePersistentApply: assertCurrent
				});
				if ("error" in prepared) throw new Error(prepared.error);
				const config = applySetupNativeSessionCatalogPreference({
					config: prepared.config,
					workspaceDir: detection.workspace,
					enabled: false,
					onlyUnset: true
				});
				const patch = createMergePatch(snapshot.runtimeConfig ?? snapshot.config, config);
				const target = {
					read: async () => ({
						config: (await readConfigFileSnapshot()).sourceConfig,
						write: target.write
					}),
					write: async (_config, { writeOptions, captureUndo }) => {
						return (await transformConfigWithPendingPluginInstalls({
							base: "source",
							writeOptions,
							transform: (current, { snapshot: latest }) => {
								assertCurrent();
								if (setupConfigPatchConflicts(snapshot.sourceConfig, current, patch)) throw new SetupInferenceOwnerDriftError("Setup settings changed while preparing Codex. Retry automatic setup.");
								const nextConfig = applyMergePatch(current, patch);
								captureUndo(captureSetupInferenceFileUndo(latest, nextConfig));
								return { nextConfig };
							}
						})).nextConfig;
					}
				};
				if (!isDeepStrictEqual(config, snapshot.runtimeConfig ?? snapshot.config)) await commitSetupInferenceActivation({
					config,
					configTarget: target,
					requireApplied: true,
					assertCurrent,
					activate: async () => void 0,
					deferCompletion: (completion) => {
						complete = completion;
					}
				});
				recordCodexInstall();
			});
		} finally {
			await complete?.();
		}
		assertCurrent();
		try {
			await appendSystemAgentAuditEntry({
				operation: "openclaw.setup.auto",
				summary: "Prepared the official Codex plugin for automatic setup",
				details: {
					source: "automatic-setup",
					pluginId: "codex"
				}
			});
		} catch (error) {
			runtime.error?.(`Codex is prepared, but its setup audit could not be recorded: ${await redactSetupInferenceError(error)}`);
		}
		const refreshed = await runSystemAgentGatewayTask(() => detectSetupInference());
		ranked = rankSetupInferenceCandidates(refreshed.candidates);
		authOptions = refreshed.authOptions;
		const codex = ranked.find((candidate) => candidate.kind === "codex-cli");
		if (codex && attempts.length < 4 && await activate(codex)) return result("activated", codex);
		if (!codex || codexNeedsSignIn) {
			const signIn = refreshed.authOptions.find((option) => option.brandId === "openai" && (option.kind === "oauth" || option.kind === "device-code"));
			if (signIn) return {
				...result("needs-sign-in"),
				signIn: {
					authOptionId: signIn.id,
					label: signIn.label
				}
			};
			throw new Error("Codex is installed, but its ChatGPT sign-in option is unavailable.");
		}
	} catch (error) {
		assertCurrent();
		if (error instanceof SetupInferenceActivationIndeterminateError || signal?.aborted) throw error;
		const detail = await redactSetupInferenceError(error);
		const lastAttempt = attempts.at(-1);
		if (attempts.length === 4 && lastAttempt) lastAttempt.error += ` Codex preparation also failed: ${detail}`;
		else attempts.push({
			kind: "codex-cli",
			label: "Codex",
			error: detail
		});
	}
	return result("unavailable");
}
//#endregion
export { runGatewayAutomaticSetup };
