const Transakcje = require("../models/TransakcjeModel");

const getAllTransactionAPI = async (req, res) => {
    try {
      const transakcje = await Transakcje.find().populate('zamowienie');
      
      if (transakcje.length === 0) {
        return res.status(404).json({ message: 'Brak transakcji w bazie.' });
      }
      return res.status(200).json(transakcje);
    } catch (err) {
      return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
};
  
const getTransactionIdAPI = async (req, res) => {
    try {
     const transakcje = await Transakcje.find().populate('zamowienie');
      if (transakcje) {
        return res.status(200).json(transakcje);
      }
      return res.status(404).json({ message: 'Nie znaleziono transakcji o podanym ID.' });
    } catch (err) {
      return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
};
  

const putUpdateTransactionAPI = async (req, res) => {
    try {
      // Przykład: zmiana statusu (z 'oczekujaca' na 'zrealizowana' albo 'odrzucona')
      const { status_platnosci } = req.body;
      const validStatuses = ['oczekujaca', 'zrealizowana', 'odrzucona'];
      if (!validStatuses.includes(status_platnosci)) {
        return res.status(400).json({
          message: `Nieprawidłowy status płatności. Dostępne wartości: ${validStatuses.join(', ')}`
        });
      }
  
      const updatedTransakcje = await Transakcje.findByIdAndUpdate(
        req.params.id,
        { status_platnosci },
        { new: true }
      );
      if (!updatedTransakcje) {
        return res.status(404).json({ message: 'Nie znaleziono transakcji o podanym ID.' });
      }
  
      return res.status(200).json(updatedTransakcje);
    } catch (err) {
      return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
};
  
const deleteTransactionAPI = async (req, res) => {
    try {
      const transakcje = await Transakcje.findByIdAndDelete(req.params.id);
      if (!transakcje) {
        return res.status(404).json({ message: 'Nie znaleziono transakcji o podanym ID.' });
      }
      return res.status(200).json({ message: 'Transakcja została usunięta.' });
    } catch (err) {
      return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
};

//AdminPanel/Transactions
const listTransaction = async (req, res) => {
  try {
    const zamowienie= await Zamowienie.find().lean();
    res.render('listOrder', {zamowienie});
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const showCreateFormTransaction = async (req, res) => {
  try {
    const zamowienie= await Zamowienie.find().lean();
    res.render('createOrder', {zamowienie});
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const createTransaction = async (req, res) => {

};

const showEditFormTransaction = async (req, res) => {
  try {
    const zamowienie = await Zamowienie.findById(req.params.id).lean();
    if (!zamowienie) {
      return res.status(404).send('Nie znaleziono produktu');
    }

    res.render('editOrder', {zamowienie});
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const updateTransaction = async (req, res) => {
  try {
    const zamowienieId = req.params.id;
    const { status_zamowienia } = req.body;

    const validStatuses = ['nowe', 'w realizacji', 'wyslane', 'dostarczone', 'anulowane'];
    if (!validStatuses.includes(status_zamowienia)) {
      return res.status(400).json({
        message: `Nieprawidłowa wartość statusu. Dozwolone wartości: ${validStatuses.join(', ')}`
      });
    }

    await Zamowienie.findByIdAndUpdate(zamowienieId, { status_zamowienia });
    res.redirect('/AdminPanel/Orders');
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const zamowienieId = req.params.id;
    await Zamowienie.findByIdAndDelete(zamowienieId );
    res.redirect('/AdminPanel/Orders');
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};


module.exports={
    getAllTransactionAPI,
    getTransactionIdAPI,
    //  
    putUpdateTransactionAPI,
    deleteTransactionAPI,
    listTransaction,
    showCreateFormTransaction,
    createTransaction,
    showEditFormTransaction,
    updateTransaction,
    deleteTransaction
};