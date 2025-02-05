const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');

// Middleware do weryfikacji tokena z CIASTECZKA
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
}

// Middleware sprawdzający, czy użytkownik jest adminem
function isAdmin(req, res, next) {
  if (!req.user || !req.user.admin) {
    return res.status(403).send('Access denied. Admins only.');
  }
  next();
}

module.exports = { verifyToken, isAdmin };

// dotenv.config();
// const jwt = require('jsonwebtoken');

// // Middleware do weryfikacji tokena
// function verifyToken(req, res, next) {
//     const token = localStorage.getItem('token'); // Pobranie nagłówka Authorization
//     if (!token) {
//         return res.status(401).send('No token provided');
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Weryfikacja tokena
//         req.user = decoded; // Przypisanie danych użytkownika z tokena do req.user
//         next(); // Przejście do kolejnego middleware/obsługi trasy
//     } catch (err) {
//         return res.status(403).send('Invalid token');
//     }
// }

// function isAdmin(req, res, next) {
//     if (!req.user || !req.user.admin) {
//         return res.status(403).send('Access denied. Admins only.');
//     }
//     next();
// }

// module.exports = {verifyToken ,isAdmin} ; 










