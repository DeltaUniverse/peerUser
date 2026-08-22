import { InlineKeyboard } from "grammy";

import { middleware } from "@middleware";

middleware.chatType("supergroup")
  .command("whisper")
  .filter(
    (ctx) => {
      if (!ctx.msg.ephemeral_message_id) return false;
      if (!ctx.match) return false;

      const replyMsg = ctx.msg.reply_to_message;

      if (!replyMsg) return false;
      if (!replyMsg.from) return false;

      if (replyMsg.from.is_bot) return false;
      if (replyMsg.from.id === ctx.from.id) return false;

      if (replyMsg.sender_chat) return false;

      return true;
    },
    async (ctx) => {
      const replyMsg = ctx.msg.reply_to_message!;
      const reply_parameters = { message_id: replyMsg.message_id };

      await Promise.all([
        ctx.reply(ctx.match, {
          receiver_user_id: ctx.from.id,
          reply_parameters,
        }),
        ctx.reply(ctx.match, {
          reply_markup: new InlineKeyboard()
            .url("🍏", `https://t.me/@id${ctx.from.id}`).primary()
            .url("🤖", `tg://openmessage?user_id=${ctx.from.id}`).success(),
          receiver_user_id: replyMsg.from!.id,
          reply_parameters,
        }),
      ]);
    },
  );
