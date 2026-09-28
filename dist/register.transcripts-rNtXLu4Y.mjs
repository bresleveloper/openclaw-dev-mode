import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { r as normalizeExportText, t as TranscriptsStore } from "./store-K2ivV-ir.mjs";
import path from "node:path";
//#region src/cli/program/register.transcripts.ts
function createStore() {
	const stateDir = resolveStateDir();
	return new TranscriptsStore(path.join(stateDir, "transcripts"), { env: {
		...process.env,
		OPENCLAW_STATE_DIR: stateDir
	} });
}
function writeLine(value) {
	process.stdout.write(`${value}\n`);
}
function writeJson(value) {
	writeLine(JSON.stringify(value, null, 2).replace(/[\u007f-\u009f]/g, (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`));
}
function sanitizeMarkdownForTerminal(markdown) {
	return markdown.split("\n").map(sanitizeTerminalText).join("\n");
}
function formatSessionLine(entry) {
	const title = sanitizeTerminalText(entry.session.title?.trim() || "Transcripts");
	const started = sanitizeTerminalText(entry.session.startedAt || "unknown");
	const summary = sanitizeTerminalText(entry.hasSummary ? entry.summaryPath : "no summary.md");
	return `${entry.selector}\t${started}\t${title}\t${summary}`;
}
async function listCommand(options) {
	const sessions = await createStore().listSessionEntries();
	if (options.json) {
		writeJson(sessions.map((entry) => ({
			sessionId: entry.session.sessionId,
			selector: entry.selector,
			date: entry.selector.slice(0, 10),
			title: entry.session.title,
			startedAt: entry.session.startedAt,
			stoppedAt: entry.session.stoppedAt,
			source: entry.session.source,
			path: entry.sessionDir,
			summaryPath: entry.summaryPath,
			hasSummary: entry.hasSummary
		})));
		return;
	}
	if (sessions.length === 0) {
		writeLine("No transcripts found.");
		return;
	}
	for (const session of sessions) writeLine(formatSessionLine(session));
}
async function showCommand(sessionSelector, options) {
	const store = createStore();
	const entry = await store.readSessionEntry(sessionSelector);
	if (!entry) throw new Error(`transcripts session not found: ${sessionSelector}`);
	const storedSummary = await store.readSummary(entry.session);
	const materializedMarkdown = storedSummary.markdown === void 0 ? void 0 : normalizeExportText(storedSummary.markdown);
	await store.materializeSessionArtifacts(entry.session, "summary");
	if (options.json) {
		writeJson({
			session: entry.session,
			selector: entry.selector,
			path: entry.sessionDir,
			summaryPath: entry.summaryPath,
			summary: materializedMarkdown ?? null
		});
		return;
	}
	if (materializedMarkdown === void 0) throw new Error(`summary.md not found for transcripts session: ${sessionSelector}`);
	process.stdout.write(sanitizeMarkdownForTerminal(materializedMarkdown));
}
function selectedArtifactKind(options) {
	if (options.dir) return "all";
	if (options.metadata) return "metadata";
	if (options.transcript) return "transcript";
	return "summary";
}
async function pathCommand(selector, options) {
	const store = createStore();
	const entry = await store.readSessionEntry(selector);
	if (!entry) throw new Error(`transcripts session not found: ${selector}`);
	const kind = selectedArtifactKind(options);
	const artifacts = await store.materializeSessionArtifacts(entry.session, kind);
	const selectedPath = options.dir ? artifacts.sessionDir : options.metadata ? artifacts.metadataPath : options.transcript ? artifacts.transcriptPath : artifacts.summaryPath;
	const exists = kind !== "summary" || artifacts.hasSummary;
	if (options.json) {
		writeJson({
			sessionId: entry.session.sessionId,
			selector: entry.selector,
			path: selectedPath,
			exists
		});
		return;
	}
	if (!exists) throw new Error(`summary.md not found for transcripts session: ${selector}`);
	writeLine(selectedPath);
}
/** Register transcript list/show/path inspection and export commands. */
function registerTranscriptsCli(program) {
	const transcripts = program.command("transcripts").description("Inspect stored transcripts");
	transcripts.command("list").description("List stored transcript sessions").option("--json", "Print JSON").action(async (options) => {
		await listCommand(options);
	});
	transcripts.command("show").description("Print and materialize a transcript summary").argument("<session>", "Transcripts session id or YYYY-MM-DD/session selector").option("--json", "Print JSON").action(async (sessionId, options) => {
		await showCommand(sessionId, options);
	});
	transcripts.command("path").description("Materialize and print a stored transcripts artifact path").argument("<session>", "Transcripts session id or YYYY-MM-DD/session selector").option("--dir", "Materialize all artifacts and print the session directory").option("--metadata", "Materialize and print metadata.json").option("--transcript", "Materialize and print transcript.jsonl").option("--json", "Print JSON").action(async (sessionId, options) => {
		await pathCommand(sessionId, options);
	});
}
//#endregion
export { registerTranscriptsCli };
