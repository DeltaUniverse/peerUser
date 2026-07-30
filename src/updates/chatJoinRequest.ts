import { InlineKeyboard } from "grammy";

import { kv } from "@config";
import { middleware } from "@middleware";

const stringNumber = Array.from({ length: 6 }, (_, i) => {
  return String(i + 1);
})
  .sort(() => Math.random() - 0.5);

const reply_markup = new InlineKeyboard();

stringNumber.forEach((n, i) => {
  reply_markup.text(n);

  if (i % 2) {
    reply_markup.row();
  }
});

middleware.chatType("supergroup")
  .on("chat_join_request", async (ctx) => {
    const userId = ctx.chatJoinRequest.user_chat_id;
    const [{ message_id }, { invite_link }] = await Promise.all([
      ctx.api.sendDice(userId, "🎲", { reply_markup }),
      ctx.getChat(),
    ]);

    await kv.set(["chatJoinRequest", userId, message_id], {
      chat_id: ctx.chatId,
      invite_link,
    }, {
      expireIn: 1000 * 60 * 15,
    });
  });
