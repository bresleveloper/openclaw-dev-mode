import { s as asFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { t as coerceErrorMessage } from "./error-coercion-CvJK4lmH.mjs";
import { o as asRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { n as runExec } from "./exec-DJvyCA0D.mjs";
import "./error-runtime-BmospGvZ.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./process-runtime-CYiH_oPH.mjs";
import "./temp-path-C5ZA6ftW.mjs";
import path from "node:path";
import { chmod, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region extensions/logbook/src/node-host.ts
const LOGBOOK_SNAPSHOT_EXEC_TIMEOUT_MS = 25e3;
async function handleLogbookSnapshot(rawParams) {
	if (process.platform !== "darwin") return { error: `logbook.snapshot is not supported on ${process.platform}` };
	const params = asRecord(rawParams);
	const screenIndex = Math.max(0, Math.round(asFiniteNumber(params.screenIndex) ?? 0));
	const width = asFiniteNumber(params.maxWidth);
	const maxWidth = width && width >= 480 ? Math.round(width) : 1440;
	const quality = asFiniteNumber(params.quality);
	const qualityPct = Math.min(100, Math.max(10, Math.round((quality && quality > 0 && quality <= 1 ? quality : .6) * 100)));
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
		return { error: coerceErrorMessage(err) };
	} finally {
		await rm(filePath, { force: true });
	}
}
//#endregion
export { handleLogbookSnapshot };
