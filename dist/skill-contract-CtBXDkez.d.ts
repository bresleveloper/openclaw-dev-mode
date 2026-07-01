import { t as SourceInfo } from "./source-info-DwyHUYNZ.js";

//#region src/skills/loading/skill-contract.d.ts
interface Skill {
  name: string;
  description: string;
  filePath: string;
  baseDir: string;
  /** Deterministic marker for the SKILL.md content rendered as <version>. */
  promptVersion?: string;
  sourceInfo: SourceInfo;
  disableModelInvocation: boolean;
  source: string;
}
//#endregion
export { Skill as t };