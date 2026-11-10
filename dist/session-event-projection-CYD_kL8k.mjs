import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as isDeeplyFrozenPlainData } from "./immutable-data-DqJSDH8t.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { _ as readGatewayAccessRevision } from "./operator-role-policy-Coro3qc5.mjs";
import { t as buildGatewaySessionSnapshot } from "./session-event-payload-jfNs8sPy.mjs";
import { n as prepareSessionRowPublication, r as serializeSessionRow } from "./session-row-presentation-L_akTnVb.mjs";
import { createHash, randomUUID } from "node:crypto";
//#region src/gateway/session-ancestor-references.ts
const MAX_ROWS = 128;
const MAX_CONTENT_CHARS = 131072;
const preparedAncestors = /* @__PURE__ */ new WeakMap();
/** Prepare immutable viewer content once, before consulting connection delivery history. */
function prepareSessionAncestor(row) {
	const cached = preparedAncestors.get(row);
	if (cached) return cached;
	const serialized = JSON.stringify(row.snapshotAt === void 0 ? row : {
		...row,
		snapshotAt: 0
	});
	const prepared = {
		row,
		identity: JSON.stringify([row.agentId, row.key]),
		content: createHash("sha256").update(serialized).digest("base64url"),
		chars: serialized.length
	};
	if (isDeeplyFrozenPlainData(row)) preparedAncestors.set(row, prepared);
	return prepared;
}
/** Connection-owned, bounded history of exactly the presented wire content. */
var SessionAncestorReferences = class {
	#rows = /* @__PURE__ */ new Map();
	#chars = 0;
	forget(key) {
		for (const [identity, row] of this.#rows) if (row.key === key) this.#delete(identity);
	}
	#delete(identity) {
		const previous = this.#rows.get(identity);
		if (previous) {
			this.#chars -= previous.chars;
			this.#rows.delete(identity);
		}
	}
	prepare(rows, revision = randomUUID()) {
		const ancestorSessions = [];
		const ancestorSessionRefs = [];
		const deliveryKeys = [];
		let updates;
		for (const { row, identity, content, chars } of rows) {
			const snapshotAt = row.snapshotAt;
			const previous = this.#rows.get(identity);
			if (previous?.content === content && snapshotAt !== void 0) {
				deliveryKeys.push(previous.revision);
				ancestorSessionRefs.push({
					key: row.key,
					sessionId: row.sessionId,
					agentId: row.agentId,
					revision: previous.revision,
					snapshotAt
				});
				continue;
			}
			deliveryKeys.push("");
			ancestorSessions.push({
				...row,
				ancestorRevision: revision
			});
			(updates ??= /* @__PURE__ */ new Map()).set(identity, snapshotAt !== void 0 && chars <= MAX_CONTENT_CHARS ? {
				key: row.key,
				content,
				chars,
				revision
			} : void 0);
		}
		return {
			deliveryKey: JSON.stringify(deliveryKeys),
			ancestorSessions,
			...ancestorSessionRefs.length ? { ancestorSessionRefs } : {},
			delivered: () => {
				if (!updates) return;
				for (const [identity, row] of updates) {
					this.#delete(identity);
					if (row) {
						this.#rows.set(identity, row);
						this.#chars += row.chars;
					}
				}
				while (this.#rows.size > MAX_ROWS || this.#chars > MAX_CONTENT_CHARS) this.#delete(this.#rows.keys().next().value);
			}
		};
	}
};
//#endregion
//#region src/gateway/session-event-projection.ts
/** Bind prepared rows without exposing their implementation to transport contracts. */
function prepareSessionEventProjection(projection, read, prepared) {
	return (event, payload, eventScope, connection) => {
		if (!connection.isCurrentProjection(projection)) return () => void 0;
		if (event !== "sessions.changed" && event !== "session.message" || !isRecord(payload)) return;
		const source = payload;
		if (source.reason === "delete" || typeof source.sessionKey !== "string") {
			connection.forgetAncestors(typeof source.sessionKey === "string" ? source.sessionKey : void 0);
			return;
		}
		const scope = connection.resolveAgentScope(source.sessionKey, typeof source.agentId === "string" ? source.agentId : eventScope.agentId);
		if (!scope?.[1] || !scope[0] && !scope[2] && !parseAgentSessionKey(source.sessionKey)) return;
		const query = {
			key: source.sessionKey,
			agentId: scope[1]
		};
		const rows = read ?? projection;
		const record = rows.describe(query);
		if (!record || typeof source.sessionId === "string" && source.sessionId !== record.entry.sessionId) return () => void 0;
		const base = isRecord(source.session) ? source : {
			...buildGatewaySessionSnapshot({
				sessionRow: rows.present(record),
				agentId: scope[0],
				includeSession: true
			}),
			...source
		};
		const sourceRow = base.session;
		if (!isRecord(sourceRow) || sourceRow.sessionId !== record.entry.sessionId || sourceRow.lifecycleRevision !== void 0 && sourceRow.lifecycleRevision !== record.entry.lifecycleRevision) return () => void 0;
		let messageBytes;
		const serializeMessage = event === "session.message" && prepared?.encodeMessage ? () => {
			if (!messageBytes) {
				const field = JSON.stringify({ message: base.message }).slice(1, -1);
				messageBytes = Buffer.from(field ? `${field},` : "");
			}
			return messageBytes;
		} : void 0;
		const presentRecipient = prepareSessionRowPublication(projection, Date.now(), rows);
		const ancestors = prepared ? prepared.ancestors : projection.ancestorRows(record, read);
		const enrichment = {
			includeDerivedTitles: true,
			includeLastMessage: true
		};
		const ancestorRevision = randomUUID();
		const audiences = /* @__PURE__ */ new Map();
		let revision = projection.state.revision;
		let accessRevision = readGatewayAccessRevision();
		let runProjector = connection.getRunProjector();
		return (client) => {
			if (!connection.isCurrentProjection(projection) || !projection.isCurrent(record)) return;
			const currentRunProjector = connection.getRunProjector();
			const currentAccessRevision = readGatewayAccessRevision();
			if (revision !== projection.state.revision || accessRevision !== currentAccessRevision || runProjector !== currentRunProjector) {
				audiences.clear();
				revision = projection.state.revision;
				accessRevision = currentAccessRevision;
				runProjector = currentRunProjector;
			}
			const presentation = presentRecipient(client, runProjector);
			const audienceKey = presentation.audienceKey;
			let audience = audiences.get(audienceKey);
			if (!audience) {
				const row = presentation.present(record, enrichment);
				if (!row) return;
				const hiddenAncestors = [];
				audience = {
					row,
					ancestors: ancestors?.every((ancestor) => projection.isCurrent(ancestor)) ? ancestors.flatMap((ancestor) => {
						if (presentation.sharing.entryFilter?.(ancestor.key, ancestor.entry) === false) {
							hiddenAncestors.push(ancestor.key);
							return [];
						}
						const presented = presentation.present(ancestor, enrichment);
						return presented ? [prepareSessionAncestor(presented)] : [];
					}) : void 0,
					hiddenAncestors,
					payloads: /* @__PURE__ */ new Map()
				};
				audiences.set(audienceKey, audience);
			}
			const { row } = audience;
			const references = connection.references(client);
			for (const key of audience.hiddenAncestors) references.forget(key);
			const ancestorDelivery = audience.ancestors && references.prepare(audience.ancestors, ancestorRevision);
			if (!ancestorDelivery) connection.forgetConnectionAncestors(client);
			const deliveryKey = ancestorDelivery?.deliveryKey;
			let projected = audience.payloads.get(deliveryKey);
			if (!projected) {
				projected = {
					...base,
					session: row,
					fastMode: row.fastMode,
					effectiveFastMode: row.effectiveFastMode,
					ancestorSessions: ancestorDelivery?.ancestorSessions,
					ancestorSessionRefs: ancestorDelivery?.ancestorSessionRefs,
					visibility: row.visibility,
					sharingRole: row.sharingRole,
					...isRecord(base.activitySummary) && row.activitySummary ? { activitySummary: {
						...base.activitySummary,
						canEnsure: row.activitySummary.canEnsure
					} } : {}
				};
				if (Object.hasOwn(projected, "childSessions")) projected.childSessions = row.childSessions;
				audience.payloads.set(deliveryKey, projected);
			}
			return {
				payload: projected,
				serializeSession: () => serializeSessionRow(row),
				serializeMessage,
				delivered: () => {
					references.forget(row.key);
					if (event === "sessions.changed" && source.reason === "activity-summary") for (const ancestor of ancestorDelivery?.ancestorSessions ?? []) references.forget(ancestor.key);
					else ancestorDelivery?.delivered();
				}
			};
		};
	};
}
//#endregion
export { SessionAncestorReferences as n, prepareSessionEventProjection as t };
