import { n as ENV_SECRET_REF_ID_RE } from "./ref-contract-Bfd9_-Lp.mjs";
//#region src/secrets/setup-secret-migration.ts
/** The host compares legacy values; plugin repair receives no secret material. */
async function inspectSetupSecretMigration(params) {
	const names = [...new Set(params.names)];
	if (names.length > 16) throw new Error("Setup secret migration inspection must contain at most 16 names.");
	const validNames = names.filter((name) => ENV_SECRET_REF_ID_RE.test(name));
	if (validNames.length === 0) return names.map((name) => ({
		name,
		status: "missing"
	}));
	let entries;
	try {
		const { readSelectedSecretStoreEntries } = await import("./secret-store-DgsUJeG_.mjs");
		entries = await readSelectedSecretStoreEntries({
			names: validNames,
			database: { env: params.env }
		});
	} catch {
		return names.map((name) => ({
			name,
			status: "unavailable"
		}));
	}
	const selected = new Map(entries.map((entry) => [entry.name, entry]));
	return names.map((name) => {
		const entry = selected.get(name);
		return {
			name,
			status: !entry ? "missing" : !entry.allowedHosts.length ? "missing-bindings" : Object.hasOwn(params.env, name) && params.env[name] !== entry.value ? "conflicting-value" : "ready"
		};
	});
}
//#endregion
export { inspectSetupSecretMigration };
