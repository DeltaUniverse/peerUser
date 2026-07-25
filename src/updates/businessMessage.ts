import { InlineKeyboard } from "grammy";

import { middleware } from "@middleware";

middleware.on("business_message")
  .filter(
    (ctx) => {
      if (ctx.from.is_bot) return false;
      if (ctx.msg.dice) return false;

      return true;
    },
  )
  .use(
    async (ctx) => {
      const { rights, user } = await ctx.getBusinessConnection();

      if (!rights?.can_delete_all_messages) return;

      const fromId = ctx.from.id;
      const userId = user.id;

      if (fromId === userId) return;

      const { api, msg } = ctx;

      const params = {
        reply_markup: new InlineKeyboard()
          .url("iOS", `https://t.me/@id${fromId}`).primary()
          .row()
          .url("Android", `tg://openmessage?user_id=${fromId}`).success(),
        entities: msg.entities,
        caption: msg.caption,
        caption_entities: msg.caption_entities,
      };

      if (msg.text) {
        await api.sendMessage(userId, msg.text, params);
      } else if (msg.sticker) {
        await api.sendSticker(userId, msg.sticker.file_id, params);
      } else if (msg.voice) {
        await api.sendVoice(userId, msg.voice.file_id, params);
      } else if (msg.video_note) {
        await api.sendVideoNote(userId, msg.video_note.file_id, params);
      } else if (msg.photo) {
        await api.sendPhoto(
          userId,
          msg.photo[msg.photo.length - 1].file_id,
          params,
        );
      } else if (msg.video) {
        await api.sendVideo(userId, msg.video.file_id, params);
      } else if (msg.animation) {
        await api.sendAnimation(userId, msg.animation.file_id, params);
      } else if (msg.document) {
        await api.sendDocument(userId, msg.document.file_id, params);
      } else if (msg.location) {
        const { latitude, longitude } = msg.location;

        if (msg.venue) {
          await api.sendVenue(
            userId,
            latitude,
            longitude,
            msg.venue.title,
            msg.venue.address,
            params,
          );
        } else {
          await api.sendLocation(userId, latitude, longitude, params);
        }
      } else if (msg.contact) {
        await api.sendContact(
          userId,
          msg.contact.phone_number,
          msg.contact.first_name,
          params,
        );
      } else if (msg.audio) {
        await api.sendAudio(userId, msg.audio.file_id, params);
      } else {
        return;
      }

      await ctx.deleteBusinessMessages([msg.message_id]);
    },
  );
