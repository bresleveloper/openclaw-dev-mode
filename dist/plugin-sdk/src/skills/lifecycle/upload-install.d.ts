import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ArchiveLogger } from "../../infra/archive.js";
import { type SkillUploadStore } from "./upload-store.js";
/** Error classes exposed by uploaded skill archive install attempts. */
type UploadedSkillInstallErrorKind = "invalid-request" | "unavailable";
/** User-facing disabled message for archive upload installs. */
export declare const UPLOADED_SKILL_ARCHIVES_DISABLED_MESSAGE = "Uploaded skill archive installs are disabled by skills.install.allowUploadedArchives";
export declare function areUploadedSkillArchivesEnabled(config: OpenClawConfig): boolean;
type UploadedSkillInstallResult = {
    ok: true;
    message: string;
    stdout: string;
    stderr: string;
    code: 0;
    slug: string;
    targetDir: string;
    sha256: string;
} | {
    ok: false;
    error: string;
    errorKind: UploadedSkillInstallErrorKind;
};
export declare function installUploadedSkillArchive(params: {
    uploadId: string;
    slug: string;
    force: boolean;
    sha256?: string;
    timeoutMs?: number;
    workspaceDir: string;
    config: OpenClawConfig;
    log?: ArchiveLogger;
    store?: SkillUploadStore;
}): Promise<UploadedSkillInstallResult>;
export {};
