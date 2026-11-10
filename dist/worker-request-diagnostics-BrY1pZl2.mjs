import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { q as hasInternalDiagnosticEventInterest, s as emitTrustedDiagnosticEvent } from "./diagnostic-events-C91J-XX8.mjs";
import { t as isDiagnosticFlagEnabled } from "./diagnostic-flags-CaSenm_x.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/infra/sqlite-worker-request-class.ts
const operations = [
	"admit",
	"audit.events.list",
	"audit.writer.process",
	"audit.writer.prune",
	"database.domain.bind",
	"database.domain.close",
	"database.domain.publish",
	"database.inspectIdle",
	"database.prepareWrite",
	"database.walMaintenance",
	"stateLease.acquire",
	"stateLease.release",
	"stateLease.renew",
	"stateLease.verify"
];
const families = [
	"acp",
	"acpSessions",
	"agentDatabaseDeletion",
	"agentDatabaseRegistry",
	"agentDatabases",
	"agentDeletionJournal",
	"agentProvenance",
	"apns",
	"audit",
	"authProfiles",
	"backup",
	"bootstrap",
	"capture",
	"channelIngress",
	"clawProvenance",
	"claws",
	"config",
	"conversation",
	"conversationBindings",
	"database",
	"deliveryQueue",
	"deviceAuth",
	"deviceIdentity",
	"devicePairing",
	"diagnostic",
	"doctor",
	"exec-approvals",
	"execApprovals",
	"generatedHtmlProvenance",
	"githubPublication",
	"githubRepository",
	"legacyMcpOAuth",
	"localWorkspace",
	"managedImages",
	"mcpOAuth",
	"mentions",
	"modelCatalog",
	"nativeHookRelay",
	"node",
	"nodeHost",
	"nodeWorker",
	"onboardingRecommendations",
	"operator",
	"operatorApprovals",
	"pairing",
	"placementJournals",
	"placementTools",
	"placementTranscript",
	"placementTurns",
	"pluginBlob",
	"pluginModelCatalogCredentials",
	"plugins",
	"preparedPoolPresence",
	"projects",
	"promotions",
	"repositoryWorkspaces",
	"restartSentinel",
	"sandboxRegistry",
	"secrets",
	"sessionDelivery",
	"sessionGroups",
	"sessionRepositoryWorkspaces",
	"sessionState",
	"sessionUpstream",
	"skillLibrary",
	"skillUploads",
	"skills",
	"stateLease",
	"subagents",
	"telemetry",
	"tts",
	"tui",
	"updateRuns",
	"usageCache",
	"userModelAccounts",
	"userPreferences",
	"userProfiles",
	"webPush",
	"workerEnvironments",
	"workerInference",
	"workerPlacements",
	"workers",
	"workspace",
	"workshop",
	"worktrees"
];
const sqliteWorkerRequestClasses = /* @__PURE__ */ new Set([...operations, ...families]);
function classifySqliteWorkerExecute(commandType) {
	if (sqliteWorkerRequestClasses.has(commandType)) return commandType;
	const separator = commandType.indexOf(".");
	const family = separator === -1 ? commandType : commandType.slice(0, separator);
	return sqliteWorkerRequestClasses.has(family) ? family : "execute";
}
//#endregion
//#region src/infra/worker-request-diagnostics.ts
const reservations = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerReservationObservation"), () => new AsyncLocalStorage());
function withSqliteWorkerReservationObservation(observation, run) {
	return reservations.run(observation, run);
}
const detailedTiming = isDiagnosticFlagEnabled("sqlite.worker-timing");
const coreCommands = /* @__PURE__ */ new Set([
	"session.actor.read",
	"session.actor.acceptInput",
	"session.actor.adoptRun",
	"session.actor.appendToolResult",
	"session.actor.appendTranscriptEvent",
	"session.actor.completeTurn",
	"session.actor.deliveryPending",
	"session.actor.deliverySettled",
	"session.actor.patch",
	"session.entry.read",
	"session.entry.patch.prepare",
	"session.entry.patch.commit",
	"session.entry.replacements.prepare",
	"session.entry.replacements.commit",
	"session.lifecycle.project",
	"session.maintenance.metadata",
	"session.maintenance.prepare",
	"session.maintenance.release",
	"session.maintenance.finalize",
	"session.maintenance.size",
	"session.rowTranscript.backfill",
	"usageCache.writeRollup",
	"usageCache.prune",
	"trajectory.events.append",
	"trajectory.retention.begin",
	"trajectory.retention.delete",
	"session.pendingInputs.read",
	"session.pendingInputs.mutate",
	"session.turn.prepare",
	"session.turn.commit",
	"transcript.prepare",
	"transcript.commit"
]);
const projectionCommands = /* @__PURE__ */ new Map([
	["preflight", "transcript-projection.preflight"],
	["sweep", "transcript-projection.sweep"],
	["claim", "transcript-projection.claim"],
	["deleteChunk", "transcript-projection.deleteChunk"],
	["appendChunk", "transcript-projection.appendChunk"],
	["finalize", "transcript-projection.finalize"]
]);
const projectionModuleSuffixes = ["/config/sessions/session-transcript-projection-publication.worker.js", "/config/sessions/session-transcript-projection-publication.worker.ts"];
const requestPrefixes = [
	["pluginState.", "plugin_state"],
	["session.history.", "transcript_read"],
	["trajectory.", "transcripts"],
	["session.transcript.", "transcripts"],
	["transcripts.", "transcripts"],
	["session.", "sessions"],
	["cron.", "cron"]
];
function classifyWorkerRequest(commandType, commandInput) {
	if (typeof commandType !== "string") return "execute";
	if (coreCommands.has(commandType)) return commandType;
	if (commandType === "auth-profile-rows") return "auth_profiles";
	if (commandType === "database.domain.execute" || commandType === "database.domain.publish") {
		const publication = isRecord(commandInput) ? commandInput : void 0;
		const inner = publication && isRecord(publication.command) ? publication.command : void 0;
		const moduleUrl = publication?.moduleUrl;
		if (commandType === "database.domain.publish" && typeof moduleUrl === "string" && typeof inner?.type === "string" && projectionModuleSuffixes.some((suffix) => moduleUrl.endsWith(suffix))) {
			const projection = projectionCommands.get(inner.type);
			if (projection) return projection;
		}
		const label = inner ? classifyWorkerRequest(inner.type) : "execute";
		return label === "execute" ? "domain_execute" : label;
	}
	for (const [prefix, requestClass] of requestPrefixes) if (commandType.startsWith(prefix)) return requestClass;
	return classifySqliteWorkerExecute(commandType);
}
const queued = resolveGlobalSingleton(Symbol.for("openclaw.workerRequestQueueDepth"), () => /* @__PURE__ */ new Map());
const requestClasses = /* @__PURE__ */ new Set([
	...coreCommands,
	...projectionCommands.values(),
	...sqliteWorkerRequestClasses,
	...requestPrefixes.map(([, requestClass]) => requestClass),
	"task",
	"open",
	"close",
	"execute",
	"domain_execute",
	"auth_profiles"
]);
/** One observation follows a request across admission retries and cancellation. */
function trackWorkerRequest(kind, requestClass, queuedSignal) {
	const label = requestClasses.has(requestClass) ? requestClass : "other";
	const reservation = kind === "sqlite_writer" ? reservations.getStore() : void 0;
	const enqueuedAt = performance.now();
	const timing = kind === "sqlite_writer" && (detailedTiming || hasInternalDiagnosticEventInterest("worker.request")) ? { enqueued: enqueuedAt } : void 0;
	let startedAt;
	let completed = false;
	const emit = (phase, durations = {}) => {
		if (!hasInternalDiagnosticEventInterest("worker.request")) return;
		emitTrustedDiagnosticEvent({
			type: "worker.request",
			kind,
			requestClass: label,
			phase,
			queueDepth: queued.get(kind) ?? 0,
			...durations,
			...phase === "completed" && timing ? { timing } : {}
		});
	};
	const dequeue = () => queued.set(kind, (queued.get(kind) ?? 0) - 1);
	queued.set(kind, (queued.get(kind) ?? 0) + 1);
	emit("queued");
	const observation = {
		timing,
		...reservation ? { recordTransactions: (count) => {
			reservation.transactionCount = (reservation.transactionCount ?? 0) + count;
		} } : {},
		started: () => {
			if (completed || startedAt !== void 0) return;
			startedAt = performance.now();
			if (reservation) reservation.operations.add(reservation.operations.has(label) || reservation.operations.size < 8 ? label : "other");
			if (timing) timing.dispatched = startedAt;
			queuedSignal?.removeEventListener("abort", observation.completed);
			dequeue();
			emit("started", { queueWaitMs: startedAt - enqueuedAt });
		},
		completed: () => {
			if (completed) return;
			completed = true;
			queuedSignal?.removeEventListener("abort", observation.completed);
			if (startedAt === void 0) dequeue();
			emit("completed", startedAt === void 0 ? {} : { durationMs: performance.now() - startedAt });
		}
	};
	queuedSignal?.addEventListener("abort", observation.completed, { once: true });
	if (queuedSignal?.aborted) observation.completed();
	return observation;
}
//#endregion
export { trackWorkerRequest as n, withSqliteWorkerReservationObservation as r, classifyWorkerRequest as t };
