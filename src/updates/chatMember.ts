import { middleware } from "@middleware";

middleware.chatType("channel")
  .on("chat_member")
  .use(
    async (ctx) => {
      const member = ctx.chatMember.new_chat_member;

      if (member.status !== "member") return;

      const userId = member.user.id;

      await ctx.banChatMember(userId);
      await ctx.unbanChatMember(userId);
    },
  );
