import { Static, TSchema, Type } from "typebox";
//#region packages/gateway-protocol/src/schema/skill-library.d.ts
declare const SkillLibraryFileSchema: Type.TObject<{
  path: Type.TString;
  content: Type.TString;
  encoding: Type.TOptional<Type.TUnion<[Type.TLiteral<"utf8">, Type.TLiteral<"base64">]>>;
  executable: Type.TOptional<Type.TBoolean>;
}>;
declare const SkillLibrarySelectionSchema: Type.TObject<{
  skillId: Type.TString;
  revision: Type.TString;
  /** Persisted command identity: library collisions never shadow workspace names. */
  name: Type.TString;
  ownerProfileId: Type.TUnion<[Type.TString, Type.TNull]>;
}>;
type SkillLibraryFile = Static<typeof SkillLibraryFileSchema>;
type SkillLibrarySelection = Static<typeof SkillLibrarySelectionSchema>;
type SkillLibraryEntry = {
  skillId: string;
  slug: string;
  name: string;
  description: string;
  ownerProfileId: string | null;
  ownerLabel: string;
  authorProfileId: string;
  shared: boolean;
  enabled: boolean;
  removed: boolean;
  revision: string;
  createdAt: number;
  updatedAt: number;
  canEdit: boolean;
};
type SkillsLibraryListResult = {
  entries: SkillLibraryEntry[];
  profileId: string | null;
  multipleProfiles: boolean;
  defaultTarget: "workspace" | "personal" | "unavailable";
  canManageWorkspace: boolean;
  defaultSelectionLimit: number;
  defaultSelectionNotice?: string;
  session?: {
    sessionKey: string;
    selections: Array<SkillLibrarySelection & {
      slug: string;
      description: string;
      ownerLabel: string;
    }>;
    attachable: SkillLibraryEntry[];
  };
};
type SkillsLibraryReadResult = {
  entry: SkillLibraryEntry;
  content: string;
  files: SkillLibraryFile[];
  revisions: Array<{
    revision: string;
    createdAt: number;
  }>;
};
type SkillsLibraryReceipt = {
  state: "published" | "unchanged" | "removed";
  target: "personal" | "team";
  entry: SkillLibraryEntry;
  sessionActivation: "new-sessions";
  nextAction: string;
};
type SkillsLibraryActivateResult = {
  sessionKey: string;
  selections: SkillLibrarySelection[];
  sessionActivation: "next-turn";
};
//#endregion
export { SkillsLibraryReadResult as a, SkillsLibraryListResult as i, SkillLibrarySelection as n, SkillsLibraryReceipt as o, SkillsLibraryActivateResult as r, SkillLibraryFile as t };