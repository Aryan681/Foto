import { i } from "@instantdb/react";

const schema = i.schema({
  entities: {
    interactions: i.entity({
      imageId: i.string(),
      type: i.string(),      // 'emoji' or 'comment'
      user: i.string(),      // Readable name
      userColor: i.string(), // Persistent color
      emoji: i.string().optional(),
      text: i.string().optional(),
      createdAt: i.number(),
    }),
  },
});

export default schema;