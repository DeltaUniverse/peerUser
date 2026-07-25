import { middleware } from "@middleware";

middleware.command("rm")
  .filter(
    (ctx) => {
      return !!ctx.match;
    },
  )
  .use(
    async (ctx) => {
      const reply_parameters = { message_id: ctx.msgId };

      try {
        await ctx.replyWithRichMessage({ markdown: ctx.match }, {
          reply_parameters,
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
        });
      }
    },
  );
