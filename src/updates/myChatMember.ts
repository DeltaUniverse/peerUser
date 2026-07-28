import { middleware } from "@middleware";

middleware.on("my_chat_member")
  .filter(
    (ctx) => {
      const member = ctx.myChatMember.new_chat_member;

      if (member.status !== "administrator") return true;
      if (!member.can_restrict_members) return true;

      return false;
    },
    async (ctx) => {
      await ctx.leaveChat();
    },
  );
