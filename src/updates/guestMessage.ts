import { InlineKeyboard, InlineQueryResultBuilder } from "grammy";

import { authIds, kv, secretToken } from "@config";
import { middleware } from "@middleware";
import { aEval, fmtMs, paste, toStr } from "@utils";

middleware.chatType("supergroup")
  .on("guest_message")
  .filter(
    (ctx) => {
      return authIds.includes(ctx.from.id);
    },
    async (ctx) => {
      let input = ctx.msg.caption ?? ctx.msg.text ?? "";

      if (!input.endsWith(";")) return;

      const tag = `@${ctx.me.username}`.toLowerCase();

      if (input.toLowerCase().startsWith(tag)) {
        input = input.slice(tag.length).trimStart();
      }

      const inlineMsg = await ctx.answerGuestQuery(
        InlineQueryResultBuilder.article("0", "0").text("..."),
      );

      let output;
      const startMs = performance.now();

      try {
        output = await aEval(input, {
          kv,
          ctx,
          api: ctx.api,
          raw: ctx.api.raw,
          msg: ctx.msg,
          replyMsg: ctx.msg.reply_to_message,
          inlineMsg,
        });

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
        inlineMsg.inline_message_id,
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
