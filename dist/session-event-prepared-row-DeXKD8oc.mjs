import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./io-B0OAIqw3.mjs";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.mjs";
import { i as resolveSessionEventAgentScope } from "./session-request-agent-Bxi11ET4.mjs";
import { i as withReadySessionRows } from "./session-row-prepared-read-BwiDGjfX.mjs";
import { performance } from "node:perf_hooks";
//#region src/gateway/session-event-prepared-row.ts
const PUBLICATIONS_PER_TURN = 8;
const PUBLICATION_BUDGET_MS = 6;
const publicationOwners = /* @__PURE__ */ new WeakMap();
function createPublicationOwner(projection) {
	const pending = /* @__PURE__ */ new Set();
	const deferred = Symbol("publication-deferred");
	let started = 0;
	let startedAt = 0;
	let reset;
	let wake;
	const waiting = /* @__PURE__ */ new Set();
	function track(work) {
		pending.add(work);
		work.then(() => pending.delete(work), () => pending.delete(work));
		return work;
	}
	function wakeNext() {
		wake ??= setImmediate(() => {
			wake = void 0;
			clearImmediate(reset);
			reset = void 0;
			const resume = waiting.values().next().value;
			if (resume) {
				waiting.delete(resume);
				resume();
			}
			if (waiting.size > 0) wakeNext();
		});
	}
	function claimTurn(resumed) {
		const now = performance.now();
		if (!reset) {
			started = 0;
			startedAt = now;
			reset = setImmediate(() => {
				reset = void 0;
			});
			reset.unref?.();
		}
		if (!resumed && (wake || waiting.size > 0) || started >= PUBLICATIONS_PER_TURN || now - startedAt >= PUBLICATION_BUDGET_MS) return new Promise((resolve) => {
			waiting.add(resolve);
			wakeNext();
		});
		started++;
	}
	const rows = { withPreparedExactRows(queries, consume, options) {
		return track((async () => {
			let resumed = false;
			for (;;) {
				let yieldUntil;
				const prepared = await projection.withPreparedExactRows(queries, (read) => {
					yieldUntil = claimTurn(resumed);
					return yieldUntil ? deferred : consume(read);
				}, options);
				if (prepared.kind === "pending") return prepared;
				if (prepared.value !== deferred) return {
					kind: "complete",
					value: prepared.value
				};
				await yieldUntil;
				resumed = true;
			}
		})());
	} };
	return {
		rows: {
			...rows,
			track,
			withReadyRows(queries, consume, options) {
				return track(withReadySessionRows(rows, queries, consume, options));
			}
		},
		async drain() {
			while (pending.size > 0) await Promise.allSettled(pending);
			clearImmediate(reset);
			reset = void 0;
		}
	};
}
/** Independent prepared publishers share a budget without serializing row preparation. */
function sessionEventPublicationRows(projection) {
	let owner = publicationOwners.get(projection);
	if (!owner) {
		owner = createPublicationOwner(projection);
		publicationOwners.set(projection, owner);
	}
	return owner.rows;
}
async function drainSessionEventPublications(projection) {
	await publicationOwners.get(projection)?.drain();
}
async function withPreparedEventRow(projection, query, publish) {
	if (!projection || !query) {
		publish();
		return;
	}
	await sessionEventPublicationRows(projection).withReadyRows(() => [query], publish, { includeAncestors: true });
}
async function withPreparedSessionEventRow(projection, sessionKey, eventAgentId, publish) {
	if (!projection) {
		publish();
		return;
	}
	const routingAgentId = resolveSessionEventAgentScope(getRuntimeConfig(), sessionKey, eventAgentId)?.[1];
	if (routingAgentId) {
		await withPreparedEventRow(projection, {
			key: sessionKey,
			agentId: routingAgentId
		}, publish);
		return;
	}
	do
		await projection.ensureMaterialized();
	while (projection.needsMaterialization);
	publish();
}
function readTranscriptUpdateLifecycleOwner(update, projection) {
	const marker = parseSqliteSessionFileMarker(update.sessionFile);
	const sessionKey = normalizeOptionalString(update.target?.sessionKey) ?? normalizeOptionalString(update.sessionKey) ?? (marker ? projection?.findBySessionId(marker)[0]?.key : void 0);
	if (!sessionKey) return;
	const agentId = normalizeOptionalString(update.target?.agentId) ?? normalizeOptionalString(update.agentId) ?? marker?.agentId;
	const sessionId = normalizeOptionalString(update.target?.sessionId) ?? normalizeOptionalString(update.sessionId) ?? marker?.sessionId;
	const storePath = normalizeOptionalString(update.target?.storePath) ?? marker?.storePath;
	const ownerAgentId = agentId ?? resolveSessionEventAgentScope(getRuntimeConfig(), sessionKey)?.[1];
	const entry = ownerAgentId ? projection?.capture({
		agentId: ownerAgentId,
		key: sessionKey,
		storePath
	})?.entry : void 0;
	if (!entry || sessionId && entry.sessionId !== sessionId) return;
	const lifecycleRevision = normalizeOptionalString(entry.lifecycleRevision);
	return {
		sessionId: entry.sessionId,
		...lifecycleRevision ? { lifecycleRevision } : {}
	};
}
//#endregion
export { withPreparedSessionEventRow as a, withPreparedEventRow as i, readTranscriptUpdateLifecycleOwner as n, sessionEventPublicationRows as r, drainSessionEventPublications as t };
