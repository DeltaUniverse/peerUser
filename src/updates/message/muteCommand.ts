import { middleware } from "@middleware";

const chatPermissions = {
  can_send_messages: false,
  can_send_audios: false,
  can_send_documents: false,
  can_send_photos: false,
  can_send_videos: false,
  can_send_video_notes: false,
  can_send_voice_notes: false,
  can_send_polls: false,
  can_send_other_messages: false,
  can_add_web_page_previews: false,
  can_react_to_messages: false,
  can_change_info: false,
  can_invite_users: false,
  can_edit_tag: false,
  can_pin_messages: false,
  can_manage_topics: false,
};

middleware.chatType("supergroup")
  .command("mute")
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
      if (status === "restricted") return false;

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
        ctx.reply("Muted", {
          receiver_user_id: ctx.from.id,
          reply_parameters: { message_id: replyMsg.message_id },
        }),
      ]);
    },
  );
