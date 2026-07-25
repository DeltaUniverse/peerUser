import { InlineKeyboard, InlineQueryResultBuilder } from "grammy";

import { secretToken, userIds } from "@config";
import { middleware } from "@middleware";
import { aEval, fmtMs, paste, toStr } from "@utils";

middleware.chatType("supergroup")
  .on("guest_message")
  .filter(
    (ctx) => {
      return userIds.includes(ctx.from.id);
    },
  )
  .use(
    async (ctx) => {
      let input = ctx.msg.caption ?? ctx.msg.text ?? "";

      if (!input.endsWith(";")) return;

      const tag = `@${ctx.me.username}`.toLowerCase();

      if (input.toLowerCase().startsWith(tag)) {
        input = input.slice(tag.length).trimStart();
      }

      const { inline_message_id: iMsgId } = await ctx.answerGuestQuery(
        InlineQueryResultBuilder.article("0", "0").text("..."),
      );

      let output;

      const startMs = performance.now();

      try {
        output = await aEval(input, { ctx, iMsgId });

        if (input.endsWith("return;")) return;
      } catch (e) {
        output = String(e);
      }

      const deltaMs = fmtMs(performance.now() - startMs);

      output = toStr(output);
      output = output.replaceAll(secretToken, "********");

      const reply_markup = new InlineKeyboard();

      if (output.length > 2048) {
        const url = await paste(output);

        if (url) {
          output = `${output.slice(0, 1024)} ...`;
          reply_markup.url("...", url).row();
        } else {
          output = `${output.slice(0, 3072)} ...`;
        }
      }

      reply_markup.switchInlineCurrent(">_", `\n${input}`).text("_<", "0");

      await ctx.api.editMessageTextInline(
        iMsgId,
        `${output}\n${deltaMs}`,
        {
          entities: [
            { offset: 0, length: output.length, type: "pre", language: "js" },
            { offset: output.length + 1, length: deltaMs.length, type: "bold" },
          ],
          reply_markup,
        },
      );
    },
  );
