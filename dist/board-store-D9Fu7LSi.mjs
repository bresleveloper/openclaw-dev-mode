import { c as readErrorName, i as extractErrorCode, n as collectErrorGraphCandidates } from "./error-coercion-C787aVxk.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHI12YH5.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-DazJcPEG.mjs";
import { r as resolveRuntimeWorkerUrl } from "./runtime-worker-url-B4o9tqvO.mjs";
import { a as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { t as sessionChanges } from "./session-row-changes-xuu0eHng.mjs";
import { a as isSqliteWorkerError } from "./sqlite-worker-contract-DgNznZvn.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./io-C0BSvvM5.mjs";
import { i as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-DLTnzTd_.mjs";
import { f as runOpenClawAgentWriteTransaction, m as withOpenClawAgentDatabaseAsync, s as getOpenClawAgentDatabaseIfOpen } from "./openclaw-agent-db-CaQAStOA.mjs";
import { n as runOpenClawAgentWorkerWrite, r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-b9fAKekK.mjs";
import { r as BoardValidationError } from "./board-layout-6DyK3jbx.mjs";
import { t as openOpenClawAgentSqliteWorkerStore } from "./openclaw-agent-worker-store-DpwCZ9_q.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-IBx2zWDG.mjs";
import { s as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Dcog4O-M.mjs";
import { a as putBoardWidgetInDatabase, c as readBoardWidgetRow, d as normalizeBoardWidgetPutParams, i as hasBoardSession, l as rowToBoardWidgetDocument, n as ensureBoardSchema, r as grantBoardWidgetInDatabase, s as readBoardSnapshotWithHtmlViewMetadata, t as applyBoardOpsToDatabase, u as cloneBoardSnapshot } from "./sqlite-board-store.kernel--WWNhhyI.mjs";
import { r as resolveSessionStoreIdentity } from "./session-store-key-BoleEY7N.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { randomBytes } from "node:crypto";
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
	resolve(target) {
		return this.options.resolveSession(target);
	}
	assertTargetCurrent(target, resolved) {
		const current = this.resolve(target);
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
		const resolved = this.resolve(target);
		const env = cloneEnvWithPlatformSemantics(this.options.env ?? process.env);
		env.OPENCLAW_STATE_DIR = resolveStateDir(env);
		const databaseOptions = {
			...resolved,
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
		return this.readSnapshotWithHtmlViewMetadata(this.resolve(target)).snapshot;
	}
	async getSnapshotWithHtmlViewMetadata(target) {
		return this.readSnapshotWithHtmlViewMetadata(this.resolve(target));
	}
	async consumeRead(target, consume) {
		const resolved = this.resolve(target);
		const env = cloneEnvWithPlatformSemantics(this.options.env ?? process.env);
		env.OPENCLAW_STATE_DIR = resolveStateDir(env);
		const captured = {
			...resolved,
			env,
			path: resolveOpenClawAgentSqlitePath({
				...resolved,
				env
			})
		};
		const runInCallerContext = AsyncLocalStorage.snapshot();
		return await (await runOpenClawAgentWorkerWrite(captured, async () => {
			this.assertTargetCurrent(target, resolved);
			return { value: runInCallerContext(consume, captured, env) };
		})).value;
	}
	async useSnapshot(target, consume) {
		return this.consumeRead(target, (resolved, env) => consume(this.readSnapshotWithHtmlViewMetadata(resolved, env).snapshot));
	}
	async useWidgetDocument(target, name, consume) {
		return this.consumeRead(target, (resolved, env) => consume(this.readWidgetDocument(resolved, name, void 0, env)));
	}
	readSnapshotWithHtmlViewMetadata(resolved, env = this.options.env) {
		const result = withOpenClawAgentDatabaseReadOnly((database) => readBoardSnapshotWithHtmlViewMetadata(database, resolved.sessionKey), {
			agentId: resolved.agentId,
			...resolved.path ? { path: resolved.path } : {},
			env
		});
		const stored = result.found ? result.value : void 0;
		return {
			snapshot: cloneBoardSnapshot(stored?.snapshot ?? emptyBoardSnapshot(resolved.sessionKey)),
			htmlViewMetadata: stored?.htmlViewMetadata ?? /* @__PURE__ */ new Map()
		};
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
	readWidgetDocument(resolved, name, contentKind, env = this.options.env) {
		const result = withOpenClawAgentDatabaseReadOnly((database) => readBoardWidgetRow(database, resolved.sessionKey, name), {
			agentId: resolved.agentId,
			...resolved.path ? { path: resolved.path } : {},
			env
		});
		const row = result.found ? result.value : void 0;
		return row && (!contentKind || row.content_kind === contentKind) ? rowToBoardWidgetDocument(row) : void 0;
	}
	async readWidgetMcpApp(target, name) {
		const document = this.readWidgetDocument(this.resolve(target), name, "mcp-app");
		return document && "descriptor" in document ? document : void 0;
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
const boardStore = new SqliteBoardStore({ resolveSession: ({ sessionKey, agentId }) => resolveGatewaySessionDatabase(sessionKey, agentId) });
//#endregion
export { captureGatewaySessionStoreScope as n, resolveGatewaySessionDatabase as r, boardStore as t };
