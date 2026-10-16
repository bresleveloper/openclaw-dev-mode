import { Fn as object, Jn as string, Lt as boolean, Nt as array, Yt as discriminatedUnion, xn as literal } from "./schemas-BOYIvvln.mjs";
const CLAWHUB_RECOMMENDATIONS_CHANNEL_DATA_KEY = "openclawClawHubRecommendations";
const recommendationFields = {
	type: literal("clawhub"),
	id: string().min(1).max(256),
	name: string().min(1).max(120),
	description: string().max(240).optional(),
	iconUrl: string().url().max(2048).optional(),
	installed: boolean(),
	official: literal(true)
};
const skillReference = string().max(256).regex(/^@[a-z0-9](?:[a-z0-9._-]{0,38}[a-z0-9])?\/[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i);
const recommendationSchema = discriminatedUnion("kind", [object({
	...recommendationFields,
	kind: literal("plugin"),
	id: string().max(512).regex(/^ch_[A-Za-z0-9_-]+$/),
	pluginId: string().max(256).optional()
}).strict(), object({
	...recommendationFields,
	kind: literal("skill"),
	registry: string().url().max(2048),
	id: skillReference,
	skillRef: skillReference
}).strict()]).refine((entry) => entry.kind !== "skill" || entry.id === entry.skillRef);
let recommendationsSchema;
function readClawHubRecommendations(channelData) {
	recommendationsSchema ??= array(recommendationSchema).max(3);
	const result = recommendationsSchema.safeParse(channelData?.[CLAWHUB_RECOMMENDATIONS_CHANNEL_DATA_KEY]);
	return result.success ? result.data : [];
}
//#endregion
export { readClawHubRecommendations as n, CLAWHUB_RECOMMENDATIONS_CHANNEL_DATA_KEY as t };
