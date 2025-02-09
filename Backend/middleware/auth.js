const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');

function setUser(req, res, next) {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded;
    } catch (err) {
      console.error('Błąd weryfikacji tokena:', err);
      res.clearCookie('token');
    }
  }
  next();
};

function forceToLogin(req, res, next) {
  if (req.user) {
    return next();
  } else {
    return res.redirect('/login?next=' + encodeURIComponent(req.originalUrl));
  }
}

function verifyToken(req, res, next) {
  
  // Odczytujemy token z ciasteczka (np. 'token')
  const token = req.cookies.token; 
  if (!token) {
    return res.status(401).send('No token provided');
  }
  
  try {
    // Weryfikacja tokena
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).send('Invalid token');
  }
};

function isAdmin(req, res, next) {
  if (!req.user || !req.user.admin) {
    return res.status(403).send('Access denied. Admins only.');
  }
  next();
};

module.exports = { verifyToken, isAdmin ,setUser,forceToLogin };











