const Uzytkownicy = require('../models/UzytkownicyModel');


const postOrders = async (req, res) => {
  try {
    // const produkty = await Produkty.find();
    res.render('orders');
  } catch (error) {
    console.error(error);
    res.status(500).send('Wystąpił błąd podczas ładowania strony głównej.');
  }
};


module.exports = { postOrders};
