import { InlineKeyboard } from "grammy";

import { middleware } from "@middleware";

const animationFileId =
  "CgACAgQAAyEFAAMBAsnPlgAD9mphFJ44IyUflPYlgHWFAAEi5TvHfgACLQ4AAk6ySFBWQ49JzIi9mj0E";

middleware.chatType("private")
  .command("start")
  .use(
    async (ctx) => {
      const meUsername = ctx.me.username;

      await Promise.all([
        ctx.deleteMessage(),
        ctx.replyWithAnimation(animationFileId, {
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
