import { Bot /* webhookCallback */ } from "grammy";

import { botInfo, botToken /* secretToken */ } from "@config";
import { middleware } from "@middleware";

import "./src/updates/index.ts";

const bot = new Bot(botToken!, { botInfo });

bot.errorBoundary(
  (e) => {
    console.log(String(e));
  },
)
  .use(middleware);

/*
Deno.serve(
  webhookCallback(bot, "std/http", {
    onTimeout: "return",
    timeoutMilliseconds: 8192,
    secretToken,
  }),
);
*/

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  Deno.addSignalListener(signal, () => bot.stop());
}

bot.start(
  {
    allowed_updates: [
      "business_message",
      "callback_query",
      "chat_member",
      "guest_message",
      "message",
      "my_chat_member",
    ],
    drop_pending_updates: true,
    onStart: () => console.log("Bot Started"),
  },
);
