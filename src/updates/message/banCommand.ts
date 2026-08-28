import { middleware } from "@middleware";

middleware.chatType("supergroup")
  .command("ban")
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

      if (replyMsg.sender_chat) return false;

      const { status } = await ctx.getChatMember(userId);

      if (status === "administrator") return false;
      if (status === "creator") return false;
      if (status === "kicked") return false;

      const member = await ctx.getChatMember(fromId);

      if (member.status === "creator") return true;

      if (member.status !== "administrator") return false;
      if (!member.can_restrict_members) return false;

      return true;
    },
    async (ctx) => {
      const replyMsg = ctx.msg.reply_to_message!;

      await Promise.all([
        ctx.banChatMember(replyMsg.from!.id),
        ctx.reply("Banned", {
          entities: [{ offset: 0, length: 6, type: "bold" }],
          reply_parameters: { message_id: replyMsg.message_id },
          ephemeral_message_parameters: { receiver_user_id: ctx.from.id },
        }),
      ]);
    },
  );
