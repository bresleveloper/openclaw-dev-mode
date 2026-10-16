//#region extensions/memory-core/src/memory/local-embedding-provider.ts
const LOCAL_MEMORY_EMBEDDING_PROVIDER_ID = "local";
const LLAMA_CPP_PROVIDER_INSTALL_COMMAND = "openclaw plugins install @openclaw/llama-cpp-provider";
const MISSING_LOCAL_MEMORY_EMBEDDING_PROVIDER_MESSAGE = [
	"Unknown memory embedding provider: local.",
	"Local GGUF embeddings are provided by the official llama.cpp provider plugin.",
	"Semantic memory recall is degraded until the managed llama-server is configured.",
	`Install it with: ${LLAMA_CPP_PROVIDER_INSTALL_COMMAND}`,
	"Then run `openclaw configure` and choose llama.cpp to set up the managed llama-server.",
	"Then restart OpenClaw and retry: openclaw memory status --deep"
].join("\n");
//#endregion
export { LOCAL_MEMORY_EMBEDDING_PROVIDER_ID as n, MISSING_LOCAL_MEMORY_EMBEDDING_PROVIDER_MESSAGE as r, LLAMA_CPP_PROVIDER_INSTALL_COMMAND as t };
