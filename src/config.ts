export const botToken = Deno.env.get("BOT_TOKEN");

if (!botToken) throw new Error("!botToken");

const botInfoString = Deno.env.get("BOT_INFO");
export const botInfo = botInfoString ? JSON.parse(botInfoString) : undefined;

const authIdsString = Deno.env.get("AUTH_IDS");
export const authIds = authIdsString
  ? authIdsString.split(" ")
    .map(Number)
    .filter(Boolean)
  : [];

export const secretToken = botToken.split(":")[1];
