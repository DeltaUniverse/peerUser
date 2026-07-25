import { InlineKeyboard } from "grammy";

import { middleware } from "@middleware";

const msgText = `
Add to Channel
• Remove New Subscribers

Add to Group
• Reply with Ephemeral Message
• Sed

Add to Chat Automation
• Delete New Private Messages
`;

middleware.chatType("private")
  .command("start")
  .use(
    async (ctx) => {
      const meUsername = ctx.me.username;

      await Promise.all([
        ctx.deleteMessage(),
        ctx.reply(msgText, {
          reply_markup: new InlineKeyboard()
            .url(
              "Add to Channel",
              `https://t.me/${meUsername}?startchannel&admin=restrict_members`,
            )
            .url(
              "Add to Group",
              `https://t.me/${meUsername}?startgroup&admin=manage_chat`,
            )
            .row()
            .url("Add to Chat Automation", "tg://settings/edit"),
        }),
      ]);
    },
  );
