export const botToken = Deno.env.get("BOT_TOKEN");

if (!botToken) throw new Error("!botToken");

const botInfoRaw = Deno.env.get("BOT_INFO");
export const botInfo = botInfoRaw ? JSON.parse(botInfoRaw) : undefined;

const userIdsRaw = Deno.env.get("USER_IDS");
export const userIds = userIdsRaw
  ? userIdsRaw.split(" ")
    .map(Number)
    .filter(Boolean)
  : [];

export const secretToken = botToken.split(":")[1];
