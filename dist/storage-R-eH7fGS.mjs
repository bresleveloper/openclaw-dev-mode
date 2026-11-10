import { o as writeRuntimeJson } from "./runtime-BazLsT0s.mjs";
import { n as sanitizeTerminalText } from "./safe-text-BjmWJADa.mjs";
import { t as captureRuntimeConfigAsyncReader } from "./io.runtime-Ds5uC0Bf.mjs";
import "./config-B3oiWDlr.mjs";
import { a as storageLocationError, i as probeStorageLocation, n as listStorageLocations, o as acquireStorageProvider, r as openStorageLocation, t as initStorageLocation } from "./locations-Bgppb48Q.mjs";
import { randomBytes, randomUUID } from "node:crypto";
//#region src/commands/storage.ts
async function storageListCommand(runtime, opts) {
	const config = await captureRuntimeConfigAsyncReader()();
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
	for (const location of locations) {
		const summary = `${location.name} (${location.provider}): ${location.state}${location.displayTarget ? ` — ${location.displayTarget}` : ""}`;
		runtime.log(`${sanitizeTerminalText(summary)}${location.message ? `\n  ${sanitizeTerminalText(location.message)}` : ""}`);
	}
}
async function storageInitCommand(runtime, name, opts) {
	const location = await initStorageLocation({
		name,
		config: await captureRuntimeConfigAsyncReader()()
	});
	try {
		const description = location.describe();
		if (opts.json) writeRuntimeJson(runtime, {
			...description,
			state: "ok"
		});
		else runtime.log(sanitizeTerminalText(`Storage location ${name} initialized: ${description.displayTarget}`));
	} finally {
		await location.close();
	}
}
async function storageTestCommand(runtime, name, opts) {
	const location = await openStorageLocation({
		name,
		config: await captureRuntimeConfigAsyncReader()()
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
