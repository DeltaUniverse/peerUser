import { InlineKeyboard } from "grammy";

import { userIds } from "@config";
import { middleware } from "@middleware";
import { aEval, fmtMs, paste, toStr } from "@utils";

middleware.chatType("supergroup")
  .command("_")
  .filter(
    (ctx) => {
      if (!userIds.includes(ctx.from.id)) return false;
      if (!ctx.msg.ephemeral_message_id) return false;
      if (!ctx.match) return false;

      return true;
    },
    async (ctx) => {
      const ephemeralMsg = await ctx.reply("...", {
        reply_parameters: {
          ephemeral_message_id: ctx.msg.ephemeral_message_id,
        },
        receiver_user_id: ctx.from.id,
      });

      let output;

      const startMs = performance.now();

      try {
        output = await aEval(ctx.match, {
          ctx,
          api: ctx.api,
          raw: ctx.api.raw,
          msg: ctx.msg,
          replyMsg: ctx.msg.reply_to_message,
          ephemeralMsg,
        });

        if (ctx.match.endsWith("return")) return;
      } catch (e) {
        output = String(e);
      }

      const deltaMs = fmtMs(performance.now() - startMs);

      const reply_markup = new InlineKeyboard();

      output = toStr(output);

      if (output.length > 512) {
        const url = await paste(output);

        if (url) {
          output = `${output.slice(0, 256)} ...`;
          reply_markup.url("...", url);
        } else {
          output = `${output.slice(0, 768)} ...`;
        }
      }

      reply_markup.text("\u2060", "0").danger();

      await ctx.api.editEphemeralMessageText(
        ctx.chatId,
        ctx.from.id,
        ephemeralMsg.ephemeral_message_id!,
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
