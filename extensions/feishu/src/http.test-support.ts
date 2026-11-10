import type { IncomingMessage, ServerResponse } from "node:http";

type DispatcherInit = RequestInit & { dispatcher?: unknown };

export async function readRequestBody(req: IncomingMessage): Promise<string> {
  let body = "";
  for await (const chunk of req) {
    body += String(chunk);
  }
  return body;
}

export function stripDispatcher(init: RequestInit | undefined): RequestInit | undefined {
  if (!init || !("dispatcher" in init)) {
    return init;
  }
  const { dispatcher: _dispatcher, ...rest } = init as DispatcherInit;
  return rest;
}

/** Stream one chunk past the cap and await real client closure, never finite EOF. */
export function writeOversizedJson(
  res: ServerResponse,
  capBytes: number,
  jsonPrefix: string,
): { bytesPulled: () => number; canceled: () => boolean; clientClosed: Promise<void> } {
  let canceled = false;
  const clientClosed = new Promise<void>((resolve) => {
    res.once("close", () => {
      canceled = true;
      resolve();
    });
  });
  const chunk = Buffer.alloc(1024 * 1024, 0x20);
  const prefix = Buffer.from(jsonPrefix);
  let bytesPulled = prefix.byteLength;
  res.writeHead(200, { "content-type": "application/json" });
  res.write(prefix);
  const sendChunk = () => {
    if (res.destroyed || bytesPulled > capBytes) {
      return;
    }
    bytesPulled += chunk.byteLength;
    if (res.write(chunk)) {
      setImmediate(sendChunk);
      return;
    }
    res.once("drain", sendChunk);
  };
  setImmediate(sendChunk);
  return { bytesPulled: () => bytesPulled, canceled: () => canceled, clientClosed };
}
