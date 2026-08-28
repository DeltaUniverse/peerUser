import { InlineKeyboard } from "grammy";

import { middleware } from "@middleware";

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
        entities: [{
          offset: 0,
          length: updateString.length,
          type: "pre",
          language: "json",
        }],
        reply_markup,
        reply_parameters: {
          ephemeral_message_id: ctx.msg.ephemeral_message_id,
        },
        ephemeral_message_parameters: { receiver_user_id: ctx.from!.id },
      });
    },
  );

async function paste(body: string): Promise<string | null> {
  const apiUrl = "https://paste.rs";

  try {
    const resp = await fetch(apiUrl, { method: "POST", body });

    if (!resp.ok) return null;

    const url = (await resp.text()).trim();

    return url.startsWith(apiUrl) ? url : null;
  } catch {
    return null;
  }
}
