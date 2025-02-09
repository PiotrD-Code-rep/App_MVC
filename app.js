const dotenv = require('dotenv');
dotenv.config();
process.env.TZ = 'Europe/Warsaw';
const express = require('express');
const morgan = require('morgan');
const mongoose=require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
// const {verifyToken ,isAdmin } = require('./middleware/auth')
const expressHandlebars = require("express-handlebars");
const {setUser} = require('./Backend/middleware/auth');

//Middleware
app.use(express.json()); //Zamiast bodyparser w Express 5 (Zalecany)
app.use(morgan('tiny')); //express.logger w starszych wresja Express zalecany morgan
app.use(cors({
  origin: ['http://127.0.0.1:3000/', 'http://localhost:3000/','http://127.0.0.1:3000', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

//Statyczne pliki
app.use(express.static(path.join(__dirname, 'public')));



//Konfiguracja Express Handlebars
const handlebars = expressHandlebars.create({
  defaultLayout: "main",
  extname: ".hbs", // Dopasowane do plików w folderze
  layoutsDir: path.join(__dirname, "./Backend/views/layouts"),
});

app.engine("hbs", handlebars.engine); // Rejestracja silnika widoków
app.set("views", path.join(__dirname, "./Backend/views")); // Ustawienie folderu z widokami
app.set("view engine", "hbs"); // Ustawienie Handlebars jako domyślnego silnika widoków


//Middleware do przekazywania danych o użytkowniku
app.use(setUser);
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});


//Tarasy API
const KatygorieTrasa=require('./Backend/routes/KatygorieRoutes');
app.use('/api',KatygorieTrasa);
const ProduktyTrasa=require('./Backend/routes/ProduktyRoutes');
app.use('/api',ProduktyTrasa);
const UzytkownicyTasa=require('./Backend/routes/UzytkowicyRoutes');
app.use('/api',UzytkownicyTasa);
const TransakcjeTasa=require('./Backend/routes/TransakacjeRoutes');
app.use('/api',TransakcjeTasa);
const ZamowienieTasa=require('./Backend/routes/ZamowienieRoutes');
app.use('/api',ZamowienieTasa);


// Trasy do Strony
const HomeTasa=require('./Backend/routes/HomeRoutes');
app.use('/',HomeTasa);
const OrdersTasa=require('./Backend/routes/OrdersRoutes');
app.use('/Orders',OrdersTasa);
const AdminTasa=require('./Backend/routes/AdminPanelRoutes');
app.use('/',AdminTasa);


//Schemat bazy danych
// const ProduktyModel=require('./models/Produkty');
// const KatygorieModel=require('./models/Katygorie');
// const UzytkownicyModel=require('./models/Uzytkownicy');
// const TransakcjeModel=require('./models/Transakcje');
// const Zamowienie_PozycjaModel=require('./models/Zamowienie_Pozycja');





mongoose.connect(process.env.MONGO,{
})
 .then(()=>{
   console.log('Udalo sie polaczyc z baza danych');
 })
 .catch((err)=>{
  console.log(err);
 })

app.listen(process.env.PORT_SERVER, () => {
  console.log(`Example app listening on port http://localhost:${process.env.PORT_SERVER}`);
  console.log('Lokalny czas:', new Date().toString());
})