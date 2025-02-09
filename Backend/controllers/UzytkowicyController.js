const Uzytkownicy= require("../models/UzytkownicyModel");
const bcrypt= require('bcryptjs');
const {sendAccessToken, createAccessToken} = require('../helpers/token');

//api/users
const getAllUserAPI = async(req,res)=>{
    try{
        const uzytkownicy = await Uzytkownicy.find().select('-haslo');
        if (uzytkownicy){
            return res.status(200).json(uzytkownicy);
        } else{
            return res.status(404).json({ success: false, message: 'Nie znaleziono użytkowników.' });
        }
    }catch (err){
        return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
};

const getUserIdAPI = async (req, res) => {
    try{
        const uzytkownik = await Uzytkownicy.findById(req.params.id).select('-haslo');
        if (uzytkownik){
            return res.status(200).json(uzytkownik);
        } else{
            return res.status(404).json({ success: false, message: 'Nie znaleziono użytkownika o podanym ID.' });
        }
    }catch (err){
        return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
};

const postCreateUserAPI = async (req, res) => {
    try{
        const { imie, nazwisko, email, haslo } = req.body;
        // Sprawdzenie wymaganych pól
        if (!imie || !nazwisko || !email || !haslo){
            return res.status(400).json({ message: 'Pola "imie", "nazwisko", "email", "haslo" są wymagane.' });
        }

        // Sprawdzenie, czy użytkownik o podanym email już istnieje
        const existUzytkownik = await Uzytkownicy.findOne({ email });
        if (existUzytkownik) {
            return res.status(400).json({ message: 'Użytkownik o podanym email już istnieje.' });
        }
        // Hashowanie hasła
        const hashHaslo = await bcrypt.hash(haslo, 10);
        const newUzytkownik = new Uzytkownicy({
            imie,
            nazwisko,
            email,
            haslo: hashHaslo,
        });

        const savedUzytkownik = await newUzytkownik.save();
        if (savedUzytkownik){
            const userObj = savedUzytkownik.toObject();
            delete userObj.haslo;
            return res.status(201).json(userObj);
        } else{
            return res.status(400).json({ success: false, message: 'Nie udało się dodać użytkownika.' });
        }
    }catch (err){
        return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
};

const putUpdateUserAPI = async (req, res) => {
    try{
        const { imie, nazwisko, email, haslo} = req.body;
        if (!imie || !nazwisko || !email){
            return res.status(400).json({ message: 'Pola "imie", "nazwisko", "email" są wymagane.' });
        }
        const updatedData = {
            imie,
            nazwisko,
            email,
        };
        if (haslo){
            updatedData.haslo = await bcrypt.hash(haslo, 10);
        }
        const updatedUser = await Uzytkownicy.findByIdAndUpdate(req.params.id, updatedData, { new: true }).select('-haslo');
        if (updatedUser){
            return res.status(200).json(updatedUser);
        } else{
            return res.status(404).json({ message: 'Nie znaleziono użytkownika o podanym ID.' });
        }
    }catch (err){
        return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
};

const deleteUserAPI = async (req, res) => {
    try{
        const deletedUser = await Uzytkownicy.findByIdAndDelete(req.params.id);
        if (deletedUser){
            return res.status(200).json({ message: 'Użytkownik został usunięty.' });
        } else{
            return res.status(404).json({ message: 'Nie znaleziono użytkownika o podanym ID.' });
        }
    }catch (err){
        return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
};

//AdminaPanel/Users
const listUser = async (req, res) => {
  try {
    const uzytkownicy = await Uzytkownicy.find().select('-haslo').lean();
    res.render('listUser', {uzytkownicy});
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const showCreateFormUser = async (req, res) => {
  try {
    const uzytkownicy = await Uzytkownicy.find().select('-haslo').lean();
    res.render('createUser', {uzytkownicy});
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const createUser = async (req, res) => {
    try {
        const { imie, nazwisko, email, haslo, admin } = req.body;
        // Weryfikacja wymaganych pól – dla tworzenia użytkownika przez administratora
        if (!imie || !nazwisko || !email || !haslo) {
          return res.status(400).send('Pola "imie", "nazwisko", "email" i "haslo" są wymagane.');
        }
        // Sprawdzenie, czy użytkownik o podanym email już istnieje
        const existUzytkownik = await Uzytkownicy.findOne({ email });
        if (existUzytkownik) {
          return res.status(400).send('Użytkownik o podanym email już istnieje.');
        }
        // Hashowanie hasła przed zapisaniem użytkownika
        const hashHaslo = await bcrypt.hash(haslo, 10);
        await Uzytkownicy.create({
          imie,
          nazwisko,
          email,
          haslo: hashHaslo,
          admin: admin ? true : false,
        });
        res.redirect('/AdminPanel/Users');
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

const showEditFormUser = async (req, res) => {
  try {
    const uzytkownicy = await Uzytkownicy.findById(req.params.id).select('-haslo').lean();
    if (!uzytkownicy) {
      return res.status(404).send('Nie znaleziono uztkownika');
    }

    res.render('editUser', {uzytkownicy});
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const updateUser = async (req, res) => {
    try {
        const uzytkownikId = req.params.id;
        const { imie, nazwisko, email, haslo, admin } = req.body;
        // Budujemy dane do aktualizacji
        const updateData = {
          imie,
          nazwisko,
          email,
          admin: admin ? true : false,
        };
        // Jeśli podano nowe hasło, hashujemy je
        if (haslo) {
          updateData.haslo = await bcrypt.hash(haslo, 10);
        }
        await Uzytkownicy.findByIdAndUpdate(uzytkownikId, updateData);
        res.redirect('/AdminPanel/Users');
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

const deleteUser = async (req, res) => {
  try {
    const uzytkownicyId = req.params.id;
    await Uzytkownicy.findByIdAndDelete(uzytkownicyId);
    res.redirect('/AdminPanel/Users');
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

//login
const getLogin = (req, res) => {
  const { error } = req.query;      
  res.render('login', { error });   
};

const postLogin = async (req, res) => {
  try {
    const { email, haslo } = req.body;
    if (!email || !haslo) {
      return res.redirect('/login?error=Uzupełnij email i hasło');
    }

    const user = await Uzytkownicy.findOne({ email });
    if (!user) {
      return res.redirect('/login?error=Nieprawidłowe dane logowania');
    }

    const passwordMatch = await bcrypt.compare(haslo, user.haslo);
    if (!passwordMatch) {
      return res.redirect('/login?error=Nieprawidłowe dane logowania');
    }

    const token = createAccessToken(user._id, user.admin);
    sendAccessToken(res, token,'/');

  } catch (error) {
    console.error(error);
    return res.redirect('/login?error=Wystąpił błąd serwera');
  }
};

//register
const getRegister = (req, res) => {
  const { error } = req.query; 
  res.render('register', { error });
};

const postRegister = async (req, res) => {
  try {
    const { imie, nazwisko, email, haslo, confirmHaslo } = req.body;
    if (!imie || !nazwisko || !email || !haslo || !confirmHaslo) {
      return res.redirect('/register?error=Uzupełnij wszystkie pola');
    }
    if (haslo !== confirmHaslo) {
      return res.redirect('/register?error=Hasła muszą się zgadzać');
    }

    const existingUser = await Uzytkownicy.findOne({ email });
    if (existingUser) {
      return res.redirect('/register?error=Email jest już używany');
    }

    const hashed = await bcrypt.hash(haslo, 10);
    const newUser = new Uzytkownicy({
      imie,
      nazwisko,
      email,
      haslo: hashed
    });
    await newUser.save();

    const token = createAccessToken(newUser._id, newUser.admin);
    sendAccessToken(res, token,'/');

  } catch (error) {
    console.error(error);
    return res.redirect('/register?error=Błąd serwera przy rejestracji');
  }
};

//logout
const getLogout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
};

module.exports={
    getAllUserAPI,
    getUserIdAPI,
    postCreateUserAPI,
    putUpdateUserAPI,
    deleteUserAPI,
    listUser,
    showCreateFormUser,
    createUser,
    showEditFormUser,
    updateUser,
    deleteUser,
    getLogin,
    postLogin,
    getRegister,
    postRegister,
    getLogout
};