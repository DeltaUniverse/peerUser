import { InlineKeyboard } from "grammy";

import { middleware } from "@middleware";
import { paste } from "@utils";

middleware.command("j")
  .use(
    async (ctx) => {
      const { update_id: _, ...updateMsg } = ctx.update;

      let message = JSON.stringify(updateMsg, null, 2);
      let reply_markup = undefined;

      if (message.length > 3072) {
        const url = await paste(message);

        if (url) {
          message = `${message.slice(0, 2048)} ...`;
          reply_markup = new InlineKeyboard()
            .url("...", `${url}.json`);
        } else {
          message = `${message.slice(0, 3072)} ...`;
        }
      }

      await ctx.reply(message, {
        entities: [{
          offset: 0,
          length: message.length,
          type: "pre",
          language: "json",
        }],
        reply_parameters: { message_id: ctx.msgId },
        reply_markup,
      });
    },
  );
