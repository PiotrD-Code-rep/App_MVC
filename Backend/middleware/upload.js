const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Obecne __dirname wskazuje na: C:\Users\Piotr\Desktop\App_MVC\Backend\middleware
// Aby dostać się do: C:\Users\Piotr\Desktop\App_MVC\public\uploads
// przechodzimy o dwa poziomy w górę, a następnie do public/uploads:
const uploadFolder = path.join(__dirname, '..', '..', 'public', 'uploads');

// Upewnij się, że folder uploadFolder istnieje:
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // limit 5MB
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Nieprawidłowy typ pliku. Dozwolone są tylko obrazy.'), false);
    }
  }
});

module.exports = upload;

