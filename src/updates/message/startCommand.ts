import { InlineKeyboard } from "grammy";

import { middleware } from "@middleware";

const msgText = `
*Channel*
  • Ban\\-Unban Chat Member \\(Auto\\)

*Chat Automation*
  • Delete Business Messages

*Group*
  • Ban
  • Kick
  • Mute
  • Unban
  • Unmute
  • Whisper

*Private/Group*
  • JSON 
  • Rich
  • Sed
`;

middleware.chatType("private")
  .command("start", async (ctx) => {
    const meUsername = ctx.me.username;

    await ctx.reply(msgText, {
      link_preview_options: {
        url: "https://github.com/DeltaUniverse/peerUser",
        prefer_small_media: true,
        show_above_text: true,
      },
      reply_markup: new InlineKeyboard()
        .url(
          "Channel",
          `https://t.me/${meUsername}?startchannel&admin=restrict_members`,
        )
        .url(
          "Group",
          `https://t.me/${meUsername}?startgroup&admin=restrict_members`,
        )
        .row()
        .url("Chat Automation", "tg://settings/edit"),
      parse_mode: "MarkdownV2",
    });
  });
