import { InlineKeyboard } from "grammy";

import { kv } from "@config";
import { middleware } from "@middleware";

middleware.on("callback_query:data")
  .fork(
    (ctx) => {
      ctx.answerCallbackQuery();
    },
  );

middleware.chatType("private")
  .callbackQuery(/^[1-6]$/)
  .filter(
    (ctx) => {
      return !!ctx.msg?.dice;
    },
    async (ctx) => {
      const userId = ctx.from.id;

      const k = ["chatJoinRequest", userId, ctx.msgId!];
      const v = await kv.get<{ chat_id: number; invite_link: string }>(k);

      if (!v.value) {
        await ctx.editMessageReplyMarkup();
        return;
      }

      const { chat_id, invite_link } = v.value;

      await ctx.editMessageReplyMarkup({
        reply_markup: new InlineKeyboard().url("Open", invite_link!),
      });

      if (ctx.msg?.dice?.value === Number(ctx.callbackQuery.data)) {
        await ctx.api.approveChatJoinRequest(chat_id, userId)
          .catch(() => {});
      } else {
        await ctx.api.declineChatJoinRequest(chat_id, userId)
          .catch(() => {});
      }

      await kv.delete(k);
    },
  );
