import { a as extractErrorCode, l as readErrorName, r as collectErrorGraphCandidates } from "./error-coercion-BwMr25F8.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-CvMrvFI1.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { d as isSqliteWorkerError } from "./sqlite-worker-contract-DhDutMia.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { n as runOpenClawAgentWorkerWrite, r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import { d as withOpenClawAgentDatabaseRuntime } from "./openclaw-agent-db-_fC-kf1x.mjs";
import "./io-DIF-KW3P.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { o as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-DJQA0Ssz.mjs";
import { r as BoardValidationError } from "./board-layout-6DyK3jbx.mjs";
import { n as captureSessionActorStorageOwner, s as withSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { g as targetDiscoveryLane } from "./session-transcript-worker-resources-D1956Oac.mjs";
import { o as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { n as openOpenClawAgentSqliteWorkerStore } from "./openclaw-agent-worker-store-CcajP8TM.mjs";
import { n as IncognitoSessionMissingError } from "./incognito-session-error-Dsi9IsoJ.mjs";
import { t as readSessionActorStorageResult } from "./session-actor-storage-result-BfP7PrnB.mjs";
import { a as resolveSessionStoreIdentity } from "./session-store-key-DKpto8R6.mjs";
import { randomBytes } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
import { isPromise } from "node:util/types";
//#region src/boards/board-store-errors.ts
function restoreBoardError(error) {
	if (error instanceof Error && error.name === "BoardValidationError" && "code" in error && (error.code === "conflict" || error.code === "invalid_operation" || error.code === "not_found")) return new BoardValidationError(error.code, error.message);
	return error;
}
/** Invalidation never grants retries; transported post-execution failures are plain Errors. */
function hasUnknownBoardWriteOutcome(error) {
	return collectErrorGraphCandidates(error, (current) => current instanceof AggregateError ? [current.cause] : []).some((current) => isSqliteWorkerError(current, "outcome-unknown") || current instanceof Error && readErrorName(current) === "SqliteWorkerError" && extractErrorCode(current) === "outcome-unknown");
}
//#endregion
//#region src/boards/session-actor-board-store.ts
/** The routing owner supplies the already-acquired actor; this store never acquires a backend. */
function createSessionActorBoardStore(resolve) {
	const write = async (binding, type, input, options) => {
		options?.assertCurrent?.();
		const outcome = await binding.actor.storage.mutate({
			type,
			input
		}, binding.authority);
		if (outcome.kind === "rolled-back") throw restoreBoardError(Object.assign(new Error(outcome.error.message), outcome.error));
		return readSessionActorStorageResult(outcome);
	};
	const readSnapshot = async (target, consume) => {
		const binding = resolve(target);
		const value = await binding.actor.storage.read({
			type: "boards.snapshot",
			input: { sessionKey: binding.actor.target.sessionKey }
		}, binding.authority);
		binding.actor.snapshot(binding.authority);
		return await consume(value);
	};
	const readDocument = async (target, name, consume, contentKind) => {
		const binding = resolve(target);
		const value = await binding.actor.storage.read({
			type: "boards.document",
			input: {
				sessionKey: binding.actor.target.sessionKey,
				name,
				contentKind
			}
		}, binding.authority);
		binding.actor.snapshot(binding.authority);
		return await consume(value);
	};
	const store = {
		useSnapshot(target, consume) {
			return readSnapshot(target, ({ snapshot }) => consume(snapshot));
		},
		useWidgetDocument(target, name, consume) {
			return readDocument(target, name, consume);
		},
		getSnapshot(target) {
			return readSnapshot(target, ({ snapshot }) => snapshot);
		},
		getSnapshotWithHtmlViewMetadata: (target) => readSnapshot(target, (value) => value),
		async applyOps(target, ops, options) {
			if (!ops.length) return store.getSnapshot(target);
			const binding = resolve(target);
			return write(binding, "boards.applyOps", {
				sessionKey: binding.actor.target.sessionKey,
				ops: structuredClone(ops)
			}, options);
		},
		async putWidget(input, options) {
			const binding = resolve(input);
			let params = structuredClone(input);
			const content = params.content;
			if (content.kind === "mcp-app" && content.interactive && options?.resolveMcpAppInteraction && !await options.resolveMcpAppInteraction()) params = {
				...params,
				content: {
					...content,
					interactive: false
				},
				declared: void 0
			};
			return write(binding, "boards.putWidget", {
				sessionKey: binding.actor.target.sessionKey,
				params,
				viewGeneration: randomBytes(16).toString("hex")
			}, options);
		},
		async grant(target, name, decision, revision, instanceId, options) {
			const binding = resolve(target);
			return write(binding, "boards.grant", {
				sessionKey: binding.actor.target.sessionKey,
				name,
				decision,
				revision,
				instanceId
			}, options);
		},
		readWidgetMcpApp(target, name) {
			return readDocument(target, name, (value) => value && "descriptor" in value ? value : void 0, "mcp-app");
		}
	};
	return store;
}
//#endregion
//#region src/boards/sqlite-board-authority.ts
const log = createSubsystemLogger("boards/store");
function reportBoardCleanupFailure(error) {
	try {
		log.warn(`Board publication completed before cleanup failed: ${formatErrorMessage(error)}`);
	} catch {}
}
//#endregion
//#region src/boards/sqlite-board-store.ts
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
	useMemory(target, consume, missing) {
		const resolved = this.options.resolveSession(target);
		const assertCurrent = () => this.assertTargetCurrent(target, resolved);
		const authority = {
			assertCurrent,
			authorize: assertCurrent
		};
		const scope = {
			...resolved,
			storePath: resolved.path,
			env: this.options.env
		};
		const memory = captureSessionActorStorageOwner(scope, authority);
		if (!memory) return;
		return withSessionActorStorage(scope, {
			authority: memory.authority,
			lifetime: {
				assertCurrent,
				assertReadable: assertCurrent
			}
		}, async (binding) => ({ value: await consume(createSessionActorBoardStore(() => binding)) })).then(async (result) => {
			if (result) return result;
			assertCurrent();
			if (missing) return { value: await missing() };
			throw new BoardValidationError("not_found", `board session not found: ${resolved.sessionKey}`);
		});
	}
	write(target, options, worker, prepare) {
		const resolved = this.options.resolveSession(target);
		if (resolved.absent) {
			options?.assertCurrent?.();
			this.assertTargetCurrent(target, resolved);
			resolved.absent.assertCurrent();
			throw new IncognitoSessionMissingError();
		}
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
		const assertCurrent = () => this.assertTargetCurrent(target, resolved);
		assertCurrent();
		return runOpenClawAgentWriteAdmission(databaseOptions, async (identity, assertDatabaseCurrent) => {
			const source = await withSessionHistoryWorkerDatabase(databaseOptions, (reader) => reader.readExactEntries({
				env,
				sessionKeys: [resolved.sessionKey],
				projection: "exact",
				snapshotFields: [],
				expectedIdentity: identity
			}), targetDiscoveryLane);
			assertDatabaseCurrent();
			assertCurrent();
			const entry = source.entries[0]?.entry;
			if (!entry) throw new BoardValidationError("not_found", `board session not found: ${resolved.sessionKey}`);
			const expectedSession = {
				sessionId: entry.sessionId,
				lifecycleRevision: entry.lifecycleRevision
			};
			const assertPreparedCurrent = () => {
				assertDatabaseCurrent();
				assertCurrent();
			};
			return withOpenClawAgentDatabaseRuntime(databaseOptions, async (database) => {
				if (prepare) await prepare();
				assertPreparedCurrent();
				const publication = await openOpenClawAgentSqliteWorkerStore(databaseOptions, database.db, {
					moduleUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.boardStore),
					input: {
						agentId: databaseOptions.agentId,
						sessionKey: resolved.sessionKey,
						expectedSession
					}
				});
				let outcome;
				try {
					outcome = {
						ok: true,
						value: await publication.run(async (scope) => {
							options?.assertCurrent?.();
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
						}, assertPreparedCurrent)
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
				if (!cleanup.ok) reportBoardCleanupFailure(cleanup.error);
				return outcome.value;
			}, () => {
				options?.assertCurrent?.();
				assertPreparedCurrent();
			});
		}, true);
	}
	async getSnapshot(target) {
		return this.useSnapshot(target, (snapshot) => snapshot);
	}
	async getSnapshotWithHtmlViewMetadata(target) {
		const memory = this.useMemory(target, (store) => store.getSnapshotWithHtmlViewMetadata(target), () => ({
			snapshot: {
				sessionKey: target.sessionKey,
				revision: 0,
				tabs: [],
				widgets: []
			},
			htmlViewMetadata: /* @__PURE__ */ new Map()
		}));
		if (memory) return (await memory).value;
		return this.consumeSnapshotWithHtmlViewMetadata(target, (snapshot) => snapshot);
	}
	async consumeRead(target, worker, consume) {
		const capturedTarget = { ...target };
		const resolved = this.options.resolveSession(capturedTarget);
		if (resolved.absent) {
			this.assertTargetCurrent(capturedTarget, resolved);
			resolved.absent.assertCurrent();
			const result = await consume(void 0, resolved.sessionKey);
			this.assertTargetCurrent(capturedTarget, resolved);
			resolved.absent.assertCurrent();
			return result;
		}
		const env = captureSessionTranscriptStorageEnvironment(this.options.env ?? process.env);
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
		const identity = readDatabasePathIdentitySync(captured.path);
		if (!identity.key.startsWith("file:")) return await (await runOpenClawAgentWorkerWrite(captured, async () => accept(void 0))).value;
		return await (await withSessionHistoryWorkerDatabase({
			...captured,
			path: identity.canonicalPath,
			requestedPaths: [captured.path]
		}, (reader) => runOpenClawAgentWriteAdmission(captured, async () => {
			this.assertTargetCurrent(capturedTarget, resolved);
			const value = await worker(reader, captured.sessionKey, env, identity);
			reader.assertCurrent();
			return accept(value);
		}, true), targetDiscoveryLane).catch((error) => {
			throw restoreBoardError(error);
		})).value;
	}
	async useSnapshot(target, consume) {
		const memory = this.useMemory(target, (store) => store.useSnapshot(target, consume), async () => consume({
			sessionKey: target.sessionKey,
			revision: 0,
			tabs: [],
			widgets: []
		}));
		if (memory) return await (await memory).value;
		return this.consumeSnapshotWithHtmlViewMetadata(target, ({ snapshot }) => consume(snapshot));
	}
	async useWidgetDocument(target, name, consume) {
		const memory = this.useMemory(target, (store) => store.useWidgetDocument(target, name, consume), async () => consume(void 0));
		if (memory) return await (await memory).value;
		return this.consumeWidgetDocument(target, name, consume);
	}
	consumeSnapshotWithHtmlViewMetadata(target, consume) {
		return this.consumeRead(target, (reader, sessionKey, env, expectedIdentity) => reader.readBoardSnapshot({
			sessionKey,
			env,
			expectedIdentity
		}), (stored, sessionKey) => consume(stored ?? {
			snapshot: {
				sessionKey,
				revision: 0,
				tabs: [],
				widgets: []
			},
			htmlViewMetadata: /* @__PURE__ */ new Map()
		}));
	}
	async applyOps(target, ops, options) {
		if (ops.length === 0) return this.getSnapshot(target);
		const capturedOps = structuredClone(ops);
		const memory = this.useMemory(target, (store) => store.applyOps(target, capturedOps, options));
		if (memory) return (await memory).value;
		return this.write(target, options, (scope, sessionKey) => scope.execute({
			type: "boards.applyOps",
			input: {
				sessionKey,
				ops: capturedOps
			}
		}));
	}
	async putWidget(params, options) {
		let preparedParams = structuredClone(params);
		const memory = this.useMemory(params, (store) => store.putWidget(preparedParams, options));
		if (memory) return (await memory).value;
		const viewGeneration = randomBytes(16).toString("hex");
		const content = preparedParams.content;
		const resolveInteraction = options?.resolveMcpAppInteraction;
		const prepare = content.kind === "mcp-app" && content.interactive && resolveInteraction ? async () => {
			if (!await resolveInteraction()) preparedParams = {
				...preparedParams,
				content: {
					...content,
					interactive: false
				},
				declared: void 0
			};
		} : void 0;
		return this.write(params, options, (scope, sessionKey) => scope.execute({
			type: "boards.putWidget",
			input: {
				sessionKey,
				params: preparedParams,
				viewGeneration
			}
		}), prepare);
	}
	async grant(target, name, decision, revision, instanceId, options) {
		const memory = this.useMemory(target, (store) => store.grant(target, name, decision, revision, instanceId, options));
		if (memory) return (await memory).value;
		return this.write(target, options, (scope, sessionKey) => scope.execute({
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
		return this.consumeRead(target, (reader, sessionKey, env, expectedIdentity) => reader.readBoardWidgetDocument({
			sessionKey,
			name,
			contentKind,
			env,
			expectedIdentity
		}), consume);
	}
	async readWidgetMcpApp(target, name) {
		const memory = this.useMemory(target, (store) => store.readWidgetMcpApp(target, name), () => void 0);
		if (memory) return (await memory).value;
		return this.consumeWidgetDocument(target, name, (document) => document && "descriptor" in document ? document : void 0, "mcp-app");
	}
};
//#endregion
//#region src/gateway/board-store.ts
function captureGatewaySessionStoreScope(sessionKey, explicitAgentId) {
	const cfg = readRuntimeConfig();
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
	const assertCurrent = () => {
		const current = captureGatewaySessionStoreScope(sessionKey, agentId);
		if (current.agentId !== scope.agentId || current.storePath !== scope.storePath || current.sessionKey !== scope.sessionKey) throw new BoardValidationError("invalid_operation", "board session changed; retry");
	};
	const memory = captureSessionActorStorageOwner(scope, {
		assertCurrent,
		authorize: assertCurrent
	});
	return {
		...memory ? {
			agentId: memory.agentId,
			path: memory.path,
			sessionKey: scope.sessionKey
		} : resolveGatewaySessionDatabase(sessionKey, agentId),
		assertCurrent
	};
} });
//#endregion
export { captureGatewaySessionStoreScope as n, boardStore as t };
