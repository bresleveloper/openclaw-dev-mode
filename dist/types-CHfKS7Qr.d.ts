import { n as SkillLibrarySelection, t as SkillLibraryFile } from "./skill-library-DVzEZ7Hi.js";
import { t as Skill } from "./skill-contract-ChC4fiJP.js";
//#region src/skills/types.d.ts
type SkillInstallSpec = {
  id?: string;
  kind: "brew" | "node" | "go" | "uv" | "download";
  label?: string;
  bins?: string[];
  os?: string[];
  formula?: string;
  package?: string;
  module?: string;
  url?: string;
  sha256?: string;
  archive?: string;
  extract?: boolean;
  stripComponents?: number;
  targetDir?: string;
};
type OpenClawSkillMetadata = {
  always?: boolean;
  skillKey?: string;
  primaryEnv?: string;
  emoji?: string;
  homepage?: string;
  os?: string[];
  requires?: {
    bins?: string[];
    anyBins?: string[];
    env?: string[];
    config?: string[];
  };
  install?: SkillInstallSpec[];
};
type SkillInvocationPolicy = {
  userInvocable: boolean;
  disableModelInvocation: boolean;
};
type SkillCommandDispatchSpec = {
  kind: "tool";
  /** Name of the tool to invoke (AnyAgentTool.name). */
  toolName: string;
  /**
   * How to forward user-provided args to the tool.
   * - raw: forward the raw args string (no core parsing).
   */
  argMode?: "raw";
};
type SkillTelemetrySource = "bundled" | "unknown" | "workspace";
type SkillUsagePath = {
  /** Path visible to the tool runtime when it reads SKILL.md. */
  readPath: string;
  /** Canonical source SKILL.md path used as the lifecycle identity. */
  skillFile: string;
  skillName: string;
  skillSource: SkillTelemetrySource;
};
type ExplicitSkillSelection = {
  name: string;
  path: string;
};
type SkillCommandSpec = {
  name: string;
  /** Human-readable skill title for display surfaces. */
  displayName?: string;
  /** Canonical SKILL.md path for file-scoped usage accounting. */
  skillFile?: string;
  skillName: string;
  description: string;
  /** Whether the model can resolve this skill from its available-skills prompt. */
  modelVisible?: boolean;
  /** Bounded source label used for diagnostics. */
  skillSource?: SkillTelemetrySource;
  /** Localized descriptions for native command surfaces that support them. */
  descriptionLocalizations?: Record<string, string>;
  /** Optional deterministic dispatch behavior for this command. */
  dispatch?: SkillCommandDispatchSpec;
  /** Native prompt template used by Claude-bundle command markdown files. */
  promptTemplate?: string;
  /** Source markdown path for bundle-backed commands. */
  sourceFilePath?: string;
};
type SkillsInstallPreferences = {
  preferBrew: boolean;
  nodeManager: "npm" | "pnpm" | "yarn" | "bun";
};
type ParsedSkillFrontmatter = Record<string, string>;
type SkillExposure = {
  includeInRuntimeRegistry: boolean;
  includeInAvailableSkillsPrompt: boolean;
  userInvocable: boolean;
};
type SkillEntry = {
  skill: Skill;
  frontmatter: ParsedSkillFrontmatter;
  metadata?: OpenClawSkillMetadata;
  invocation?: SkillInvocationPolicy;
  exposure?: SkillExposure;
  syncSourceDir?: string;
  syncDirName?: string;
  disableCommandDispatch?: boolean;
};
type SkillEligibilityContext = {
  nodeSkills?: {
    canExec: boolean;
    node?: string;
  };
  remote?: {
    platforms: string[];
    hasBin: (bin: string) => boolean;
    hasAnyBin: (bins: string[]) => boolean;
    note?: string;
  };
};
type SkillSnapshot = {
  librarySelections?: SkillLibrarySelection[];
  prompt: string;
  /** Complete eligible sync identities, including skills hidden from the model prompt. */
  skills: Array<{
    name: string;
    /** Gateway-admitted path for explicit reads of hidden, Gateway-owned skills. */
    gatewayFilePath?: string;
    /** Config key can differ from the prompt-facing skill name. */
    skillKey?: string;
    primaryEnv?: string;
    requiredEnv?: string[];
  }>;
  /** Normalized agent-level filter used to build this snapshot; undefined means unrestricted. */
  skillFilter?: string[];
  /** Sparse per-session overlay applied after the agent-level filter. */
  skillOverrides?: Record<string, boolean>;
  /** Effective node-exec eligibility used to select connected node-hosted skills. */
  nodeSkillsEligibility?: SkillEligibilityContext["nodeSkills"];
  resolvedSkills?: Skill[];
  /** Present only when a session merges skills from distinct agent and execution roots. */
  skillRoots?: {
    agentWorkspaceDir: string;
    executionWorkspaceDir: string;
  };
  version?: number;
  promptFormatVersion?: number;
};
/** Filesystem reads run on the workspace host; catalog selection stays with the caller. */
type SkillResourceSourceReader = {
  /** Read the instruction path selected by the run, without packaging supporting files. */
  readInstructions: (filePath: string, options: {
    signal?: AbortSignal;
  }) => Promise<string>;
  resolveExplicitSkill: (selection: ExplicitSkillSelection) => Promise<Skill | null>;
  /** Null means only the requested root vanished, and only when allowMissingRoot is true. */
  readSkillFiles: (skill: Skill, options: {
    allowMissingRoot: boolean;
  }) => Promise<SkillLibraryFile[] | null>;
};
//#endregion
export { SkillInstallSpec as a, SkillTelemetrySource as c, SkillEntry as i, SkillUsagePath as l, SkillCommandSpec as n, SkillResourceSourceReader as o, SkillEligibilityContext as r, SkillSnapshot as s, ExplicitSkillSelection as t, SkillsInstallPreferences as u };