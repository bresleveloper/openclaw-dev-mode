import type { UsageBarTemplate } from "./translator.js";
export type UsageTemplateConfig = string | Record<string, unknown> | undefined;
export declare function loadUsageBarTemplate(configured: UsageTemplateConfig): UsageBarTemplate;
export declare function clearUsageBarTemplateCacheForTest(): void;
