import { a as writeRuntimeJson } from "./runtime-DlO3PTAd.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { a as storageLocationError, i as probeStorageLocation, n as listStorageLocations, o as acquireStorageProvider, r as openStorageLocation, t as initStorageLocation } from "./locations-DP6s8i9T.mjs";
import { randomBytes, randomUUID } from "node:crypto";
//#region src/commands/storage.ts
async function storageListCommand(runtime, opts) {
	const config = getRuntimeConfig();
	const locations = [];
	for (const location of listStorageLocations(config)) {
		let displayTarget = location.displayTarget;
		let probe;
		try {
			const acquired = await acquireStorageProvider({
				providerId: location.provider,
				config
			});
			try {
				const settings = config.storage?.locations?.[location.name]?.settings;
				if (settings) displayTarget = acquired.provider.describeTarget?.(settings);
				probe = await probeStorageLocation({
					name: location.name,
					config,
					registry: acquired.registry
				});
			} finally {
				await acquired.release();
			}
		} catch (error) {
			const { state, message } = storageLocationError(error);
			probe = {
				state,
				message
			};
		}
		locations.push({
			...location,
			...displayTarget === void 0 ? {} : { displayTarget },
			...probe
		});
	}
	if (opts.json) {
		writeRuntimeJson(runtime, { locations });
		return;
	}
	if (locations.length === 0) runtime.log("No storage locations configured. Configure storage.locations to add one.");
	for (const location of locations) runtime.log(`${location.name} (${location.provider}): ${location.state}${location.displayTarget ? ` — ${location.displayTarget}` : ""}${location.message ? `\n  ${location.message}` : ""}`);
}
async function storageInitCommand(runtime, name, opts) {
	const location = await initStorageLocation({
		name,
		config: getRuntimeConfig()
	});
	try {
		const description = location.describe();
		if (opts.json) writeRuntimeJson(runtime, {
			...description,
			state: "ok"
		});
		else runtime.log(`Storage location ${name} initialized: ${description.displayTarget}`);
	} finally {
		await location.close();
	}
}
async function storageTestCommand(runtime, name, opts) {
	const location = await openStorageLocation({
		name,
		config: getRuntimeConfig()
	});
	try {
		const key = `.openclaw-probe-${randomUUID()}`;
		const payload = randomBytes(256);
		await location.putObject(key, (async function* () {
			yield payload;
		})(), { sizeBytes: payload.length });
		try {
			const body = await location.getObject(key);
			if (!body) throw new Error(`Storage test for "${name}" failed: the written object is missing.`);
			let offset = 0;
			for await (const chunk of body) {
				if (offset + chunk.length > payload.length || !payload.subarray(offset, offset + chunk.length).equals(chunk)) throw new Error(`Storage test for "${name}" failed: read-back bytes differ.`);
				offset += chunk.length;
			}
			if (offset !== payload.length) throw new Error(`Storage test for "${name}" failed: read-back bytes are truncated.`);
		} finally {
			await location.delete(key);
		}
		if (opts.json) writeRuntimeJson(runtime, {
			...location.describe(),
			state: "ok",
			sizeBytes: payload.length
		});
		else runtime.log(`Storage location ${name}: wrote, read, verified, and deleted ${payload.length} bytes.`);
	} finally {
		await location.close();
	}
}
//#endregion
export { storageInitCommand, storageListCommand, storageTestCommand };
