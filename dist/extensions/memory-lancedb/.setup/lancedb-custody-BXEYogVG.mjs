import path from "node:path";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
// extensions/memory-lancedb/lancedb-custody.ts
const lockOptions = {
	retries: {
		retries: 0,
		factor: 1,
		minTimeout: 0,
		maxTimeout: 0
	},
	stale: 0,
	staleRecovery: "remove-if-definitely-stale"
};
async function custodyDirectory(dbPath) {
	const localPath = /^file:/i.test(dbPath) ? fileURLToPath(dbPath) : dbPath.includes("://") ? null : dbPath;
	if (localPath === null) return null;
	await fs.mkdir(localPath, { recursive: true });
	const directory = path.join(await fs.realpath(localPath), ".openclaw-custody");
	await fs.mkdir(directory, { recursive: true });
	return directory;
}
async function acquireMemoryTableUsage(dbPath, fileLock) {
	const directory = await custodyDirectory(dbPath);
	if (directory === null) return null;
	const { acquireFileLock, withFileLock } = fileLock ?? await import("openclaw/plugin-sdk/file-lock");
	return await withFileLock(path.join(directory, "admission"), {
		...lockOptions,
		retries: {
			retries: 30,
			factor: 1.5,
			minTimeout: 20,
			maxTimeout: 1e3
		}
	}, () => acquireFileLock(path.join(directory, `use-${randomUUID()}`), lockOptions));
}
async function withExclusiveMemoryTable(dbPath, run) {
	const directory = await custodyDirectory(dbPath);
	if (directory === null) throw new Error("ltm optimize requires a local filesystem path or file URL; remote table custody is not supported.");
	const { acquireFileLock } = await import("openclaw/plugin-sdk/file-lock");
	let admission;
	try {
		admission = await acquireFileLock(path.join(directory, "admission"), lockOptions);
	} catch (error) {
		throw new Error("Memory table is in use; stop its Gateways and commands, then retry ltm optimize.", { cause: error });
	}
	try {
		for (const name of await fs.readdir(directory)) {
			if (!/^use-[0-9a-f-]+\.lock$/.test(name)) continue;
			let abandoned;
			try {
				abandoned = await acquireFileLock(path.join(directory, name.slice(0, -5)), lockOptions);
			} catch (error) {
				throw new Error("Memory table is in use; stop its Gateways and commands, then retry ltm optimize.", { cause: error });
			}
			await abandoned.release();
		}
		return await run();
	} finally {
		await admission.release();
	}
}
export { withExclusiveMemoryTable as n, acquireMemoryTableUsage as t };
