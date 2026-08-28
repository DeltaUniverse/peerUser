import { middleware } from "@middleware";

middleware.command("rich")
  .filter(
    (ctx) => {
      if (!ctx.msg.ephemeral_message_id) return false;
      if (!ctx.match) return false;

      return true;
    },
    async (ctx) => {
      const reply_parameters = {
        ephemeral_message_id: ctx.msg.ephemeral_message_id,
      };
      const ephemeral_message_parameters = { receiver_user_id: ctx.from!.id };

      try {
        await ctx.replyWithRichMessage({ markdown: ctx.match }, {
          reply_parameters,
          ephemeral_message_parameters,
        });
      } catch (e) {
        const eMsg = String(e);

        await ctx.reply(eMsg, {
          entities: [{
            offset: 0,
            length: eMsg.length,
            type: "pre",
            language: "js",
          }],
          reply_parameters,
          ephemeral_message_parameters,
        });
      }
    },
  );
