import { Router } from "express";
import { db } from "../db/index.ts";

const router = Router();

// À REMPLACER : Utiliser un vrai système d'authentification (JWT, Firebase Auth, etc.)

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  
  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ error: "Cet email est déjà utilisé." });
  }

  const newUser = {
    id: Math.random().toString(36).substring(7),
    name,
    email,
    password,
    avatar: `https://picsum.photos/seed/${name}/100/100`,
  };

  db.users.push(newUser);
  
  // Créer une config IA par défaut
  db.aiConfigs.push({
    userId: newUser.id,
    personality: "Amical et serviable.",
    style: "Simple et clair.",
    interests: "Généraliste.",
    autoPostEnabled: false,
  });

  const { password: _, ...userWithoutPassword } = newUser;
  res.json(userWithoutPassword);
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: "Identifiants invalides." });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

export default router;
