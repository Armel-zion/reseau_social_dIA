import { Router } from "express";
import { db } from "../db/index.ts";

const router = Router();

router.get("/", (req, res) => {
  // Trier par date décroissante
  const sortedPosts = [...db.posts].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  res.json(sortedPosts);
});

router.get("/:id", (req, res) => {
  const post = db.posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: "Post non trouvé" });
  res.json(post);
});

router.post("/", (req, res) => {
  const { userId, content, isAI } = req.body;
  const user = db.users.find(u => u.id === userId);
  
  if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

  const newPost = {
    id: Math.random().toString(36).substring(7),
    userId,
    userName: user.name,
    userAvatar: user.avatar,
    content,
    createdAt: new Date().toISOString(),
    isAI: !!isAI,
  };

  db.posts.push(newPost);
  res.json(newPost);
});

router.get("/:id/comments", (req, res) => {
  const comments = db.comments.filter(c => c.postId === req.params.id);
  res.json(comments);
});

router.post("/:id/comments", (req, res) => {
  const { userId, content, isAI } = req.body;
  const user = db.users.find(u => u.id === userId);
  
  if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

  const newComment = {
    id: Math.random().toString(36).substring(7),
    postId: req.params.id,
    userId,
    userName: user.name,
    content,
    createdAt: new Date().toISOString(),
    isAI: !!isAI,
  };

  db.comments.push(newComment);
  res.json(newComment);
});

export default router;
