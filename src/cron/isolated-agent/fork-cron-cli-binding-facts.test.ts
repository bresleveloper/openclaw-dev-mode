// FIX-10 (openclaw-dev-mode fork): cron runs inside a chat session keep that chat's CLI session.
import { describe, expect, it } from "vitest";
import type { CliSessionBindingFacts } from "../../agents/cli-runner/session-binding.types.js";
import { hashCliSessionText, resolveCliSessionReuse } from "../../agents/cli-session.js";
import type { SessionEntry } from "../../config/sessions.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { isSubagentSessionKey } from "../../routing/session-key.js";
import { resolveForkCronCliSessionBindingFacts } from "./fork-cron-cli-binding-facts.js";

const CHAT_KEY = "agent:main:whatsapp:direct:+15550001111";
const GROUP_KEY = "agent:main:whatsapp:group:120363000000000000@g.us";

// Upstream's per-run facts for a cron job with the default announce delivery.
const ANNOUNCE_FACTS: CliSessionBindingFacts = {
  extraSystemPromptStatic: "cron delivery prompt",
  sourceReplyDeliveryMode: undefined,
  requireExplicitMessageTarget: true,
};

function whatsappEntry(chatType: "direct" | "group", to: string): SessionEntry {
  return {
    sessionId: `${chatType}-session`,
    updatedAt: 1,
    chatType,
    delivery: {
      kind: "external",
      route: { channel: "whatsapp", target: { to } },
      context: { channel: "whatsapp", to },
      origin: { provider: "whatsapp", surface: "whatsapp", chatType },
    },
  };
}

// A `session:<chat key>` job: the run reuses the chat's own session row.
function chatRun(
  overrides: Partial<Parameters<typeof resolveForkCronCliSessionBindingFacts>[0]> = {},
) {
  return {
    cfgWithAgentDefaults: {} as OpenClawConfig,
    agentId: "main",
    agentSessionKey: CHAT_KEY,
    runSessionKey: CHAT_KEY,
    usesDetachedRunSession: false,
    cronSession: { sessionEntry: whatsappEntry("direct", "+15550001111") },
    ...overrides,
  };
}

// Mirrors the messageToolPolicyHash rule in src/agents/cli-runner/prepare.ts for runs that pass
// binding facts (chat turns, agent commands, cron).
function messagePolicyHash(facts: CliSessionBindingFacts, sessionKey: string) {
  const requireExplicitMessageTarget =
    facts.requireExplicitMessageTarget ?? isSubagentSessionKey(sessionKey);
  const hasPolicy =
    facts.sourceReplyDeliveryMode !== undefined ||
    facts.requireExplicitMessageTarget !== undefined ||
    requireExplicitMessageTarget;
  return hasPolicy
    ? hashCliSessionText(
        JSON.stringify({
          sourceReplyDeliveryMode: facts.sourceReplyDeliveryMode,
          requireExplicitMessageTarget,
        }),
      )
    : undefined;
}

describe("FIX-10 cron CLI binding facts", () => {
  it("binds a chat-session run with the chat's stable reply mode and no explicit-target flag", () => {
    const facts = resolveForkCronCliSessionBindingFacts(chatRun(), ANNOUNCE_FACTS);
    expect(facts.sourceReplyDeliveryMode).toBe("automatic");
    expect(facts).not.toHaveProperty("requireExplicitMessageTarget");
    // A different extra system prompt only resumes with drift; it never resets the session.
    expect(facts.extraSystemPromptStatic).toBe("cron delivery prompt");
  });

  it("reuses the chat's stored CLI session instead of resetting it (message-policy)", () => {
    // What a WhatsApp chat turn stores: { extraSystemPromptStatic, sourceReplyDeliveryMode }.
    const binding = {
      sessionId: "chat-cli-session",
      messageToolPolicyHash: messagePolicyHash({ sourceReplyDeliveryMode: "automatic" }, CHAT_KEY),
    };
    const reuse = (facts: CliSessionBindingFacts) =>
      resolveCliSessionReuse({
        binding,
        authEpochVersion: 1,
        messageToolPolicyHash: messagePolicyHash(facts, CHAT_KEY),
      });
    // The bug: upstream's per-run announce facts throw the chat's session away.
    expect(reuse(ANNOUNCE_FACTS)).toEqual({
      mode: "invalidate",
      invalidatedReason: "message-policy",
    });
    expect(reuse(resolveForkCronCliSessionBindingFacts(chatRun(), ANNOUNCE_FACTS))).toEqual({
      mode: "reuse",
      sessionId: "chat-cli-session",
    });
  });

  it("follows the session's own reply policy rather than a fixed mode", () => {
    const facts = resolveForkCronCliSessionBindingFacts(
      chatRun({
        cfgWithAgentDefaults: { messages: { groupChat: { visibleReplies: "message_tool" } } },
        agentSessionKey: GROUP_KEY,
        runSessionKey: GROUP_KEY,
        cronSession: { sessionEntry: whatsappEntry("group", "120363000000000000@g.us") },
      }),
      ANNOUNCE_FACTS,
    );
    expect(facts.sourceReplyDeliveryMode).toBe("message_tool_only");
    expect(facts).not.toHaveProperty("requireExplicitMessageTarget");
  });

  it("keeps upstream's per-run facts for detached runs and cron-owned sessions", () => {
    // isolated / current: a throwaway `:run:` session under the job's cron key.
    const detached = chatRun({
      usesDetachedRunSession: true,
      agentSessionKey: "agent:main:cron:job-1",
      runSessionKey: "agent:main:cron:job-1:run:run-1",
    });
    expect(resolveForkCronCliSessionBindingFacts(detached, ANNOUNCE_FACTS)).toBe(ANNOUNCE_FACTS);
    // `session:agent:main:cron:<name>` reuses a cron-keyed row in place; only cron runs bind it.
    const cronOwned = chatRun({
      agentSessionKey: "agent:main:cron:nightly",
      runSessionKey: "agent:main:cron:nightly",
    });
    expect(resolveForkCronCliSessionBindingFacts(cronOwned, ANNOUNCE_FACTS)).toBe(ANNOUNCE_FACTS);
  });
});
