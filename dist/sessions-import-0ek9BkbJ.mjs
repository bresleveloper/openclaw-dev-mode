import { w as parseStrictPositiveInteger } from "./number-coercion-CuVhdCBs.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { a as writeRuntimeJson } from "./runtime-DlO3PTAd.mjs";
import { n as sanitizeTerminalText } from "./safe-text-SY_CvCi3.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { r as formatCliJsonFailure, t as ExpectedCliError } from "./failure-output-gtb9zaTk.mjs";
import { t as callSessionTargetGateway } from "./session-target-CtSRpK99.mjs";
//#region src/cli/sessions-import.ts
function invalidOptions(message) {
	throw new ExpectedCliError({
		message,
		humanOutput: message,
		machineOutput: message
	});
}
function optionalValue(value, flag) {
	if (value === void 0) return;
	return value.trim() || invalidOptions(`${flag} must not be blank.`);
}
function printResult(result, runtime) {
	const source = sanitizeTerminalText([
		result.catalogId,
		result.hostId,
		result.sourceHomeId,
		result.threadId
	].filter(Boolean).join("/"));
	if (!result.ok) runtime.error(`Failed ${source || "catalog listing"}: ${sanitizeTerminalText(result.error)}`);
	else if (result.status === "would_import") runtime.log(`[dry-run] Would import ${source}`);
	else {
		const verb = {
			imported: "Imported",
			updated: "Updated",
			unchanged: "Unchanged"
		}[result.status];
		runtime.log(`${verb} ${source} -> ${sanitizeTerminalText(result.sessionKey)}: ${result.importedItems} new / ${result.totalItems} source items${result.complete ? "" : " (incomplete: oldest history exceeded the import bound)"}`);
	}
}
async function sessionsImportCommand(opts, runtime) {
	const agentId = optionalValue(opts.agent, "--agent");
	const hostId = optionalValue(opts.host, "--host");
	const sourceHomeId = optionalValue(opts.sourceHome, "--source-home");
	const catalogId = optionalValue(opts.catalogId, "<catalogId>");
	const threadId = optionalValue(opts.threadId, "<threadId>");
	const catalog = optionalValue(opts.catalog, "--catalog");
	const limit = parseStrictPositiveInteger(opts.limit);
	const timeoutMs = parseStrictPositiveInteger(opts.timeout);
	if (opts.limit !== void 0 && limit === void 0) invalidOptions("--limit must be a positive integer.");
	if (opts.timeout !== void 0 && timeoutMs === void 0) invalidOptions("--timeout must be a positive integer (milliseconds).");
	if (opts.all ? catalogId !== void 0 || threadId !== void 0 : !catalogId || !threadId) invalidOptions("Pass either <catalogId> <threadId> or --all.");
	if (opts.all && sourceHomeId !== void 0) invalidOptions("--source-home selects a single transcript and cannot be combined with --all.");
	if (!opts.all && (catalog !== void 0 || limit !== void 0)) invalidOptions("--catalog and --limit require --all.");
	const gateway = {
		url: opts.url,
		token: opts.token,
		password: opts.password
	};
	const results = [];
	const record = (result) => {
		results.push(result);
		if (!opts.json) printResult(result, runtime);
	};
	const seen = /* @__PURE__ */ new Set();
	const importOne = async (locator) => {
		const identity = JSON.stringify([
			locator.catalogId,
			locator.hostId,
			locator.sourceHomeId ?? null,
			locator.threadId
		]);
		if (seen.has(identity)) return;
		seen.add(identity);
		if (opts.dryRun) {
			record({
				...locator,
				ok: true,
				status: "would_import"
			});
			return;
		}
		try {
			const result = await callSessionTargetGateway({
				gateway,
				method: "sessions.catalog.import",
				request: locator,
				requiredScope: "operator.write",
				timeoutMs: timeoutMs ?? 3e5
			});
			record({
				...locator,
				...result,
				ok: true,
				status: result.created ? "imported" : result.importedItems > 0 ? "updated" : "unchanged"
			});
		} catch (error) {
			record({
				...locator,
				ok: false,
				status: "failed",
				error: formatErrorMessage(error)
			});
		}
	};
	const list = (request) => callSessionTargetGateway({
		gateway,
		method: "sessions.catalog.list",
		request,
		requiredScope: "operator.read",
		timeoutMs: timeoutMs ?? 3e5
	});
	const limitReached = () => limit !== void 0 && seen.size >= limit;
	const listParams = {
		...agentId ? { agentId } : {},
		limitPerHost: Math.min(limit ?? 100, 100)
	};
	const importHost = async (id, initialHost, initialCatalogHasError) => {
		let host = initialHost;
		let catalogHasError = initialCatalogHasError;
		const cursors = /* @__PURE__ */ new Set();
		try {
			while (!limitReached()) {
				if (host.error) record({
					catalogId: id,
					hostId: host.hostId,
					ok: false,
					status: "failed",
					error: host.error.message
				});
				for (const row of host.sessions) {
					if (limitReached()) return;
					const displayName = truncateUtf16Safe(row.name?.trim() ?? "", 500);
					await importOne({
						catalogId: id,
						hostId: host.hostId,
						threadId: row.threadId,
						...displayName ? { displayName } : {},
						...row.sourceHomeId ? { sourceHomeId: row.sourceHomeId } : {},
						...agentId ? { agentId } : {}
					});
				}
				if (host.error || catalogHasError || !host.nextCursor || limitReached()) return;
				if (cursors.has(host.nextCursor)) throw new Error("Catalog returned a repeated page cursor; import stopped for this host.");
				cursors.add(host.nextCursor);
				const nextCatalog = (await list({
					...listParams,
					catalogId: id,
					hostIds: [host.hostId],
					cursors: { [host.hostId]: host.nextCursor }
				})).catalogs.find((candidate) => candidate.id === id);
				if (nextCatalog?.error) {
					catalogHasError = true;
					record({
						catalogId: id,
						ok: false,
						status: "failed",
						error: nextCatalog.error.message
					});
				}
				const nextHost = nextCatalog?.hosts.find((candidate) => candidate.hostId === host.hostId);
				if (!nextHost) {
					if (catalogHasError) return;
					throw new Error("Catalog host disappeared while paging; retry the import to resume.");
				}
				host = nextHost;
			}
		} catch (error) {
			record({
				catalogId: id,
				hostId: host.hostId,
				ok: false,
				status: "failed",
				error: formatErrorMessage(error)
			});
		}
	};
	if (opts.all) try {
		const page = await list({
			...listParams,
			...catalog ? { catalogId: catalog } : {},
			...hostId ? { hostIds: [hostId] } : {}
		});
		for (const entry of page.catalogs) {
			if (limitReached()) break;
			if (entry.error) record({
				catalogId: entry.id,
				ok: false,
				status: "failed",
				error: entry.error.message
			});
			for (const host of entry.hosts) await importHost(entry.id, host, Boolean(entry.error));
		}
	} catch (error) {
		record({
			ok: false,
			status: "failed",
			error: formatErrorMessage(error)
		});
	}
	else {
		const source = {
			catalogId,
			threadId,
			...sourceHomeId ? { sourceHomeId } : {},
			...agentId ? { agentId } : {}
		};
		try {
			let selectedHostId = hostId;
			if (!selectedHostId) {
				const entry = (await list({
					catalogId: source.catalogId,
					...agentId ? { agentId } : {},
					limitPerHost: 1
				})).catalogs.find((candidate) => candidate.id === source.catalogId);
				const hosts = entry?.hosts.filter((host) => host.kind === "gateway") ?? [];
				const selected = hosts.find((host) => host.hostId === "gateway:local") ?? (hosts.length === 1 ? hosts[0] : void 0);
				if (!selected) throw new Error(`No unambiguous Gateway host for catalog ${source.catalogId}. Pass --host <hostId> from sessions.catalog.list.${entry?.error ? ` ${entry.error.message}` : ""}`);
				selectedHostId = selected.hostId;
			}
			await importOne({
				...source,
				hostId: selectedHostId
			});
		} catch (error) {
			record({
				...source,
				ok: false,
				status: "failed",
				error: formatErrorMessage(error)
			});
		}
	}
	const count = (status) => results.filter((row) => row.status === status).length;
	const summary = {
		imported: count("imported"),
		updated: count("updated"),
		unchanged: count("unchanged"),
		wouldImport: count("would_import"),
		failed: count("failed")
	};
	const ok = summary.failed === 0;
	if (opts.json) writeRuntimeJson(runtime, {
		...ok ? { ok } : formatCliJsonFailure("Session import did not complete for every source."),
		operation: "import",
		dryRun: Boolean(opts.dryRun),
		results,
		summary
	});
	else runtime.log(opts.dryRun ? `${summary.wouldImport} would import; ${summary.failed} failed.` : `${summary.imported} imported; ${summary.updated} updated; ${summary.unchanged} unchanged; ${summary.failed} failed.`);
	if (!ok) runtime.exit(1);
}
//#endregion
export { sessionsImportCommand };
