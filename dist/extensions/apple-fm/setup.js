import { v as ensureModelAllowlistEntry } from "../../provider-onboard-Be0xLg2V.mjs";
import { a as buildAppleFmProviderConfig, i as APPLE_FM_PROVIDER_ID, n as APPLE_FM_MIN_CONTEXT_WINDOW, r as APPLE_FM_MODEL_REF } from "../../defaults-p5LbrA8q.mjs";
//#region extensions/apple-fm/setup.ts
const SETUP_NOTE = "Apple Foundation Models is your on-device setup and utility model, with no API key. Choose a separate primary model for regular agent conversations.";
function requireUsableModel(facts) {
	if (!facts.available) throw new Error(facts.reason || "Apple Foundation Models is unavailable. Enable Apple Intelligence in System Settings and wait for its model download, then retry setup.");
	if (facts.contextWindow < 8192) throw new Error(`${facts.modelName} provides ${facts.contextWindow} context tokens. OpenClaw's Apple setup option requires at least ${APPLE_FM_MIN_CONTEXT_WINDOW}. Choose another local or cloud model on this Mac.`);
}
function setupResult(facts) {
	requireUsableModel(facts);
	return {
		profiles: [],
		defaultModel: APPLE_FM_MODEL_REF,
		notes: [SETUP_NOTE],
		configPatch: {
			models: { providers: { [APPLE_FM_PROVIDER_ID]: buildAppleFmProviderConfig(facts) } },
			agents: { defaults: { models: { [APPLE_FM_MODEL_REF]: { agentRuntime: { id: "openclaw" } } } } }
		}
	};
}
async function detectAppleFmSetup(ctx, native) {
	const facts = await native.probe({
		signal: ctx.signal,
		env: ctx.env
	});
	if (!facts?.available || facts.contextWindow < 8192) return null;
	return {
		modelRef: APPLE_FM_MODEL_REF,
		detail: `${facts.modelName} · ${facts.contextWindow.toLocaleString("en-US")} tokens · on-device setup and utility`
	};
}
async function prepareAppleFmSetup(ctx, native) {
	if (ctx.modelRef !== APPLE_FM_MODEL_REF) return null;
	return setupResult(await native.prepare({
		signal: ctx.signal,
		env: ctx.env
	}));
}
async function runAppleFmSetup(ctx, native) {
	return setupResult(await native.prepare({
		signal: ctx.signal,
		env: ctx.env
	}));
}
async function validateAppleFmNonInteractive(ctx, native) {
	const facts = await native.probe();
	if (!facts) {
		ctx.runtime.error("Apple Foundation Models requires an Apple Silicon Mac running macOS 27 or later.");
		return false;
	}
	try {
		requireUsableModel(facts);
		return true;
	} catch (error) {
		ctx.runtime.error(error instanceof Error ? error.message : String(error));
		return false;
	}
}
async function configureAppleFmNonInteractive(ctx, native) {
	const facts = await native.prepare();
	requireUsableModel(facts);
	return ensureModelAllowlistEntry({
		cfg: {
			...ctx.config,
			models: {
				...ctx.config.models,
				providers: {
					...ctx.config.models?.providers,
					[APPLE_FM_PROVIDER_ID]: buildAppleFmProviderConfig(facts)
				}
			},
			agents: {
				...ctx.config.agents,
				defaults: {
					...ctx.config.agents?.defaults,
					utilityModel: APPLE_FM_MODEL_REF,
					models: {
						...ctx.config.agents?.defaults?.models,
						[APPLE_FM_MODEL_REF]: {
							...ctx.config.agents?.defaults?.models?.[APPLE_FM_MODEL_REF],
							agentRuntime: { id: "openclaw" }
						}
					}
				}
			}
		},
		modelRef: APPLE_FM_MODEL_REF
	});
}
//#endregion
export { configureAppleFmNonInteractive, detectAppleFmSetup, prepareAppleFmSetup, runAppleFmSetup, validateAppleFmNonInteractive };
