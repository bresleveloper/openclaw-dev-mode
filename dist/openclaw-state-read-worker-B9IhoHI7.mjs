import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { t as ensureSqliteLibrarySelected } from "./bun-sqlite-library-GOquVAYK.mjs";
import { t as SQLITE_IDLE_HANDLE_TTL_MS } from "./sqlite-handle-lifecycle-dWd9h3ii.mjs";
import { n as createSqliteLifecycleAggregateError } from "./sqlite-coordinator-z2lO0ops.mjs";
import { _ as registerOpenClawStateDatabaseAsyncResource, v as registerOpenClawStateDatabaseLifecycleListener } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { t as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-q9v1M311.mjs";
import { i as DEFAULT_WORKER_PENDING_BYTES, n as createOwnedWorkerTaskPool, r as WorkerTaskError } from "./worker-task-pool-cppt7dT0.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload } from "./openclaw-state-worker-error-DLFiBmPG.mjs";
//#region src/state/openclaw-state-read-worker.ts
function readPool() {
	const state = resolveGlobalSingleton(Symbol.for("openclaw.stateReadWorkers"), () => {
		const owned = {};
		registerOpenClawStateDatabaseAsyncResource({
			phase: "after-resources",
			async close(identity) {
				if (!owned.pool) return;
				const pool = owned.pool;
				if (identity) {
					await pool.closeResources(identity.key);
					return;
				}
				await (owned.closing ??= Promise.resolve().then(() => pool.closeResources()).then(() => pool.close()).then(() => {
					owned.pool = void 0;
				}).finally(() => {
					owned.closing = void 0;
				}));
			}
		});
		registerOpenClawStateDatabaseLifecycleListener((event) => {
			if (event.kind !== "opened" && event.identity) owned.pool?.closeResources(event.identity.key).catch((error) => {
				process.emitWarning(`Shared-state reader invalidation failed: ${String(error)}`);
			});
		});
		return owned;
	});
	if (state.closing) throw new WorkerTaskError("Shared-state readers are closing", "unavailable");
	if (!state.pool) {
		ensureSqliteLibrarySelected();
		state.pool = createOwnedWorkerTaskPool({
			workerUrl: resolveRuntimeProcessEntrypointUrl("stateRead"),
			workerOptions: { resourceLimits: { maxOldGenerationSizeMb: 512 } },
			maxWorkers: 2,
			idleTimeoutMs: SQLITE_IDLE_HANDLE_TTL_MS,
			maxPendingTasks: 128,
			maxPendingBytes: DEFAULT_WORKER_PENDING_BYTES
		});
	}
	return state.pool;
}
function captureCommand(command) {
	if (command.type === "userProfiles.channelIdentity.resolve") return {
		type: command.type,
		identity: { ...command.identity }
	};
	if (command.type === "subagents.runs") return {
		...command,
		scope: command.scope.kind === "ids" ? {
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
	if (command.type === "operatorApprovals.history") return {
		...command,
		input: { ...command.input }
	};
	if (command.type === "tasks.mutationSnapshot") {
		const scope = command.input;
		return {
			type: command.type,
			input: scope === void 0 ? void 0 : "taskId" in scope ? { ...scope } : scope.map((entry) => Object.assign({}, entry))
		};
	}
	if (command.type === "githubPublication.knownPullRequestUrls" || command.type === "githubRepository.knownPullRequestUrls") return structuredClone(command);
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
	if (command.type === "workers.placementProjection") return structuredClone(command);
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
function commandBytes(command) {
	let bytes = Buffer.byteLength(command.type, "utf8");
	if (command.type === "subagents.runs") return bytes + (command.scope.kind === "session" ? Buffer.byteLength(command.scope.sessionKey, "utf8") : command.scope.runIds.reduce((total, runId) => total + Buffer.byteLength(runId, "utf8"), 0));
	if (command.type === "mcpOAuth.statuses") return command.input.reduce((total, key) => total + Buffer.byteLength(key, "utf8"), bytes);
	if (command.type === "mcpOAuth.readOnly" || command.type === "mcpOAuth.keys" || command.type === "mcpOAuth.pending" || command.type === "mcpOAuth.countPrincipals") return bytes + Buffer.byteLength(command.input, "utf8");
	if (command.type === "sessionGroups.members") return bytes + Buffer.byteLength(JSON.stringify(command.cfg), "utf8");
	if (command.type === "conversationBindings.inspect") return bytes + Object.values(command.conversation).reduce((sum, value) => sum + Buffer.byteLength(value ?? "", "utf8"), 0);
	if (command.type === "cron.observeRunRecovery") return command.proposals.reduce((total, proposal) => total + Buffer.byteLength(proposal.jobId, "utf8") + (proposal.queuedAtMs === void 0 ? 0 : 8) + (proposal.runningAtMs === void 0 ? 0 : 8), bytes + Buffer.byteLength(command.storeKey, "utf8"));
	if (command.type === "devicePairing.bootstrapContext") return bytes + Buffer.byteLength(command.input.token) + Buffer.byteLength(command.input.deviceId) + Buffer.byteLength(command.input.publicKey) + 8;
	if (command.type === "devicePairing.lookup") return bytes + Buffer.byteLength(command.deviceId);
	if (command.type === "devicePairing.pending") return bytes + Buffer.byteLength(command.requestId) + 8;
	if (command.type === "devicePairing.list") return bytes + 8 + Buffer.byteLength(command.publishedRevision ?? "");
	if (command.type === "operatorApprovals.history") return bytes + Buffer.byteLength(command.input.cursor ?? "", "utf8") + Buffer.byteLength(command.input.kind ?? "", "utf8") + 16;
	if (command.type === "tasks.mutationSnapshot") {
		const scope = command.input;
		return (scope === void 0 ? [] : "taskId" in scope ? [scope] : scope).reduce((total, entry) => total + Buffer.byteLength(entry.taskId, "utf8") + Buffer.byteLength(entry.flowId ?? "", "utf8") + Buffer.byteLength(entry.runId ?? "", "utf8") + Buffer.byteLength(entry.childSessionKey ?? "", "utf8"), bytes);
	}
	if (command.type === "githubPublication.request" || command.type === "githubRepository.request" || command.type === "githubPublication.lifecycle") return bytes + Buffer.byteLength(command.requestId, "utf8") + 8;
	if (command.type === "githubPublication.knownPullRequestUrls" || command.type === "githubRepository.knownPullRequestUrls") return Object.values(command.input).reduce((total, value) => total + (typeof value === "string" ? Buffer.byteLength(value, "utf8") : 8), bytes);
	if (command.type === "pluginBlob.lookup" || command.type === "pluginBlob.entries") return bytes + Buffer.byteLength(command.input.pluginId, "utf8") + Buffer.byteLength(command.input.namespace, "utf8") + (command.type === "pluginBlob.lookup" ? Buffer.byteLength(command.input.key, "utf8") : 0);
	if (command.type === "subagents.forChildSession") return bytes + Buffer.byteLength(command.childSessionKey, "utf8");
	if (command.type === "sandboxRegistry.get") return bytes + Buffer.byteLength(command.containerName, "utf8");
	if (command.type === "sandboxRegistry.runtimeIds") return bytes + Buffer.byteLength(command.backendId, "utf8") + Buffer.byteLength(command.scopeKey, "utf8");
	if (command.type === "updateRuns.get") return bytes + Buffer.byteLength(command.runId, "utf8");
	if (command.type === "updateRuns.list") return bytes + Buffer.byteLength(command.input.reason ?? "", "utf8") + Buffer.byteLength(command.input.includeRunId ?? "", "utf8") + (command.input.limit === void 0 ? 0 : 8) + (command.input.active === void 0 ? 0 : 1);
	if (command.type === "skills.library.descriptions" || command.type === "skills.library.manifests") return command.input.reduce((total, pin) => total + Buffer.byteLength(pin.skillId, "utf8") + Buffer.byteLength(pin.revision, "utf8"), bytes);
	if (command.type === "fleet.get") return bytes + Buffer.byteLength(command.tenantId, "utf8");
	if (command.type === "onboardingRecommendations.read") return bytes + Buffer.byteLength(command.configKey, "utf8");
	if (command.type === "userProfiles.reconcile" || command.type === "userProfiles.channelIdentity.list" || command.type === "userProfiles.authority.resolve") return bytes + Buffer.byteLength(command.profileId, "utf8");
	if (command.type === "userProfiles.githubIdentity.cached") return bytes + Buffer.byteLength(command.email, "utf8") + 8;
	if (command.type === "userProfiles.channelIdentity.resolve") return bytes + Object.values(command.identity).reduce((total, value) => total + Buffer.byteLength(value, "utf8"), 0);
	if (command.type === "userProfiles.email.resolve") return bytes + Buffer.byteLength(command.email, "utf8");
	if (command.type === "workspace.snapshot") return bytes + Buffer.byteLength(command.workspaceDir, "utf8");
	if (command.type === "audit.run.inspect") {
		const input = command.input;
		bytes += Buffer.byteLength(input.decisionCursor ?? "", "utf8") + 8;
		if (input.decisionLimit !== void 0) bytes += 8;
		if ("executionId" in input) return bytes + Buffer.byteLength(input.executionId, "utf8");
		return bytes + Buffer.byteLength(input.runId, "utf8") + (input.executionOffset === void 0 ? 0 : 8) + (input.executionLimit === void 0 ? 0 : 8);
	}
	if (command.type === "workers.placementProjection") return Buffer.byteLength(JSON.stringify(command), "utf8");
	if (command.type === "workerEnvironments.pruneCandidates") return bytes + 8 + (command.input.limit === void 0 ? 0 : 8) + (command.input.cursor ? 8 + Buffer.byteLength(command.input.cursor.environmentId, "utf8") : 0);
	if (command.type === "workerEnvironments.snapshot") return bytes + (command.ids?.reduce((total, id) => total + Buffer.byteLength(id, "utf8"), 0) ?? 0);
	return bytes;
}
function requestBytes(request) {
	return [
		...Object.values(request.context.environment),
		request.context.coordinatorRuntime.directory,
		request.context.existingSchemaPath,
		request.databasePath,
		request.location,
		request.expectedIdentity,
		request.snapshotRoot
	].reduce((bytes, value) => bytes + (value === void 0 ? 0 : Buffer.byteLength(value, "utf8")), commandBytes(request.command));
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
function createOpenClawStateReadTransport(command) {
	const capturedCommand = captureCommand(command);
	const tasks = /* @__PURE__ */ new Map();
	let closed = false;
	let closing;
	const closeTask = async (task) => {
		const cleanup = tasks.get(task);
		try {
			await task.close(cleanup?.retire ? { retire: true } : void 0);
		} catch (error) {
			if (cleanup?.error) throw createSqliteLifecycleAggregateError([cleanup.error, error], "Shared-state reader cleanup and worker retirement failed", cleanup.error);
			throw error;
		}
		tasks.delete(task);
	};
	const run = async (context, location, checkFreshAdmission, operation, authority, expectedIdentity, snapshotRoot) => {
		if (closed) throw new WorkerTaskError("Shared-state read transport is closed", "unavailable");
		authority.assertCurrent();
		const request = {
			context: {
				environment: { ...context.environment },
				coordinatorRuntime: { ...context.coordinatorRuntime },
				existingSchemaPath: context.existingSchemaPath
			},
			databasePath: context.admission.databasePath,
			location,
			checkFreshAdmission,
			expectedIdentity,
			snapshotRoot,
			command: { ...operation }
		};
		const task = readPool().runTask(() => {
			authority.assertCurrent();
			return request;
		}, {
			signal: authority.signal,
			inputBytes: requestBytes(request)
		});
		const cleanup = { retire: true };
		tasks.set(task, cleanup);
		let outcome;
		try {
			const reply = await task.result;
			if (reply.nativeCleanupFailure) {
				const error = /* @__PURE__ */ new Error("Quarantine reader native cleanup was not confirmed");
				retainOpenClawStateWorkerErrorPayload(error, reply.nativeCleanupFailure.error);
				cleanup.error = hydrateOpenClawStateWorkerError(error, { includeOrdinary: true });
			}
			outcome = decodeTaskReply(reply);
		} catch (error) {
			outcome = { error };
		}
		cleanup.retire = Boolean(process.versions.bun) || "error" in outcome || cleanup.error !== void 0;
		return {
			task,
			outcome
		};
	};
	return {
		async validateFresh(context, authority) {
			const { task, outcome } = await run(context, context.admission.databasePath, true, { type: "admit" }, authority);
			if ("error" in outcome) throw outcome.error;
			authority.assertCurrent();
			await closeTask(task);
		},
		async read(source, authority) {
			const { outcome } = await run(source.context, source.location, source.checkFreshAdmission, capturedCommand, authority, source.expectedIdentity, source.snapshotRoot);
			return outcome;
		},
		close() {
			closed = true;
			return closing ??= Promise.allSettled([...tasks.keys()].map(closeTask)).then((results) => {
				const errors = results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
				if (errors.length === 1) throw errors[0];
				if (errors.length > 1) throw new AggregateError(errors, "Shared-state reader task cleanup failed");
			}).finally(() => {
				closing = void 0;
			});
		}
	};
}
//#endregion
export { createOpenClawStateReadTransport as t };
