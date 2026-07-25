import { InlineKeyboard } from "grammy";

import { middleware } from "@middleware";

const iMsg = `( /j ): JSON => {
  Show JSON
};

( /em ): ephemeralMessage => {
  Send Ephemeral Message

  e.g.,
    Reply to User Message &&
    /em "Hello, World!"
};

( /rm ): richMessage => {
  Send Rich Message

  e.g.,
    /rm <b>"Hello World!"</b> ||
    /rm **"Hello, World!"**
};

( s/(.+)/$1/flag ): Sed => {
  Replace Content

  /* Reply to Message */
};`;

middleware.chatType("supergroup")
  .command(
    "i",
    async (ctx) => {
      await ctx.reply(iMsg, {
        reply_markup: new InlineKeyboard()
          .url("Start Me", `https://t.me/${ctx.me.username}`),
        reply_parameters: { message_id: ctx.msgId },
      });
    },
  );
