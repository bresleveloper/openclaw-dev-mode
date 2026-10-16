import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as getSqliteRuntimeCapabilities, r as ensureSqliteLibrarySelected } from "./bun-sqlite-library-CBSPJxTD.mjs";
import { r as flatMapRetainedOperation, t as createRetainedOperation } from "./retained-operation-CODoIe4t.mjs";
import { a as createSqliteLifecycleAggregateError, s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { t as captureRuntimeWorkerSource } from "./runtime-worker-generation-DCJaEqeS.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-D3H3_asn.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
import { t as captureRetainedNativeWorkerSource } from "./worker-native-lifecycle-VAONWs_C.mjs";
import { i as DEFAULT_WORKER_PENDING_BYTES, r as WorkerTaskError } from "./src-WCJCjrey.mjs";
import { n as createOwnedWorkerTaskPool } from "./worker-task-pool-iI3pfrsK.mjs";
import { _ as registerOpenClawStateDatabaseAsyncResource, v as registerOpenClawStateDatabaseLifecycleListener } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { t as SQLITE_IDLE_HANDLE_TTL_MS } from "./sqlite-handle-lifecycle-dWd9h3ii.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/channels/message/ingress-queue-read-contract.ts
function isChannelIngressReadCommand(value) {
	if (!isRecord(value)) return false;
	if (value.type === "channelIngress.failedHealth") return value.input === void 0;
	if (value.type === "channelIngress.accounts") return isRecord(value.input) && typeof value.input.channelId === "string";
	return value.type === "channelIngress.pressureHealth" && isRecord(value.input) && typeof value.input.now === "number";
}
//#endregion
//#region src/gateway/worker-environments/placement-workspace-journal.types.ts
function isJournalOwner(value) {
	return isRecord(value) && typeof value.sessionId === "string" && typeof value.environmentId === "string" && typeof value.ownerEpoch === "number" && typeof value.placementGeneration === "number";
}
function isWorkspaceJournalReadCommand(value) {
	return isRecord(value) && (value.type === "placementJournals.owners" || (value.type === "placementJournals.placement" || value.type === "placementJournals.load") && isJournalOwner(value.owner) && (value.allowFailedOwner === void 0 || typeof value.allowFailedOwner === "boolean"));
}
function isWorkspaceJournalReceipt(value) {
	return isRecord(value) && (value.type === "placementJournals.begin" || value.type === "placementJournals.abort" || value.type === "placementJournals.prune") && Array.isArray(value.owners) && value.owners.every(isJournalOwner) && Array.isArray(value.changes) && value.changes.every((change) => isRecord(change) && (change.all === true && change.scope === "worker-placements" || typeof change.agentId === "string" && typeof change.sessionKey === "string"));
}
//#endregion
//#region src/state/openclaw-state-read-request.ts
function captureCommand(command) {
	if (command.type === "secrets.metadata" || command.type === "secrets.execEnvironment" || command.type === "secrets.value" || command.type === "sessionState.versions" || command.type === "sessionState.ambientTargets" || command.type === "sessionState.events" || command.type === "operatorApprovals.history" || command.type === "diagnostic.latest" || command.type === "operatorApprovals.listCronGrants" || command.type === "acpSessions.metadata" || command.type === "githubPublication.knownPullRequestUrls" || command.type === "githubRepository.knownPullRequestUrls" || command.type === "workers.placementProjection") return structuredClone(command);
	if (isWorkspaceJournalReadCommand(command)) return command.type === "placementJournals.owners" ? { ...command } : {
		...command,
		owner: { ...command.owner }
	};
	if (command.type === "workerPlacements.changeSnapshot" && command.profileIds) return {
		...command,
		profileIds: [...command.profileIds]
	};
	if (command.type === "cron.scratch") return {
		...command,
		selector: { ...command.selector }
	};
	if (command.type === "userProfiles.avatar.read") return {
		...command,
		expected: { ...command.expected }
	};
	if (command.type === "channelIngress.failedHealth") return { type: command.type };
	if (command.type === "channelIngress.pressureHealth") return {
		type: command.type,
		input: { now: command.input.now }
	};
	if (command.type === "channelIngress.accounts") return {
		type: command.type,
		input: { channelId: command.input.channelId }
	};
	if (command.type === "cron.jobNames") return {
		...command,
		jobIds: [...command.jobIds]
	};
	if (command.type === "cron.quarantine") return {
		type: command.type,
		storeKey: command.storeKey
	};
	if (command.type === "githubPublication.sharedObservation") return {
		type: command.type,
		input: {
			...command.input,
			session: { ...command.input.session },
			selector: { ...command.input.selector },
			entry: {
				...command.input.entry,
				...command.input.entry.worktree ? { worktree: { ...command.input.entry.worktree } } : {}
			}
		}
	};
	if (command.type === "sessionRepositoryWorkspaces.find") return {
		type: command.type,
		owners: command.owners.map(({ agentId, sessionKey }) => ({
			agentId,
			sessionKey
		}))
	};
	if (command.type === "userProfiles.channelIdentity.resolve") return {
		type: command.type,
		identity: structuredClone(command.identity)
	};
	if (command.type === "userProfiles.githubAttribution.resolve" || command.type === "userPreferences.values") return {
		...command,
		profileIds: [...command.profileIds]
	};
	if (command.type === "subagents.runs") return {
		...command,
		scope: command.scope.kind === "descendants" ? {
			kind: "descendants",
			sessionKeys: [...command.scope.sessionKeys],
			liveTopology: command.scope.liveTopology.map((link) => ({ ...link }))
		} : command.scope.kind === "ids" ? {
			kind: "ids",
			runIds: [...command.scope.runIds]
		} : { ...command.scope }
	};
	if (command.type === "mcpOAuth.statuses") return {
		type: command.type,
		input: [...command.input]
	};
	if (command.type === "sessionGroups.members") return {
		...command,
		cfg: structuredClone(command.cfg)
	};
	if (command.type === "conversationBindings.inspect") {
		const { channel, accountId, conversationId, parentConversationId } = command.conversation;
		return {
			type: command.type,
			conversation: {
				channel,
				accountId,
				conversationId,
				...parentConversationId !== void 0 ? { parentConversationId } : {}
			}
		};
	}
	if (command.type === "cron.currentReceipt") {
		const { receiptId, storeKey, jobId, agentId, ownerPid, ownerStartTime } = command.handle;
		return {
			type: command.type,
			handle: {
				receiptId,
				storeKey,
				jobId,
				agentId,
				ownerPid,
				ownerStartTime
			},
			includeJob: command.includeJob,
			includeAvailability: command.includeAvailability
		};
	}
	if (command.type === "cron.observeRunRecovery") return {
		type: command.type,
		storeKey: command.storeKey,
		proposals: command.proposals.map(({ jobId, queuedAtMs, runningAtMs }) => ({
			jobId,
			...queuedAtMs === void 0 ? {} : { queuedAtMs },
			...runningAtMs === void 0 ? {} : { runningAtMs }
		}))
	};
	if (command.type === "devicePairing.bootstrapContext") return {
		...command,
		input: { ...command.input }
	};
	if (command.type === "pluginBlob.lookup") {
		const { pluginId, namespace, key } = command.input;
		return {
			type: command.type,
			input: {
				pluginId,
				namespace,
				key
			}
		};
	}
	if (command.type === "pluginBlob.entries") {
		const { pluginId, namespace } = command.input;
		return {
			type: command.type,
			input: {
				pluginId,
				namespace
			}
		};
	}
	if (command.type === "updateRuns.list") return {
		...command,
		input: { ...command.input }
	};
	if (command.type === "updateRuns.reconciliationCandidates") return {
		...command,
		input: {
			...command.input,
			...command.input.runIds ? { runIds: [...command.input.runIds] } : {}
		}
	};
	if (command.type === "skills.library.descriptions" || command.type === "skills.library.manifests") return {
		type: command.type,
		input: command.input.map(({ skillId, revision }) => ({
			skillId,
			revision
		}))
	};
	if (command.type === "audit.run.inspect") {
		const input = command.input;
		const common = {
			now: input.now,
			decisionCursor: input.decisionCursor,
			decisionLimit: input.decisionLimit
		};
		return {
			type: command.type,
			input: "executionId" in input ? {
				...common,
				executionId: input.executionId
			} : {
				...common,
				runId: input.runId,
				executionOffset: input.executionOffset,
				executionLimit: input.executionLimit
			}
		};
	}
	if (command.type === "workerEnvironments.pruneCandidates") return {
		type: command.type,
		input: {
			...command.input,
			cursor: command.input.cursor ? { ...command.input.cursor } : void 0
		}
	};
	if (command.type === "workerEnvironments.snapshot") return {
		type: command.type,
		...command.ids ? { ids: [...command.ids] } : {}
	};
	return { ...command };
}
function stringBytes(values) {
	return values.reduce((bytes, value) => bytes + Buffer.byteLength(value ?? "", "utf8"), 0);
}
function commandBytes(command) {
	if (command.type === "secrets.execEnvironment" || command.type === "secrets.value" || command.type === "sessionState.versions" || command.type === "sessionState.ambientTargets" || command.type === "sessionState.events" || command.type === "workers.placementProjection" || command.type === "workers.placementPendingResults" || isWorkspaceJournalReadCommand(command)) return Buffer.byteLength(JSON.stringify(command), "utf8");
	let bytes = Buffer.byteLength(command.type, "utf8");
	if (command.type === "generatedHtmlProvenance.read") return bytes + Buffer.byteLength(command.input, "utf8");
	if (command.type === "diagnostic.latest") return bytes + Buffer.byteLength(command.input.scope, "utf8") + 16;
	if (command.type === "cron.activeReceiptOwners") return bytes + Buffer.byteLength(command.agentId, "utf8");
	if (command.type === "claws.packageOwnership") return bytes + Buffer.byteLength(command.agentId ?? "", "utf8");
	if (command.type === "workerPlacements.changeSnapshot") return bytes + stringBytes(command.profileIds ?? []);
	if (command.type === "tui.lastSession.read") return bytes + Buffer.byteLength(command.stateKey, "utf8");
	if (isChannelIngressReadCommand(command)) return bytes + Buffer.byteLength(JSON.stringify(command.input ?? null), "utf8");
	if (command.type === "acpSessions.metadata") return command.entries.reduce((total, input) => total + stringBytes([
		...input.keys,
		input.legacyKey,
		input.entry?.lifecycleRevision,
		input.entry?.sessionId
	]) + (input.entry?.sessionStartedAt === void 0 ? 0 : 8), bytes);
	if (command.type === "capture.readOnlyEvents") return bytes + Buffer.byteLength(command.sessionId, "utf8") + 8;
	if (command.type === "capture.readOnlyBlob") return bytes + Buffer.byteLength(command.blobId, "utf8");
	if (command.type === "cron.jobNames") return bytes + stringBytes([command.storePath, ...command.jobIds]);
	if (command.type === "cron.quarantine") return bytes + Buffer.byteLength(command.storeKey, "utf8");
	if (command.type === "githubPublication.sharedObservation") return bytes + Buffer.byteLength(JSON.stringify(command.input), "utf8");
	if (command.type === "sessionRepositoryWorkspaces.find") return command.owners.reduce((total, owner) => total + stringBytes([owner.agentId, owner.sessionKey]), bytes);
	if (command.type === "agentDatabaseDeletion.snapshot") return bytes + Buffer.byteLength(command.purpose, "utf8");
	if (command.type === "agentDeletionJournal.status" || command.type === "agentDeletionJournal.authority") return bytes + Buffer.byteLength(command.agentId, "utf8");
	if (command.type === "subagents.runs") return bytes + (command.scope.kind === "descendants" ? stringBytes(command.scope.sessionKeys) + command.scope.liveTopology.reduce((total, link) => total + stringBytes([link.childSessionKey, link.requesterSessionKey]), 0) : command.scope.kind === "session" ? Buffer.byteLength(command.scope.sessionKey, "utf8") : command.scope.kind === "ids" ? stringBytes(command.scope.runIds) : 0);
	if (command.type === "mcpOAuth.statuses") return bytes + stringBytes(command.input);
	if (command.type === "mcpOAuth.readOnly" || command.type === "mcpOAuth.keys" || command.type === "mcpOAuth.pending" || command.type === "mcpOAuth.countPrincipals") return bytes + Buffer.byteLength(command.input, "utf8");
	if (command.type === "sessionGroups.members") return bytes + Buffer.byteLength(JSON.stringify(command.cfg), "utf8");
	if (command.type === "conversationBindings.inspect") return bytes + stringBytes(Object.values(command.conversation));
	if (command.type === "cron.currentReceipt") return bytes + Buffer.byteLength(JSON.stringify(command.handle), "utf8") + 2;
	if (command.type === "cron.observeRunRecovery") return command.proposals.reduce((total, proposal) => total + Buffer.byteLength(proposal.jobId, "utf8") + (proposal.queuedAtMs === void 0 ? 0 : 8) + (proposal.runningAtMs === void 0 ? 0 : 8), bytes + Buffer.byteLength(command.storeKey, "utf8"));
	if (command.type === "cron.scratch") return bytes + Buffer.byteLength(command.storeKey, "utf8") + Buffer.byteLength(command.selector.kind, "utf8") + (command.selector.kind === "job" ? 8 : 0) + Buffer.byteLength(command.selector.kind === "job" ? command.selector.jobId : command.selector.agentId, "utf8");
	if (command.type === "devicePairing.bootstrapContext") return bytes + Buffer.byteLength(command.input.token) + Buffer.byteLength(command.input.deviceId) + Buffer.byteLength(command.input.publicKey) + 8;
	if (command.type === "devicePairing.lookup") return bytes + Buffer.byteLength(command.deviceId);
	if (command.type === "devicePairing.pending") return bytes + Buffer.byteLength(command.requestId) + 8;
	if (command.type === "devicePairing.list") return bytes + 8 + Buffer.byteLength(command.publishedRevision ?? "");
	if (command.type === "operatorApprovals.history") return bytes + Buffer.byteLength(command.input.cursor ?? "", "utf8") + Buffer.byteLength(command.input.kind ?? "", "utf8") + 16;
	if (command.type === "operatorApprovals.listCronGrants") return bytes + 8;
	if (command.type === "deliveryQueue.outbound") return bytes + Buffer.byteLength(command.id ?? "", "utf8");
	if (command.type === "githubPublication.request" || command.type === "githubRepository.request" || command.type === "githubPublication.lifecycle") return bytes + Buffer.byteLength(command.requestId, "utf8") + 8;
	if (command.type === "githubPublication.knownPullRequestUrls" || command.type === "githubRepository.knownPullRequestUrls") return Object.values(command.input).reduce((total, value) => total + (typeof value === "string" ? Buffer.byteLength(value, "utf8") : 8), bytes);
	if (command.type === "pluginBlob.lookup" || command.type === "pluginBlob.entries") return bytes + Buffer.byteLength(command.input.pluginId, "utf8") + Buffer.byteLength(command.input.namespace, "utf8") + (command.type === "pluginBlob.lookup" ? Buffer.byteLength(command.input.key, "utf8") : 0);
	if (command.type === "subagents.forChildSession") return bytes + Buffer.byteLength(command.childSessionKey, "utf8");
	if (command.type === "sandboxRegistry.get") return bytes + Buffer.byteLength(command.containerName, "utf8");
	if (command.type === "sandboxRegistry.runtimeIds") return bytes + Buffer.byteLength(command.backendId, "utf8") + Buffer.byteLength(command.scopeKey, "utf8");
	if (command.type === "updateRuns.get" || command.type === "updateRuns.reconciliationCandidate") return bytes + Buffer.byteLength(command.runId, "utf8");
	if (command.type === "updateRuns.reconciliationCandidates") return bytes + stringBytes(command.input.runIds ?? []) + 3 + (command.input.repairHistorySinceMs === void 0 ? 0 : 8);
	if (command.type === "updateRuns.list") return bytes + Buffer.byteLength(command.input.reason ?? "", "utf8") + Buffer.byteLength(command.input.includeRunId ?? "", "utf8") + (command.input.limit === void 0 ? 0 : 8) + (command.input.active === void 0 ? 0 : 1);
	if (command.type === "skills.library.descriptions" || command.type === "skills.library.manifests") return command.input.reduce((total, pin) => total + stringBytes([pin.skillId, pin.revision]), bytes);
	if (command.type === "fleet.get") return bytes + Buffer.byteLength(command.tenantId, "utf8");
	if (command.type === "onboardingRecommendations.read") return bytes + Buffer.byteLength(command.configKey, "utf8");
	if (command.type === "userModelAccounts.links" || command.type === "userProfiles.reconcile" || command.type === "userProfiles.avatar.inspect" || command.type === "userProfiles.channelIdentity.list" || command.type === "userProfiles.authority.resolve") return bytes + Buffer.byteLength(command.profileId, "utf8");
	if (command.type === "userProfiles.avatar.read") return bytes + Buffer.byteLength(command.profileId, "utf8") + stringBytes(Object.values(command.expected));
	if (command.type === "userProfiles.githubIdentity.cached") return bytes + Buffer.byteLength(command.email, "utf8") + 8;
	if (command.type === "userProfiles.githubAttribution.resolve" || command.type === "userPreferences.values") return bytes + stringBytes(command.profileIds) + (command.type === "userPreferences.values" ? Buffer.byteLength(command.key) : 0);
	if (command.type === "userProfiles.channelIdentity.resolve") return bytes + Buffer.byteLength(JSON.stringify(command.identity), "utf8");
	if (command.type === "userProfiles.email.resolve") return bytes + Buffer.byteLength(command.email, "utf8");
	if (command.type === "workspace.snapshot") return bytes + Buffer.byteLength(command.workspaceDir, "utf8");
	if (command.type === "audit.run.inspect") {
		const input = command.input;
		bytes += Buffer.byteLength(input.decisionCursor ?? "", "utf8") + 8;
		if (input.decisionLimit !== void 0) bytes += 8;
		if ("executionId" in input) return bytes + Buffer.byteLength(input.executionId, "utf8");
		return bytes + Buffer.byteLength(input.runId, "utf8") + (input.executionOffset === void 0 ? 0 : 8) + (input.executionLimit === void 0 ? 0 : 8);
	}
	if (command.type === "workerEnvironments.pruneCandidates") return bytes + 8 + (command.input.limit === void 0 ? 0 : 8) + (command.input.cursor ? 8 + Buffer.byteLength(command.input.cursor.environmentId, "utf8") : 0);
	if (command.type === "workerEnvironments.snapshot") return bytes + stringBytes(command.ids ?? []);
	return bytes;
}
function requestBytes(request) {
	return commandBytes(request.command) + stringBytes([
		...Object.entries(request.context.environment).flatMap(([key, value]) => [key, value]),
		request.context.existingSchemaPath,
		request.databasePath,
		request.location,
		request.expectedIdentity,
		request.snapshotRoot
	]);
}
//#endregion
//#region src/state/openclaw-state-read-worker.ts
function closeReadResources(pool, key) {
	if (!pool) return;
	return getSqliteRuntimeCapabilities().explicitSqliteCloseReleasesNativeResources ? pool.closeResources(key) : pool.rotate();
}
async function closeReadPool(state) {
	if (state.closing) return await state.closing;
	const pool = state.pool;
	if (!pool) return;
	const closing = Promise.resolve().then(() => closeReadResources(pool)).then(() => pool.close()).then(() => {
		state.pool = void 0;
	});
	state.closing = closing;
	try {
		await closing;
	} finally {
		state.closing = void 0;
	}
}
function readRuntimes() {
	return resolveGlobalSingleton(Symbol.for("openclaw.stateReadWorkers"), () => {
		const sources = /* @__PURE__ */ new Map();
		registerOpenClawStateDatabaseAsyncResource({
			phase: "after-resources",
			async close(identity) {
				const results = await Promise.allSettled([...sources.values()].map(async (state) => {
					if (identity) await closeReadResources(state.pool, identity.key);
					else await closeReadPool(state);
				}));
				throwSqliteLifecycleErrors(results.flatMap((result) => result.status === "rejected" ? [result.reason] : []), "Shared-state reader source cleanup failed");
			}
		});
		registerOpenClawStateDatabaseLifecycleListener((event) => {
			if (event.kind !== "opened" && event.identity) for (const state of sources.values()) closeReadResources(state.pool, event.identity.key)?.catch((error) => {
				process.emitWarning(`Shared-state reader invalidation failed: ${String(error)}`);
			});
		});
		return sources;
	});
}
/** Retire cached workers only after every independently admitted reader has joined. */
async function retireIdleOpenClawStateReadWorkers(nativeSource) {
	const state = readRuntimes().get(nativeSource);
	if (!state) return true;
	if (state.operations.size > 0) return false;
	await closeReadPool(state);
	return true;
}
function readPool(state, admitted) {
	if (state.sealed && !admitted || state.closing) throw new WorkerTaskError("Shared-state readers are closing", "unavailable");
	if (!state.pool) {
		ensureSqliteLibrarySelected();
		state.pool = createOwnedWorkerTaskPool({
			workerUrl: state.workerUrl,
			workerOptions: { resourceLimits: { maxOldGenerationSizeMb: 512 } },
			maxWorkers: 2,
			idleTimeoutMs: SQLITE_IDLE_HANDLE_TTL_MS,
			maxPendingTasks: 128,
			maxPendingBytes: DEFAULT_WORKER_PENDING_BYTES
		}, {
			retainedTransport: true,
			nativeSource: state.nativeSource
		});
	}
	return state.pool;
}
/** Capture the execution source before snapshot preparation yields. */
function captureOpenClawStateReadSource() {
	const captured = captureRuntimeWorkerSource(resolveRuntimeProcessEntrypointUrl("stateRead"));
	const nativeSource = captureRetainedNativeWorkerSource({ runtimeGeneration: captured.runtimeGeneration });
	const sources = readRuntimes();
	let runtime = sources.get(nativeSource);
	if (!runtime) {
		const created = {
			nativeSource,
			workerUrl: captured.moduleUrl,
			operations: /* @__PURE__ */ new Set(),
			servicing: false,
			sealed: false
		};
		nativeSource.retain(created, () => {
			created.sealed = true;
			if (!created.stopping) created.stopping = Promise.resolve().then(async () => {
				const results = await Promise.allSettled([...created.operations].map((operation) => Promise.resolve().then(() => operation.close())));
				throwSqliteLifecycleErrors(results.flatMap((result) => result.status === "rejected" ? [result.reason] : []), "Shared-state reader source cleanup failed");
				await closeReadPool(created);
				sources.delete(nativeSource);
			}).finally(() => {
				created.stopping = void 0;
			});
			return created.stopping;
		});
		sources.set(nativeSource, created);
		runtime = created;
	}
	const state = runtime;
	const admitted = /* @__PURE__ */ new Set();
	return {
		createTransport: (command) => createReadTransport(command, state, () => admitted.size > 0),
		own(service, close) {
			if (state.sealed || state.closing) throw new WorkerTaskError("Shared-state readers are closing", "unavailable");
			const inContext = AsyncLocalStorage.snapshot();
			const operation = {
				service: () => inContext(service),
				close: () => inContext(close)
			};
			state.operations.add(operation);
			admitted.add(operation);
			return () => {
				state.operations.delete(operation);
				admitted.delete(operation);
			};
		},
		service() {
			if (state.servicing) return;
			state.servicing = true;
			const errors = [];
			try {
				const operations = Array.from(state.operations);
				for (const operation of operations) if (state.operations.has(operation)) try {
					operation.service();
				} catch (error) {
					errors.push(error);
				}
			} finally {
				state.servicing = false;
			}
			throwSqliteLifecycleErrors(errors, "Shared-state reader source cleanup failed");
		}
	};
}
function decodeTaskReply(reply) {
	if (reply.ok) return { value: reply };
	const error = new Error(reply.message);
	retainOpenClawStateWorkerErrorPayload(error, reply.error);
	return {
		error: hydrateOpenClawStateWorkerError(error, { includeOrdinary: true }),
		sourceAdmitted: reply.sourceAdmitted === true
	};
}
function createReadTransport(command, state, ownsAdmission) {
	const capturedCommand = captureCommand(command);
	const tasks = /* @__PURE__ */ new Map();
	let closed = false;
	let closing;
	const startCloseTask = (task) => {
		const inContext = AsyncLocalStorage.snapshot();
		const cleanup = tasks.get(task);
		let release;
		const completion = createRetainedOperation(() => inContext(service));
		const fail = (error) => completion.reject(cleanup?.error ? createSqliteLifecycleAggregateError([cleanup.error, error], "Shared-state reader cleanup and worker retirement failed", cleanup.error) : error);
		function service() {
			if (completion.operation.read().status !== "pending") return;
			try {
				release.service();
				const outcome = release.read();
				if (outcome.status === "pending") return;
				if (outcome.status === "rejected") throw outcome.error;
				tasks.delete(task);
				completion.resolve(void 0);
			} catch (error) {
				fail(error);
			}
		}
		try {
			release = task.release(cleanup?.retire ? { retire: true } : void 0);
			release.result.then(() => completion.operation.service(), () => completion.operation.service());
			completion.operation.service();
		} catch (error) {
			fail(error);
		}
		return completion.operation;
	};
	const startRun = (context, location, checkFreshAdmission, readCommand, authority, expectedIdentity, snapshotRoot) => {
		const inContext = AsyncLocalStorage.snapshot();
		let task;
		const cleanup = { retire: true };
		const completion = createRetainedOperation(() => inContext(service));
		function service() {
			if (!task || completion.operation.read().status !== "pending") return;
			let outcome;
			try {
				task.service();
				const read = task.read();
				if (read.status === "pending") return;
				if (read.status === "rejected") throw read.error;
				const reply = read.value;
				if (reply.nativeCleanupFailure) {
					const error = /* @__PURE__ */ new Error("Shared-state reader native cleanup was not confirmed");
					retainOpenClawStateWorkerErrorPayload(error, reply.nativeCleanupFailure.error);
					cleanup.error = hydrateOpenClawStateWorkerError(error, { includeOrdinary: true });
				}
				outcome = decodeTaskReply(reply);
			} catch (error) {
				outcome = { error };
			}
			cleanup.retire = "error" in outcome || cleanup.error !== void 0;
			completion.resolve(outcome);
		}
		try {
			if (closed) throw new WorkerTaskError("Shared-state read transport is closed", "unavailable");
			const request = {
				context: {
					environment: { ...context.environment },
					existingSchemaPath: context.existingSchemaPath
				},
				databasePath: context.admission.databasePath,
				location,
				checkFreshAdmission,
				expectedIdentity,
				snapshotRoot,
				command: { ...readCommand }
			};
			task = readPool(state, ownsAdmission()).startTask(() => {
				authority.assertCurrent();
				return request;
			}, {
				signal: authority.signal,
				inputBytes: requestBytes(request)
			});
			tasks.set(task, cleanup);
			task.result.then(() => completion.operation.service(), () => completion.operation.service());
			completion.operation.service();
		} catch (error) {
			completion.reject(error);
		}
		return {
			task,
			operation: completion.operation
		};
	};
	const startValidateFresh = (context, authority) => {
		const run = startRun(context, context.admission.databasePath, true, { type: "admit" }, authority);
		return flatMapRetainedOperation(run.operation, (read) => {
			if ("error" in read) throw read.error;
			authority.assertCurrent();
			if (!run.task) throw new Error("Shared-state admission completed without its retained task");
			return startCloseTask(run.task);
		});
	};
	const startRead = (source, authority) => startRun(source.context, source.location, source.checkFreshAdmission, capturedCommand, authority, source.expectedIdentity, source.snapshotRoot).operation;
	const startClose = () => {
		closed = true;
		if (closing) return closing;
		const releases = [...tasks.keys()].map(startCloseTask);
		const inContext = AsyncLocalStorage.snapshot();
		const completion = createRetainedOperation(() => inContext(service));
		closing = completion.operation;
		function service() {
			if (completion.operation.read().status !== "pending") return;
			const errors = [];
			let pending = false;
			for (const release of releases) {
				release.service();
				const outcome = release.read();
				pending ||= outcome.status === "pending";
				if (outcome.status === "rejected") errors.push(outcome.error);
			}
			if (pending) return;
			closing = void 0;
			try {
				throwSqliteLifecycleErrors(errors, "Shared-state reader task cleanup failed");
				completion.resolve(void 0);
			} catch (error) {
				completion.reject(error);
			}
		}
		for (const release of releases) release.result.then(() => completion.operation.service(), () => completion.operation.service());
		completion.operation.service();
		return completion.operation;
	};
	return {
		startValidateFresh,
		startRead,
		startClose
	};
}
//#endregion
export { retireIdleOpenClawStateReadWorkers as n, isWorkspaceJournalReceipt as r, captureOpenClawStateReadSource as t };
