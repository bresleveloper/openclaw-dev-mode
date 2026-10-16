import { c as pruneWorkspaceHashMemo, h as withWorkspaceHashMemo, o as measureLocalWorkspaceReconciliation } from "./workspace-hash-memo-CLHlwU2N.mjs";
import { i as recoverWorkerWorkspaceReconciliation, o as inspectAcceptedWorkerWorkspace } from "./workspace-reconcile-DEtkg-5s.mjs";
import { a as NODE_WORKSPACE_QUIESCENCE_COMMAND } from "./node-workspace-protocol-umi8DFKH.mjs";
import { p as workerWorkspaceResultStaging } from "./workspace-result-staging-BH0OcWj7.mjs";
import { t as workspaceQuiescenceArgv } from "./workspace-quiescence-scripts-Ej5s1Kgx.mjs";
import { h as workerWorkspaceCommandSucceeded, p as waitForQuiescenceRenewal, y as workspaceSyncError } from "./workspace-sync-helpers-CJW1gdNZ.mjs";
import path from "node:path";
import { randomBytes } from "node:crypto";
//#region src/gateway/worker-environments/workspace-local-reconciliation.ts
/** Accepts authenticated transport snapshots through one local journal and result owner. */
async function prepareLocalWorkspaceReconciliation(params) {
	const { request, hashMemo, metrics } = params;
	const pending = await request.journal.load();
	if (pending) {
		await recoverWorkerWorkspaceReconciliation({
			root: request.localPath,
			journal: pending,
			assertCurrent: request.assertCurrent
		});
		request.assertCurrent?.();
		await request.journal.abort();
	}
	pruneWorkspaceHashMemo(hashMemo);
	const runLocal = (operation) => measureLocalWorkspaceReconciliation(metrics, () => withWorkspaceHashMemo(hashMemo, operation, metrics.gateway));
	return async (snapshot) => {
		const inspected = snapshot.currentManifestRef === request.baseManifestRef ? await runLocal(() => inspectAcceptedWorkerWorkspace({
			root: request.localPath,
			expectedManifestRef: request.baseManifestRef,
			base: snapshot.base,
			current: snapshot.current
		})) : void 0;
		const unchanged = inspected?.conflictPaths.length === 0 ? inspected : void 0;
		if (!unchanged) await snapshot.verifyStable();
		const staged = await runLocal(() => workerWorkspaceResultStaging.prepareRequestedWorkerWorkspaceResult({
			request,
			stagingRoot: snapshot.stagingRoot,
			currentManifestRef: snapshot.currentManifestRef,
			baseManifestRaw: snapshot.baseRaw,
			currentManifestRaw: snapshot.currentRaw,
			publishAcceptedManifest: snapshot.publishAcceptedManifest,
			unchanged
		}));
		const { acceptUnchangedStagedResult } = staged;
		return {
			get manifestRef() {
				return snapshot.manifestRef();
			},
			changed: snapshot.currentManifestRef !== request.baseManifestRef,
			verifyStable: snapshot.verifyStable,
			...staged,
			applyPreparedStagedResult: () => runLocal(staged.applyPreparedStagedResult),
			...acceptUnchangedStagedResult ? { acceptUnchangedStagedResult: () => runLocal(acceptUnchangedStagedResult) } : {},
			verifyLocalStable: () => runLocal(() => staged.verifyLocalStable())
		};
	};
}
//#endregion
//#region src/gateway/worker-environments/workspace-quiescence.ts
const WORKSPACE_QUIESCENCE_TIMEOUT_MS = 72e4;
const WORKSPACE_QUIESCENCE_RENEW_INTERVAL_MS = 24e4;
function createWorkerWorkspaceQuiescence(params) {
	return async (remoteWorkspaceDir) => {
		const posixAbsolute = path.posix.isAbsolute(remoteWorkspaceDir);
		const windowsAbsolute = path.win32.isAbsolute(remoteWorkspaceDir);
		if (!posixAbsolute && !windowsAbsolute) throw new Error("Worker workspace quiescence path must be absolute");
		if (!posixAbsolute && windowsAbsolute && !params.sharedHost) throw new Error("Windows worker workspace quiescence requires a shared host");
		const hostMode = params.sharedHost ? "shared-host" : "dedicated";
		const nativeWatchdog = await params.nativeWatchdog?.() ?? false;
		params.ownerSignal.throwIfAborted();
		const nativeNonce = randomBytes(16).toString("hex");
		const run = async (operation) => {
			const result = await params.runWorkspaceCommand({
				transportRetry: "never",
				argv: nativeWatchdog ? [NODE_WORKSPACE_QUIESCENCE_COMMAND, remoteWorkspaceDir] : workspaceQuiescenceArgv(remoteWorkspaceDir, operation, hostMode),
				...nativeWatchdog ? { quiescence: operation } : { legacyQuiescence: true }
			});
			if (!workerWorkspaceCommandSucceeded(result)) throw workspaceSyncError(result);
			return result;
		};
		let nonce;
		try {
			const result = await run({
				action: "acquire",
				nonce: nativeNonce,
				timeoutMs: WORKSPACE_QUIESCENCE_TIMEOUT_MS
			});
			const acknowledgement = /^quiesced ([a-f0-9]{32})$/u.exec(result.stdout.trim());
			if (!acknowledgement || nativeWatchdog && acknowledgement[1] !== nativeNonce) throw new Error("Worker workspace quiescence returned an invalid acknowledgement");
			nonce = acknowledgement[1];
		} catch (error) {
			if (nativeWatchdog && !params.ownerSignal.aborted) try {
				await run({
					action: "release",
					nonce: nativeNonce
				});
			} catch (recoveryError) {
				throw new AggregateError([error, recoveryError], "Worker workspace quiescence acquisition failed and recovery did not complete", { cause: recoveryError });
			}
			throw error;
		}
		let releasePromise;
		let renewalFailure;
		const renewalAbort = new AbortController();
		const renewalSignal = AbortSignal.any([params.ownerSignal, renewalAbort.signal]);
		let renewalQueue = Promise.resolve();
		const renew = (validationMode) => {
			const operation = renewalQueue.then(async () => {
				if ((await run({
					action: "renew",
					nonce,
					timeoutMs: WORKSPACE_QUIESCENCE_TIMEOUT_MS,
					validationMode
				})).stdout.trim() !== `renewed ${nonce}`) throw new Error("Worker workspace quiescence renewal returned an invalid acknowledgement");
			});
			renewalQueue = operation.catch(() => void 0);
			return operation;
		};
		const renewalLoop = (async () => {
			while (!renewalSignal.aborted) {
				if (!await waitForQuiescenceRenewal(renewalSignal, WORKSPACE_QUIESCENCE_RENEW_INTERVAL_MS)) return;
				try {
					await renew("heartbeat");
				} catch (error) {
					renewalFailure = error;
					return;
				}
			}
		})();
		return {
			assertActive: async () => {
				if (renewalSignal.aborted) throw new Error("Worker workspace quiescence was already released");
				if (renewalFailure) throw new Error("Worker workspace quiescence renewal failed", { cause: renewalFailure });
				await renew("final");
			},
			resume: async () => {
				releasePromise ??= (async () => {
					renewalAbort.abort();
					await renewalLoop;
					await renewalQueue;
					if (!params.ownerSignal.aborted) await run({
						action: "release",
						nonce
					});
				})().catch((error) => {
					if (params.ownerSignal.aborted) return;
					releasePromise = void 0;
					throw error;
				});
				await releasePromise;
			}
		};
	};
}
//#endregion
export { prepareLocalWorkspaceReconciliation as n, createWorkerWorkspaceQuiescence as t };
