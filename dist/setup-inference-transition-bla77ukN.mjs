import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { C as createRuntimeConfigWriteApplication, S as copyRuntimeConfigWriteApplication, c as readConfigFileSnapshot, x as attachRuntimeConfigWriteApplication } from "./io.runtime-BN-rPaec.mjs";
import { n as createMergePatch, t as applyMergePatch } from "./merge-patch-C1--BlNd.mjs";
import { o as transformConfigFileWithRetry } from "./mutate-CDIHLSip.mjs";
import "./config-Ciq2mxdN.mjs";
import { i as captureGatewayRootWorkAdmissionContinuationScope } from "./gateway-work-admission-CHv_0noy.mjs";
import { o as SetupInferenceOwnerDriftError } from "./setup-inference-core-CJd1l_r5.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/system-agent/setup-inference-transition.ts
function setupConfigPatchConflicts(base, current, patch) {
	if (!isRecord(patch)) return !isDeepStrictEqual(base, current);
	if (isRecord(base) !== isRecord(current) || !isRecord(base) && !isDeepStrictEqual(base, current)) return true;
	const before = isRecord(base) ? base : {};
	const now = isRecord(current) ? current : {};
	return Object.entries(patch).some(([key, change]) => setupConfigPatchConflicts(before[key], now[key], change));
}
function restoreSetupInferenceConfig(current, before, after) {
	if (!setupConfigPatchConflicts(before, current, createMergePatch(before, after))) return {
		config: current,
		written: false
	};
	const reverse = createMergePatch(after, before);
	if (setupConfigPatchConflicts(after, current, reverse)) throw new SetupInferenceOwnerDriftError("Newer connection settings superseded this activation. Those settings were preserved.");
	return {
		config: applyMergePatch(current, reverse),
		written: true
	};
}
/** Captures only this file writer's effects, before its guarded commit can start. */
function captureSetupInferenceFileUndo(snapshot, candidate) {
	return async (writeOptions) => {
		const current = await readConfigFileSnapshot();
		if (current.path !== snapshot.path) throw new SetupInferenceOwnerDriftError("The configuration owner changed before activation recovery.");
		if (!restoreSetupInferenceConfig(current.sourceConfig, snapshot.sourceConfig, candidate).written) return {
			config: current.runtimeConfig ?? current.config,
			written: false
		};
		return {
			config: (await transformConfigFileWithRetry({
				base: "source",
				writeOptions: copyRuntimeConfigWriteApplication(writeOptions, {
					...writeOptions,
					expectedConfigPath: snapshot.path
				}),
				transform: (config) => ({ nextConfig: restoreSetupInferenceConfig(config, snapshot.sourceConfig, candidate).config })
			})).nextConfig,
			written: true
		};
	};
}
/** Setup coordinates effects; the selected config and auth owners retain their own undo. */
async function commitSetupInferenceActivation(params) {
	const continuation = captureGatewayRootWorkAdmissionContinuationScope()?.run;
	let credential;
	let undoConfig;
	let assertApplicationCurrent = params.assertCurrent;
	let activated = false;
	let configCommitted = false;
	const activate = async (assertCurrent) => {
		assertApplicationCurrent = assertCurrent;
		params.assertCurrent();
		assertCurrent();
		if (!activated) {
			credential = await params.activate(assertCurrent);
			activated = true;
		}
	};
	const application = params.deferCompletion ? createRuntimeConfigWriteApplication(continuation, {
		prepare: activate,
		requireImmediateApplication: params.preserveWorkingConnection
	}) : void 0;
	const restore = async () => {
		const restoredApplication = application ? createRuntimeConfigWriteApplication(continuation, { prepare: async (assertCurrent) => {
			assertApplicationCurrent = assertCurrent;
		} }) : void 0;
		const restored = configCommitted && undoConfig ? await undoConfig(attachRuntimeConfigWriteApplication({}, restoredApplication)) : {
			config: (await params.configTarget.read()).config,
			written: false
		};
		credential?.rollback();
		if (restoredApplication && restored.written) {
			if (!restoredApplication.claimed || await restoredApplication.result !== "applied") throw new Error("The previous connection was restored on disk, but the Gateway could not apply it. Restart the Gateway before chatting.");
		}
	};
	const recover = async (error) => {
		try {
			await restore();
		} catch (recoveryError) {
			throw new AggregateError([error, recoveryError], `Activation failed and recovery could not complete. ${formatErrorMessage(recoveryError)}`, { cause: recoveryError });
		}
		throw error;
	};
	let config;
	try {
		config = await params.configTarget.write(params.config, {
			captureUndo: (undo) => {
				undoConfig = undo;
			},
			writeOptions: attachRuntimeConfigWriteApplication({
				assertCurrent: params.assertCurrent,
				...application && params.preserveWorkingConnection ? { runtimeRefresh: { requireImmediateApplication: true } } : {}
			}, application)
		});
		configCommitted = true;
	} catch (error) {
		if (!credential) throw error;
		if (params.deferCompletion) {
			params.deferCompletion(async () => {
				if (application?.claimed) await application.result;
				return await recover(error);
			});
			throw error;
		}
		return await recover(error);
	}
	const complete = async () => {
		try {
			if (application) {
				const status = application.claimed ? await application.result : "unclaimed";
				if (!params.preserveWorkingConnection && (status === "restart-pending" || status === "applied-restart-required")) return true;
				if (status !== "applied") throw new Error(`The Gateway did not complete activation (${status}). Resolve the reported problem, then retry the saved sign-in.`);
			} else await activate(params.assertCurrent);
			params.assertCurrent();
			assertApplicationCurrent();
			credential?.assertCurrent();
			return false;
		} catch (error) {
			return await recover(error);
		}
	};
	if (params.deferCompletion) params.deferCompletion(complete);
	else await complete();
	return config;
}
//#endregion
export { setupConfigPatchConflicts as i, commitSetupInferenceActivation as n, restoreSetupInferenceConfig as r, captureSetupInferenceFileUndo as t };
