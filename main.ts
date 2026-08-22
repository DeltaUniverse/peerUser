import { Bot, webhookCallback } from "grammy";

import { botInfo, botToken, secretToken } from "@config";
import { middleware } from "@middleware";

import "./src/updates/index.ts";

const bot = new Bot(botToken!, { botInfo });

bot.errorBoundary(
  (e) => {
    console.log(String(e));
  },
)
  .use(middleware);

Deno.serve(
  webhookCallback(bot, "std/http", { onTimeout: "return", secretToken }),
);
