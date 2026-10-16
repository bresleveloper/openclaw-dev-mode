import { l as normalizeOptionalString } from "../../string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "../../record-coerce-TIsquoVR.mjs";
import { t as DEFAULT_CONTEXT_TOKENS } from "../../defaults-Jag53zwP.mjs";
import { s as isNonSecretApiKeyMarker } from "../../model-auth-markers-Cuz_bq6T.mjs";
import "../../string-coerce-runtime-50qKeWeL.mjs";
import "../../provider-auth-C3BBF7yn.mjs";
import { f as getCachedLiveProviderModelRows, m as LiveModelCatalogHttpError } from "../../provider-catalog-live-runtime-NaavztHY.mjs";
import "../../provider-model-metadata-fSBArSt7.mjs";
import { n as TOKEN_SHARING_AUTH_FLOW, s as TOKEN_SHARING_RESOURCE } from "../../token-sharing-CmBELw8t.mjs";
//#region extensions/openai/token-sharing-catalog.ts
/** SIWC model discovery uses the already-prepared inference profile, never Codex auth. */
async function buildTokenSharingCatalog(params) {
	const { auth } = params;
	const sharing = auth.authFlow === TOKEN_SHARING_AUTH_FLOW;
	let models = sharing ? params.models.filter((model) => model.api === "openai-responses") : [];
	let status = sharing ? "unavailable" : "auth-rejected";
	let rejectionScope;
	const discoveryApiKey = auth.preparationFailed ? void 0 : auth.discoveryApiKey ?? (auth.apiKey && !isNonSecretApiKeyMarker(auth.apiKey) ? auth.apiKey : void 0);
	if (sharing && discoveryApiKey) try {
		const rows = await getCachedLiveProviderModelRows({
			providerId: "openai",
			endpoint: `${TOKEN_SHARING_RESOURCE}/models`,
			discoveryApiKey,
			signal: params.signal,
			ttlMs: 6e4,
			auditContext: "openai-model-discovery",
			readRows: (body) => {
				const bodyModels = asOptionalRecord(body)?.models;
				if (!Array.isArray(bodyModels)) throw new Error("SIWC model discovery response must be { models: [] }");
				return bodyModels;
			}
		});
		const metadata = new Map(models.map((model) => [model.id, model]));
		models = rows.flatMap((row) => {
			const record = asOptionalRecord(row);
			const id = normalizeOptionalString(record?.slug);
			if (record?.visibility !== "list" || !id) return [];
			return [{
				reasoning: false,
				input: ["text"],
				cost: {
					input: 0,
					output: 0,
					cacheRead: 0,
					cacheWrite: 0
				},
				contextWindow: DEFAULT_CONTEXT_TOKENS,
				maxTokens: 128e3,
				...metadata.get(id),
				id,
				name: normalizeOptionalString(record.display_name) ?? id,
				api: "openai-responses",
				baseUrl: TOKEN_SHARING_RESOURCE
			}];
		});
		status = "ready";
	} catch (error) {
		if (error instanceof LiveModelCatalogHttpError && (error.status === 401 || error.status === 403)) {
			models = [];
			status = "auth-rejected";
			rejectionScope = error.status === 403 ? "catalog" : void 0;
		}
	}
	return {
		providers: { openai: {
			baseUrl: TOKEN_SHARING_RESOURCE,
			api: "openai-responses",
			models
		} },
		outcomes: [{
			provider: "openai",
			profileId: auth.profileId,
			status,
			...rejectionScope ? { rejectionScope } : {},
			...status === "ready" ? { modelOrder: models.map(({ id }) => id) } : {}
		}]
	};
}
//#endregion
export { buildTokenSharingCatalog };
