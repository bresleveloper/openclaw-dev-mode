import { C as parseOpaqueLeafEntry, T as partitionSessionFileEntries, v as assertCurrentSessionTranscriptHeader, w as parseParentLinkedOpaqueEntry, x as isIndexedSessionEntry } from "./transcript-payload-Yc_w8Yx5.mjs";
import { n as captureSessionTranscriptTargetBinding } from "./transcript-target-binding-WjVavOYj.mjs";
import { i as captureOwnedTranscriptWriteAssertion } from "./transcript-write-context-m7NE2aEm.mjs";
import { t as warnSessionPersistenceDeprecation } from "./session-persistence-deprecation-H2dQRi8K.mjs";
import { a as inspectTranscriptEventsSync, d as loadTranscriptReadSnapshotSync } from "./session-accessor.sqlite-read-8qBtzC-z.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { r as resolveOpaqueSessionFirstKeptEntryId, t as SessionEntryNavigation } from "./session-entry-navigation-DTnKkJNk.mjs";
import { t as readSessionTranscriptBoundedActiveContextCore } from "./session-accessor.sqlite-active-context-B0o-SgQq.mjs";
import { t as prepareSessionTranscriptHydration } from "./session-transcript-hydration-Boy0sn8m.mjs";
import { d as generateSessionEntryId, s as migrateToCurrentVersion, u as createManagedSessionId } from "./session-manager-codec-Dl5j6GJ-.mjs";
//#region src/agents/sessions/session-manager-core.ts
var SessionManagerCore = class SessionManagerCore extends SessionEntryNavigation {
	constructor(cwd, persistenceTarget, loadedEntries, boundedContext, transcriptMutationAt, version) {
		super();
		this.migrated = false;
		this.sessionId = "";
		this.hydrationRevision = 0;
		this.fileEntries = [];
		this.opaqueFileEntries = [];
		this.boundedParentIds = /* @__PURE__ */ new Map();
		this.boundedFirstKeptById = /* @__PURE__ */ new Map();
		this.pendingDeliberateAppend = false;
		this.persistenceHeaderPending = false;
		this.boundedContextIncomplete = false;
		this.cwd = cwd;
		this.persistenceTarget = persistenceTarget;
		this.boundedContextLimits = boundedContext?.limits;
		this.boundedContextIncomplete = boundedContext !== void 0;
		this.persistedBoundaryCount = boundedContext?.boundaryCount;
		this.persistedSuffixStartSeq = boundedContext?.persistedSuffixStartSeq;
		this.transcriptMutationAt = boundedContext !== void 0 ? boundedContext.transcriptMutationAt : transcriptMutationAt;
		this.transcriptVersion = version ?? boundedContext?.version;
		if (persistenceTarget || loadedEntries) this.setLoadedSessionTarget(persistenceTarget, loadedEntries ?? [], boundedContext, version);
		else this.newSession();
	}
	/** @deprecated Runtime callers should await setSessionTargetAsync. */
	setSessionTarget(target) {
		warnSessionPersistenceDeprecation("SessionManager.setSessionTarget", "setSessionTargetAsync");
		this.setSessionTargetSync(target);
	}
	setSessionTargetSync(target) {
		this.assertTranscriptViewAvailable();
		this.hydrationRevision++;
		const capturedTarget = captureSessionTranscriptTargetBinding(target);
		const bounded = this.boundedContextLimits ? readSessionTranscriptBoundedActiveContextCore(capturedTarget, this.boundedContextLimits) : void 0;
		const snapshot = bounded ? void 0 : loadTranscriptReadSnapshotSync(capturedTarget);
		const entries = bounded?.events ?? snapshot?.events ?? [];
		this.boundedContextIncomplete = bounded !== void 0;
		this.persistedBoundaryCount = bounded?.boundaryCount;
		this.persistedSuffixStartSeq = bounded?.persistedSuffixStartSeq;
		this.transcriptMutationAt = bounded !== void 0 ? bounded.transcriptMutationAt : snapshot?.version.updatedAt;
		const header = entries.find((entry) => typeof entry === "object" && entry !== null && entry.type === "session");
		this.setLoadedSessionTarget(capturedTarget, entries, bounded, bounded?.version ?? snapshot?.version);
		if (header?.cwd) this.cwd = header.cwd;
	}
	/** Prepare off-thread and publish the entire view only while this manager is unchanged. */
	setSessionTargetAsync(target, signal) {
		return this.hydrateSessionTarget(target, false, signal);
	}
	async hydrateSessionTarget(target, preserveCwd, signal, complete = false) {
		this.assertTranscriptViewAvailable();
		const hydration = prepareSessionTranscriptHydration(target, complete ? void 0 : this.boundedContextLimits, signal);
		const assertOwned = captureOwnedTranscriptWriteAssertion(hydration.target);
		const revision = ++this.hydrationRevision;
		const prior = this.captureTranscriptView();
		const entryCount = this.fileEntries.length;
		const opaqueCount = this.opaqueFileEntries.length;
		assertOwned();
		const prepared = await hydration.read().catch((error) => {
			assertOwned();
			throw error;
		});
		signal?.throwIfAborted();
		assertOwned();
		hydration.assertCurrent();
		this.assertTranscriptViewAvailable();
		const current = this.captureTranscriptView();
		if (revision !== this.hydrationRevision || this.fileEntries.length !== entryCount || this.opaqueFileEntries.length !== opaqueCount || Object.keys(prior).some((key) => Reflect.get(prior, key) !== Reflect.get(current, key))) throw new Error("Session manager changed during transcript hydration");
		this.adoptPreparedTranscriptReload(prepared, void 0, hydration.target);
		if (!preserveCwd) this.cwd = this.fileEntries.find((entry) => entry.type === "session")?.cwd ?? this.cwd;
		this.hydrationRevision++;
	}
	/** Reload an existing view without changing the runtime working directory. */
	async reloadPersistedTranscriptAsync(signal) {
		if (!this.persistenceTarget) return;
		await this.hydrateSessionTarget(this.persistenceTarget, true, signal);
	}
	/** Active-only loads can omit sibling rows even when they fit the context limits. */
	ensureCompletePersistedHistory() {
		this.assertTranscriptViewAvailable();
		if (!this.persistenceTarget || !this.boundedContextIncomplete) return;
		const limits = this.boundedContextLimits;
		this.boundedContextLimits = void 0;
		this.setSessionTargetSync(this.persistenceTarget);
		this.boundedContextLimits = limits;
	}
	async ensureCompletePersistedHistoryAsync() {
		this.assertTranscriptViewAvailable();
		if (this.persistenceTarget && this.boundedContextIncomplete) await this.hydrateSessionTarget(this.persistenceTarget, true, void 0, true);
	}
	setLoadedSessionTarget(target, entries, bounded, version) {
		this.assertTranscriptViewAvailable();
		this.transcriptVersion = version ?? bounded?.version;
		this.boundedFirstKeptById.clear();
		this.boundedParentIds.clear();
		const partitioned = partitionSessionFileEntries(entries);
		if (partitioned.fileEntries.length === 0 && partitioned.opaqueEntries.length === 0) {
			this.persistenceTarget = target ? captureSessionTranscriptTargetBinding(target) : void 0;
			this.initializeSession({ id: target?.sessionId });
			this.persistenceHeaderPending = target !== void 0;
			return;
		}
		const header = partitioned.fileEntries.find((entry) => entry.type === "session");
		if (target) assertCurrentSessionTranscriptHeader(header);
		this.persistenceHeaderPending = false;
		this.persistenceTarget = target ? captureSessionTranscriptTargetBinding(target) : void 0;
		this.fileEntries = partitioned.fileEntries;
		this.opaqueFileEntries = partitioned.opaqueEntries;
		this.sessionId = header?.id ?? target?.sessionId ?? createManagedSessionId();
		this.migrated = migrateToCurrentVersion(this.fileEntries, partitioned.fileEntriesByOriginalIndex);
		this.buildIndex();
		if (bounded) {
			this.boundedParentIds = new Map(bounded.parents);
			for (const [id, parentId] of bounded.opaqueParents) this.opaqueParentsById.set(id, parentId);
			this.adoptSelectedTranscriptPath(bounded.activeLeafEntryId, bounded.parents);
			for (const [boundaryId, range] of bounded.firstKeptRanges) {
				let firstKeptEntryId = boundaryId;
				for (let index = range.startIndex; index < range.endIndex; index++) {
					const entry = partitioned.fileEntriesByOriginalIndex[index];
					if (isIndexedSessionEntry(entry)) {
						firstKeptEntryId = entry.id;
						break;
					}
				}
				this.boundedFirstKeptById.set(boundaryId, firstKeptEntryId);
			}
		}
	}
	adoptSelectedTranscriptPath(appendParentId, parents) {
		this.logicalParentsById.clear();
		for (const [id, parentId] of parents) this.logicalParentsById.set(id, this.resolveCanonicalParentId(parentId));
		this.appendParentId = appendParentId;
		this.leafId = this.resolveOpaqueLeafTargetId(appendParentId);
		this.appendMode = void 0;
	}
	/** The loaded view only: bounded managers must never hydrate inactive history for a rewrite. */
	captureTranscriptView(copy = false) {
		this.assertTranscriptViewAvailable();
		return {
			sessionId: this.sessionId,
			transcriptVersion: this.transcriptVersion,
			persistenceHeaderPending: this.persistenceHeaderPending,
			migrated: this.migrated,
			fileEntries: copy ? [...this.fileEntries] : this.fileEntries,
			opaqueFileEntries: copy ? this.opaqueFileEntries.map((entry) => ({ ...entry })) : this.opaqueFileEntries,
			byId: copy ? new Map(this.byId) : this.byId,
			opaqueParentsById: copy ? new Map(this.opaqueParentsById) : this.opaqueParentsById,
			logicalParentsById: copy ? new Map(this.logicalParentsById) : this.logicalParentsById,
			invalidLeafControlIds: copy ? new Set(this.invalidLeafControlIds) : this.invalidLeafControlIds,
			labelsById: copy ? new Map(this.labelsById) : this.labelsById,
			labelTimestampsById: copy ? new Map(this.labelTimestampsById) : this.labelTimestampsById,
			boundedFirstKeptById: copy ? new Map(this.boundedFirstKeptById) : this.boundedFirstKeptById,
			boundedParentIds: copy ? new Map(this.boundedParentIds) : this.boundedParentIds,
			boundedContextIncomplete: this.boundedContextIncomplete,
			boundedContextLimits: this.boundedContextLimits,
			persistedBoundaryCount: this.persistedBoundaryCount,
			persistedSuffixStartSeq: this.persistedSuffixStartSeq,
			transcriptMutationAt: this.transcriptMutationAt,
			leafId: this.leafId,
			appendParentId: this.appendParentId,
			appendMode: this.appendMode,
			pendingDeliberateAppend: this.pendingDeliberateAppend
		};
	}
	/** @deprecated Runtime callers should await reloadPersistedTranscriptAsync. */
	reloadPersistedTranscript() {
		warnSessionPersistenceDeprecation("SessionManager.reloadPersistedTranscript", "reloadPersistedTranscriptAsync");
		this.reloadPersistedTranscriptSync();
	}
	reloadPersistedTranscriptSync() {
		this.assertTranscriptViewAvailable();
		if (this.persistenceTarget) {
			const runtimeCwd = this.cwd;
			this.setSessionTargetSync(this.persistenceTarget);
			this.cwd = runtimeCwd;
		}
	}
	/** Reloads a committed append without adopting a later user turn. */
	reloadPersistedTranscriptAfterAppend(expectedMutationAt, expectedEntryId, admittedUserId) {
		if (!this.persistenceTarget) return;
		const target = this.persistenceTarget;
		if (this.boundedContextLimits) this.adoptPreparedTranscriptReload({
			kind: "bounded",
			snapshot: readSessionTranscriptBoundedActiveContextCore(target, {
				...this.boundedContextLimits,
				ignoreReadFence: true
			})
		}, {
			expectedMutationAt,
			expectedEntryId,
			admittedUserId
		});
		else {
			const inspected = inspectTranscriptEventsSync(target);
			this.adoptPreparedTranscriptReload({
				kind: "full",
				snapshot: {
					events: inspected.events,
					version: {
						generation: inspected.snapshot.generation,
						rawSeq: inspected.snapshot.lastSeq,
						updatedAt: inspected.snapshot.transcriptUpdatedAt
					}
				}
			}, {
				expectedMutationAt,
				expectedEntryId,
				admittedUserId
			});
		}
	}
	/** Adopt owner-prepared bytes without reading SQLite again on the receiving thread. */
	adoptPreparedTranscriptReload(prepared, append, target = this.persistenceTarget) {
		if (!target) return;
		const { events, version } = prepared.snapshot;
		const bounded = prepared.kind === "bounded" ? prepared.snapshot : void 0;
		const mutationAt = bounded ? bounded.transcriptMutationAt : version.updatedAt;
		if (append && mutationAt !== append.expectedMutationAt && !events.some((entry) => isIndexedSessionEntry(entry) && entry.id === append.expectedEntryId)) throw new Error("SQLite transcript changed before adopting the committed append");
		const candidate = new SessionManagerCore(this.cwd);
		candidate.boundedContextLimits = this.boundedContextLimits;
		candidate.boundedContextIncomplete = bounded !== void 0;
		candidate.persistedBoundaryCount = bounded?.boundaryCount;
		candidate.persistedSuffixStartSeq = bounded?.persistedSuffixStartSeq;
		candidate.transcriptMutationAt = mutationAt;
		candidate.setLoadedSessionTarget(target, events, bounded, version);
		if (append) {
			const activeBranch = candidate.getBranch();
			const admittedUserIndex = activeBranch.findIndex((entry) => entry.id === append.admittedUserId);
			if (admittedUserIndex < 0 || activeBranch.slice(admittedUserIndex + 1).some((entry) => entry.type === "message" && entry.message.role === "user")) candidate.adoptSelectedTranscriptPath(append.expectedEntryId, [...candidate.byId].map(([id, entry]) => [id, entry.parentId]));
		}
		Object.assign(this, candidate.captureTranscriptView());
		this.persistenceTarget = candidate.persistenceTarget;
	}
	newSession(options) {
		if (this.persistenceTarget) throw new Error("Persisted session managers cannot change session identity in place");
		return this.initializeSession(options);
	}
	initializeSession(options) {
		this.sessionId = options?.id ?? this.persistenceTarget?.sessionId ?? createManagedSessionId();
		this.migrated = false;
		const header = {
			type: "session",
			version: 4,
			id: this.sessionId,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			cwd: this.cwd,
			parentSession: options?.parentSession
		};
		this.fileEntries = [header];
		this.opaqueFileEntries = [];
		this.clearNavigation();
		this.boundedFirstKeptById.clear();
		this.boundedParentIds.clear();
		this.pendingDeliberateAppend = false;
		return this.persistenceTarget ? this.sessionId : void 0;
	}
	buildIndex() {
		this.clearNavigation();
		this.pendingDeliberateAppend = false;
		let opaqueIndex = 0;
		for (let index = 0; index <= this.fileEntries.length; index += 1) {
			while (this.opaqueFileEntries[opaqueIndex]?.index === index) {
				this.appendOpaqueNavigationRecord(this.opaqueFileEntries[opaqueIndex]?.record);
				opaqueIndex += 1;
			}
			const entry = this.fileEntries[index];
			if (!entry || entry.type === "session" || this.migrated && !isIndexedSessionEntry(entry)) continue;
			this.appendCanonicalNavigationEntry(entry);
		}
		this.finishNavigation();
	}
	normalizeEntryParent(entry) {
		let normalized = super.normalizeEntryParent(entry);
		const boundedFirstKept = this.boundedFirstKeptById.get(normalized.id);
		if (boundedFirstKept !== void 0 && (normalized.type === "compaction" || normalized.type === "reset")) normalized = {
			...normalized,
			firstKeptEntryId: boundedFirstKept
		};
		if ((normalized.type === "compaction" || normalized.type === "reset") && normalized.firstKeptEntryId !== void 0 && !this.byId.has(normalized.firstKeptEntryId) && this.opaqueParentsById.has(normalized.firstKeptEntryId)) {
			const firstKeptEntryId = resolveOpaqueSessionFirstKeptEntryId({
				firstKeptEntryId: normalized.firstKeptEntryId,
				parentId: normalized.parentId,
				fallbackParentId: this.resolveEntryParentId(entry),
				byId: this.byId,
				opaqueParentsById: this.opaqueParentsById,
				entries: () => this.fileEntries.filter(isIndexedSessionEntry)
			});
			if (firstKeptEntryId && firstKeptEntryId !== normalized.firstKeptEntryId) normalized = {
				...normalized,
				firstKeptEntryId
			};
		}
		return normalized;
	}
	resolveBranchTargetId(branchFromId) {
		if (this.byId.has(branchFromId)) return branchFromId;
		return this.opaqueParentsById.has(branchFromId) ? this.resolveCanonicalParentId(branchFromId) : void 0;
	}
	clampOpaqueFileEntryIndexes() {
		let previousOpaqueIndex = 0;
		for (const opaqueEntry of this.opaqueFileEntries) {
			opaqueEntry.index = Math.max(previousOpaqueIndex, Math.min(opaqueEntry.index, this.fileEntries.length));
			previousOpaqueIndex = opaqueEntry.index;
		}
	}
	createLeafControl(parentId, appendParentId = this.appendParentId, appendMode) {
		return {
			type: "leaf",
			id: generateSessionEntryId(),
			parentId,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			targetId: this.leafId,
			...appendParentId !== this.leafId ? { appendParentId } : {},
			...appendMode ? { appendMode } : {}
		};
	}
	rememberLeafControl(leafEntry) {
		this.opaqueFileEntries.push({
			index: this.fileEntries.length,
			record: leafEntry
		});
		this.opaqueParentsById.set(leafEntry.id, leafEntry.targetId);
	}
	getSessionName() {
		this.assertTranscriptViewAvailable();
		return this.fileEntries.findLast((entry) => entry.type === "session_info" && this.byId.has(entry.id))?.name?.trim() || void 0;
	}
	getChildren(parentId) {
		this.assertTranscriptViewAvailable();
		const children = [];
		for (const entry of this.byId.values()) {
			const normalizedEntry = this.normalizeEntryParent(entry);
			if (normalizedEntry.parentId === parentId) children.push(normalizedEntry);
		}
		return children;
	}
	getLabel(id) {
		this.assertTranscriptViewAvailable();
		return this.labelsById.get(id);
	}
	getBoundaryCount() {
		this.assertTranscriptViewAvailable();
		return this.persistedBoundaryCount ?? this.getBranch().filter((entry) => entry.type === "compaction" || entry.type === "reset").length;
	}
	getHeader() {
		this.assertTranscriptViewAvailable();
		return this.fileEntries.find((entry) => entry.type === "session") ?? null;
	}
	getEntries() {
		this.assertTranscriptViewAvailable();
		return this.fileEntries.filter((entry) => entry.type !== "session" && this.byId.has(entry.id)).map((entry) => this.normalizeEntryParent(entry));
	}
	getTree() {
		const entries = this.getEntries();
		const nodeMap = /* @__PURE__ */ new Map();
		const roots = [];
		for (const entry of entries) nodeMap.set(entry.id, {
			entry,
			children: [],
			label: this.labelsById.get(entry.id),
			labelTimestamp: this.labelTimestampsById.get(entry.id)
		});
		for (const entry of entries) {
			const node = nodeMap.get(entry.id);
			const parentId = this.resolveCanonicalParentId(entry.parentId);
			const parent = parentId !== null && parentId !== entry.id ? nodeMap.get(parentId) : void 0;
			if (parent) parent.children.push(node);
			else roots.push(node);
		}
		const stack = [...roots];
		while (stack.length > 0) {
			const node = stack.pop();
			node.children.sort((left, right) => new Date(left.entry.timestamp).getTime() - new Date(right.entry.timestamp).getTime());
			stack.push(...node.children);
		}
		return roots;
	}
	getLeafId() {
		this.assertTranscriptViewAvailable();
		return this.leafId;
	}
	getLeafEntry() {
		this.assertTranscriptViewAvailable();
		return this.leafId ? this.getEntry(this.leafId) : void 0;
	}
	getEntry(id) {
		this.assertTranscriptViewAvailable();
		const entry = this.byId.get(id);
		return entry ? this.normalizeEntryParent(entry) : void 0;
	}
	getAppendParentId() {
		this.assertTranscriptViewAvailable();
		return this.appendParentId;
	}
	getAppendMode() {
		this.assertTranscriptViewAvailable();
		return this.appendMode;
	}
	getPersistedFileEntries(leafAppendParentId = this.appendParentId, leafAppendMode) {
		this.assertTranscriptViewAvailable();
		this.clampOpaqueFileEntryIndexes();
		const entries = [];
		let opaqueIndex = 0;
		for (let index = 0; index <= this.fileEntries.length; index += 1) {
			while (this.opaqueFileEntries[opaqueIndex]?.index === index) {
				entries.push(this.opaqueFileEntries[opaqueIndex]?.record);
				opaqueIndex += 1;
			}
			const entry = this.fileEntries[index];
			if (entry) entries.push(entry);
		}
		while (opaqueIndex < this.opaqueFileEntries.length) {
			entries.push(this.opaqueFileEntries[opaqueIndex]?.record);
			opaqueIndex += 1;
		}
		let persistedLeafId = null;
		let persistedAppendParentId = null;
		let rawTailId = null;
		for (const entry of entries) {
			const leafEntry = parseOpaqueLeafEntry(entry);
			if (leafEntry) {
				rawTailId = leafEntry.id;
				if (this.invalidLeafControlIds.has(leafEntry.id)) continue;
				const targetId = this.resolveOpaqueLeafTargetId(leafEntry.targetId);
				persistedLeafId = targetId;
				persistedAppendParentId = leafEntry.appendParentId === void 0 ? targetId : this.resolveOpaqueAppendParentId(leafEntry.appendParentId);
				continue;
			}
			if (isIndexedSessionEntry(entry)) {
				persistedLeafId = entry.id;
				persistedAppendParentId = entry.id;
				rawTailId = entry.id;
				continue;
			}
			const opaqueLink = parseParentLinkedOpaqueEntry(entry);
			if (opaqueLink) {
				persistedAppendParentId = opaqueLink.id;
				rawTailId = opaqueLink.id;
			}
		}
		if (persistedLeafId !== this.leafId || persistedAppendParentId !== this.appendParentId) {
			const leafEntry = this.createLeafControl(rawTailId, leafAppendParentId, leafAppendMode);
			this.rememberLeafControl(leafEntry);
			entries.push(leafEntry);
		}
		return entries;
	}
	getPersistedEntries() {
		return this.getPersistedFileEntries();
	}
	clearPreservedOpaqueFileEntries() {
		this.assertTranscriptViewAvailable();
		this.opaqueFileEntries = [];
		this.opaqueParentsById.clear();
		this.invalidLeafControlIds.clear();
		this.appendParentId = null;
		this.appendMode = void 0;
		this.pendingDeliberateAppend = false;
	}
	invalidateTranscriptView(error) {
		this.transcriptViewFailure = error;
		this.transcriptVersion = void 0;
	}
	assertTranscriptViewAvailable() {
		if (this.transcriptViewFailure) throw this.transcriptViewFailure;
	}
	getBranch(fromId) {
		this.assertTranscriptViewAvailable();
		return super.getBranch(fromId);
	}
	isPersisted() {
		return this.persistenceTarget !== void 0;
	}
	getCwd() {
		return this.cwd;
	}
	getSessionId() {
		return this.sessionId;
	}
	getSessionTarget() {
		const target = this.persistenceTarget;
		return target ? {
			...target,
			...target.env ? { env: { ...target.env } } : {}
		} : void 0;
	}
};
//#endregion
export { SessionManagerCore as t };
