import { middleware } from "@middleware";

middleware.chatType("supergroup")
  .command("kick")
  .filter(
    async (ctx) => {
      if (!ctx.msg.ephemeral_message_id) return false;

      const replyMsg = ctx.msg.reply_to_message;

      if (!replyMsg) return false;
      if (!replyMsg.from) return false;

      const userId = replyMsg.from.id;
      const fromId = ctx.from.id;

      if (userId === fromId) return false;
      if (userId === ctx.me.id) return false;

      const { status } = await ctx.getChatMember(userId);

      if (status === "administrator") return false;
      if (status === "creator") return false;
      if (status === "left") return false;

      const member = await ctx.getChatMember(fromId);

      if (member.status === "creator") return true;

      if (member.status !== "administrator") return false;
      if (!member.can_restrict_members) return false;

      return true;
    },
    async (ctx) => {
      const replyMsg = ctx.msg.reply_to_message!;

      await Promise.all([
        ctx.unbanChatMember(replyMsg.from!.id),
        ctx.reply("Kicked", {
          receiver_user_id: ctx.from.id,
          reply_parameters: { message_id: replyMsg.message_id },
        }),
      ]);
    },
  );
