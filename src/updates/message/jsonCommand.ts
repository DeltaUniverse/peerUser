import { InlineKeyboard } from "grammy";

import { middleware } from "@middleware";
import { paste } from "@utils";

middleware.command("json", async (ctx) => {
  const { update_id: _, ...updateObject } = ctx.update;

  let updateString = JSON.stringify(updateObject, null, 1);
  let reply_markup = undefined;

  if (updateString.length > 2048) {
    const url = await paste(updateString);

    if (url) {
      updateString = `${updateString.slice(0, 1024)} ...`;
      reply_markup = new InlineKeyboard().url("...", `${url}.json`);
    } else {
      updateString = `${updateString.slice(0, 3072)} ...`;
    }
  }

  await ctx.reply(updateString, {
    reply_parameters: { message_id: ctx.msgId },
    entities: [{
      offset: 0,
      length: updateString.length,
      type: "pre",
      language: "json",
    }],
    reply_markup,
  });
});
