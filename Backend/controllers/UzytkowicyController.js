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


// Logowanie użytkownika
const postLogowanie = async (req, res) => {
    try{
        const { email, haslo } = req.body;
        // Sprawdzenie, czy email i hasło są dostarczone
        if (!email || !haslo){
            return res.status(400).json({ error: 'Email i hasło są wymagane.' });
        }

        const user = await Uzytkownicy.findOne({ email });

        if (!user){
            return res.status(401).json({ error: 'Nieprawidłowy email lub hasło.' });
        }

        const passwordMatch = await bcrypt.compare(haslo, user.haslo);
        if (!passwordMatch){
            return res.status(401).json({ error: 'Nieprawidłowy email lub hasło.' });
        }

        const token = createAccessToken(user._id, user.admin);
        sendAccessToken(res,token);

    }catch (error){
        res.status(500).json({ error: 'Błąd podczas logowania.' });
    }
};

// Rejestracja użytkownika
const postRejestracja = postCreateUserAPI;

//Zmian ikony
const postWhoami = async (req, res) => {
    return res.json({
        email: req.user.email,
        // np. role: req.user.role
      });
};

//Wylogowanie
const postLogout = async (req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'Wylogowano' });
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
    postLogowanie,
    postRejestracja,
    postWhoami,
    postLogout
};