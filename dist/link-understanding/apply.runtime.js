import { d as normalizeStringEntries } from "../string-normalization-_gRhJUDw.mjs";
import { n as isAbortError, t as createAbortError } from "../abort-signal-Z3A36sLL.mjs";
import { i as logVerbose, o as shouldLogVerbose } from "../globals-QODkv80i.mjs";
import { i as runCommandWithTimeout } from "../exec-shcN2-sN.mjs";
import { i as readResponseWithLimit, t as cancelUnreadResponseBody } from "../http-response-body-DXfezLdR.mjs";
import "../http-body-Bl_jph25.mjs";
import { c as isBlockedHostnameOrIp } from "../ssrf-BQRtcdBp.mjs";
import { i as fetchWithSsrFGuard, t as GUARDED_FETCH_MODE } from "../fetch-guard-EFfAF2PS.mjs";
import { t as CLI_OUTPUT_MAX_BUFFER } from "../defaults.constants-Cof2g8lZ.mjs";
import { c as resolveTimeoutMs, s as resolveScopeDecision } from "../resolve-P9fG0vPg.mjs";
import { t as fromMarkdown } from "../lib-WLZTziNZ.mjs";
import { t as finalizeInboundContext } from "../inbound-context-BLR5MPPS.mjs";
import { t as applyTemplate } from "../templating-DocmBuN3.mjs";
import "../defaults-CJPLJeAl.mjs";
//#region src/link-understanding/format.ts
/** Appends normalized link-understanding outputs to the agent-visible body. */
function formatLinkUnderstandingBody(params) {
	const outputs = normalizeStringEntries(params.outputs);
	if (outputs.length === 0) return params.body ?? "";
	const base = (params.body ?? "").trim();
	if (!base) return outputs.join("\n");
	return `${base}\n\n${outputs.join("\n")}`;
}
//#endregion
//#region packages/markdown-core/src/link-spans.ts
/** Returns parser-owned source spans for inline links, autolinks, and images. */
function findMarkdownLinkSourceSpans(markdown) {
	const spans = [];
	const pending = [fromMarkdown(markdown)];
	while (pending.length > 0) {
		const node = pending.pop();
		if (!node) continue;
		if (node.type === "link" || node.type === "image") {
			const start = node.position?.start?.offset;
			const end = node.position?.end?.offset;
			if (start !== void 0 && end !== void 0) spans.push([start, end]);
			continue;
		}
		for (const child of node.children ?? []) pending.push(child);
	}
	return spans.toSorted((left, right) => left[0] - right[0]);
}
//#endregion
//#region src/link-understanding/detect.ts
const BARE_LINK_RE = /https?:\/\/\S+/gi;
function stripMarkdownLinks(message) {
	const chunks = [];
	let cursor = 0;
	for (const [start, end] of findMarkdownLinkSourceSpans(message)) {
		chunks.push(message.slice(cursor, start), " ");
		cursor = end;
	}
	chunks.push(message.slice(cursor));
	return chunks.join("");
}
function resolveMaxLinks(value) {
	if (typeof value === "number" && Number.isFinite(value) && value > 0) return Math.floor(value);
	return 3;
}
function isAllowedUrl(raw) {
	try {
		const parsed = new URL(raw);
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
		if (isBlockedHostnameOrIp(parsed.hostname)) return false;
		return true;
	} catch {
		return false;
	}
}
/**
* Extracts unique, SSRF-filtered bare HTTP(S) links from inbound text.
* Markdown links are ignored so display-only citations do not trigger fetches.
*/
function extractLinksFromMessage(message, opts) {
	const source = message?.trim();
	if (!source) return [];
	const maxLinks = resolveMaxLinks(opts?.maxLinks);
	const sanitized = stripMarkdownLinks(source);
	const seen = /* @__PURE__ */ new Set();
	const results = [];
	for (const match of sanitized.matchAll(BARE_LINK_RE)) {
		const raw = match[0]?.trim();
		if (!raw) continue;
		if (!isAllowedUrl(raw)) continue;
		if (seen.has(raw)) continue;
		seen.add(raw);
		results.push(raw);
		if (results.length >= maxLinks) break;
	}
	return results;
}
//#endregion
//#region src/link-understanding/runner.ts
function resolveTimeoutMsFromConfig(params) {
	const configured = params.entry.timeoutSeconds ?? params.config?.timeoutSeconds;
	return resolveTimeoutMs(configured, 30);
}
function resolveFetchTimeoutMsFromConfig(params) {
	if (params.config?.timeoutSeconds != null) return resolveTimeoutMs(params.config.timeoutSeconds, 30);
	return Math.max(...params.entries.map((entry) => resolveTimeoutMsFromConfig({
		config: params.config,
		entry
	})));
}
function isLinkUrlTemplate(value) {
	return value.includes("LinkUrl") || value.includes("LinkFinalUrl");
}
function commandName(command) {
	return (command.split(/[\\/]/).pop() ?? command).toLowerCase();
}
function isUrlFetcherCommand(command) {
	return commandName(command) === "curl" || commandName(command) === "wget";
}
function buildLinkCliArgs(params) {
	const templCtx = {
		...params.ctx,
		LinkFinalUrl: params.finalUrl,
		LinkUrl: params.url
	};
	return params.args.filter((arg) => !isLinkUrlTemplate(arg)).map((arg) => applyTemplate(arg, templCtx));
}
async function fetchLinkContent(params) {
	const { response, finalUrl, release } = await fetchWithSsrFGuard({
		url: params.url,
		timeoutMs: params.timeoutMs,
		mode: GUARDED_FETCH_MODE.STRICT,
		auditContext: "link-understanding",
		signal: params.signal,
		init: { headers: {
			Accept: "text/*,application/json,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
			"User-Agent": "OpenClaw-LinkUnderstanding/1.0"
		} }
	});
	try {
		if (!response.ok) {
			cancelUnreadResponseBody(response);
			throw new Error(`Link fetch failed with HTTP ${response.status}`);
		}
		const buffer = await readResponseWithLimit(response, CLI_OUTPUT_MAX_BUFFER);
		const content = new TextDecoder().decode(buffer).trim();
		if (!content) return null;
		return {
			content,
			finalUrl
		};
	} finally {
		await release();
	}
}
async function runCliEntry(params) {
	if ((params.entry.type ?? "cli") !== "cli") return null;
	const command = params.entry.command.trim();
	if (!command) return null;
	const args = params.entry.args ?? [];
	const timeoutMs = resolveTimeoutMsFromConfig({
		config: params.config,
		entry: params.entry
	});
	if (isUrlFetcherCommand(command) && args.some(isLinkUrlTemplate)) return params.content;
	const argv = [command, ...buildLinkCliArgs({
		args,
		ctx: params.ctx,
		finalUrl: params.finalUrl,
		url: params.url
	})];
	if (shouldLogVerbose()) logVerbose(`Link understanding via CLI: ${argv.join(" ")}`);
	const result = await runCommandWithTimeout(argv, {
		timeoutMs,
		input: params.content,
		signal: params.signal,
		killProcessTree: true,
		env: {
			OPENCLAW_LINK_FINAL_URL: params.finalUrl,
			OPENCLAW_LINK_URL: params.url
		}
	});
	if (params.signal?.aborted) throw createAbortError("Link understanding command aborted", { cause: params.signal.reason });
	if (result.code !== 0) throw new Error(`Link understanding command exited with code ${result.code ?? "unknown"}`);
	return result.stdout.trim() || null;
}
async function runLinkEntries(params) {
	let lastError;
	for (const entry of params.entries) {
		if (params.signal?.aborted) break;
		try {
			const output = await runCliEntry({
				content: params.content,
				entry,
				finalUrl: params.finalUrl,
				ctx: params.ctx,
				url: params.url,
				config: params.config,
				signal: params.signal
			});
			if (output) return output;
		} catch (err) {
			if (isAbortError(err)) throw err;
			lastError = err;
			if (shouldLogVerbose()) logVerbose(`Link understanding failed for ${params.url}: ${String(err)}`);
		}
	}
	if (lastError && shouldLogVerbose()) logVerbose(`Link understanding exhausted for ${params.url}`);
	return null;
}
/**
* Fetches detected links through the SSRF guard and runs configured CLI processors.
*/
async function runLinkUnderstanding(params) {
	const config = params.cfg.tools?.links;
	if (!config || config.enabled === false) return [];
	if (resolveScopeDecision({
		scope: config.scope,
		ctx: params.ctx
	}) === "deny") {
		if (shouldLogVerbose()) logVerbose("Link understanding disabled by scope policy.");
		return [];
	}
	const links = extractLinksFromMessage(params.message ?? params.ctx.CommandBody ?? params.ctx.RawBody ?? params.ctx.Body ?? "", { maxLinks: config?.maxLinks });
	if (links.length === 0) return [];
	const entries = config?.models ?? [];
	if (entries.length === 0) return [];
	const outputs = [];
	const timeoutMs = resolveFetchTimeoutMsFromConfig({
		config,
		entries
	});
	for (const url of links) {
		if (params.signal?.aborted) break;
		let fetched;
		try {
			fetched = await fetchLinkContent({
				url,
				timeoutMs,
				signal: params.signal
			});
		} catch (err) {
			if (params.signal?.aborted) throw createAbortError("Link understanding fetch aborted", { cause: params.signal.reason });
			if (isAbortError(err)) throw err;
			if (shouldLogVerbose()) logVerbose(`Link understanding fetch blocked or failed for ${url}: ${String(err)}`);
			continue;
		}
		if (!fetched) continue;
		const output = await runLinkEntries({
			content: fetched.content,
			entries,
			finalUrl: fetched.finalUrl,
			ctx: params.ctx,
			url,
			config,
			signal: params.signal
		}) ?? fetched.content;
		if (params.signal?.aborted) break;
		if (output) outputs.push(output);
	}
	return outputs;
}
//#endregion
//#region src/link-understanding/apply.ts
/** Runs link understanding and folds successful outputs into the inbound context. */
async function applyLinkUnderstanding(params) {
	const outputs = await runLinkUnderstanding({
		cfg: params.cfg,
		ctx: params.ctx,
		signal: params.signal
	});
	if (outputs.length === 0 || params.signal?.aborted) return;
	params.ctx.LinkUnderstanding = [...params.ctx.LinkUnderstanding ?? [], ...outputs];
	const enrich = (body) => formatLinkUnderstandingBody({
		body,
		outputs
	});
	params.ctx.agentText = enrich(params.ctx.agentText ?? params.ctx.BodyForAgent ?? params.ctx.Body);
	params.ctx.Body = enrich(params.ctx.Body);
	finalizeInboundContext(params.ctx, { forceBodyForCommands: true });
}
//#endregion
export { applyLinkUnderstanding };
