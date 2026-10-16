import { c as readErrorName, i as extractErrorCode, n as collectErrorGraphCandidates } from "./error-coercion-CvJK4lmH.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-DoBSDhBS.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import { v as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { u as isSqliteWorkerError } from "./sqlite-worker-contract-C51cJHzg.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { c as resolveOpenClawAgentSqlitePath, i as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { n as sessionChanges } from "./session-row-changes-BcJIdta8.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./io-CUI9EWW_.mjs";
import { a as getOpenClawAgentDatabaseIfOpen, f as withOpenClawAgentDatabaseAsync, u as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-DBug3LUA.mjs";
import { n as runOpenClawAgentWorkerWrite, r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-CKOCIcah.mjs";
import { r as BoardValidationError } from "./board-layout-6DyK3jbx.mjs";
import { t as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-CaPKglUL.mjs";
import { t as openOpenClawAgentSqliteWorkerStore } from "./openclaw-agent-worker-store-DpPONdtx.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { o as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { a as putBoardWidgetInDatabase, c as readBoardWidgetDocument, i as hasBoardSession, l as cloneBoardSnapshot, n as ensureBoardSchema, r as grantBoardWidgetInDatabase, s as readBoardSnapshotWithHtmlViewMetadata, t as applyBoardOpsToDatabase, u as normalizeBoardWidgetPutParams } from "./sqlite-board-store.kernel-4NufZP3t.mjs";
import { i as resolveSessionStoreIdentity } from "./session-store-key-Ci099tm9.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { randomBytes } from "node:crypto";
import { isPromise } from "node:util/types";
//#region src/boards/sqlite-board-store.ts
const log = createSubsystemLogger("boards/store");
function restoreBoardError(error) {
	if (error instanceof Error && error.name === "BoardValidationError" && "code" in error && (error.code === "conflict" || error.code === "invalid_operation" || error.code === "not_found")) return new BoardValidationError(error.code, error.message);
	return error;
}
/** Invalidation never grants retries; transported post-execution failures are plain Errors. */
function hasUnknownBoardWriteOutcome(error) {
	return collectErrorGraphCandidates(error, (current) => current instanceof AggregateError ? [current.cause] : []).some((current) => isSqliteWorkerError(current, "outcome-unknown") || current instanceof Error && readErrorName(current) === "SqliteWorkerError" && extractErrorCode(current) === "outcome-unknown");
}
function emptyBoardSnapshot(sessionKey) {
	return {
		sessionKey,
		revision: 0,
		tabs: [],
		widgets: []
	};
}
var SqliteBoardStore = class {
	constructor(options) {
		this.options = options;
	}
	assertTargetCurrent(target, resolved) {
		if (resolved.assertCurrent) {
			resolved.assertCurrent();
			return;
		}
		const current = this.options.resolveSession(target);
		if (current.agentId !== resolved.agentId || current.path !== resolved.path || current.sessionKey !== resolved.sessionKey) throw new BoardValidationError("invalid_operation", "board session changed; retry");
	}
	requireExistingSession(resolved, env) {
		const result = withOpenClawAgentDatabaseReadOnly((database) => hasBoardSession(database, resolved.sessionKey), {
			agentId: resolved.agentId,
			...resolved.path ? { path: resolved.path } : {},
			env
		});
		if (!result.found || !result.value) throw new BoardValidationError("not_found", `board session not found: ${resolved.sessionKey}`);
	}
	write(target, options, operationLabel, native, worker, prepare) {
		const resolved = this.options.resolveSession(target);
		const env = cloneEnvWithPlatformSemantics(this.options.env ?? process.env);
		env.OPENCLAW_STATE_DIR = resolveStateDir(env);
		const databaseOptions = {
			agentId: resolved.agentId,
			env,
			path: resolveOpenClawAgentSqlitePath({
				...resolved,
				env
			})
		};
		const assertCurrent = () => {
			options?.assertCurrent?.();
			this.assertTargetCurrent(target, resolved);
		};
		const assertOpenCurrent = () => {
			assertCurrent();
			this.requireExistingSession({
				...resolved,
				path: databaseOptions.path
			}, env);
		};
		assertOpenCurrent();
		return runOpenClawAgentWriteAdmission(databaseOptions, () => withOpenClawAgentDatabaseAsync(databaseOptions, async (database) => {
			if (prepare) await prepare();
			assertCurrent();
			if (prepare && getOpenClawAgentDatabaseIfOpen(databaseOptions) !== database) throw new BoardValidationError("invalid_operation", "board database closed or changed; retry");
			ensureBoardSchema(database);
			if (typeof readOpenClawAgentDatabaseIdentity(database).identity === "symbol") return runOpenClawAgentWriteTransaction((current) => {
				assertCurrent();
				return native(current, resolved.sessionKey);
			}, databaseOptions, { operationLabel });
			const publication = await openOpenClawAgentSqliteWorkerStore(databaseOptions, database.db, {
				moduleUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.boardStore),
				input: void 0
			});
			let outcome;
			try {
				outcome = {
					ok: true,
					value: await publication.run(async (scope) => {
						let committed;
						try {
							committed = await worker(scope, resolved.sessionKey);
						} catch (error) {
							if (hasUnknownBoardWriteOutcome(error)) sessionChanges.emit({
								sessionKey: resolved.sessionKey,
								storePath: database.path
							});
							throw error;
						}
						sessionChanges.emitBatch(committed.changes);
						return committed.value;
					}, assertCurrent)
				};
			} catch (error) {
				outcome = {
					ok: false,
					error: restoreBoardError(error)
				};
			}
			let cleanup;
			try {
				await publication.close();
				cleanup = {
					ok: true,
					value: void 0
				};
			} catch (error) {
				cleanup = {
					ok: false,
					error
				};
			}
			if (!outcome.ok) {
				if (!cleanup.ok) throw new AggregateError([outcome.error, cleanup.error], "Board publication and cleanup failed", { cause: outcome.error });
				throw outcome.error;
			}
			if (!cleanup.ok) try {
				log.warn(`Board publication completed before cleanup failed: ${formatErrorMessage(cleanup.error)}`);
			} catch {}
			return outcome.value;
		}, assertOpenCurrent), true);
	}
	async getSnapshot(target) {
		return this.useSnapshot(target, (snapshot) => snapshot);
	}
	async getSnapshotWithHtmlViewMetadata(target) {
		return this.consumeSnapshotWithHtmlViewMetadata(target, (snapshot) => snapshot);
	}
	async consumeRead(target, native, worker, consume) {
		const capturedTarget = { ...target };
		const resolved = this.options.resolveSession(capturedTarget);
		const env = cloneEnvWithPlatformSemantics(this.options.env ?? process.env);
		env.OPENCLAW_STATE_DIR = resolveStateDir(env);
		const captured = {
			agentId: resolved.agentId,
			sessionKey: resolved.sessionKey,
			env,
			path: resolveOpenClawAgentSqlitePath({
				...resolved,
				env
			})
		};
		const runInCallerContext = AsyncLocalStorage.snapshot();
		const accept = (value) => {
			this.assertTargetCurrent(capturedTarget, resolved);
			const result = runInCallerContext(consume, value, captured.sessionKey);
			if (isPromise(result)) result.catch(() => {});
			return { value: result };
		};
		if (isIncognitoOpenClawAgentSqlitePath(captured.path, captured)) return await (await runOpenClawAgentWorkerWrite(captured, async () => {
			this.assertTargetCurrent(capturedTarget, resolved);
			const read = withOpenClawAgentDatabaseReadOnly((database) => native(database, captured.sessionKey), captured);
			return accept(read.found ? read.value : void 0);
		})).value;
		const identity = readDatabasePathIdentitySync(captured.path);
		if (!identity.key.startsWith("file:")) return await (await runOpenClawAgentWorkerWrite(captured, async () => accept(void 0))).value;
		const execution = captureOpenClawAgentDatabaseExecution(captured, { expectedIdentity: {
			kind: "file",
			physicalIdentity: identity.key.slice(5),
			nativeLocation: identity.canonicalPath,
			birthtime: identity.birthtime
		} });
		const assertCurrent = () => {
			execution.assertCurrent();
			this.assertTargetCurrent(capturedTarget, resolved);
		};
		let publication;
		let result;
		const failures = [];
		try {
			result = await runOpenClawAgentWriteAdmission(captured, async () => {
				publication = await openOpenClawAgentSqliteWorkerStore(captured, { execution }, {
					moduleUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.boardStore),
					input: "read"
				});
				return publication.run(async (scope) => {
					const value = await worker(scope, captured.sessionKey);
					assertCurrent();
					return accept(value);
				}, assertCurrent);
			}, true);
		} catch (error) {
			failures.push(restoreBoardError(error));
		} finally {
			for (const close of [() => publication?.close(), () => execution.release()]) try {
				await close();
			} catch (error) {
				failures.push(error);
			}
		}
		throwSqliteLifecycleErrors(failures, "Board read and cleanup failed");
		return await result.value;
	}
	async useSnapshot(target, consume) {
		return this.consumeSnapshotWithHtmlViewMetadata(target, ({ snapshot }) => consume(snapshot));
	}
	async useWidgetDocument(target, name, consume) {
		return this.consumeWidgetDocument(target, name, consume);
	}
	consumeSnapshotWithHtmlViewMetadata(target, consume) {
		return this.consumeRead(target, readBoardSnapshotWithHtmlViewMetadata, (scope, sessionKey) => scope.execute({
			type: "boards.readSnapshot",
			input: { sessionKey }
		}), (stored, sessionKey) => consume({
			snapshot: cloneBoardSnapshot(stored?.snapshot ?? emptyBoardSnapshot(sessionKey)),
			htmlViewMetadata: stored?.htmlViewMetadata ?? /* @__PURE__ */ new Map()
		}));
	}
	async applyOps(target, ops, options) {
		if (ops.length === 0) return this.getSnapshot(target);
		const capturedOps = structuredClone(ops);
		return this.write(target, options, "board.apply-ops", (database, sessionKey) => applyBoardOpsToDatabase(database, sessionKey, capturedOps), (scope, sessionKey) => scope.execute({
			type: "boards.applyOps",
			input: {
				sessionKey,
				ops: capturedOps
			}
		}));
	}
	async putWidget(params, options) {
		const capturedParams = structuredClone(params);
		const viewGeneration = randomBytes(16).toString("hex");
		let preparedParams = capturedParams;
		const content = capturedParams.content;
		const resolveInteraction = options?.resolveMcpAppInteraction;
		const prepare = content.kind === "mcp-app" && content.interactive && resolveInteraction ? async () => {
			if (!await resolveInteraction()) preparedParams = {
				...capturedParams,
				content: {
					...content,
					interactive: false
				},
				declared: void 0
			};
		} : void 0;
		return this.write(params, options, "board.put-widget", (database, sessionKey) => putBoardWidgetInDatabase(database, sessionKey, normalizeBoardWidgetPutParams(preparedParams, sessionKey), viewGeneration), (scope, sessionKey) => scope.execute({
			type: "boards.putWidget",
			input: {
				sessionKey,
				params: preparedParams,
				viewGeneration
			}
		}), prepare);
	}
	async grant(target, name, decision, revision, instanceId, options) {
		return this.write(target, options, "board.grant-widget", (database, sessionKey) => grantBoardWidgetInDatabase(database, sessionKey, name, decision, revision, instanceId), (scope, sessionKey) => scope.execute({
			type: "boards.grant",
			input: {
				sessionKey,
				name,
				decision,
				revision,
				instanceId
			}
		}));
	}
	consumeWidgetDocument(target, name, consume, contentKind) {
		return this.consumeRead(target, (database, sessionKey) => readBoardWidgetDocument(database, sessionKey, name, contentKind), (scope, sessionKey) => scope.execute({
			type: "boards.readWidgetDocument",
			input: {
				sessionKey,
				name,
				contentKind
			}
		}), consume);
	}
	async readWidgetMcpApp(target, name) {
		return this.consumeWidgetDocument(target, name, (document) => document && "descriptor" in document ? document : void 0, "mcp-app");
	}
};
//#endregion
//#region src/gateway/board-store.ts
function captureGatewaySessionStoreScope(sessionKey, explicitAgentId) {
	const cfg = getRuntimeConfig();
	const { agentId, canonicalKey } = resolveSessionStoreIdentity({
		cfg,
		sessionKey,
		agentId: explicitAgentId
	});
	return {
		agentId,
		storePath: resolveSessionStorePathCore(cfg.session?.store, { agentId }),
		sessionKey: canonicalKey
	};
}
function resolveGatewaySessionDatabase(sessionKey, explicitAgentId) {
	const { agentId, storePath, sessionKey: canonicalKey } = captureGatewaySessionStoreScope(sessionKey, explicitAgentId);
	const databaseTarget = resolveSqliteTargetFromSessionStorePath(storePath, { agentId });
	return {
		agentId: databaseTarget.agentId ?? agentId,
		path: databaseTarget.path,
		sessionKey: canonicalKey
	};
}
const boardStore = new SqliteBoardStore({ resolveSession: ({ sessionKey, agentId }) => {
	const scope = captureGatewaySessionStoreScope(sessionKey, agentId);
	return {
		...resolveGatewaySessionDatabase(sessionKey, agentId),
		assertCurrent() {
			const current = captureGatewaySessionStoreScope(sessionKey, agentId);
			if (current.agentId !== scope.agentId || current.storePath !== scope.storePath || current.sessionKey !== scope.sessionKey) throw new BoardValidationError("invalid_operation", "board session changed; retry");
		}
	};
} });
//#endregion
export { captureGatewaySessionStoreScope as n, boardStore as t };
