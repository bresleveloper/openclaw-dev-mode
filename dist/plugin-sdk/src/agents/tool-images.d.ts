import type { ImageContent } from "../llm/types.js";
import { type ImageSanitizationLimits } from "./image-sanitization.js";
import type { AgentToolResult } from "./runtime/index.js";
type ToolContentBlock = AgentToolResult<unknown>["content"][number];
export declare function sanitizeContentBlocksImages(blocks: ToolContentBlock[], label: string, opts?: ImageSanitizationLimits): Promise<ToolContentBlock[]>;
export declare function sanitizeImageBlocks(images: ImageContent[], label: string, opts?: ImageSanitizationLimits): Promise<{
    images: ImageContent[];
    dropped: number;
}>;
export declare function sanitizeToolResultImages(result: AgentToolResult<unknown>, label: string, opts?: ImageSanitizationLimits): Promise<AgentToolResult<unknown>>;
export {};
