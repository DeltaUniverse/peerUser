import { InlineKeyboard } from "grammy";

import { middleware } from "@middleware";

const msgText = `
*Channel*
 • Ban-Unban Chat Member

*Group*
 • Reply with Ephemeral Message
 • Sed

*Chat Automation*
 • Delete Business Messages

\\[ *[Source](https://github.com/DeltaUniverse/peerUser)* \\]
`;

middleware.chatType("private")
  .command("start")
  .use(
    async (ctx) => {
      const meUsername = ctx.me.username;

      await Promise.all([
        ctx.deleteMessage(),
        ctx.reply(msgText, {
          link_preview_options: { is_disabled: true },
          reply_markup: new InlineKeyboard()
            .url(
              "Channel",
              `https://t.me/${meUsername}?startchannel&admin=restrict_members`,
            )
            .url(
              "Group",
              `https://t.me/${meUsername}?startgroup&admin=manage_chat`,
            )
            .row()
            .url("Chat Automation", "tg://settings/edit"),
          parse_mode: "MarkdownV2",
        }),
      ]);
    },
  );
