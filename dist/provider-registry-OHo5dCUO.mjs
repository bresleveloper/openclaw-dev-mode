import { t as createMediaProviderRegistry } from "./provider-registry-Cj7EioxL.mjs";
//#region src/transcripts/provider-registry.ts
/** Transcript providers use targeted lookup to avoid broad capability discovery. */
const { listProviders: listTranscriptSourceProviders, getProvider: getTranscriptSourceProvider } = createMediaProviderRegistry("transcriptSourceProviders", { directLookup: true });
//#endregion
export { listTranscriptSourceProviders as n, getTranscriptSourceProvider as t };
