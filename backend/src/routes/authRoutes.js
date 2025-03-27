import express from 'express';
const router = express.Router();

router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        error: "Email y contraseña requeridos" 
      });
    }

    res.json({ 
      success: true,
      message: "Login exitoso",
      user: { email }
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;