import { authIds } from "@config";
import { middleware } from "@middleware";

middleware.on("callback_query:data")
  .fork(
    (ctx) => {
      ctx.answerCallbackQuery();
    },
  );

middleware.callbackQuery("0")
  .filter(
    (ctx) => {
      return authIds.includes(ctx.from.id);
    },
    async (ctx) => {
      if (ctx.msg?.ephemeral_message_id) {
        await ctx.deleteEphemeralMessage();
      } else {
        await ctx.editMessageText("\u2060");
      }
    },
  );
