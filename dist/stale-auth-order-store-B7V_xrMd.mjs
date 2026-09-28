import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import "./utils-aKqR_F_U.mjs";
import { a as inspectPersistedAuthProfileStoreRaw, i as inspectPersistedAuthProfileStateRaw, o as inspectPersistedSharedAuthProfileStateRaw, p as resolveAuthProfileDatabaseFilePaths, s as inspectPersistedSharedAuthProfileStoreRaw } from "./sqlite-BIg_k8qE.mjs";
import { g as mergeAuthProfileState, i as coercePersistedAuthProfileStore, m as coerceAuthProfileState } from "./persisted-B486xwB_.mjs";
import { i as resolveLegacyFlatAuthPath, n as resolveLegacyAuthProfilesPath, r as resolveLegacyAuthStatePath } from "./doctor-auth-legacy-paths-C7z3rdwq.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/commands/doctor/shared/stale-auth-order-store.ts
function inspectAuthPath(pathname) {
	try {
		fs.statSync(pathname);
		return "present";
	} catch (error) {
		if (error.code !== "ENOENT") return "unreadable";
	}
	try {
		fs.lstatSync(pathname);
		return "unreadable";
	} catch (error) {
		if (error.code !== "ENOENT") return "unreadable";
	}
	let ancestor = path.dirname(pathname);
	while (true) {
		try {
			const stat = fs.lstatSync(ancestor);
			if (!stat.isSymbolicLink()) return stat.isDirectory() ? "missing" : "unreadable";
			try {
				return fs.statSync(ancestor).isDirectory() ? "missing" : "unreadable";
			} catch {
				return "unreadable";
			}
		} catch (error) {
			if (error.code !== "ENOENT") return "unreadable";
		}
		const parent = path.dirname(ancestor);
		if (parent === ancestor) return "missing";
		ancestor = parent;
	}
}
function inspectUnmigratedAuthStoreSources(agentDir) {
	const results = new Set([
		resolveLegacyAuthProfilesPath(agentDir),
		resolveLegacyAuthStatePath(agentDir),
		resolveLegacyFlatAuthPath(agentDir)
	].map((pathname) => inspectAuthPath(pathname)));
	if (results.has("unreadable")) return "unreadable";
	return results.has("present") ? "present" : "missing";
}
function inspectAuthDatabaseFiles(agentDir) {
	const [databasePath, ...sidecarPaths] = resolveAuthProfileDatabaseFilePaths(agentDir);
	if (!databasePath) return "unreadable";
	const availability = inspectAuthPath(databasePath);
	const sidecarAvailability = sidecarPaths.map((pathname) => inspectAuthPath(pathname));
	if (availability === "unreadable" || sidecarAvailability.some((status) => status === "unreadable")) return "unreadable";
	if (availability === "present") return "present";
	return sidecarAvailability.every((sidecar) => sidecar === "missing") ? "missing" : "unreadable";
}
function loadCompletePersistedStore(agentDir, env = process.env) {
	const inspection = agentDir ? inspectPersistedAuthProfileStoreRaw(agentDir) : inspectPersistedSharedAuthProfileStoreRaw(env);
	const stateInspection = agentDir ? inspectPersistedAuthProfileStateRaw(agentDir) : inspectPersistedSharedAuthProfileStateRaw(env);
	if (inspection.status === "unreadable" || stateInspection.status === "unreadable") return { status: "invalid" };
	const storeMissingReason = inspection.status === "missing" ? inspection.reason : void 0;
	const stateMissingReason = stateInspection.status === "missing" ? stateInspection.reason : void 0;
	if (storeMissingReason === "database" || stateMissingReason === "database") return storeMissingReason === "database" && stateMissingReason === "database" ? {
		status: "ok",
		store: null,
		hasAuthTables: false
	} : { status: "invalid" };
	if (storeMissingReason === "table" !== (stateMissingReason === "table")) return { status: "invalid" };
	if (storeMissingReason === "table") return {
		status: "ok",
		store: null,
		hasAuthTables: false
	};
	const persistedState = stateInspection.status === "readable" ? coerceAuthProfileState(stateInspection.raw) : {};
	if (inspection.status === "missing") return stateInspection.status === "missing" ? {
		status: "ok",
		store: null,
		hasAuthTables: true
	} : {
		status: "ok",
		store: {
			version: 1,
			profiles: {},
			...persistedState
		},
		hasAuthTables: true
	};
	if (!isRecord(inspection.raw) || !isRecord(inspection.raw.profiles)) return { status: "invalid" };
	const store = coercePersistedAuthProfileStore(inspection.raw);
	const rawProfileIds = Object.keys(inspection.raw.profiles);
	if (!store || rawProfileIds.length !== Object.keys(store.profiles).length || rawProfileIds.some((profileId) => !Object.hasOwn(store.profiles, profileId))) return { status: "invalid" };
	return {
		status: "ok",
		store: {
			...store,
			...mergeAuthProfileState(coerceAuthProfileState(inspection.raw), persistedState)
		},
		hasAuthTables: true
	};
}
//#endregion
export { inspectUnmigratedAuthStoreSources as n, loadCompletePersistedStore as r, inspectAuthDatabaseFiles as t };
