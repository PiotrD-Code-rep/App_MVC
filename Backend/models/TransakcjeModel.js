const mongoose = require('mongoose');

const transakcjeModel= new mongoose.Schema({
  zamowienie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Zamowienie',
    required: true
  },
  typ_transakcji: {
    type: String,
    enum: ['karta','gotowka'],
    required: true
  },
  kwota: {
    type: Number,
    required: true
  },
  status_platnosci: {
    type: String,
    enum: ['oczekujaca', 'zrealizowana', 'odrzucona'],
    default: 'oczekujaca'
  },
  data_transakcji: {
    type: Date,
    default: Date.now
  }
},{collection: 'Transakcje'});

module.exports = mongoose.model('Transakcje', transakcjeModel);
