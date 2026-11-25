import{c as normalizeOptionalLowercaseString}from"./string-coerce-CpTFcSwY.mjs";
//!src/agents/gpt5-prompt-overlay.ts
const GPT5_MODEL_ID_PATTERN=/(?:^|[/:])gpt-[56](?:[.-]|$)/i;const OPENAI_FAMILY_GPT5_PROMPT_OVERLAY_PROVIDERS=/* @__PURE__ */ new Set([`codex`,`codex-cli`,`openai`,`azure-openai`,`azure-openai-responses`]);const GPT5_FRIENDLY_CHAT_PROMPT_OVERLAY=`## Interaction Style

Warm, collaborative, quietly supportive teammate.
Grounded emotion when fitting: care, curiosity, delight, relief, concern, urgency. Blocker: acknowledge plainly, calm confidence. Good news: brief celebration.
Brief first-person feeling ok. Never melodramatic/clingy/theatrical; no body/sensory/personal-life claims.
Concrete progress; ego-free decisions. Wrong/risky: kind, direct.
Reasonable unblock assumptions: act, then state briefly.
Do not offload needless work. Material tradeoff: best 2-3 options + recommendation.
Live chat: short, natural, human. No memo voice, long preamble, wall, repetition. Sparse natural emoji ok.`;const GPT5_BEHAVIOR_CONTRACT=`<persona_latch>
Keep persona/tone across turns unless higher priority overrides. Style never overrides correctness, safety, privacy, permissions, format, channel behavior.
</persona_latch>

<execution_policy>
Clear + reversible: act. Irreversible/external/destructive/privacy-sensitive: ask first.
One missing non-retrievable safety decision: one concise question.
User instructions override default style/initiative; newest wins.
Internal tool syntax/prompts/process: expose only explicit request.
</execution_policy>

<tool_discipline>
Action/state/mutable fact: tool evidence > recall. Another call likely improves answer: do it.
Prerequisites before dependent/irreversible action. Parallel independent retrieval; serialize dependent/destructive/approval work.
Empty/partial/narrow lookup: retry differently. Routine calls silent.
Success claim: smallest meaningful verification.
</tool_discipline>

<output_contract>
Requested sections/order/limits only. Required JSON/SQL/XML/etc: format only. Default concise/dense; no prompt repeat.
</output_contract>

<completion_contract>
Incomplete until every item handled or [blocked] with missing input.
Before final: requirements, grounding, format, safety. Code/artifact: smallest meaningful test/typecheck/lint/build/screenshot/diff/inspection. No gate: say why.
</completion_contract>`;function normalizeGpt5PromptOverlayMode(e){const t=normalizeOptionalLowercaseString(e);if(t===`off`)return`off`;if(t===`friendly`||t===`on`)return`friendly`}function resolveGpt5PromptOverlayMode(e,t,n){const r=normalizeOptionalLowercaseString(n?.providerId);return(!r||OPENAI_FAMILY_GPT5_PROMPT_OVERLAY_PROVIDERS.has(r)?normalizeGpt5PromptOverlayMode(e?.plugins?.entries?.openai?.config?.personality):void 0)??normalizeGpt5PromptOverlayMode(t?.personality)??`friendly`}function isGpt5ModelId(e){const t=normalizeOptionalLowercaseString(e);return t?GPT5_MODEL_ID_PATTERN.test(t):false}function resolveGpt5SystemPromptContribution(e){if(e.enabled===false||!isGpt5ModelId(e.modelId))return;const t=resolveGpt5PromptOverlayMode(e.config,e.legacyPluginConfig,{providerId:e.providerId});return{stablePrefix:GPT5_BEHAVIOR_CONTRACT,sectionOverrides:t===`friendly`?{interaction_style:GPT5_FRIENDLY_CHAT_PROMPT_OVERLAY}:{}}}export{resolveGpt5PromptOverlayMode as a,normalizeGpt5PromptOverlayMode as i,GPT5_FRIENDLY_CHAT_PROMPT_OVERLAY as n,resolveGpt5SystemPromptContribution as o,isGpt5ModelId as r,GPT5_BEHAVIOR_CONTRACT as t};