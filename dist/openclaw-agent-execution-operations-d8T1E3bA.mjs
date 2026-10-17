import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { o as SQLITE_WORKER_PREPARE_COMMAND } from "./sqlite-worker-contract-C51cJHzg.mjs";
import { i as requestSqliteWorkerOperationAdmission, r as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { isPromise } from "node:util/types";
//#region src/state/openclaw-agent-execution-domain.ts
/** A domain restriction must obtain exactly one grant for the original native stage. */
function requestRestrictedAgentDatabaseAdmission(request, restriction) {
	const { stage } = request;
	let admitted = false;
	const dispatch = (restricted) => {
		if (admitted || restricted.stage !== stage) throw new Error("Agent admission restriction changed its native stage");
		requestSqliteWorkerOperationAdmission(restricted);
		admitted = true;
	};
	if (restriction) restriction(request, dispatch);
	else dispatch(request);
	if (!admitted) throw new Error("Agent admission restriction omitted its native grant");
}
/** One admitted publication scope borrows the canonical connection; it never owns its close. */
function createAgentDatabaseDomainOwner(context) {
	let binding;
	let prepared;
	let failedBinding = false;
	const requireBinding = (id) => {
		if (!binding || binding.id !== id || !binding.authority.active) throw new Error("Agent database operation lost its bound publication scope");
		return binding;
	};
	const bind = (input) => {
		const database = context.assertCurrent();
		if (!prepared || prepared.id !== input.id || binding) throw new Error("Agent publication module was not prepared for this scope");
		const factory = prepared.factory;
		prepared = void 0;
		failedBinding = true;
		const authority = { active: true };
		try {
			const backend = factory(input.input, {
				databasePath: context.databasePath,
				database,
				admit: (stage, requestAdmission) => {
					if (!authority.active) throw new Error("Agent publication cleanup cannot admit a transaction");
					context.admit(stage, requestAdmission);
				}
			});
			if (isPromise(backend)) {
				backend.catch(() => {});
				throw new Error("Connection-bound publication factories must remain synchronous");
			}
			if (!isRecord(backend) || typeof backend.execute !== "function" || typeof backend.close !== "function" || typeof backend.assertSettled !== "function" || SQLITE_WORKER_PREPARE_COMMAND in backend && backend[SQLITE_WORKER_PREPARE_COMMAND] !== void 0 && typeof backend[SQLITE_WORKER_PREPARE_COMMAND] !== "function" || backend.prepare !== void 0 && typeof backend.prepare !== "function") throw new Error("Agent publication module returned an invalid connection-bound backend");
			binding = {
				id: input.id,
				backend,
				authority
			};
			failedBinding = false;
		} catch (error) {
			authority.active = false;
			throw error;
		}
	};
	const prepareCommand = async (input) => {
		const current = requireBinding(input.id);
		const loading = current.backend[SQLITE_WORKER_PREPARE_COMMAND]?.(input.command.type);
		if (loading) await loading;
		await current.backend.prepare?.(input.command);
		if (requireBinding(input.id) !== current) throw new Error("Agent publication changed during command preparation");
	};
	const closeBinding = () => {
		if (!binding) return;
		binding.authority.active = false;
		const closed = binding.backend.close();
		if (closed !== void 0) {
			closed.catch(() => {});
			throw new Error("Connection-bound publication cleanup must remain synchronous");
		}
		binding = void 0;
	};
	return {
		async prepare(command) {
			if (command.type === "database.domain.bind" || command.type === "database.domain.publish") {
				if (binding || prepared) throw new Error("Agent database already has an admitted publication scope");
				const url = new URL(command.input.moduleUrl);
				if (url.protocol !== "file:" || url.search || url.hash) throw new Error("Agent publication requires a static local module URL");
				const module = await import(url.href);
				if (!isRecord(module) || typeof module.bindSqliteWorkerBackend !== "function") throw new Error("Agent publication module must export bindSqliteWorkerBackend");
				const factory = module.bindSqliteWorkerBackend;
				prepared = {
					id: command.input.id,
					factory: (input, bindingContext) => factory(input, bindingContext)
				};
			} else if (command.type === "database.domain.execute") await prepareCommand(command.input);
		},
		async preparePublication(input) {
			bind(input);
			requireBinding(input.id).backend.assertSettled?.();
			await Promise.resolve();
			await prepareCommand(input);
		},
		cleanupPublication(id) {
			if (binding?.id === id) {
				context.assertCleanupCurrent();
				closeBinding();
			}
		},
		execute(command) {
			if (command.type === "database.domain.bind") {
				bind(command.input);
				return;
			}
			context.assertCurrent();
			const current = requireBinding(command.input.id);
			if (command.type === "database.domain.close") {
				closeBinding();
				return;
			}
			return current.backend.execute(command.input.command);
		},
		assertSettled() {
			prepared = void 0;
			if (failedBinding) throw new Error("Agent publication binding did not settle");
			if (binding && !binding.authority.active) throw new Error("Agent publication cleanup did not settle");
			binding?.backend.assertSettled?.();
		},
		close() {
			closeBinding();
			prepared = void 0;
		}
	};
}
//#endregion
//#region src/state/openclaw-agent-execution-operations.ts
let transcript;
function prepareAgentTranscript() {
	return Promise.all([import("./session-accessor.sqlite-transcript-header-G_E8RnrI.mjs"), import("./session-accessor.sqlite-scope-BggY-C_1.mjs")]).then(([header, scope]) => {
		transcript = {
			initialize: header.ensureTranscriptHeader,
			assertIdentity: scope.assertSqliteTranscriptWriteIdentity
		};
	});
}
async function loadAgentTranscriptOperations() {
	await prepareAgentTranscript();
	return { "session.transcript.initialize": (input, context) => {
		if (!transcript) throw new Error("Session transcript initialization was not prepared");
		const { initialize } = transcript;
		const assertIdentity = transcript.assertIdentity;
		assertIdentity(input);
		return context.writeTransaction("session.entry.create-with-transcript", "Session transcript", (current) => {
			const publication = {
				kind: "session-transcript-initialized",
				sessionKey: input.sessionKey
			};
			initialize(current, {
				agentId: context.options.agentId,
				path: context.options.path,
				...input
			}, input.cwd, { onPlaceholderInserted: ({ sessionId }) => {
				publication.placeholder = { sessionId };
			} });
			deferSqliteWorkerCommitReceipt(current.db, publication);
			context.admit("commit", publication);
			return publication;
		});
	} };
}
async function loadAgentReplacementOperations() {
	const kernel = await import("./session-accessor.sqlite-replacement-state-BSuSTFK9.mjs");
	return { "session.entries.replace": (input, context) => context.writeTransaction("session.entry-replacements", "Session replacement", (current) => {
		const result = kernel.commitSessionEntryReplacementsInDatabase(current, input, () => {
			const initialization = input.initializeTranscript;
			if (!initialization) return;
			try {
				if (!transcript) throw new Error("Session transcript initialization was not prepared");
				const { initialize } = transcript;
				const assertIdentity = transcript.assertIdentity;
				assertIdentity(initialization);
				initialize(current, {
					agentId: context.options.agentId,
					path: context.options.path,
					...initialization
				}, initialization.cwd);
			} catch (error) {
				throw Object.assign(new Error(formatErrorMessage(error), { cause: error }), { name: "SessionTranscriptInitializationError" });
			}
		});
		const publication = kernel.prepareSessionEntryReplacementPublication(result, current);
		deferSqliteWorkerCommitReceipt(current.db, publication);
		context.admit("commit", publication);
		return {
			...result,
			publication
		};
	}) };
}
async function loadAgentRestartRecoveryOperations() {
	const kernel = await import("./session-accessor.sqlite-recovery.worker-BfNgaVMM.mjs");
	return { "session.restart.recover": (input, { writeTransaction, admit }) => writeTransaction("session.lifecycle.recover-tombstone", "Session recovery", (current) => {
		const result = kernel.recoverRestartTombstoneInDatabase(current, input);
		deferSqliteWorkerCommitReceipt(current.db, result.publication ?? { kind: "session-restart-recovery-unchanged" });
		admit("commit", result.publication);
		return result;
	}) };
}
async function loadAgentEntryReadOperations() {
	const kernel = await import("./session-accessor.sqlite-entry-read-BAw2csg5.mjs");
	return { "session.entry.read": (input, { open }) => kernel.readSessionEntryRow(open(), input.sessionKey)?.entry };
}
async function loadAgentEntryPatchOperations() {
	const kernel = await import("./session-entry-patch.worker-CLVHD_2W.mjs");
	return {
		"session.entry.patch.prepare": (input, { open }) => kernel.readSessionEntryPatchSnapshot(open(), input),
		"session.entry.patch.commit": kernel.commitSessionEntryPatch
	};
}
async function loadAgentCompoundOperations() {
	const turn = await import("./session-turn.worker-CGxXVWn8.mjs");
	const reset = await import("./session-reset.worker-BokV5G3V.mjs");
	await (await import("./session-turn-predicate-69fuoDRB.mjs")).prepareSessionTurnPredicates();
	return {
		"session.turn.prepare": turn.prepareSessionTurn,
		"session.turn.commit": turn.commitSessionTurn,
		"session.lifecycle.reset": reset.commitSessionReset
	};
}
async function loadAgentNativeBindingOperations() {
	return { "session.nativeBindings.delete": (await import("./session-native-binding.worker-BFDvDckb.mjs")).deleteSessionWithNativeBindings };
}
async function prepareAgentNativeBindingOperation(input, env) {
	await (await import("./session-native-binding.worker-BFDvDckb.mjs")).prepareSessionNativeBindingDeletion(input, env);
}
async function loadAgentTrajectoryOperations() {
	const kernel = await import("./runtime-store.sqlite-aTMfP6-b.mjs");
	return { "trajectory.events.append": (input, { writeTransaction, admit }) => writeTransaction("trajectory.runtime.append", "Trajectory append", (current) => {
		kernel.appendSqliteTrajectoryRuntimeEventsInTransaction(current, input);
		deferSqliteWorkerCommitReceipt(current.db, { kind: "trajectory-runtime-append" });
		admit("commit");
	}) };
}
async function loadAgentArchiveOperations() {
	const kernel = await import("./session-accessor.sqlite-archive-store-kernel-DAnmYtZU.mjs");
	return {
		"session.archives.preparePublication": (input, { writeTransaction, admit }) => writeTransaction("session.archive.publish", "Session archive publication", (current) => {
			const result = kernel.prepareSessionTranscriptArchivePublishPlans(current, input);
			admit("commit");
			return result;
		}),
		"session.archives.recordPublication": (input, { writeTransaction, admit }) => writeTransaction("session.archive.publish", "Session archive publication", (current) => {
			const result = kernel.recordSessionTranscriptArchivePublishResults(current, input.results, input.nowMs);
			admit("commit");
			return result;
		})
	};
}
async function loadAgentAcpOperations() {
	const kernel = await import("./session-meta-entry.worker-BnccK34h.mjs");
	return { "session.entry.acp": (input, { open, options, admit }) => kernel.mutateAcpSessionEntryInWorker(open(), options, input, admit) };
}
async function loadAgentProviderReviewOperations() {
	const kernel = await import("./provider-review-store.worker-CORbJleu.mjs");
	return { "session.providerReview.compare": (input, { open, options, admit }) => kernel.compareSessionProviderReviewInWorker(open(), options, input, admit) };
}
async function loadAgentReactionOperations() {
	const kernel = await import("./session-reaction-store.kernel-D386K_aB.mjs");
	return { "session.reaction.set": (input, { writeTransaction, admit }) => writeTransaction("session.reaction.set", "Reaction write", (current) => {
		const result = kernel.setSessionReactionInDatabase(current, input.sessionKey, input.params);
		admit("commit");
		return result;
	}) };
}
async function loadAgentPendingInputOperations() {
	const pending = await import("./session-pending-input-operations.kernel-0IFDMFgF.mjs");
	const kernel = await import("./session-pending-input-withdrawal.worker-B47aHSuz.mjs");
	const history = await import("./session-pending-input-history-reconcile-C-HBiSxK.mjs");
	return {
		"session.pendingInputs.read": (input, { open }) => pending.readPendingInput(open(), input),
		"session.pendingInputs.mutate": (input, context) => pending.mutatePendingInput(input, context, deferSqliteWorkerCommitReceipt),
		"session.pendingInputs.interruptHistory": (input, { open, options, admit }) => {
			const database = open();
			return history.interruptPendingInputHistoryInDatabase(database, options, input, admit, (receipt) => deferSqliteWorkerCommitReceipt(database.db, receipt));
		},
		"session.pendingInputs.withdraw": (input, { open, options, admit }) => kernel.discardSessionPendingInputInWorker(open(), options, input, admit)
	};
}
async function loadAgentArchivePruningOperations() {
	const kernel = await import("./session-history-archive-pruning.worker-CtbX6A-0.mjs");
	return {
		"session.archivePruning.pruneRetention": (input, { open, options, admit }) => kernel.pruneSessionArchivesByRetentionInDatabase(open(), options, input, admit),
		"session.archivePruning.deletePublished": (input, { open, options, admit }) => kernel.deletePublishedSessionArchiveInDatabase(open(), options, input, admit),
		"session.archivePruning.removeLegacy": (input, { open, options, admit }) => kernel.removeLegacySessionArchiveInDatabase(open(), options, input.filePath, admit),
		"session.archivePruning.reclaimPages": (input, { open, admit }) => open().walMaintenance.reclaimFreePages({
			maxPages: input.maxPages,
			beforeMutation: () => admit("transaction"),
			onCommit: () => admit("commit")
		})
	};
}
async function loadConversationDeliveryOperations() {
	const kernel = await import("./conversation-delivery-store.kernel-YgNWpSiF.mjs");
	return {
		"conversation.delivery.begin": (input, { writeTransaction, admit }) => writeTransaction("conversation-delivery.begin", "Conversation delivery", (database) => {
			const result = kernel.beginConversationDeliveryInDatabase(database, input);
			admit("commit");
			return result;
		}),
		"conversation.delivery.transition": (input, { writeTransaction, admit }) => writeTransaction(`conversation-delivery.${input.status}`, "Conversation delivery", (database) => {
			const result = kernel.transitionConversationDeliveryInDatabase(database, input);
			admit("commit");
			return result;
		})
	};
}
async function loadUsageCacheOperations() {
	const kernel = await import("./session-cost-usage-cache.kernel-CLQc4cl0.mjs");
	return {
		"usageCache.writeRollup": (input, { writeTransaction, admit }) => writeTransaction("session-cost-usage.rollup.write", "Usage cache", ({ db }) => {
			const result = kernel.writeSessionCostUsageRollupInDatabase(db, input);
			admit("commit");
			return result;
		}),
		"usageCache.prune": (input, { writeTransaction, admit }) => writeTransaction("session-cost-usage.rollup.prune", "Usage cache", ({ db }) => {
			kernel.pruneSessionCostUsageRollupsInDatabase(db, input);
			admit("commit");
		}),
		"usageCache.acquireLock": (input, { writeTransaction, admit }) => writeTransaction("session-cost-usage.refresh-lock.acquire", "Usage cache", ({ db }) => {
			const result = kernel.acquireSessionCostUsageRefreshLockInDatabase(db, input);
			admit("commit");
			return result;
		}),
		"usageCache.releaseLock": (input, { writeTransaction, admit }) => writeTransaction("session-cost-usage.refresh-lock.delete", "Usage cache", ({ db }) => {
			kernel.deleteSessionCostUsageRefreshLockInDatabase(db, input);
			admit("commit");
		})
	};
}
//#endregion
export { prepareAgentNativeBindingOperation as _, loadAgentEntryPatchOperations as a, requestRestrictedAgentDatabaseAdmission as b, loadAgentPendingInputOperations as c, loadAgentReplacementOperations as d, loadAgentRestartRecoveryOperations as f, loadUsageCacheOperations as g, loadConversationDeliveryOperations as h, loadAgentCompoundOperations as i, loadAgentProviderReviewOperations as l, loadAgentTranscriptOperations as m, loadAgentArchiveOperations as n, loadAgentEntryReadOperations as o, loadAgentTrajectoryOperations as p, loadAgentArchivePruningOperations as r, loadAgentNativeBindingOperations as s, loadAgentAcpOperations as t, loadAgentReactionOperations as u, prepareAgentTranscript as v, createAgentDatabaseDomainOwner as y };
