import { i as isProviderAuthProfileConfiguredAsync, r as isProviderAuthProfileConfigured } from "./provider-auth-availability-CfYdMNuk.mjs";
import "./provider-auth-JCvgbsWg.mjs";
import { n as createXaiSpeechProviderMetadata$1 } from "./speech-provider-metadata-factory-BUKWgfFP.mjs";
//#region extensions/xai/speech-provider-metadata.ts
function createXaiSpeechProviderMetadata() {
	return createXaiSpeechProviderMetadata$1({
		isProviderAuthProfileConfigured,
		isProviderAuthProfileConfiguredAsync
	});
}
//#endregion
export { createXaiSpeechProviderMetadata as t };
