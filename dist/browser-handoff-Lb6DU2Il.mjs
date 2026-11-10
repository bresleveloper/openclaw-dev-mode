import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { n as createPrivateWindowsFile, t as createPrivateWindowsDirectory } from "./windows-private-directory-MPEowKNX.mjs";
import { n as openLocalFile } from "./browser-open-C7wb2rVh.mjs";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import fs$1 from "node:fs/promises";
import path from "node:path";
//#region src/infra/browser-handoff.ts
const HANDOFF_DIR_PREFIX = "openclaw-browser-handoff-";
const HANDOFF_FILE_NAME = "handoff.html";
const HANDOFF_CLEANUP_DELAY_MS = 6e5;
function escapeHtmlAttribute(value) {
	return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function escapeScriptString(value) {
	return JSON.stringify(value).replaceAll("<", "\\u003c");
}
function renderBrowserHandoffDocument(targetUrl) {
	const href = escapeHtmlAttribute(targetUrl);
	return [
		"<!doctype html>",
		"<html lang=\"en\">",
		"<head>",
		"<meta charset=\"utf-8\">",
		`<meta http-equiv="refresh" content="0; url=${href}">`,
		"<title>OpenClaw</title>",
		"</head>",
		"<body>",
		"<p>Opening the OpenClaw Control UI…</p>",
		`<p>If nothing happens, <a href="${href}">continue to OpenClaw</a>.</p>`,
		`<script>location.replace(${escapeScriptString(targetUrl)});<\/script>`,
		"</body>",
		"</html>",
		""
	].join("\n");
}
/** Create the private handoff directory with platform-appropriate owner-only access. */
async function createHandoffDirectory() {
	if (process.platform !== "win32") return await fs$1.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), HANDOFF_DIR_PREFIX));
	const directory = path.join(resolvePreferredOpenClawTmpDir(), `${HANDOFF_DIR_PREFIX}${randomUUID()}`);
	createPrivateWindowsDirectory(directory);
	return directory;
}
/** Write the handoff document with platform-appropriate owner-only access. */
async function writeHandoffDocument(filePath, content) {
	if (process.platform !== "win32") {
		await fs$1.writeFile(filePath, content, {
			mode: 384,
			flag: "wx"
		});
		return;
	}
	const file = createPrivateWindowsFile(filePath);
	try {
		fs.writeFileSync(file.fd, content);
	} finally {
		file.close();
	}
}
async function removeHandoffDirectory(directory) {
	await fs$1.rm(directory, {
		recursive: true,
		force: true
	}).catch(() => {});
}
/**
* Open a credential-bearing URL in the user's browser without exposing it in
* any process's command line. The URL is delivered through a private one-time
* handoff document; only that document's file path reaches the browser opener.
* Returns true when the handoff document was handed off successfully.
*/
async function openUrlPrivately(targetUrl) {
	const parsed = URL.parse(targetUrl);
	if (parsed?.protocol !== "http:" && parsed?.protocol !== "https:") return false;
	const normalizedTargetUrl = parsed.toString();
	let directory;
	try {
		directory = await createHandoffDirectory();
	} catch {
		return false;
	}
	const filePath = path.join(directory, HANDOFF_FILE_NAME);
	try {
		await writeHandoffDocument(filePath, renderBrowserHandoffDocument(normalizedTargetUrl));
	} catch {
		await removeHandoffDirectory(directory);
		return false;
	}
	if (!await openLocalFile(filePath).catch(() => false)) {
		await removeHandoffDirectory(directory);
		return false;
	}
	setTimeout(() => {
		removeHandoffDirectory(directory);
	}, HANDOFF_CLEANUP_DELAY_MS).unref?.();
	return true;
}
//#endregion
export { openUrlPrivately as t };
