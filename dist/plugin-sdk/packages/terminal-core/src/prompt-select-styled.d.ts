import { select } from "@clack/prompts";
/** Run a clack select prompt with styled message and hints. */
export declare function selectStyled<T>(params: Parameters<typeof select<T>>[0]): Promise<symbol | T>;
