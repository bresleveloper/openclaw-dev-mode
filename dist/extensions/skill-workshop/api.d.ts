import "../../config-contracts-hzlacViZ.js";
import { r as OpenClawConfig } from "../../types.openclaw-D8uW-XQA.js";
/** One skill the reviewed turn used, as `agent_end` reports it in `event.skillsUsed`. */
type ReviewedSkillUse = {
  name: string;
};
/** The `agent_end` event fields a review reads. */
type ExperienceReviewAgentEndEvent = {
  messages: unknown[];
  success: boolean;
  error?: string;
  modelIterations?: number;
  skillsUsed?: readonly ReviewedSkillUse[];
};
/** The finished turn's final transcript entry: `ctx.completedTurn` plus its session. */
type ExperienceReviewSource = {
  agentId: string;
  sessionKey: string;
  sessionId: string;
  entryId: string;
};
type ExperienceReviewAgentContext = {
  runId?: string;
  sessionKey?: string;
  workspaceDir?: string;
  modelProviderId?: string;
  modelId?: string;
  toolNames?: readonly string[];
  trigger?: string;
  agentId: string;
};
type ExperienceReviewCandidate = {
  ctx: Pick<ExperienceReviewAgentContext, "runId">;
  config: OpenClawConfig;
  /** The fork owner reads the anchored turn's requester, model and workspace at admission. */
  source: ExperienceReviewSource;
  usedSkills?: ExperienceReviewAgentEndEvent["skillsUsed"];
  turnAborted?: boolean;
};
/**
 * Runs one background review as a hidden fork of the finished turn, with only this plugin's
 * `skill_workshop` tool. The fork owner admits it against the session's tool policy, reads the
 * anchored turn's requester, model and workspace, and fences it to that session generation.
 */
export declare function runSkillExperienceReview(candidate: ExperienceReviewCandidate, options?: {
  abortSignal?: AbortSignal;
}): Promise<void>;
export {};