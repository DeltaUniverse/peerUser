import { userIds } from "@config";
import { middleware } from "@middleware";

middleware.callbackQuery("0")
  .filter(
    (ctx) => {
      return userIds.includes(ctx.from.id);
    },
  )
  .use(
    async (ctx) => {
      if (ctx.msg?.ephemeral_message_id) {
        await ctx.deleteEphemeralMessage();
      } else {
        await ctx.editMessageText("\u2060");
      }
    },
  );
