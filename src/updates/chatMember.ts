import { middleware } from "@middleware";

middleware.chatType("channel")
  .on("chat_member")
  .filter(
    (ctx) => {
      return ctx.chatMember.new_chat_member.status === "member";
    },
    async (ctx) => {
      await ctx.unbanChatMember(ctx.chatMember.new_chat_member.user.id);
    },
  );
