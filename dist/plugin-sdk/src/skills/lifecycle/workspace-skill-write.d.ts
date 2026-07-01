export declare const MAX_WORKSPACE_SKILL_SUPPORT_FILE_BYTES: number;
type WorkspaceSkillSymlinkWritePolicy = {
    allowWrites: boolean;
    allowedTargetRealPaths: readonly string[];
};
type WorkspaceSkillSupportFileWrite = {
    path: string;
    content: string;
};
type WorkspaceSkillWriteTargetParams = {
    workspaceDir: string;
    filePath: string;
    symlinkPolicy: WorkspaceSkillSymlinkWritePolicy;
};
export declare function normalizeWorkspaceSkillSupportPath(input: string): string;
export declare function assertWorkspaceSkillSupportPathSetIsFileOnly(paths: readonly string[]): void;
export declare function readWorkspaceSkillFile(filePath: string): Promise<string | null>;
export declare function readWorkspaceSupportFile(params: {
    skillDir: string;
    relativePath: string;
}): Promise<string | null>;
export declare function assertWorkspaceSkillWriteTarget(params: WorkspaceSkillWriteTargetParams): Promise<void>;
export declare function writeWorkspaceSkill(params: {
    workspaceDir: string;
    skillDir: string;
    skillFile: string;
    content: string;
    supportFiles?: readonly WorkspaceSkillSupportFileWrite[];
    mode: "create" | "update";
    symlinkPolicy: WorkspaceSkillSymlinkWritePolicy;
}): Promise<void>;
export declare function assertInsideWorkspace(workspaceDir: string, targetPath: string, label: string): void;
export {};
