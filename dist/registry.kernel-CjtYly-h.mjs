import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/sandbox/registry.kernel.ts
function rowToUpdate(row) {
	const { registry_kind: _registryKind, container_name: _containerName, ...update } = row;
	return update;
}
function insertSandboxRegistryRowInDatabase(db, row) {
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("sandbox_registry_entries").values(row).onConflict((conflict) => conflict.columns(["registry_kind", "container_name"]).doUpdateSet(rowToUpdate(row))));
}
function assertSandboxRegistryReservationCurrent(current, expected) {
	if (!current || current.runtimeState === "removing" || current.runtimeState === "removing-pending" || current.backendId !== expected.backendId || current.sessionKey !== expected.sessionKey) throw new Error("Sandbox runtime was removed or is being removed; retry after sandbox recreate completes.");
}
function removeRegistryRowInDatabase(db, kind, containerName) {
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("sandbox_registry_entries").where("registry_kind", "=", kind).where("container_name", "=", containerName));
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
	assertSandboxRegistryReservationCurrent(existing, entry);
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
	const next = {
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
	};
	return {
		registry_kind: "container",
		container_name: next.containerName,
		session_key: next.sessionKey,
		backend_id: next.backendId ?? null,
		runtime_label: next.runtimeLabel ?? null,
		image: next.image,
		created_at_ms: next.createdAtMs,
		last_used_at_ms: next.lastUsedAtMs,
		config_label_kind: next.configLabelKind ?? null,
		config_hash: next.configHash ?? null,
		cdp_port: null,
		no_vnc_port: null,
		entry_json: JSON.stringify(next),
		updated_at: Date.now()
	};
}
function browserEntryToRow(entry, existing) {
	const next = {
		...entry,
		createdAtMs: existing?.createdAtMs ?? entry.createdAtMs,
		image: existing?.image ?? entry.image,
		configHash: entry.configHash ?? existing?.configHash,
		workspaceDir: entry.workspaceDir ?? existing?.workspaceDir
	};
	return {
		registry_kind: "browser",
		container_name: next.containerName,
		session_key: next.sessionKey,
		backend_id: null,
		runtime_label: null,
		image: next.image,
		created_at_ms: next.createdAtMs,
		last_used_at_ms: next.lastUsedAtMs,
		config_label_kind: null,
		config_hash: next.configHash ?? null,
		cdp_port: next.cdpPort,
		no_vnc_port: next.noVncPort ?? null,
		entry_json: JSON.stringify(next),
		updated_at: Date.now()
	};
}
function insertSandboxRegistryRowIfMissingInDatabase(db, row) {
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("sandbox_registry_entries").values(row).onConflict((conflict) => conflict.columns(["registry_kind", "container_name"]).doNothing()));
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
function readSandboxRegistryEntryInDatabase(db, containerName) {
	if (!tableExists(db, "sandbox_registry_entries")) return null;
	const row = readSandboxRegistryRowInDatabase(db, "container", containerName);
	return row ? rowToContainerEntry(row) : null;
}
function readSandboxRegistryRowInDatabase(db, kind, containerName) {
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("sandbox_registry_entries").selectAll().where("registry_kind", "=", kind).where("container_name", "=", containerName).limit(1)).rows[0] ?? null;
}
//#endregion
export { insertSandboxRegistryRowInDatabase as a, rowToBrowserEntry as c, insertSandboxRegistryRowIfMissingInDatabase as i, rowToContainerEntry as l, browserEntryToRow as n, readSandboxRegistryEntryInDatabase as o, containerEntryToRow as r, readSandboxRegistryRowInDatabase as s, assertSandboxRegistryReservationCurrent as t, writeSandboxRegistryInDatabase as u };
