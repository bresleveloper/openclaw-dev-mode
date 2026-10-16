//#region extensions/memory-core/src/memory/vector-blob.ts
const vectorToBlob = (embedding) => Buffer.from(new Float32Array(embedding).buffer);
//#endregion
export { vectorToBlob as t };
