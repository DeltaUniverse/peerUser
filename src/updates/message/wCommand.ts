import { middleware } from "@middleware";

middleware.chatType("supergroup")
  .command("w")
  .filter(
    (ctx) => {
      if (!ctx.msg.ephemeral_message_id) return false;
      if (!ctx.match) return false;

      const msg = ctx.msg.reply_to_message;

      if (!msg) return false;
      if (!msg.from) return false;
      if (msg.from.is_bot) return false;
      if (msg.from.id === ctx.from.id) return false;
      if (msg.ephemeral_message_id) return false;

      return true;
    },
  )
  .use(
    async (ctx) => {
      const msg = ctx.msg.reply_to_message!;
      const msgText = ctx.match;
      const reply_parameters = { message_id: msg.message_id };

      const offset = msgText.length + 4;
      const length = 4;

      await Promise.all([
        ctx.reply(msgText, {
          receiver_user_id: ctx.from.id,
          reply_parameters,
        }),
        ctx.reply(`${msgText}\n\n[ From ]`, {
          receiver_user_id: msg.from!.id,
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
