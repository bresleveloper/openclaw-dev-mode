import { t as ControlUiLinkReaderDocument } from "../../control-ui-link-reader-DjD6bkVP.js";
//#region packages/normalization-core/src/record-coerce.d.ts
/** Type guard for non-array object records at browser-safe boundaries. */
export declare function isRecord(value: unknown): value is Record<string, unknown>;
//#endregion
//#region extensions/github/src/github-api.d.ts
export declare const GITHUB_API_ORIGIN = "https://api.github.com";
export declare const GITHUB_REQUEST_TIMEOUT_MS = 8000;
export declare class ControlUiGitHubError extends Error {
  readonly statusCode: number;
  private readonly retryAtMs?;
  readonly upstreamStatus: number;
  readonly retryable: boolean;
  constructor(statusCode: number, message: string, options?: {
    retryAtMs?: number;
    upstreamStatus?: number;
    retryable?: boolean;
  });
  get retryAfterMs(): number | undefined;
}
export declare class GitHubGraphQLUnavailableError extends ControlUiGitHubError {
  constructor(upstreamStatus: number);
}
export declare function formatControlUiGitHubPreviewError(error: unknown): {
  message: string;
  retryable: boolean;
  retryAfterMs?: number;
};
export declare function githubApiCredentialCacheScope(token: string | undefined): string;
export declare function requiredString(record: Record<string, unknown>, key: string): string;
export declare function readOptionalGitHubString(record: Record<string, unknown>, key: string): string | undefined;
export declare function optionalNumber(record: Record<string, unknown>, key: string): number | undefined;
export declare function fetchGitHubApi(rawUrl: string, fetchImpl: typeof fetch, token?: string, beforeRedirect?: (url: URL) => Promise<void>, identity?: {
  revalidate: () => Promise<void>;
  assertSelected: () => void;
}, etag?: string, callerSignal?: AbortSignal, graphql?: {
  query: string;
  variables: Record<string, string>;
}): Promise<Response>;
export declare function discardResponse(response: Response): Promise<void>;
export declare function readBoundedResponse(response: Response, maxBytes: number): Promise<Buffer>;
/** GraphQL can report failed queries and exhausted quota in an HTTP 200 response. */
export declare function readGitHubGraphQLResponse(response: Response, fetchImpl: typeof fetch, token: string, maxBytes?: number): Promise<unknown>;
export declare function withOptionalGitHubAuth<T>(token: string | undefined, request: (token: string | undefined) => Promise<T>): Promise<T>;
export declare function readGitHubJsonResponse(response: Response, maxBytes?: number): Promise<unknown>;
/** Fetch a GitHub API JSON document with bounded size and normalized errors. */
export declare function fetchGitHubJson(rawUrl: string, fetchImpl: typeof fetch, token?: string, maxBytes?: number): Promise<unknown>;
//#endregion
//#region extensions/github/src/preview-contract.d.ts
/** Public GitHub metadata rendered by Control UI link hover cards. */
/**
 * One co-author resolved from a `Co-authored-by` trailer. Only trailers using
 * GitHub's `<id>+<login>@users.noreply.github.com` form resolve, because the id
 * yields both the login and the avatar without a per-person API lookup.
 */
type ControlUiGitHubPreviewCoAuthor = {
  login: string;
  avatarDataUrl?: string;
};
type ControlUiGitHubPreview = {
  additions?: number;
  avatarDataUrl?: string;
  /** Bounded to the faces the card renders; `coAuthorCount` carries the true total. */
  coAuthors?: ControlUiGitHubPreviewCoAuthor[];
  coAuthorCount?: number;
  changedFiles?: number;
  closedAt?: string;
  comments?: number;
  createdAt: string;
  deletions?: number;
  draft?: boolean;
  kind: "issue" | "pull";
  login: string;
  mergedAt?: string;
  number: number;
  owner: string;
  repo: string;
  state: string;
  stateReason?: string;
  title: string;
  updatedAt: string;
};
//#endregion
//#region extensions/github/src/targets.d.ts
type GitHubItemTarget = {
  kind: "issue" | "pull";
  owner: string;
  repo: string;
  number: number;
};
type GitHubTarget = GitHubItemTarget | {
  kind: "commit";
  owner: string;
  repo: string;
  sha: string;
};
export declare function parseGitHubTarget(value: unknown): GitHubTarget | null;
declare function parseGitHubItemTarget(value: unknown): GitHubItemTarget | null;
//#endregion
//#region extensions/github/src/preview.d.ts
type ControlUiGitHubPreviewTarget = GitHubItemTarget;
/** Host-prepared read identity; the plugin never discovers or selects managed credentials. */
type ControlUiGitHubPreviewIdentity = {
  token: string | undefined;
  cacheScope: string;
  /** Host service/env credentials may retry a stale HTTP 401 anonymously. */
  optionalAuth?: true;
  revalidate: () => Promise<void>;
  assertSelected: () => void;
};
export declare const parseControlUiGitHubPreviewTarget: typeof parseGitHubItemTarget;
export declare function loadControlUiGitHubPreview(target: ControlUiGitHubPreviewTarget, identity?: ControlUiGitHubPreviewIdentity, fetchImpl?: typeof fetch, refresh?: boolean): Promise<ControlUiGitHubPreview>;
//#endregion
//#region extensions/github/src/detail.d.ts
type GitHubComment = NonNullable<ControlUiLinkReaderDocument["comments"]>[number];
type GitHubFile = NonNullable<ControlUiLinkReaderDocument["files"]>[number];
type GitHubDocument = ControlUiLinkReaderDocument & {
  comments: GitHubComment[];
  files: GitHubFile[];
};
export declare function loadGitHubDetail(target: GitHubTarget, identity?: ControlUiGitHubPreviewIdentity, fetchImpl?: typeof fetch, refresh?: boolean): Promise<GitHubDocument>;
//#endregion
export type { ControlUiGitHubPreview, ControlUiGitHubPreviewIdentity, ControlUiGitHubPreviewTarget };