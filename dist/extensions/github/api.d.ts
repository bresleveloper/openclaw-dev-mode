import { c as isRecord } from "../../record-coerce-Df4UCOH5.js";
import { n as ControlUiLinkReaderDetailParams, r as ControlUiLinkReaderDocument } from "../../control-ui-link-reader-DaJ2Fr9p.js";
import "../../control-ui-link-reader-CZZT_gMB.js";
export declare const GITHUB_API_ORIGIN = "https://api.github.com";
export declare const GITHUB_API_BASE_URL = "https://api.github.com";
export declare const GITHUB_GRAPHQL_URL: string;
export declare function resolveGitHubApiUrls(apiBaseUrl: string | undefined): {
  baseUrl: string;
  graphqlUrl: string;
};
export declare const GITHUB_REQUEST_TIMEOUT_MS = 8000;
export declare class ControlUiGitHubError extends Error {
  readonly statusCode: number;
  readonly retryAtMs: number | undefined;
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
  signal?: AbortSignal;
}, etag?: string, callerSignal?: AbortSignal, graphql?: {
  query: string;
  variables: Record<string, string>;
}, apiBaseUrl?: string, redirect?: "follow" | "manual"): Promise<Response>;
export declare function discardResponse(response: Response): Promise<void>;
export declare function readBoundedResponse(response: Response, maxBytes: number): Promise<Buffer>;
/** GraphQL can report failed queries and exhausted quota in an HTTP 200 response. */
export declare function readGitHubGraphQLResponse(response: Response, fetchImpl: typeof fetch, token: string, maxBytes?: number): Promise<unknown>;
export declare function withOptionalGitHubAuth<T>(token: string | undefined, request: (token: string | undefined) => Promise<T>): Promise<T>;
export declare function readGitHubJsonResponse(response: Response, maxBytes?: number): Promise<unknown>;
type GitHubJsonPage = {
  value: unknown;
  link: string | null;
};
/** Revalidate every GET; only GitHub's 304 permits reuse, never a local TTL. */
export declare function fetchGitHubJsonPage(rawUrl: string, fetchImpl: typeof fetch, token?: string, options?: {
  maxBytes?: number;
  apiBaseUrl?: string;
  beforeRedirect?: (url: URL) => Promise<void>;
  identity?: Parameters<typeof fetchGitHubApi>[4];
  signal?: AbortSignal;
}): Promise<GitHubJsonPage>;
/** Optional host credentials can retry public reads anonymously; never share their validators. */
export declare function fetchGitHubJson(rawUrl: string, fetchImpl: typeof fetch, token?: string, maxBytes?: number, apiBaseUrl?: string): Promise<unknown>;
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
type GitHubJobTarget = {
  kind: "job";
  owner: string;
  repo: string;
  runId: number;
  jobId: number;
};
type GitHubReadTarget = GitHubTarget | GitHubJobTarget;
export declare function parseGitHubReadTarget(value: unknown): GitHubReadTarget | null;
export declare function parseGitHubTarget(value: unknown): GitHubTarget | null;
/** Host-prepared read identity; the plugin never discovers or selects managed credentials. */
type ControlUiGitHubPreviewIdentity = {
  token: string | undefined;
  cacheScope: string;
  /** Host service/env credentials may retry a stale HTTP 401 anonymously. */
  optionalAuth?: true;
  stale?: true;
  signal?: AbortSignal;
  revalidate: () => Promise<void>;
  assertSelected: () => void;
};
/**
 * One co-author resolved from a `Co-authored-by` trailer. Only trailers using
 * GitHub's `<id>+<login>@users.noreply.github.com` form resolve, because the id
 * yields both the login and the avatar without a per-person API lookup.
 */
type ControlUiGitHubPreviewCoAuthor = {
  login: string;
  avatarDataUrl?: string;
};
type ControlUiGitHubPreview = GitHubTarget & {
  stale?: boolean;
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
  login: string;
  mergedAt?: string;
  state: string;
  stateReason?: string;
  title: string;
  updatedAt: string;
};
/** Prepared by the host's current operator/session and selected-App admission owners. */
type SessionGitHubReadIdentity = ControlUiGitHubPreviewIdentity & {
  host: string;
  apiBaseUrl: string;
  repository: {
    id: number;
    owner: string;
    repo: string;
  };
};
type ControlUiGitHubPreviewTarget = GitHubTarget;
export declare const parseControlUiGitHubPreviewTarget: typeof parseGitHubTarget;
export declare function loadControlUiGitHubPreview(target: ControlUiGitHubPreviewTarget, identity?: ControlUiGitHubPreviewIdentity, fetchImpl?: typeof fetch, refresh?: boolean): Promise<ControlUiGitHubPreview>;
/** Foreground session reads finish inline; no background refresh outlives caller authority. */
export declare function loadSessionGitHubPreview(target: ControlUiGitHubPreviewTarget, identity: SessionGitHubReadIdentity, fetchImpl?: typeof fetch): Promise<ControlUiGitHubPreview>;
type GitHubComment = NonNullable<ControlUiLinkReaderDocument["comments"]>[number];
type GitHubFile = NonNullable<ControlUiLinkReaderDocument["files"]>[number];
type GitHubDocument = ControlUiLinkReaderDocument & {
  comments: GitHubComment[];
  files: GitHubFile[];
};
type GitHubDetailSection = NonNullable<ControlUiLinkReaderDetailParams["section"]>;
export declare function loadGitHubDetail(target: GitHubTarget, identity?: ControlUiGitHubPreviewIdentity, fetchImpl?: typeof fetch, refresh?: boolean): Promise<GitHubDocument>;
export declare function loadGitHubDetail(target: GitHubJobTarget, identity?: ControlUiGitHubPreviewIdentity, fetchImpl?: typeof fetch, refresh?: boolean): Promise<ControlUiLinkReaderDocument>;
export declare function loadGitHubDetail(target: GitHubReadTarget, identity: ControlUiGitHubPreviewIdentity | undefined, fetchImpl: typeof fetch | undefined, refresh: boolean | undefined, section: GitHubDetailSection | undefined): Promise<ControlUiLinkReaderDocument>;
export declare function loadSessionGitHubDetail(target: GitHubTarget, identity: SessionGitHubReadIdentity, fetchImpl?: typeof fetch, refresh?: boolean): Promise<GitHubDocument>;
export declare function loadSessionGitHubDetail(target: GitHubTarget, identity: SessionGitHubReadIdentity, fetchImpl: typeof fetch | undefined, refresh: boolean | undefined, section: GitHubDetailSection | undefined): Promise<ControlUiLinkReaderDocument>;
type GitHubSearchParams = {
  repository: string;
  query: string;
  kind: "issue" | "pull";
  state: "all" | "open" | "closed";
  page: number;
};
export declare function parseGitHubSearchParams(value: unknown): GitHubSearchParams | null;
export declare function searchPublicGitHubItems(params: GitHubSearchParams, identity?: ControlUiGitHubPreviewIdentity, fetchImpl?: typeof fetch): Promise<{
  repository: string;
  kind: "issue" | "pull";
  page: number;
  pageSize: number;
  totalCount: number;
  incomplete: boolean;
  resultLimit: number;
  limited: boolean;
  nextPage: number | null;
  items: {
    url: string;
    number: number;
    kind: "issue" | "pull";
    title: string;
    state: string;
    updatedAt: string;
  }[];
}>;
export { type ControlUiGitHubPreview, type ControlUiGitHubPreviewIdentity, type ControlUiGitHubPreviewTarget, type SessionGitHubReadIdentity, isRecord };