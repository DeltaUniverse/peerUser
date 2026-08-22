import { middleware } from "@middleware";

middleware.command("rich")
  .filter(
    (ctx) => {
      if (!ctx.msg.ephemeral_message_id) return false;
      if (!ctx.match) return false;

      return true;
    },
    async (ctx) => {
      try {
        await ctx.replyWithRichMessage({ markdown: ctx.match });
      } catch (e) {
        const eMsg = String(e);

        await ctx.reply(eMsg, {
          receiver_user_id: ctx.from?.id,
          reply_parameters: {
            ephemeral_message_id: ctx.msg.ephemeral_message_id,
          },
          entities: [{
            offset: 0,
            length: eMsg.length,
            type: "pre",
            language: "js",
          }],
        });
      }
    },
  );
