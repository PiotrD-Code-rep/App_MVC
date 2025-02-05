const Katygorie = require("../models/KatygorieModel");


//api/categories
const getAllCategoryAPI= async(req,res)=>{
    try {
        const katygorie = await Katygorie.find();
        if (katygorie) {
            return res.status(200).json(katygorie);
        } else {
            return res.status(404).json({ success: false, message: 'Nie znaleziono kategorii' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Błąd serwera', error: err.message });
    }
};

const getCategoryIdAPI = async (req, res) => {
    try {
        const katygorie = await Katygorie.findById(req.params.id);
        if (katygorie) {
            return res.status(200).json(katygorie);
        } else {
            return res.status(404).json({ success: false, message: 'Nie znaleziono kategorii' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Błąd serwera', error: err.message });
    }
};

const postCreateCategoryAPI = async (req, res) => {
    try {
        const katygorie = new Katygorie({
            nazwa_katygori: req.body.nazwa_katygori,
        });

        const savedKatygorie = await katygorie.save();
        return res.status(201).json(savedKatygorie);
    } catch (err) {
        return res.status(500).json({ message: 'Błąd serwera', error: err.message });
    }
};

const putUpdateCategoryAPI  = async (req, res) => {
    try {
        const updatedKatygorie = await Katygorie.findByIdAndUpdate(
            req.params.id,
            {
                nazwa_katygori: req.body.nazwa_katygori,
            },
            { new: true, runValidators: true }
        );

        if (updatedKatygorie) {
            return res.status(200).json(updatedKatygorie);
        } else {
            return res.status(404).json({ success: false, message: 'Nie znaleziono kategorii' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Błąd serwera', error: err.message });
    }
};

const deleteCategoryAPI = async (req, res) => {
    try {
        const deletedKatygorie = await Katygorie.findByIdAndDelete(req.params.id);
        if (deletedKatygorie) {
            return res.status(200).json({ success: true, message: 'Usunięto kategorię' });
        } else {
            return res.status(404).json({ success: false, message: 'Nie znaleziono kategorii' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Błąd serwera', error: err.message });
    }
};



//AdminPanel/categories
const listCategory = async (req, res) => {
  try {
    const katygorie = await Katygorie.find().lean();
    res.render('listCategory', {katygorie});
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const showCreateFormCategory = async (req, res) => {
  try {
    const katygorie = await Katygorie.find().lean();
    res.render('createCategory', {katygorie});
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const createCategory = async (req, res) => {
  try {
    const {
      nazwa_katygori
    } = req.body;

    await Katygorie.create({
      nazwa_katygori
    });

    res.redirect('/AdminPanel/categories');
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const showEditFormCategory = async (req, res) => {
  try {
    const katygorie = await Katygorie.findById(req.params.id).lean();
    if (!katygorie) {
      return res.status(404).send('Nie znaleziono produktu');
    }

    res.render('editCategory', {katygorie});
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const updateCategory = async (req, res) => {
  try {
    const katygorieId = req.params.id;
    const { nazwa_katygori } = req.body;

    await Katygorie.findByIdAndUpdate(katygorieId, { nazwa_katygori });
    res.redirect('/AdminPanel/categories');
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const katygorieId = req.params.id;
    await Katygorie.findByIdAndDelete(katygorieId );
    res.redirect('/AdminPanel/categories');
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports={
    getAllCategoryAPI,
    getCategoryIdAPI,
    postCreateCategoryAPI,
    putUpdateCategoryAPI,
    deleteCategoryAPI,
    listCategory,
    showCreateFormCategory,
    createCategory,
    showEditFormCategory,
    updateCategory,
    deleteCategory
};