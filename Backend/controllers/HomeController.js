const Produkty = require('../models/ProduktyModel');


const getStronaGlowna = async (req, res) => {
  try {
    const produkty = await Produkty.find().lean();
    res.render('index',{produkty});
  } catch (error) {
    console.error(error);
    res.status(500).send('Wystąpił błąd podczas ładowania strony głównej.');
  }
};


module.exports = { getStronaGlowna};

