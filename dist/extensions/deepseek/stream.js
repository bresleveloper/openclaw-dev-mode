import { isDeepSeekV4ModelRef } from "./models.js";
import { createDeepSeekV4OpenAICompatibleThinkingWrapper } from "openclaw/plugin-sdk/provider-stream-shared";
// extensions/deepseek/stream.ts
function createDeepSeekV4ThinkingWrapper(baseStreamFn, thinkingLevel) {
	return createDeepSeekV4OpenAICompatibleThinkingWrapper({
		baseStreamFn,
		thinkingLevel,
		shouldPatchModel: isDeepSeekV4ModelRef,
		resolveReasoningEffort: (level) => {
			if (level === "minimal" || level === "low") return "low";
			return level === "max" ? "max" : "high";
		}
	});
}
export { createDeepSeekV4ThinkingWrapper };
