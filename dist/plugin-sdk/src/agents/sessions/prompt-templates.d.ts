export { parseCommandArgs, substituteArgs, } from "../../../packages/agent-core/src/harness/prompt-template-arguments.js";
import { type SourceInfo } from "./source-info.js";
/**
 * Represents a prompt template loaded from a markdown file
 */
export interface PromptTemplate {
    name: string;
    description: string;
    argumentHint?: string;
    content: string;
    sourceInfo: SourceInfo;
    filePath: string;
}
export interface LoadPromptTemplatesOptions {
    /** Working directory for project-local templates. */
    cwd: string;
    /** Agent config directory for global templates. */
    agentDir: string;
    /** Explicit prompt template paths (files or directories). */
    promptPaths: string[];
    /** Include default prompt directories. */
    includeDefaults: boolean;
}
/**
 * Load all prompt templates from:
 * 1. Global: agentDir/prompts/
 * 2. Project: cwd/{CONFIG_DIR_NAME}/prompts/
 * 3. Explicit prompt paths
 */
export declare function loadPromptTemplates(options: LoadPromptTemplatesOptions): PromptTemplate[];
/**
 * Expand a prompt template if it matches a template name.
 * Returns the expanded content or the original text if not a template.
 */
export declare function expandPromptTemplate(text: string, templates: PromptTemplate[]): string;
