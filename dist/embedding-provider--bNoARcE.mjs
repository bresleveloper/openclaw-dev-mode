//#region extensions/ollama/src/embedding-provider.ts
const createOllamaEmbeddingProvider = async (...args) => await (await import("./embedding-provider.runtime.js")).createOllamaEmbeddingProvider(...args);
//#endregion
export { createOllamaEmbeddingProvider as t };
