/**
 * FIX-10 (openclaw-dev-mode fork): a cron run inside a chat session keeps that chat's CLI session.
 *
 * Bug (still open upstream on main 95a27d0779d, 2026-10-16): a job with
 * `sessionTarget: "session:<chat key>"` runs in the chat's OpenClaw session, but hands its
 * per-run delivery plan (default announce: requireExplicitMessageTarget true) to the CLI runner
 * as the session's binding facts. The messageToolPolicyHash (src/agents/cli-runner/prepare.ts)
 * no longer matches the chat's, resolveCliSessionReuse invalidates the stored binding
 * ("cli session reset … reason=message-policy"), the run starts a fresh `claude` session, and
 * settlement writes the cron hash onto the chat row, so the chat's next turn resets again. The
 * chat agent forgets everything twice per run, and the history reseed is refused (auth-unknown).
 * Report: dev-mode/claude-sub/bug-cron-session-target-cli-amnesia.md.
 *
 * Fix: upstream's own rule for heartbeats (#121485, get-reply-run-context.ts) and agent-command
 * turns (#164378, src/agents/command/prepare.ts): binding facts are session policy, not this
 * turn's delivery. A run that reuses a persistent non-cron session binds with the session-stable
 * reply mode and no requireExplicitMessageTarget (prepare.ts then falls back to
 * isSubagentSessionKey, like chat turns). The run's own delivery rules still travel as the
 * top-level sourceReplyDeliveryMode / requireExplicitMessageTarget params; the per-turn reply
 * guidance and the MCP grant enforce them as before. extraSystemPromptStatic stays the cron
 * delivery prompt: a mismatch there resumes with drift (#99729), it never resets. Detached runs
 * (isolated, current) and cron-keyed sessions keep upstream's per-run facts.
 *
 * Not gated by OPENCLAW_DEV_MODE: a bug fix, like FIX-07 and FIX-09.
 *
 * Hook: src/cron/isolated-agent/run-executor.ts wraps the `cliSessionBindingFacts` it passes to
 * runCliAgent (upstream main moved that call to run-prompt-executor.ts after 10.4).
 *
 * Regression checklist (every upstream upgrade):
 * - upstream cron still passes per-run binding facts (`git grep -n cliSessionBindingFacts
 *   src/cron`); if it seeds session-stable facts itself, drop FIX-10;
 * - prepare.ts still hashes { sourceReplyDeliveryMode, requireExplicitMessageTarget } from the
 *   binding facts with the isSubagentSessionKey fallback, and chat turns still bind
 *   extraSystemPromptStatic + the session-stable mode only (get-reply-run-context.ts);
 * - run-prepare.ts: runSessionKey === agentSessionKey still means the run reuses the target
 *   session row (detached and `cron:` runs get a `:run:` key);
 * - run-prepare.ts's createCronRunContinuationSession facts still apply to `:run:` sessions only;
 * - src/cron/isolated-agent/fork-cron-cli-binding-facts.test.ts passes.
 */
import type { CliSessionBindingFacts } from "../../agents/cli-runner/session-binding.types.js";
import { resolveSessionStableReplyMode } from "../../auto-reply/reply/session-stable-reply-mode.js";
import type { SessionEntry } from "../../config/sessions.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { isCronSessionKey } from "../../routing/session-key.js";

/** The cron execution fields FIX-10 reads; the executor passes its own params. */
export type ForkCronCliBindingRun = {
  cfgWithAgentDefaults: OpenClawConfig;
  agentId: string;
  agentSessionKey: string;
  runSessionKey: string;
  usesDetachedRunSession: boolean;
  cronSession: { sessionEntry: SessionEntry };
};

/** Binding facts for a cron CLI run: session-stable when it reuses a chat or other session. */
export function resolveForkCronCliSessionBindingFacts(
  run: ForkCronCliBindingRun,
  perRunFacts: CliSessionBindingFacts,
): CliSessionBindingFacts {
  const reusesPersistentSession =
    !run.usesDetachedRunSession &&
    run.runSessionKey === run.agentSessionKey &&
    !isCronSessionKey(run.agentSessionKey);
  if (!reusesPersistentSession) {
    return perRunFacts;
  }
  return {
    extraSystemPromptStatic: perRunFacts.extraSystemPromptStatic,
    sourceReplyDeliveryMode: resolveSessionStableReplyMode({
      cfg: run.cfgWithAgentDefaults,
      ctx: { CommandAuthorized: false },
      sessionEntry: run.cronSession.sessionEntry,
      sessionAgentId: run.agentId,
      sessionKey: run.agentSessionKey,
    }),
  };
}
