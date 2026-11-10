import { o as asDateTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { t as sandboxRegistryPublication } from "./registry-publication-fWdyCoIh.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/sandbox/registry.kernel.ts
function rowToUpdate(row) {
	const { registry_kind: _registryKind, container_name: _containerName, ...update } = row;
	return update;
}
function reserveSandboxRegistryInDatabase(db, candidate) {
	const existing = readRegistryRows(db, "container", {
		backendId: candidate.backendId ?? "docker",
		scopeKey: candidate.sessionKey
	}).map(rowToContainerEntry).find((entry) => entry !== null);
	if (existing) {
		assertSandboxRegistryReservationCurrent(existing, candidate);
		if (!existing.runtimeState || !existing.workspaceDir) {
			existing.runtimeState ??= "pending";
			existing.workspaceDir ??= candidate.workspaceDir;
			insertSandboxRegistryRowInDatabase(db, containerEntryToRow(existing));
		}
		return existing;
	}
	if (readSandboxRegistryRowInDatabase(db, "container", candidate.containerName)) throw new Error(`Sandbox runtime ID "${candidate.containerName}" is already registered.`);
	const entry = {
		...candidate,
		runtimeState: "pending"
	};
	insertSandboxRegistryRowInDatabase(db, containerEntryToRow(entry));
	return entry;
}
function shouldPruneSandboxRegistryEntry(entry, prune) {
	const now = asDateTimestampMs(prune.now) ?? 0;
	const lastUsed = asDateTimestampMs(entry.lastUsedAtMs) ?? 0;
	const created = asDateTimestampMs(entry.createdAtMs) ?? 0;
	return prune.idleHours > 0 && now - lastUsed > prune.idleHours * 60 * 60 * 1e3 || prune.maxAgeDays > 0 && now - created > prune.maxAgeDays * 24 * 60 * 60 * 1e3;
}
function beginSandboxRegistryRemovalInDatabase(db, { entry, reserveRuntime, prune }) {
	const current = readSandboxRegistryEntryInDatabase(db, entry.containerName);
	if (!current || current.backendId !== entry.backendId || current.sessionKey !== entry.sessionKey || current.createdAtMs !== entry.createdAtMs || prune && !shouldPruneSandboxRegistryEntry(current, prune)) return null;
	if (!current.runtimeState && !reserveRuntime) return current;
	const next = {
		...current,
		runtimeState: current.runtimeState === "pending" || current.runtimeState === "removing-pending" ? "removing-pending" : "removing"
	};
	insertSandboxRegistryRowInDatabase(db, containerEntryToRow(next, current));
	return next;
}
function insertSandboxRegistryRowInDatabase(db, row) {
	const { rows } = executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("sandbox_registry_entries").values(row).onConflict((conflict) => conflict.columns(["registry_kind", "container_name"]).doUpdateSet(rowToUpdate(row))).returningAll());
	sandboxRegistryPublication.stage(db, rows);
}
function assertSandboxRegistryReservationCurrent(current, expected) {
	if (!current || current.runtimeState === "removing" || current.runtimeState === "removing-pending" || current.backendId !== expected.backendId || current.sessionKey !== expected.sessionKey) throw new Error("Sandbox runtime was removed or is being removed; retry after sandbox recreate completes.");
}
function assertSandboxRegistryGenerationCurrent(current, expected) {
	assertSandboxRegistryReservationCurrent(current, expected);
	if (current.createdAtMs !== expected.createdAtMs || current.workspaceDir !== expected.workspaceDir || current.configHash !== expected.configHash || !isDeepStrictEqual(current.backendTarget, expected.backendTarget)) throw new Error("Sandbox runtime generation changed");
}
function removeRegistryRowInDatabase(db, kind, containerName) {
	const { rows } = executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("sandbox_registry_entries").where("registry_kind", "=", kind).where("container_name", "=", containerName).returningAll());
	sandboxRegistryPublication.stage(db, rows, true);
}
function writeSandboxRegistryInDatabase(db, write) {
	if (write.operation === "removeGeneration") {
		const { kind, entry } = write;
		const row = readSandboxRegistryRowInDatabase(db, kind, entry.containerName);
		const current = row && (kind === "browser" ? rowToBrowserEntry(row) : rowToContainerEntry(row));
		if (!current || !sameSandboxRegistryGeneration(current, entry)) throw new Error("Sandbox runtime generation changed during retirement");
		removeRegistryRowInDatabase(db, kind, entry.containerName);
		return;
	}
	if (write.operation === "updateBrowser") {
		const { entry } = write;
		const row = readSandboxRegistryRowInDatabase(db, "browser", entry.containerName);
		insertSandboxRegistryRowInDatabase(db, browserEntryToRow(entry, row ? rowToBrowserEntry(row) : null));
		return;
	}
	if (write.operation === "removeBrowser") {
		removeRegistryRowInDatabase(db, "browser", write.containerName);
		return;
	}
	if (write.operation === "remove") {
		if (write.preserveRemovalIntent) {
			const row = readSandboxRegistryRowInDatabase(db, "container", write.containerName);
			const current = row ? rowToContainerEntry(row) : null;
			if (current?.runtimeState === "removing" || current?.runtimeState === "removing-pending") return;
		}
		removeRegistryRowInDatabase(db, "container", write.containerName);
		return;
	}
	const { entry } = write;
	const row = readSandboxRegistryRowInDatabase(db, "container", entry.containerName);
	const existing = row ? rowToContainerEntry(row) : null;
	if (write.operation === "update") {
		if (entry.runtimeState === "pending" && existing?.runtimeState !== void 0) assertSandboxRegistryReservationCurrent(existing, entry);
		insertSandboxRegistryRowInDatabase(db, containerEntryToRow(entry, existing));
		return;
	}
	assertSandboxRegistryGenerationCurrent(existing, entry);
	if (write.retired) removeRegistryRowInDatabase(db, "container", entry.containerName);
	else insertSandboxRegistryRowInDatabase(db, containerEntryToRow({
		...entry,
		runtimeState: "ready"
	}, {
		...existing,
		image: existing.runtimeState === "pending" ? entry.image : existing.image
	}));
}
function sameSandboxRegistryGeneration(current, expected) {
	const { lastUsedAtMs: _currentUse, ...currentGeneration } = current;
	const { lastUsedAtMs: _expectedUse, ...expectedGeneration } = expected;
	return isDeepStrictEqual(currentGeneration, expectedGeneration);
}
function containerEntryToRow(entry, existing) {
	return registryEntryToRow({
		kind: "container",
		next: {
			...entry,
			backendId: entry.backendId ?? existing?.backendId,
			backendTarget: entry.backendTarget ?? existing?.backendTarget,
			runtimeLabel: entry.runtimeLabel ?? existing?.runtimeLabel,
			createdAtMs: existing?.createdAtMs ?? entry.createdAtMs,
			image: existing?.image ?? entry.image,
			configLabelKind: entry.configLabelKind ?? existing?.configLabelKind,
			configHash: entry.configHash ?? existing?.configHash,
			runtimeState: entry.runtimeState ?? existing?.runtimeState,
			workspaceDir: existing?.workspaceDir ?? entry.workspaceDir
		}
	});
}
function browserEntryToRow(entry, existing) {
	return registryEntryToRow({
		kind: "browser",
		next: {
			...entry,
			createdAtMs: existing?.createdAtMs ?? entry.createdAtMs,
			image: existing?.image ?? entry.image,
			configHash: entry.configHash ?? existing?.configHash,
			workspaceDir: entry.workspaceDir ?? existing?.workspaceDir
		}
	});
}
function registryEntryToRow({ kind, next }) {
	return {
		registry_kind: kind,
		container_name: next.containerName,
		session_key: next.sessionKey,
		backend_id: kind === "container" ? next.backendId ?? null : null,
		runtime_label: kind === "container" ? next.runtimeLabel ?? null : null,
		image: next.image,
		created_at_ms: next.createdAtMs,
		last_used_at_ms: next.lastUsedAtMs,
		config_label_kind: kind === "container" ? next.configLabelKind ?? null : null,
		config_hash: next.configHash ?? null,
		cdp_port: kind === "browser" ? next.cdpPort : null,
		no_vnc_port: kind === "browser" ? next.noVncPort ?? null : null,
		entry_json: JSON.stringify(next),
		updated_at: Date.now()
	};
}
function insertSandboxRegistryRowIfMissingInDatabase(db, row) {
	const { rows } = executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("sandbox_registry_entries").values(row).onConflict((conflict) => conflict.columns(["registry_kind", "container_name"]).doNothing()).returningAll());
	sandboxRegistryPublication.stage(db, rows);
}
function parseRegistryEntryJson(row) {
	try {
		const parsed = JSON.parse(row.entry_json);
		return isRecord(parsed) ? parsed : null;
	} catch {
		return null;
	}
}
function optionalPayloadString(value) {
	return typeof value === "string" ? value : "";
}
function rowToContainerEntry(row) {
	if (row.registry_kind !== "container") return null;
	const payload = parseRegistryEntryJson(row);
	if (!payload) return null;
	return normalizeSandboxRegistryEntry({
		...payload,
		containerName: row.container_name,
		sessionKey: row.session_key ?? optionalPayloadString(payload.sessionKey),
		createdAtMs: row.created_at_ms ?? Number(payload.createdAtMs ?? 0),
		lastUsedAtMs: row.last_used_at_ms ?? Number(payload.lastUsedAtMs ?? 0),
		image: row.image ?? optionalPayloadString(payload.image),
		...row.backend_id != null ? { backendId: row.backend_id } : {},
		...row.runtime_label != null ? { runtimeLabel: row.runtime_label } : {},
		...row.config_label_kind != null ? { configLabelKind: row.config_label_kind } : {},
		...row.config_hash != null ? { configHash: row.config_hash } : {}
	});
}
function rowToBrowserEntry(row) {
	if (row.registry_kind !== "browser") return null;
	const payload = parseRegistryEntryJson(row);
	if (!payload) return null;
	return {
		...payload,
		containerName: row.container_name,
		sessionKey: row.session_key ?? optionalPayloadString(payload.sessionKey),
		createdAtMs: row.created_at_ms ?? Number(payload.createdAtMs ?? 0),
		lastUsedAtMs: row.last_used_at_ms ?? Number(payload.lastUsedAtMs ?? 0),
		image: row.image ?? optionalPayloadString(payload.image),
		cdpPort: row.cdp_port ?? Number(payload.cdpPort ?? 0),
		...row.no_vnc_port != null ? { noVncPort: row.no_vnc_port } : {},
		...row.config_hash != null ? { configHash: row.config_hash } : {}
	};
}
function normalizeSandboxRegistryEntry(entry) {
	return {
		...entry,
		backendId: entry.backendId?.trim() || "docker",
		runtimeLabel: entry.runtimeLabel?.trim() || entry.containerName,
		configLabelKind: entry.configLabelKind?.trim() || "Image"
	};
}
function readRegistryRows(db, kind, filter) {
	let query = getNodeSqliteKysely(db).selectFrom("sandbox_registry_entries").selectAll().where("registry_kind", "=", kind);
	if (filter) query = query.where("session_key", "=", filter.scopeKey).where("backend_id", "=", filter.backendId);
	return executeSqliteQuerySync(db, filter ? query.orderBy("last_used_at_ms", "desc").orderBy("container_name", "asc") : query.orderBy("container_name", "asc")).rows;
}
function readSandboxRegistryEntryInDatabase(db, containerName) {
	const row = readSandboxRegistryRowInDatabase(db, "container", containerName);
	return row ? rowToContainerEntry(row) : null;
}
function readSandboxRegistryRowInDatabase(db, kind, containerName) {
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("sandbox_registry_entries").selectAll().where("registry_kind", "=", kind).where("container_name", "=", containerName).limit(1)).rows[0] ?? null;
}
//#endregion
export { rowToBrowserEntry as a, writeSandboxRegistryInDatabase as c, reserveSandboxRegistryInDatabase as i, beginSandboxRegistryRemovalInDatabase as n, rowToContainerEntry as o, insertSandboxRegistryRowIfMissingInDatabase as r, shouldPruneSandboxRegistryEntry as s, assertSandboxRegistryGenerationCurrent as t };
