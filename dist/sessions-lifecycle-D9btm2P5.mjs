import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { a as writeRuntimeJson } from "./runtime-DlO3PTAd.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { l as rethrowExpectedCliError, r as formatCliJsonFailure } from "./failure-output-gtb9zaTk.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { m as resolveConfiguredAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { r as callGatewayFromCliWithTransport } from "./gateway-rpc-Cl_Z2Z7Q.mjs";
import { t as createClackPrompter } from "./clack-prompter-D76Rt341.mjs";
//#region src/shared/session-archive-timeout.ts
/** Cloud workspace reconciliation may take several minutes before archive can commit. */
const SESSION_ARCHIVE_REQUEST_TIMEOUT_MS = 6e5;
//#endregion
//#region src/commands/sessions-lifecycle.ts
/** Gateway-backed archive and delete commands for stored sessions. */
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
	const targets = [];
	const results = keys.map((key) => notFoundResult(key, agent));
	for (const [index, key] of keys.entries()) {
		if (!key) continue;
		try {
			const response = await callGatewayFromCliWithTransport("sessions.describe", rpcOptions, {
				key,
				...agent ? { agentId: agent } : {}
			}, { defaultTimeoutMs: 3e4 });
			if (!response || !("session" in response)) throw new Error("Gateway returned an invalid sessions.describe response.");
			if (response.session) {
				targets.push({
					index,
					session: response.session
				});
				results[index] = void 0;
			}
		} catch (error) {
			rethrowExpectedCliError(error);
			results[index] = {
				key,
				ok: false,
				status: "failed",
				error: formatErrorMessage(error)
			};
		}
	}
	return {
		targets,
		results
	};
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
	const keys = uniqueStrings(opts.keys.map((key) => key.trim()));
	const rpcOptions = {
		url: opts.url,
		token: opts.token,
		password: opts.password,
		timeout: opts.timeout,
		json: opts.json
	};
	let requested;
	let agent;
	try {
		agent = resolveLifecycleAgentId(opts.agent);
		requested = await listRequestedSessions(keys, agent, rpcOptions);
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
	const { targets, results } = requested;
	const deletedSessions = /* @__PURE__ */ new Map();
	const validTargets = targets.filter(({ index, session }) => {
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
				if (!response?.ok || response.entry?.archivedAt === void 0) throw new Error("Gateway did not confirm that the session was archived.");
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
