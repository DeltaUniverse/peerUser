import type { Context } from "grammy";

import { middleware } from "@middleware";

middleware.chatType("channel")
  .on("my_chat_member")
  .filter(
    (ctx) => {
      const member = ctx.myChatMember.new_chat_member;

      if (member.status !== "administrator") return true;
      if (!member.can_restrict_members) return true;

      return false;
    },
    leaveChat,
  );

middleware.chatType("supergroup")
  .on("my_chat_member")
  .filter(
    (ctx) => {
      const member = ctx.myChatMember.new_chat_member;

      if (member.status !== "administrator") return true;
      if (!member.can_restrict_members) return true;
      if (!member.can_invite_users) return true;

      return false;
    },
    leaveChat,
  );

async function leaveChat(ctx: Context) {
  await ctx.leaveChat();
}
