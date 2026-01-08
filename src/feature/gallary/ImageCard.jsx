import { getIdentity } from "../../utils/identity";

const handleQuickReact = (e) => {
  e.stopPropagation();
  const identity = getIdentity(); // ✅ Get persistent identity

  db.transact(
    db.tx.interactions[id()].update({
      imageId: img.id,
      type: "emoji",
      emoji: "💖",
      user: identity.name,       // ✅ Use readable name
      userColor: identity.color, // ✅ Store color for UI consistency
      createdAt: Date.now(),
    })
  );
};