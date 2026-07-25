export async function aEval(
  input: string,
  scopes: Record<string, unknown> = {},
): Promise<unknown> {
  const AsyncFunction = async function () {}.constructor as FunctionConstructor;

  return await new AsyncFunction(...Object.keys(scopes), input)(
    ...Object.values(scopes),
  );
}

export async function paste(body: string): Promise<string | null> {
  const apiUrl = "https://paste.rs";

  try {
    const resp = await fetch(apiUrl, { method: "POST", body });

    if (!resp.ok) return null;

    const url = (await resp.text()).trim();

    return url.startsWith(apiUrl) ? url : null;
  } catch {
    return null;
  }
}

export function toStr(object: unknown): string {
  let output;

  if (typeof object === "string") {
    output = object || "\u2060";
  } else {
    output = Deno.inspect(object, { depth: Infinity });
  }

  return output;
}

export function fmtMs(ms: number): string {
  if (ms >= 1000) return `${subEnd(ms / 1000)} s`;
  if (ms >= 1) return `${subEnd(ms)} ms`;

  return `${subEnd(ms * 1000)} μs`;
}

function subEnd(n: number): string {
  return n.toFixed(2).replace(/\.?0+$/, "");
}
