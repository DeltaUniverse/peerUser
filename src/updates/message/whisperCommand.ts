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

      return true;
    },
    async (ctx) => {
      const replyMsg = ctx.msg.reply_to_message!;
      const replyMsgText = ctx.match;
      const reply_parameters = { message_id: replyMsg.message_id };

      const offset = replyMsgText.length + 4;
      const length = 4;

      await Promise.all([
        ctx.reply(replyMsgText, {
          receiver_user_id: ctx.from.id,
          reply_parameters,
        }),
        ctx.reply(`${replyMsgText}\n\n[ From ]`, {
          receiver_user_id: replyMsg.from!.id,
          entities: [
            {
              offset,
              length,
              type: "text_link",
              url: `tg://user?id=${ctx.from.id}`,
            },
            { offset, length, type: "bold" },
          ],
          reply_parameters,
        }),
      ]);
    },
  );
