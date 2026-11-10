import { d as normalizeStringEntries } from "../string-normalization-D6DKCpwE.mjs";
import { i as createAbortError } from "../src-Bzfi3cQM.mjs";
import { t as isAbortError } from "../abort-signal-C9DFO3n5.mjs";
import { t as fromMarkdown } from "../lib-BdF0Xu6y.mjs";
import { i as runCommandWithTimeout } from "../exec-Bf6uhUA7.mjs";
import "../http-body-DZQjJc2J.mjs";
import { i as readResponseWithLimit, t as cancelUnreadResponseBody } from "../http-response-body-B70cE6fn.mjs";
import { i as logVerbose, o as shouldLogVerbose } from "../globals-XVSoVbNQ.mjs";
import { o as isBlockedHostnameOrIp } from "../ssrf-K50Tjeok.mjs";
import { i as fetchWithSsrFGuard, t as GUARDED_FETCH_MODE } from "../fetch-guard-DRapCKeS.mjs";
import { t as CLI_OUTPUT_MAX_BUFFER } from "../defaults.constants-Cof2g8lZ.mjs";
import { c as resolveTimeoutMs, s as resolveScopeDecision } from "../resolve-t14Gdp_w.mjs";
import { t as finalizeInboundContext } from "../inbound-context-DnPzLOsP.mjs";
import { t as applyTemplate } from "../templating-BukYhKrX.mjs";
import "../defaults-TPdh4DnW.mjs";
//#region src/link-understanding/format.ts
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
	const parsed = URL.parse(raw);
	return Boolean(parsed && (parsed.protocol === "http:" || parsed.protocol === "https:") && !isBlockedHostnameOrIp(parsed.hostname));
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
function isLinkUrlTemplate(value) {
	return value.includes("LinkUrl") || value.includes("LinkFinalUrl");
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
	const timeoutMs = config.timeoutSeconds != null ? resolveTimeoutMs(config.timeoutSeconds, 30) : Math.max(...entries.map((entry) => resolveTimeoutMs(entry.timeoutSeconds, 30)));
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
		let output;
		let lastError;
		for (const entry of entries) {
			if (params.signal?.aborted) break;
			try {
				if ((entry.type ?? "cli") !== "cli") continue;
				const command = entry.command.trim();
				if (!command) continue;
				const args = entry.args ?? [];
				const name = (command.split(/[\\/]/).pop() ?? command).toLowerCase();
				if ((name === "curl" || name === "wget") && args.some(isLinkUrlTemplate)) {
					output = fetched.content;
					break;
				}
				const templCtx = { ...params.ctx };
				const argv = [command, ...args.filter((arg) => !isLinkUrlTemplate(arg)).map((arg) => applyTemplate(arg, templCtx))];
				if (shouldLogVerbose()) logVerbose(`Link understanding via CLI: ${argv.join(" ")}`);
				const result = await runCommandWithTimeout(argv, {
					timeoutMs: resolveTimeoutMs(entry.timeoutSeconds ?? config.timeoutSeconds, 30),
					input: fetched.content,
					signal: params.signal,
					killProcessTree: true,
					env: {
						OPENCLAW_LINK_FINAL_URL: fetched.finalUrl,
						OPENCLAW_LINK_URL: url
					}
				});
				if (params.signal?.aborted) throw createAbortError("Link understanding command aborted", { cause: params.signal.reason });
				if (result.code !== 0) throw new Error(`Link understanding command exited with code ${result.code ?? "unknown"}`);
				output = result.stdout.trim();
				if (output) break;
			} catch (err) {
				if (isAbortError(err)) throw err;
				lastError = err;
				if (shouldLogVerbose()) logVerbose(`Link understanding failed for ${url}: ${String(err)}`);
			}
		}
		if (!output && lastError && shouldLogVerbose()) logVerbose(`Link understanding exhausted for ${url}`);
		if (params.signal?.aborted) break;
		outputs.push(output || fetched.content);
	}
	return outputs;
}
//#endregion
//#region src/link-understanding/apply.ts
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
