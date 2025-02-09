const Produkty = require('../models/ProduktyModel');


const getMainPage = async (req, res) => {
  try {
    const produkty = await Produkty.find().lean();
    res.render('index',{produkty});
  } catch (error) {
    console.error(error);
    res.status(500).send('Wystąpił błąd podczas ładowania strony głównej');
  }
};

const getAdminPage = async (req, res) => {
  try {
    res.render('adminpanel');
  } catch (error) {
    console.error(error);
    res.status(500).send('Wystąpił błąd podczas panelu administracyjnego');
  }
};

module.exports = { getMainPage, getAdminPage };

