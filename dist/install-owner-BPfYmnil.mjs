import { r as isMissingPathError } from "./errno-FR4CRyya.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { o as readJsonIfExists, t as JsonFileReadError } from "./json-files-DYmSFHoN.mjs";
import { Et as _enum, Fn as object, Jn as string, xn as literal } from "./schemas-BOYIvvln.mjs";
import fs from "node:fs/promises";
import path from "node:path";
//#region src/infra/install-owner.ts
const log = createSubsystemLogger("install-owner");
const InstallOwnerSchema = object({
	schemaVersion: literal(1),
	owner: _enum(["macos-app", "desktop-app"]),
	displayName: string().trim().min(1),
	updateHint: string().trim().min(1)
});
/** Packaging owns this marker; absent or invalid files preserve normal install discovery. */
async function readInstallOwner(root) {
	if (!root) return null;
	const marker = path.join(root, "openclaw-install-owner.json");
	try {
		const value = await readJsonIfExists(marker, { maxBytes: 16384 });
		if (value === null) await fs.access(marker);
		const parsed = InstallOwnerSchema.safeParse(value);
		if (parsed.success) return parsed.data;
	} catch (error) {
		if (isMissingPathError(error) || error instanceof JsonFileReadError && isMissingPathError(error.cause)) return null;
	}
	log.warn(`Ignoring invalid install owner marker: ${marker}`);
	return null;
}
function formatInstallOwnerMessage(owner) {
	return `Managed by ${owner.displayName}. ${owner.updateHint}`;
}
//#endregion
export { readInstallOwner as n, formatInstallOwnerMessage as t };
