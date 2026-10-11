// Only catalogued local assets can be rendered from a chat message.
export const stickers = [
  { id: 'happy-cat', vi: 'Mèo quẩy', en: 'Happy cat', file: 'happy-cat.gif', source: 'https://tenor.com/view/cat-dance-happy-dance-cat-gif-8638417088064838099' },
  { id: 'bongo-heart', vi: 'Thả tim', en: 'Sending love', file: 'bongo-heart.gif', source: 'https://tenor.com/view/bongo-cat-heart-gif-25862429' },
  { id: 'super-bongo', vi: 'Bongo tới bến', en: 'Super Bongo', file: 'super-bongo.gif', source: 'https://tenor.com/view/super-bongo-gif-25624523' },
  { id: 'dancing-duck', vi: 'Vịt nhảy', en: 'Dancing duck', file: 'dancing-duck.gif', source: 'https://tenor.com/view/pato-duck-dance-baile-heppy-gif-23096094' },
  { id: 'seal-clap', vi: 'Vỗ tay nào', en: 'Round of applause', file: 'seal-clap.gif', source: 'https://tenor.com/view/seal-clap-clapping-claps-congrats-gif-22580768' },
] as const;
export type Sticker = typeof stickers[number];
export function stickerMessage(sticker: Sticker): string { return `[sticker:${sticker.id}]`; }
export function parseSticker(text: string): Sticker | undefined {
  return stickers.find(sticker => stickerMessage(sticker) === text);
}
