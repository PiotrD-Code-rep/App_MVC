const Produkty = require("../models/ProduktyModel");
const Katygorie = require("../models/KatygorieModel");


//api/products
const getAllProductAPI = async(req,res)=>{
  try {
    const produkty = await Produkty.find();
    return res.status(200).json(produkty);
  } catch (err) {
    return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
  }

};

const getProductIdAPI = async (req, res) => {
    try{
      const produkt = await Produkty.findById(req.params.id);
      if (produkt){
        return res.status(200).json(produkt);
      } else{
        return res.status(404).json({ success: false, message: 'Nie znaleziono produktu o podanym ID.' });
      }
    }catch (err){
        return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
};

const postCreateProductAPI = async (req, res) => {
    try{
        const { katygoria, nazwa_produktu, opis_produktu, cena, stan_magazynowy, zdjecia_produktu } = req.body;
  
        // Sprawdzenie wymaganych pól
        if (!katygoria || !nazwa_produktu || !opis_produktu || cena === undefined || stan_magazynowy === undefined){
            return res.status(400).json({ message: 'Pola "katygoria", "nazwa_produktu", "opis_produktu", "cena", "stan_magazynowy" są wymagane.' });
        }
        // Walidacja kategorii
        const katygoriaDoc = await Katygorie.findById(katygoria);
        if (!katygoriaDoc){
            return res.status(400).json({ message: 'Niepoprawny identyfikator kategorii.' });
        }

        const zdjecia = req.files ? req.files.map(file => '/uploads/' + file.filename) : [];

        // Tworzenie nowego produktu
        const produkt = new Produkty({
            katygoria,
            nazwa_produktu,
            opis_produktu,
            cena,
            stan_magazynowy,
            zdjecia_produktu,
            zdjecia_produktu: zdjecia
        });
  
        const savedProdukt = await produkt.save();
        if (savedProdukt){
            return res.status(201).json(savedProdukt);
        } else{
            return res.status(400).json({ success: false, message: 'Nie udało się dodać produktu.' });
        }
    }catch (err){
        return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
};

const putUpdateProductAPI = async (req, res) => {
    try{
        const { katygoria, nazwa_produktu, opis_produktu, cena, stan_magazynowy, zdjecia_produktu } = req.body;
        // Walidacja kategorii
        const katygoriaDoc = await Katygorie.findById(katygoria);
        if (!katygoriaDoc){
            return res.status(400).json({ message: 'Niepoprawny identyfikator kategorii.' });
        }
  
        // Budowanie obiektu aktualizacji
        const updateData = {
          nazwa_produktu,
          opis_produktu,
          cena,
          katygoria,
          stan_magazynowy
        };

        // Jeśli przesłano nowe zdjęcia, aktualizujemy pole zdjecia_produktu
        if (req.files && req.files.length > 0) {
          updateData.zdjecia_produktu = req.files.map(file => '/uploads/' + file.filename);
        }

        const updatedProdukt = await Produkty.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true, runValidators: true }
        );
  
        if (updatedProdukt){
            return res.status(200).json(updatedProdukt);
        } else{
            return res.status(404).json({ success: false, message: 'Nie znaleziono produktu do aktualizacji.' });
        }
    }catch (err){
        return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
};

const deleteProductAPI = async (req, res) => {
    try{
        const deletedProdukt = await Produkty.findByIdAndDelete(req.params.id);
        if (deletedProdukt){
            return res.status(200).json({ success: true, message: 'Produkt został pomyślnie usunięty.' });
        } else{
            return res.status(404).json({ success: false, message: 'Nie znaleziono produktu do usunięcia.' });
        }
    }catch (err){
        return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
};

//AdminPanel/products
const listProduct = async (req, res) => {
  try {
    const produkty = await Produkty.find().populate('katygoria').lean();
    res.render('listProduct', { produkty });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const showCreateFormProduct = async (req, res) => {
  try {
    const katygoria = await Katygorie.find().lean();
    res.render('createProduct', {katygoria});
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const createProduct = async (req, res) => {
  try {
    const { nazwa_produktu, opis_produktu, cena, katygoria, stan_magazynowy } = req.body;

    const zdjecia = req.files ? req.files.map(file => '/uploads/' + file.filename) : [];
    // Walidacja wymaganych pól
    if (!katygoria || !nazwa_produktu || !opis_produktu || cena ===undefined || stan_magazynowy===undefined) {
      return res.status(400).send('Wszystkie pola (w tym identyfikator kategorii) są wymagane.');
    }

    // Walidacja istnienia kategorii
    const katDoc = await Katygorie.findById(katygoria);
    if (!katDoc) {
      return res.status(400).send('Niepoprawny identyfikator kategorii.');
    }

    await Produkty.create({
      nazwa_produktu,
      opis_produktu,
      cena,
      katygoria,
      stan_magazynowy,
      zdjecia_produktu: zdjecia
    });

    res.redirect('/AdminPanel/products');
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const showEditFormProduct = async (req, res) => {
  try {
    const produkt = await Produkty.findById(req.params.id).populate('katygoria').lean();
    if (!produkt) {
      return res.status(404).send('Nie znaleziono produktu');
    }
    const wszystkieKategorie = await Katygorie.find().lean();
    const aktualnaKatId = produkt.katygoria?._id?.toString();
    wszystkieKategorie.forEach(k => {
      if (k._id.toString() === aktualnaKatId) {
        k.selected = true;
      }
    });
    res.render('editProduct', {produkt,katygoria: wszystkieKategorie });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

// const updateProduct = async (req, res) => {
//   try {
//     const productId = req.params.id;
//     const { nazwa_produktu, opis_produktu, cena, katygoria, stan_magazynowy } = req.body;

//     // Jeśli przesłano kategorię, walidujemy jej istnienie
//     if (katygoria) {
//       const katDoc = await Katygorie.findById(katygoria);
//       if (!katDoc) {
//         return res.status(400).send('Niepoprawny identyfikator kategorii.');
//       }
//     }

//     const updateData = {
//       nazwa_produktu,
//       opis_produktu,
//       cena,
//       katygoria,
//       stan_magazynowy
//     };
//     // if (req.files && req.files.length > 0) {
//     //   const newImages = req.files.map(file => '/uploads/' + file.filename);
//     //   // Łączymy nowo przesłane obrazy z już zapisanymi
//     //   updateData.zdjecia_produktu = currentProduct.zdjecia_produktu.concat(newImages);
//     // }



//     if (req.files && req.files.length > 0) {
//       updateData.zdjecia_produktu = req.files.map(file => '/uploads/' + file.filename);
//     }
//     await Produkty.findByIdAndUpdate(productId, updateData, { new: true, runValidators: true });
//     res.redirect('/AdminPanel/products');
//   } catch (err) {
//     console.error(err);
//     res.sendStatus(500);
//   }
// };

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    await Produkty.findByIdAndDelete(productId);
    res.redirect('/AdminPanel/products');
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};


const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { nazwa_produktu, opis_produktu, cena, katygoria, stan_magazynowy } = req.body;
    
    // Walidacja kategorii, jeśli została przesłana
    if (katygoria) {
      const katDoc = await Katygorie.findById(katygoria);
      if (!katDoc) {
        return res.status(400).send('Niepoprawny identyfikator kategorii.');
      }
    }
    
    // Pobieramy aktualny produkt, aby zachować dotychczasowe zdjęcia
    const currentProduct = await Produkty.findById(productId);
    if (!currentProduct) {
      return res.status(404).send('Nie znaleziono produktu');
    }
    
    const updateData = {
      nazwa_produktu,
      opis_produktu,
      cena,
      katygoria,
      stan_magazynowy
    };
    
    // Pobierz listę zdjęć, które mają pozostać (domyślnie wszystkie)
    let updatedImages = currentProduct.zdjecia_produktu || [];
    
    // Jeśli przesłano zaznaczenia do usunięcia, usuń wskazane obrazy
    if (req.body.removeImages) {
      // Upewnij się, że mamy tablicę (gdy zaznaczony jest jeden checkbox, może to być string)
      const removeImages = Array.isArray(req.body.removeImages)
        ? req.body.removeImages
        : [req.body.removeImages];
      
      updatedImages = updatedImages.filter(image => !removeImages.includes(image));
    }
    
    // Jeśli przesłano nowe zdjęcia, mapujemy je na względne ścieżki i dołączamy do istniejących
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => '/uploads/' + file.filename);
      updatedImages = updatedImages.concat(newImages);
    }
    
    updateData.zdjecia_produktu = updatedImages;
    
    await Produkty.findByIdAndUpdate(productId, updateData, { new: true, runValidators: true });
    res.redirect('/AdminPanel/products');
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};



module.exports={
    getAllProductAPI,
    getProductIdAPI,
    postCreateProductAPI,
    putUpdateProductAPI,
    deleteProductAPI,
    listProduct,
    showCreateFormProduct,
    createProduct,
    showEditFormProduct,
    updateProduct,
    deleteProduct
};