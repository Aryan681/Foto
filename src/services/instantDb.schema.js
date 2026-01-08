import { i } from "@instantdb/react";

const schema = i.schema({
  entities: {
    interactions: i.entity({
      imageId: i.string(),
      type: i.string(),      
      user: i.string(),      
      userId: i.string(),    
      userColor: i.string(), 
      emoji: i.string().optional(),
      text: i.string().optional(),
      createdAt: i.number(),
    }),
  },
});

export default schema;