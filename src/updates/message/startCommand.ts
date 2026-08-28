import { InlineKeyboard } from "grammy";

import { middleware } from "@middleware";

middleware.chatType("private")
  .command("start", async (ctx) => {
    const startUrl = `https://t.me/${ctx.me.username}?start`;

    await ctx.reply("Add To:", {
      entities: [{ offset: 0, length: 7, type: "bold" }],
      reply_markup: new InlineKeyboard()
        .url("Channel", `${startUrl}channel`)
        .url("Group", `${startUrl}group`)
        .row()
        .url("Chat Automation", "tg://settings/edit"),
      link_preview_options: {
        url: "https://http.dog/200.webp",
        show_above_text: true,
      },
    });
  });
