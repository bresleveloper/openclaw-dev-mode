import { a as writeRuntimeJson } from "./runtime-BC29JSZp.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { f as resolveConfiguredAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { r as callGatewayFromCliWithTransport } from "./gateway-rpc-DXO3PHhc.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { l as rethrowExpectedCliError, r as formatCliJsonFailure } from "./failure-output-Cct-llrO.mjs";
import { t as createClackPrompter } from "./clack-prompter-D8DhCvTT.mjs";
//#region src/shared/session-archive-timeout.ts
/** Cloud workspace reconciliation may take several minutes before archive can commit. */
const SESSION_ARCHIVE_REQUEST_TIMEOUT_MS = 6e5;
//#endregion
//#region src/commands/sessions-lifecycle.ts
const SESSION_TARGET_PAGE_SIZE = 200;
function resolveLifecycleAgentId(rawAgent) {
	const requested = rawAgent?.trim();
	if (rawAgent !== void 0 && !requested) throw new Error("--agent must not be blank");
	return requested ? resolveConfiguredAgentId(getRuntimeConfig(), requested) : void 0;
}
function listHint(agent) {
	const agentFlag = agent ? ` --agent ${agent}` : "";
	return formatCliCommand(`openclaw sessions list${agentFlag} --json`);
}
function notFoundResult(key, agent) {
	return {
		key,
		ok: false,
		status: "not_found",
		error: `Session not found. Run ${listHint(agent)} to choose a valid key.`
	};
}
const WORKTREE_PRESERVATION_REASON_COPY = {
	"owner-mismatch": "registered to another owner",
	busy: "still in use by a live run or another cleanup",
	"foreign-lock": "Git reports a lock owned outside OpenClaw",
	"snapshot-failed": "OpenClaw could not create a safety snapshot",
	"cleanup-failed": "cleanup did not finish normally"
};
async function listRequestedSessions(keys, agent, rpcOptions) {
	const wanted = new Set(keys);
	const found = /* @__PURE__ */ new Map();
	let offset = 0;
	while (wanted.size > found.size) {
		const page = await callGatewayFromCliWithTransport("sessions.list", rpcOptions, {
			limit: SESSION_TARGET_PAGE_SIZE,
			...offset > 0 ? { offset } : {},
			archived: "all",
			includeGlobal: true,
			includeUnknown: true,
			configuredAgentsOnly: true,
			...agent ? { agentId: agent } : {}
		}, { defaultTimeoutMs: 3e4 });
		if (!page || !Array.isArray(page.sessions)) throw new Error("Gateway returned an invalid sessions.list response.");
		for (const row of page.sessions) if (wanted.has(row.key) && !found.has(row.key)) found.set(row.key, row);
		if (found.size === wanted.size || page.hasMore !== true) break;
		const nextOffset = page.nextOffset;
		if (typeof nextOffset !== "number" || nextOffset <= offset) throw new Error("Gateway returned invalid sessions.list pagination.");
		offset = nextOffset;
	}
	return found;
}
function outputLifecycleResults(operation, dryRun, results, runtime, json, deletedSessions) {
	const ok = results.every((result) => result.ok);
	if (json) writeRuntimeJson(runtime, ok ? {
		ok,
		operation,
		dryRun,
		results
	} : {
		...formatCliJsonFailure(`Session ${operation} did not complete for every requested key.`),
		operation,
		dryRun,
		results
	});
	else for (const result of results) switch (result.status) {
		case "archived":
			runtime.log(`Archived session ${result.key}.`);
			break;
		case "already_archived":
			runtime.log(`Session ${result.key} is already archived.`);
			break;
		case "deleted": {
			runtime.log(`Deleted session ${result.key}.`);
			const archivedTranscripts = result.archived ?? [];
			for (const archived of archivedTranscripts) runtime.log(`Archived transcript: ${archived}`);
			if (archivedTranscripts.length > 0) {
				const agentId = deletedSessions?.get(result)?.agentId;
				runtime.log("Archived transcripts can remain eligible for memory search.");
				runtime.log(agentId ? `To remove indexed memories for this session, run openclaw memory forget --agent ${quoteCliArg(agentId)} --session ${quoteCliArg(result.key)} on the Gateway host or container using its state and configuration.` : "Run openclaw memory forget on the Gateway host or container using its state and configuration; select the owning agent with --agent and this session with --session.");
			}
			if (result.worktreePreserved) {
				const preserved = result.worktreePreserved;
				runtime.error(`Worktree ${preserved.branch} at ${preserved.path} needs attention: ${WORKTREE_PRESERVATION_REASON_COPY[preserved.reason]}. Inspect it with ${formatCliCommand("openclaw worktrees list")}.`);
			}
			break;
		}
		case "would_archive":
			runtime.log(`[dry-run] archive session ${result.key}`);
			break;
		case "would_delete":
			runtime.log(`[dry-run] delete session ${result.key} and its live transcript state`);
			break;
		case "not_found":
		case "failed": runtime.error(`${operation} ${result.key}: ${result.error ?? "Unknown failure."}`);
	}
	if (!ok) runtime.exit(1);
}
async function runSessionsLifecycleCommand(operation, opts, runtime) {
	const keys = opts.keys.map((key) => key.trim());
	const rpcOptions = {
		url: opts.url,
		token: opts.token,
		password: opts.password,
		timeout: opts.timeout,
		json: opts.json
	};
	let sessions;
	let agent;
	try {
		agent = resolveLifecycleAgentId(opts.agent);
		sessions = await listRequestedSessions(keys.filter(Boolean), agent, rpcOptions);
	} catch (error) {
		rethrowExpectedCliError(error);
		const message = formatErrorMessage(error);
		outputLifecycleResults(operation, Boolean(opts.dryRun), keys.map((key) => ({
			key,
			ok: false,
			status: "failed",
			error: message
		})), runtime, Boolean(opts.json));
		return;
	}
	const results = keys.map((key) => key && sessions.has(key) ? void 0 : notFoundResult(key, agent));
	const deletedSessions = /* @__PURE__ */ new Map();
	const validTargets = keys.flatMap((key, index) => {
		const session = sessions.get(key);
		return session ? [{
			index,
			session
		}] : [];
	}).filter(({ index, session }) => {
		if (!(!opts.dryRun && !(operation === "archive" && session.archived === true)) || session.sessionId) return true;
		results[index] = {
			key: session.key,
			ok: false,
			status: "failed",
			error: "Session has no durable identity; lifecycle mutation was not attempted."
		};
		return false;
	});
	if (operation === "delete" && !opts.dryRun && !opts.yes && validTargets.length > 0) {
		if (opts.json || !process.stdin.isTTY) {
			const error = "Deletion requires confirmation. Pass --yes to delete non-interactively.";
			for (const { index, session } of validTargets) results[index] = {
				key: session.key,
				ok: false,
				status: "failed",
				error
			};
			outputLifecycleResults(operation, false, results.filter((result) => result !== void 0), runtime, Boolean(opts.json));
			return;
		}
		if (!await createClackPrompter().confirm({
			message: `Delete ${validTargets.length} session${validTargets.length === 1 ? "" : "s"} and remove live transcript state?`,
			initialValue: false
		})) {
			runtime.log("Cancelled.");
			return;
		}
	}
	for (const { index, session } of validTargets) {
		if (operation === "archive" && session.archived === true) {
			results[index] = {
				key: session.key,
				ok: true,
				status: "already_archived"
			};
			continue;
		}
		try {
			if (opts.dryRun) {
				if (session.isMain === true && session.key !== "global") throw new Error(operation === "archive" ? "Cannot archive an agent's main session." : `Cannot delete the main session (${session.key}).`);
				results[index] = {
					key: session.key,
					ok: true,
					status: operation === "archive" ? "would_archive" : "would_delete"
				};
				continue;
			}
			if (operation === "archive") {
				const response = await callGatewayFromCliWithTransport("sessions.patch", rpcOptions, {
					key: session.key,
					...agent ? { agentId: agent } : {},
					...session.sessionId ? { expectedSessionId: session.sessionId } : {},
					archived: true
				}, { defaultTimeoutMs: SESSION_ARCHIVE_REQUEST_TIMEOUT_MS });
				if (response?.ok !== true || response.entry?.archivedAt === void 0) throw new Error("Gateway did not confirm that the session was archived.");
				results[index] = {
					key: response.key ?? session.key,
					ok: true,
					status: "archived"
				};
			} else {
				const response = await callGatewayFromCliWithTransport("sessions.delete", rpcOptions, {
					key: session.key,
					...agent ? { agentId: agent } : {},
					...session.sessionId ? { expectedSessionId: session.sessionId } : {},
					deleteTranscript: true,
					...session.archived === true ? { archivedOnly: true } : {}
				}, { defaultTimeoutMs: SESSION_ARCHIVE_REQUEST_TIMEOUT_MS });
				if (!response.deleted) {
					results[index] = notFoundResult(session.key, agent);
					continue;
				}
				const result = {
					key: response.key ?? session.key,
					ok: true,
					status: "deleted",
					archived: response.archived ?? [],
					...response.worktreePreserved ? { worktreePreserved: response.worktreePreserved } : {}
				};
				results[index] = result;
				deletedSessions.set(result, session);
			}
		} catch (error) {
			results[index] = {
				key: session.key,
				ok: false,
				status: "failed",
				error: formatErrorMessage(error)
			};
		}
	}
	outputLifecycleResults(operation, Boolean(opts.dryRun), results.filter((result) => result !== void 0), runtime, Boolean(opts.json), deletedSessions);
}
/** Archive one or more stored sessions through the same Gateway patch used by Control UI. */
async function sessionsArchiveCommand(opts, runtime) {
	await runSessionsLifecycleCommand("archive", opts, runtime);
}
/** Delete one or more stored sessions through the same Gateway lifecycle owner used by Control UI. */
async function sessionsDeleteCommand(opts, runtime) {
	await runSessionsLifecycleCommand("delete", opts, runtime);
}
//#endregion
export { sessionsArchiveCommand, sessionsDeleteCommand };
