const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');

const createAccessToken = (_id,admin)=> {
    return jwt.sign({_id: _id, admin: admin}, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '4h',
    });
  };
  

// Funkcja do wysyłania tokena w ciasteczku
const sendAccessToken = (res, token) => {
  // Ustawiamy ciasteczko 'token'
  res.cookie('token', token, {
    httpOnly: true,       // ciasteczko niewidoczne w JS (zwiększa bezpieczeństwo przed XSS)
    sameSite: 'none',     // jeśli front i backend są na różnych domenach/portach
    secure: true,        // ustaw na true, jeśli używasz HTTPS (np. w produkcji)
    maxAge: 14400000,   
    path: '/',       // 1 godzina w milisekundach
  });
  
  // Odpowiadamy klientowi np. komunikatem o sukcesie
  res.status(200).json({ message: 'Zalogowano pomyślnie' });
};
module.exports={createAccessToken,sendAccessToken};