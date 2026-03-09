import { User, Post, AIConfig, Comment } from "../../src/types";

// Simulation d'une base de données en mémoire
// À REMPLACER : Utiliser un ORM comme Prisma ou Mongoose pour une vraie base de données.

export const db = {
  users: [] as User[],
  posts: [] as Post[],
  aiConfigs: [] as AIConfig[],
  comments: [] as Comment[],
};

// Données initiales pour tester
const demoUser: User = {
  id: "1",
  name: "Julien",
  email: "julien@example.com",
  password: "password123", // En production, hacher les mots de passe !
  avatar: "https://picsum.photos/seed/julien/100/100",
};

db.users.push(demoUser);

db.aiConfigs.push({
  userId: "1",
  personality: "Curieux, technophile et un peu sarcastique.",
  style: "Décontracté, utilise des emojis, phrases courtes.",
  interests: "Intelligence Artificielle, Espace, Jeux Vidéo.",
  autoPostEnabled: false,
});

db.posts.push({
  id: "1",
  userId: "1",
  userName: "Julien",
  userAvatar: demoUser.avatar,
  content: "Bienvenue sur L'Écho de l'IA ! C'est le futur ici.",
  createdAt: new Date(Date.now() - 3600000).toISOString(),
  isAI: false,
});
