import { middleware } from "@middleware";

const chatPermissions = {
  can_send_messages: true,
  can_send_audios: true,
  can_send_documents: true,
  can_send_photos: true,
  can_send_videos: true,
  can_send_video_notes: true,
  can_send_voice_notes: true,
  can_send_polls: true,
  can_send_other_messages: true,
  can_add_web_page_previews: true,
  can_react_to_messages: true,
  can_change_info: true,
  can_invite_users: true,
  can_edit_tag: true,
  can_pin_messages: true,
  can_manage_topics: true,
};

middleware.chatType("supergroup")
  .command("unmute")
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
      if (status === "member") return false;

      const member = await ctx.getChatMember(fromId);

      if (member.status === "creator") return true;

      if (member.status !== "administrator") return false;
      if (!member.can_restrict_members) return false;

      return true;
    },
    async (ctx) => {
      const replyMsg = ctx.msg.reply_to_message!;

      await Promise.all([
        ctx.restrictChatMember(replyMsg.from!.id, chatPermissions),
        ctx.reply("Unmuted", {
          entities: [{ offset: 0, length: 7, type: "bold" }],
          reply_parameters: { message_id: replyMsg.message_id },
          ephemeral_message_parameters: { receiver_user_id: ctx.from.id },
        }),
      ]);
    },
  );
