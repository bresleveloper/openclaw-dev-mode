import { i as asOptionalRecord } from "./record-coerce-CNDovvft.mjs";
//#region packages/ai/src/providers/google-video-slots.ts
const GOOGLE_VIDEO_SLOT_OMISSION = "(video omitted: native video slot unavailable)";
function createGoogleVideoPlaceholder(video, slots, placeholder) {
	slots?.set(placeholder, video);
	return placeholder;
}
/** Only original slot identities may recover private bytes after mutable payload hooks. */
function materializeGoogleVideoSlots(payload, slots, materialize, omitInjected) {
	const visit = (value) => {
		if (Array.isArray(value)) {
			value.forEach(visit);
			return;
		}
		const part = asOptionalRecord(value);
		if (!part) return;
		const video = slots.get(part);
		if (video) {
			Object.keys(part).forEach((key) => Reflect.deleteProperty(part, key));
			materialize(part, video);
			return;
		}
		omitInjected(part);
		Object.values(part).forEach(visit);
	};
	visit(payload);
}
//#endregion
export { createGoogleVideoPlaceholder as n, materializeGoogleVideoSlots as r, GOOGLE_VIDEO_SLOT_OMISSION as t };
