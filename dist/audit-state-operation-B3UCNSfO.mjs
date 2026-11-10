import { c as parseAuditEntryRecord, d as reefAuditEntryKey, f as verifyReefAuditWindow, i as REEF_AUDIT_MIGRATION_KEY, l as parseAuditStateRecord, p as createAuditEntry, t as REEF_AUDIT_HEAD_KEY, u as parseReefAuditHead } from "./audit-state-format-xKEkjxPg.mjs";
//#region extensions/reef/src/audit-state-operation.ts
function readAuditHead(tx, config) {
	const [head, migration] = tx.lookupMany([{
		store: config.head,
		key: REEF_AUDIT_HEAD_KEY
	}, {
		store: config.migration,
		key: REEF_AUDIT_MIGRATION_KEY
	}]);
	if (migration !== void 0) throw new Error("Reef audit migration is incomplete; repair audit.jsonl and rerun openclaw doctor --fix");
	return parseReefAuditHead(head);
}
function appendReefAuditEvents(tx, config, events) {
	if (events.length === 0) return [];
	let head = readAuditHead(tx, config);
	if (head.pending && head.pending.expiresAt > Date.now()) throw new Error("Reef audit append is owned by an active legacy writer");
	const staleEntryKey = head.pending?.entryKey;
	if (staleEntryKey && (!staleEntryKey.startsWith("entry:") || staleEntryKey === "entry:")) throw new Error("invalid Reef audit staged entry key");
	let plannedHead = head;
	const appended = events.map(({ type, payload, ts }) => {
		const entry = createAuditEntry(type, payload, ts, config.auditKey, plannedHead);
		plannedHead = {
			...plannedHead,
			hash: entry.entryHash,
			seq: entry.event.seq
		};
		return entry;
	});
	const keys = [.../* @__PURE__ */ new Set([
		...appended.map((entry) => reefAuditEntryKey(entry.entryHash)),
		...head.hash ? [reefAuditEntryKey(head.hash)] : [],
		...head.seq >= config.maxEntries ? [reefAuditEntryKey(head.oldestHash)] : []
	])];
	const values = tx.lookupMany(keys.map((key) => ({
		store: config.entries,
		key
	})));
	const rows = new Map(keys.map((key, index) => [key, values[index]]));
	const changes = /* @__PURE__ */ new Map();
	const read = (key) => {
		if (changes.has(key)) return changes.get(key);
		if (!rows.has(key)) rows.set(key, tx.lookup(config.entries, key));
		return rows.get(key);
	};
	for (const key of [staleEntryKey, head.garbageEntryKey]) if (key) changes.set(key, void 0);
	for (const entry of appended) {
		const entryKey = reefAuditEntryKey(entry.entryHash);
		if (read(entryKey) !== void 0) throw new Error("Reef audit entry already exists before head advancement");
		const previousKey = head.hash ? reefAuditEntryKey(head.hash) : void 0;
		if (previousKey) {
			const previous = parseAuditStateRecord(read(previousKey));
			if (previous.entry.entryHash !== head.hash) throw new Error("Reef audit head entry differs before linking append");
			if (previous.nextHash !== void 0 && reefAuditEntryKey(previous.nextHash) !== staleEntryKey) throw new Error("Reef audit head already links a committed successor");
			changes.set(previousKey, {
				...previous,
				nextHash: entry.entryHash
			});
		}
		let oldestHash = head.seq === 0 ? entry.entryHash : head.oldestHash;
		if (head.seq >= config.maxEntries) {
			const oldestKey = reefAuditEntryKey(head.oldestHash);
			const oldest = parseAuditStateRecord(read(oldestKey));
			if (!oldest.nextHash) throw new Error("Reef audit retention pointer is missing");
			oldestHash = oldest.nextHash;
			changes.set(oldestKey, void 0);
		}
		changes.set(entryKey, {
			kind: "entry",
			entry
		});
		head = {
			kind: "head",
			hash: entry.entryHash,
			seq: entry.event.seq,
			oldestHash
		};
	}
	for (const [key, value] of changes) if (value === void 0 && (!rows.has(key) || rows.get(key) !== void 0)) tx.delete(config.entries, key);
	for (const [key, value] of changes) if (value !== void 0) tx.set(config.entries, key, value);
	tx.set(config.head, REEF_AUDIT_HEAD_KEY, head);
	return appended;
}
function readReefAuditEntries(tx, config) {
	const head = readAuditHead(tx, config);
	if (head.seq === 0) return [];
	const rows = new Map(tx.entries(config.entries).map(({ key, value }) => [key, value]));
	const reversed = [];
	let hash = head.hash;
	for (let seq = head.seq; seq > 0 && reversed.length < config.maxEntries; seq--) {
		const record = rows.get(reefAuditEntryKey(hash));
		if (!record) break;
		const entry = parseAuditEntryRecord(record);
		if (entry.entryHash !== hash || entry.event.seq !== seq) throw new Error("invalid Reef audit chain state");
		reversed.push(entry);
		hash = entry.prevHash;
	}
	return verifyReefAuditWindow(reversed, head, config.maxEntries);
}
function executeReefAuditOperation(command, tx) {
	return command.type === "append" ? appendReefAuditEvents(tx, command.input, command.input.events) : readReefAuditEntries(tx, command.input);
}
//#endregion
export { executeReefAuditOperation as n, appendReefAuditEvents as t };
