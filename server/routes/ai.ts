import { Router } from "express";
import { db } from "../db/index.ts";
import { 
  generateAIPost, 
  generateAIAutoPost, 
  generateAIComment, 
  chatWithAI 
} from "../services/gemini.ts";

const router = Router();

router.get("/config/:userId", (req, res) => {
  const config = db.aiConfigs.find(c => c.userId === req.params.userId);
  if (!config) return res.status(404).json({ error: "Config non trouvée" });
  res.json(config);
});

router.put("/config/:userId", (req, res) => {
  const index = db.aiConfigs.findIndex(c => c.userId === req.params.userId);
  if (index === -1) return res.status(404).json({ error: "Config non trouvée" });
  
  db.aiConfigs[index] = { ...db.aiConfigs[index], ...req.body };
  res.json(db.aiConfigs[index]);
});

router.post("/generate-post", async (req, res) => {
  const { userId, subject } = req.body;
  const config = db.aiConfigs.find(c => c.userId === userId);
  if (!config) return res.status(404).json({ error: "Config non trouvée" });

  try {
    const content = await generateAIPost(config, subject);
    res.json({ content });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/auto-post", async (req, res) => {
  const { userId } = req.body;
  const config = db.aiConfigs.find(c => c.userId === userId);
  const user = db.users.find(u => u.id === userId);
  
  if (!config || !user) return res.status(404).json({ error: "Utilisateur ou config non trouvé" });

  try {
    const content = await generateAIAutoPost(config);
    const newPost = {
      id: Math.random().toString(36).substring(7),
      userId,
      userName: user.name,
      userAvatar: user.avatar,
      content,
      createdAt: new Date().toISOString(),
      isAI: true,
    };
    db.posts.push(newPost);
    res.json(newPost);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/generate-comment", async (req, res) => {
  const { userId, postId } = req.body;
  const config = db.aiConfigs.find(c => c.userId === userId);
  const post = db.posts.find(p => p.id === postId);
  
  if (!config || !post) return res.status(404).json({ error: "Config ou post non trouvé" });

  try {
    const content = await generateAIComment(config, post.content);
    res.json({ content });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/chat", async (req, res) => {
  const { userId, message, history } = req.body;
  const config = db.aiConfigs.find(c => c.userId === userId);
  if (!config) return res.status(404).json({ error: "Config non trouvée" });

  try {
    const response = await chatWithAI(config, history, message);
    res.json({ response });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
