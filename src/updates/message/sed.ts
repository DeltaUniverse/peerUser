import { InlineKeyboard } from "grammy";

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
        const startMs = performance.now();
        const newMsg = oldMsg.replace(regExp, ctx.match[2]) || "\u2060";
        const deltaMs = fmtMs(performance.now() - startMs);

        await ctx.reply(newMsg, {
          reply_markup: new InlineKeyboard()
            .disabled(deltaMs),
          reply_parameters: { message_id: replyMsg.message_id },
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
          reply_parameters: { message_id: ctx.msgId },
        });
      }
    },
  );

function fmtMs(ms: number): string {
  if (ms >= 1000) return `${subEnd(ms / 1000)} s`;
  if (ms >= 1) return `${subEnd(ms)} ms`;

  return `${subEnd(ms * 1000)} μs`;
}

function subEnd(n: number): string {
  return n.toFixed(2).replace(/\.?0+$/, "");
}
