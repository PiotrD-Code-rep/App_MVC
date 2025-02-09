const Zamowienie= require("../models/ZamowienieModel");
const Transakcje = require("../models/TransakcjeModel");
const Produkty = require("../models/ProduktyModel");

//api/orders
const getAllOrderAPI= async(req,res)=>{
    try{
        const zamowienie = await Zamowienie
            .find()
            .populate('uzytkownik','imie nazwisko email')
            .populate('pozycje.produkt','nazwa_produktu');
        if (zamowienie){
            return res.status(200).json(zamowienie);
        } else {
            return res.status(404).json({ success: false, message: 'Nie znaleziono żadnych pozycji zamówień.' });
        }
    }catch (err){
        return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
};

const getOrderIdAPI = async (req, res) => {
    try{
        const zamowienie = await Zamowienie
            .findById(req.params.id)
            .populate('uzytkownik','imie nazwisko email')
            .populate('pozycje.produkt','nazwa_produktu');
            console.log(zamowienie);
        if (zamowienie){
            return res.status(200).json(zamowienie);
        } else{
            return res.status(404).json({ success: false, message: 'Nie znaleziono pozycji zamówienia o podanym ID.' });
        }
    }catch (err){
        return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
};

const postCreateOrderAPI = async (req, res) => {
    try {
      const {uzytkownikId ,koszyk ,adresDostawy ,metodaPlatnosci} = req.body;
      // 1. Walidacja podstaw
      if (!uzytkownikId || !koszyk || !koszyk.length) {
        return res.status(400).json({
          message: 'Wymagane: uzytkownikId i koszyk (przynajmniej jeden produkt).'
        });
      }
  
      // 2. Zbierz ID wszystkich produktów z koszyka
      const productIds = koszyk.map(item => item.produktId);
  
      // 3. Jednym zapytaniem sprawdź, czy w bazie istnieją te produkty
      const foundProducts = await Produkty.find({ _id: { $in: productIds } });
  
      // Jeśli liczba znalezionych nie pokrywa się z liczbą w koszyku,
      // to przynajmniej jeden nie istnieje
      if (foundProducts.length !== productIds.length) {
        return res.status(400).json({
          message: 'Jeden z produktów w koszyku nie istnieje w bazie.'
        });
      }
  
      // 4. Sprawdź stan magazynowy (i jeśli OK, od razu pomniejsz)
      for (const item of koszyk) {
        const produkt = foundProducts.find(
          p => p._id.toString() === item.produktId
        );
        if (!produkt) {
          // Teoretycznie nie powinno się tu zdarzyć, bo sprawdziliśmy length,
          // ale na wszelki wypadek:
          return res.status(400).json({
            message: `Produkt o ID ${item.produktId} nie istnieje.`
          });
        }
  
        // Czy wystarczający stan magazynowy
        if (produkt.stan_magazynowy < item.ilosc) {
          return res.status(400).json({
            message: `Brak wystarczającej liczby sztuk produktu: ${produkt.nazwa_produktu}. 
                      Dostępne: ${produkt.stan_magazynowy}, zamawiane: ${item.ilosc}`
          });
        }
  
        // Pomniejsz stan
        produkt.stan_magazynowy -= item.ilosc;
        await produkt.save();
      }
  
      // 5. Oblicz kwotę całkowitą zamówienia
      let kwotaCalkowita = 0;
      koszyk.forEach(item => {
        kwotaCalkowita += item.cena * item.ilosc;
      });
  
      // 6. Tworzenie zamówienia
      const noweZamowienie = new Zamowienie({
        uzytkownik: uzytkownikId,
        pozycje: koszyk.map(item => ({
          produkt: item.produktId,
          cena: item.cena,
          ilosc: item.ilosc
        })),
        adres_dostawy: {
          ulica: adresDostawy?.ulica,
          miasto: adresDostawy?.miasto,
          kod_pocztowy: adresDostawy?.kod,
          kraj: adresDostawy?.kraj
        },
        status_zamowienia: 'nowe',
        status_platnosci: 'niezaplacone',
        kwota_calkowita: kwotaCalkowita
      });
  
      await noweZamowienie.save();
  
      // 7. (opcjonalnie) Tworzenie transakcji
      const nowaTransakcja = new Transakcje({
        zamowienie: noweZamowienie._id,
        typ_transakcji: metodaPlatnosci || 'przelew',
        kwota: kwotaCalkowita,
        status_platnosci: 'oczekujaca'
      });
  
      await nowaTransakcja.save();
  
      // 8. Zwrot odpowiedzi
      return res.status(201).json({
        message: 'Zamówienie i transakcja utworzone. Stany magazynowe zaktualizowane.',
        zamowienie: noweZamowienie,
        transakcja: nowaTransakcja
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Błąd serwera podczas tworzenia zamówienia.',
        error: err.message
      });
    }
  };

const putUpdateOrderAPI = async (req, res) => {
    try {
      const { status_zamowienia } = req.body;

      const validStatuses = ['nowe', 'w realizacji', 'wyslane', 'dostarczone', 'anulowane'];
      if (!validStatuses.includes(status_zamowienia)) {
        return res.status(400).json({
          message: `Nieprawidłowa wartość statusu. Dozwolone wartości: ${validStatuses.join(', ')}`
        });
      }

      const updatedOrder = await Zamowienie.findByIdAndUpdate(
        req.params.id,
        { status_zamowienia },
        { new: true }
      );
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Nie znaleziono zamówienia o podanym ID.' });
      }
      return res.status(200).json(updatedOrder);
    } catch (err) {
      return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
};

const deleteOrderAPI = async (req, res) => {
    try {
      const deletedOrder = await Zamowienie.findByIdAndDelete(req.params.id);
      if (!deletedOrder) {
        return res.status(404).json({ message: 'Nie znaleziono zamówienia o podanym ID.' });
      }
      return res.status(200).json({ message: 'Zamówienie zostało usunięte.' });
    } catch (err) {
      return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
};

//AdminPanel/Orders
const listOrder = async (req, res) => {
  try {
    const zamowienie= await Zamowienie.find().lean();
    res.render('listOrder', {zamowienie});
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const showCreateFormOrder = async (req, res) => {
  try {
    const zamowienie= await Zamowienie.find().lean();
    const produkty = await Produkty.find().lean();
    res.render('createOrder', {zamowienie,produkty });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const createOrder = async (req, res) => {
  try {
    // Pobieramy dane przesłane z formularza
    const {
      ulica,
      miasto,
      kod_pocztowy,
      kraj,
      paymentMethod,      // np. "gotowka" lub "karta"
      status_zamowienia,  // np. "nowe", "w realizacji" itd.
      status_platnosci,   // np. "niezaplacone", "zaplacone"
      cart                // JSON-string zawierający dane koszyka
    } = req.body;
    
    // Używamy ID zalogowanego użytkownika, jeśli jest dostępny (punkt 3)
    const userId = req.user ? req.user._id : null;
    if (!userId) {
      return res.status(401).send("Użytkownik musi być zalogowany, aby złożyć zamówienie.");
    }
    
    // Walidacja danych koszyka
    if (!cart) {
      return res.status(400).send("Brak danych koszyka.");
    }
    const cartItems = JSON.parse(cart);
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).send("Koszyk jest pusty.");
    }
    
    // Dla każdej pozycji zamówienia sprawdzamy stan magazynowy i aktualizujemy go
    for (const item of cartItems) {
      // Zakładamy, że każdy element koszyka zawiera właściwość _id (ID produktu), ilosc oraz cena
      const produkt = await Produkty.findById(item._id);
      if (!produkt) {
        return res.status(400).send(`Produkt o ID ${item._id} nie został znaleziony.`);
      }
      const quantityOrdered = Number(item.ilosc);
      if (produkt.stan_magazynowy < quantityOrdered) {
        return res.status(400).send(
          `Niewystarczający stan magazynowy dla produktu ${produkt.nazwa_produktu}. Dostępne: ${produkt.stan_magazynowy}, zamawiane: ${quantityOrdered}.`
        );
      }
      // Aktualizujemy stan magazynowy – odejmujemy zamawianą ilość
      produkt.stan_magazynowy -= quantityOrdered;
      await produkt.save();
    }
    
    // Ponowne obliczenie całkowitej kwoty zamówienia (dla bezpieczeństwa)
    let totalAmount = 0;
    cartItems.forEach(item => {
      totalAmount += Number(item.ilosc) * Number(item.cena);
    });
    
    // Tworzymy nowe zamówienie
    const newOrder = new Zamowienie({
      uzytkownik: userId,
      pozycje: cartItems.map(item => ({
        produkt: item._id,
        ilosc: Number(item.ilosc),
        cena: Number(item.cena)
      })),
      adres_dostawy: {
        ulica: ulica || "",
        miasto: miasto || "",
        kod_pocztowy: kod_pocztowy || "",
        kraj: kraj || ""
      },
      status_zamowienia: status_zamowienia || "nowe",
      // Jeśli metoda płatności to gotówka, ustawiamy status płatności na "niezaplacone"
      status_platnosci: status_platnosci || (paymentMethod === "gotowka" ? "niezaplacone" : "oczekujaca"),
      kwota_calkowita: totalAmount
    });
    await newOrder.save();
    
    // Tworzymy transakcję powiązaną z zamówieniem
    const newTransaction = new Transakcje({
      zamowienie: newOrder._id,
      typ_transakcji: paymentMethod,  // "gotowka" lub "karta"
      kwota: totalAmount,
    });
    await newTransaction.save();
    
    // Po pomyślnym utworzeniu zamówienia przekierowujemy na stronę potwierdzenia
    res.redirect("/Adminpanel/Orders");
  } catch (error) {
    console.error("Błąd przy tworzeniu zamówienia:", error);
    res.status(500).send("Wystąpił błąd przy składaniu zamówienia.");
  }
};

const showEditFormOrder = async (req, res) => {
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

const updateOrder = async (req, res) => {
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

const deleteOrder = async (req, res) => {
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
    getAllOrderAPI,
    getOrderIdAPI,
    postCreateOrderAPI,
    putUpdateOrderAPI,
    deleteOrderAPI,
    listOrder,
    showCreateFormOrder,
    createOrder,
    showEditFormOrder,
    updateOrder,
    deleteOrder
};