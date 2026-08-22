export const botToken = Deno.env.get("BOT_TOKEN");

if (!botToken) throw new Error("!botToken");

const botInfoString = Deno.env.get("BOT_INFO");
export const botInfo = botInfoString ? JSON.parse(botInfoString) : undefined;

export const secretToken = botToken.split(":")[1];
export const kv = await Deno.openKv();
