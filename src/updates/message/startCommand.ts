import { InlineKeyboard } from "grammy";

import { middleware } from "@middleware";

const msgText = `
*Channel*
  • Remove New Chat Member
    Auto\\-Remove New Subscribers

*Chat Automation \\(Enabled __Manage Messages__\\)*
  • Delete Business Messages
    Auto\\-Delete New Incoming PMs

*Group*
  Administrators with __Ban Users__ Rights:
    • Ban \\(Ban Chat Member\\)
      Reply to Member with /ban

    • Kick \\(Remove Chat Member\\)
      Reply to Member with /kick

    • Mute \\(Restrict Chat Member\\)
      Reply to Member with /mute

    • Unban \\(Unban Chat Member\\)
      Reply to Member with /unban

    • Unmute \\(Unrestrict Chat Member\\)
      Reply to Member with /unmute

  All Members:
    • Whisper \\(Send Ephemeral Message\\)
      Reply to User with /whisper and Message Text

  Notes:
    All Commands is __Ephemeral Command__

*Private/Group*
  • JSON \\(Message Object as JSON\\)
    Send/Reply to Message with /json

  • Rich \\(Rich Text Editor\\)
    Send /rich with Markdown/HTML Format Text

  • Sed
    Reply to Content with sed Command
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
          `https://t.me/${meUsername}?startgroup&admin=restrict_members+invite_users`,
        )
        .row()
        .url("Chat Automation", "tg://settings/edit"),
      parse_mode: "MarkdownV2",
    });
  });
