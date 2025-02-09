const mongoose = require('mongoose');

const PozycjaZamowieniaModel = new mongoose.Schema({
  produkt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produkty',
    required: true
  },
  ilosc: {
    type: Number,
    required: true
  },
  cena: {
    type: Number,
    required: true
  }
},{_id: false});

const zamowienieModel = new mongoose.Schema({
  uzytkownik: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Uzytkownicy',
    required: true
  },
  pozycje: [PozycjaZamowieniaModel],
  adres_dostawy: {
    ulica: String,
    miasto: String,
    kod_pocztowy: String,
    kraj: String
  },
  status_zamowienia: {
    type: String,
    enum: ['nowe', 'w realizacji', 'wyslane', 'dostarczone', 'anulowane'],
    default: 'nowe'
  },
  status_platnosci: {
    type: String,
    enum: ['niezaplacone', 'zaplacone', 'zwrot'],
    default: 'niezaplacone'
  },
  kwota_calkowita: {
    type: Number,
    default: 0
  },
  data_utworzenia: {
    type: Date,
    default: Date.now
  },
}, {collection: 'Zamowienie'});


module.exports = mongoose.model('Zamowienie',  zamowienieModel);
