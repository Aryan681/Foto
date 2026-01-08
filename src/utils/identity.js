export const getIdentity = () => {
  const existing = localStorage.getItem("user_identity");
  if (existing) return JSON.parse(existing);

  const adjectives = ["Cool", "Swift", "Bright", "Zen", "Hyper"];
  const nouns = ["Pixel", "Coder", "User", "Gamer", "Foto"];
  const colors = ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa"];

  const newIdentity = {
    name: `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${
      nouns[Math.floor(Math.random() * nouns.length)]
    }`,
    color: colors[Math.floor(Math.random() * colors.length)],
  };

  localStorage.setItem("user_identity", JSON.stringify(newIdentity));
  return newIdentity;
}; 