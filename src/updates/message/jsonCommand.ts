import { InlineKeyboard } from "grammy";

import { middleware } from "@middleware";
import { paste } from "@utils";

middleware.command("json")
  .filter(
    (ctx) => {
      return !!ctx.msg.ephemeral_message_id;
    },
    async (ctx) => {
      const { update_id: _, ...updateObject } = ctx.update;

      let updateString = JSON.stringify(updateObject, null, 1);
      let reply_markup = undefined;

      if (updateString.length > 2048) {
        const url = await paste(updateString);

        if (url) {
          updateString = `${updateString.slice(0, 1024)} ...`;
          reply_markup = new InlineKeyboard().url("...", url);
        } else {
          updateString = `${updateString.slice(0, 3072)} ...`;
        }
      }

      await ctx.reply(updateString, {
        reply_parameters: {
          ephemeral_message_id: ctx.msg.ephemeral_message_id,
        },
        entities: [{
          offset: 0,
          length: updateString.length,
          type: "pre",
          language: "json",
        }],
        receiver_user_id: ctx.from!.id,
        reply_markup,
      });
    },
  );
