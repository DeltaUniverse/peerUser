import { middleware } from "@middleware";

middleware.hears(/^s\/(.+?)\/(.*?)(?:\/([a-z]*))?$/)
  .filter(
    (ctx) => {
      const replyMsg = ctx.msg.reply_to_message;

      if (!replyMsg) return false;
      if (!replyMsg.text && !replyMsg.caption) return false;

      return true;
    },
    async (ctx) => {
      const replyMsg = ctx.msg.reply_to_message!;
      const oldMsg = replyMsg.caption ?? replyMsg.text ?? "";

      try {
        const regExp = new RegExp(ctx.match[1], ctx.match[3] || "");
        const newMsg = oldMsg.replace(regExp, ctx.match[2]) || "\u2060";

        await ctx.reply(newMsg, {
          reply_parameters: { message_id: replyMsg.message_id },
        });
      } catch (e) {
        const eMsg = String(e);

        await ctx.reply(eMsg, {
          reply_parameters: { message_id: ctx.msgId },
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
