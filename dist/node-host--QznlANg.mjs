import { s as asFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { n as runExec } from "./exec-shcN2-sN.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./process-runtime-BF3dUvYO.mjs";
import "./temp-path-PENdksor.mjs";
import path from "node:path";
import { chmod, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region extensions/logbook/src/node-host.ts
const LOGBOOK_SNAPSHOT_EXEC_TIMEOUT_MS = 25e3;
function readParams(value) {
	if (!value || typeof value !== "object") return {};
	const record = value;
	return {
		screenIndex: asFiniteNumber(record.screenIndex),
		maxWidth: asFiniteNumber(record.maxWidth),
		quality: asFiniteNumber(record.quality)
	};
}
async function handleLogbookSnapshot(rawParams) {
	if (process.platform !== "darwin") return { error: `logbook.snapshot is not supported on ${process.platform}` };
	const params = readParams(rawParams);
	const screenIndex = Math.max(0, Math.round(params.screenIndex ?? 0));
	const maxWidth = params.maxWidth && params.maxWidth >= 480 ? Math.round(params.maxWidth) : 1440;
	const qualityPct = Math.min(100, Math.max(10, Math.round((params.quality && params.quality > 0 && params.quality <= 1 ? params.quality : .6) * 100)));
	const captureDir = path.join(resolvePreferredOpenClawTmpDir(), "logbook");
	await mkdir(captureDir, {
		recursive: true,
		mode: 448
	});
	await chmod(captureDir, 448);
	const filePath = path.join(captureDir, `logbook-snapshot-${randomUUID()}.jpg`);
	try {
		await writeFile(filePath, "", { mode: 384 });
		const execSignal = AbortSignal.timeout(LOGBOOK_SNAPSHOT_EXEC_TIMEOUT_MS);
		await runExec("screencapture", [
			"-x",
			"-C",
			"-D",
			String(screenIndex + 1),
			"-t",
			"jpg",
			filePath
		], {
			logOutput: false,
			signal: execSignal
		});
		await runExec("sips", [
			"--resampleHeightWidthMax",
			String(maxWidth),
			"-s",
			"format",
			"jpeg",
			"-s",
			"formatOptions",
			String(qualityPct),
			filePath
		], {
			logOutput: false,
			signal: execSignal
		});
		return {
			format: "jpeg",
			base64: (await readFile(filePath)).toString("base64")
		};
	} catch (err) {
		return { error: err instanceof Error ? err.message : String(err) };
	} finally {
		await rm(filePath, { force: true });
	}
}
//#endregion
export { handleLogbookSnapshot };
