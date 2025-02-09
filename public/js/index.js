// Po załadowaniu drzewa DOM
document.addEventListener('DOMContentLoaded', function() {
  // Wyszukaj wszystkie przyciski z klasą .info-btn
  const infoButtons = document.querySelectorAll('.info-btn');
  infoButtons.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.preventDefault(); // Zapobiega przeładowaniu strony
      
      // Zbuduj obiekt "product" z atrybutów data-...
      // Używamy atrybutu data-images, rozbijając go na tablicę
      const product = {
        _id: btn.dataset.id,
        nazwa_produktu: btn.dataset.name,
        opis_produktu: btn.dataset.description,
        cena: btn.dataset.price,
        zdjecia_produktu: btn.dataset.images ? btn.dataset.images.split(',') : []
      };

      // Wywołanie funkcji, która wypełni i otworzy modal
      openWindowProduct(product);
    });
  });
});

// Funkcja pokazująca modal z karuzelą zdjęć (jeśli więcej niż jeden obraz)
function openWindowProduct(product) {
  // Ustawienie danych tekstowych
  document.getElementById('ProductName').innerText = product.nazwa_produktu;
  document.getElementById('ProductDescription').innerText = product.opis_produktu;
  document.getElementById('ProductPrice').innerText = `Cena: ${product.cena} zł`;

  // Budowanie zawartości sekcji obrazów
  const productImageContainer = document.getElementById('ProductImage');
  
  if (product.zdjecia_produktu.length > 1) {
    // Budowanie karuzeli, jeśli jest więcej niż jeden obraz
    let carouselHTML = `
      <div id="carouselProductImages" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
    `;
    product.zdjecia_produktu.forEach((img, index) => {
      carouselHTML += `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
          <img src="${img}" class="d-block w-100" alt="Product Image ${index + 1}" style="max-height:300px;">
        </div>
      `;
    });
    carouselHTML += `
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselProductImages" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselProductImages" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    `;
    productImageContainer.innerHTML = carouselHTML;
  } else {
    // Jeśli jest tylko jeden obraz lub tablica jest pusta
    let imageUrl = product.zdjecia_produktu.length 
      ? product.zdjecia_produktu[0] 
      : '/img/default-image.jpg';
    productImageContainer.innerHTML = `
      <img src="${imageUrl}" class="img-fluid" alt="${product.nazwa_produktu}" style="max-height:300px;">
    `;
  }

  // Inicjalizacja i otwarcie modala (Bootstrap 5)
  const productModal = new bootstrap.Modal(document.getElementById('productModal'));
  productModal.show();
}



  //Zarządzanie koszykiem
  // Odczyt koszyka
function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

// Zapis koszyka
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Dodawanie do koszyka
function addToCart(_id, nazwa_produktu, cena) {
  // Upewnijmy się, że cena jest liczbą
  let numericPrice = parseFloat(cena);
  if (isNaN(numericPrice)) numericPrice = 0;

  const cart = getCart();

  // Sprawdź, czy produkt już istnieje w koszyku
  const existingProduct = cart.find(item => item._id === _id);
  if (existingProduct) {
    existingProduct.ilosc += 1;
  } else {
    cart.push({
      _id,
      nazwa_produktu,
      cena: numericPrice,
      ilosc: 1,
    });
  }

  saveCart(cart);
  console.log('Produkt dodany do koszyka:', cart);


}

// Usuwanie z koszyka
function removeFromCart(_id) {
  let cart = getCart();
  cart = cart.filter(item => item._id !== _id);
  saveCart(cart);
  console.log('Produkt usunięty z koszyka:', cart);
}

// Aktualizacja ilości
function updateCart(_id, ilosc) {
  const cart = getCart();
  const product = cart.find(item => item._id === _id);

  if (product) {
    product.ilosc = ilosc <= 0 ? 0 : ilosc;
    
    if (product.ilosc <= 0) {
      removeFromCart(_id); 
    } else {
      saveCart(cart);
    }
  }
  console.log('Koszyk zaktualizowany:', cart);
}

// Czyszczenie koszyka
function clearCart() {
  localStorage.removeItem('cart');
  console.log('Koszyk wyczyszczony');
}

// Render koszyka w modalu
function renderCart() {
  const cart = getCart();
  const koszykTabela = document.getElementById('koszykTabela');
  const koszykSuma = document.getElementById('koszykSuma');

  // Wyczyść dotychczasowe wiersze
  koszykTabela.innerHTML = '';

  let totalSum = 0;
  
  cart.forEach(item => {
    const itemSum = item.cena * item.ilosc;
    totalSum += itemSum;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.nazwa_produktu}</td>
      <td>${item.cena.toFixed(2)} PLN</td>
      <td>
        <input 
          type="number" 
          class="form-control form-control-sm cart-quantity" 
          style="width: 60px;"
          value="${item.ilosc}" 
          data-id="${item._id}" 
          min="1"
        >
      </td>
      <td>${itemSum.toFixed(2)} PLN</td>
      <td>
        <button 
          class="btn btn-danger btn-sm remove-from-cart" 
          data-id="${item._id}"
        >
          Usuń
        </button>
      </td>
    `;
    koszykTabela.appendChild(row);

    // Zmiana ilości
    const quantityInput = row.querySelector('.cart-quantity');
    quantityInput.addEventListener('change', (e) => {
      const newQuantity = parseInt(e.target.value, 10);
      updateCart(item._id, newQuantity);
      renderCart(); 
    });

    // Usunięcie produktu z koszyka
    const removeButton = row.querySelector('.remove-from-cart');
    removeButton.addEventListener('click', () => {
      removeFromCart(item._id);
      renderCart(); 
    });
  });

  koszykSuma.innerText = `Łączna suma: ${totalSum.toFixed(2)} PLN`;

  // Jeśli koszyk pusty, wyświetl komunikat
  if (cart.length === 0) {
    koszykTabela.innerHTML = '<tr><td colspan="5" class="text-center">Koszyk jest pusty</td></tr>';
    koszykSuma.innerText = 'Łączna suma: 0 PLN';
  }
}


// Obsługa przycisku "Wyczyść koszyk"
document.addEventListener('DOMContentLoaded', () => {
  const clearCartButton = document.getElementById('clearCartButton');
  if (clearCartButton) {
    clearCartButton.addEventListener('click', () => {
      clearCart();
      renderCart(); 
    });
  }
});

/**************************************************************
 * Inicjalizacja obsługi rejestracji
 **************************************************************/
// function initRegister() {
//   // Znajdujemy formularz #registerForm
//   const registerForm = document.getElementById('registerForm');
//   if (!registerForm) return;

//   registerForm.addEventListener('submit', async (e) => {
//     e.preventDefault();

//     // Pobranie wartości z formularza
//     const imie = document.getElementById('registerFirstname').value.trim();
//     const nazwisko = document.getElementById('registerLastname').value.trim();
//     const email = document.getElementById('registerEmail').value.trim();
//     const haslo = document.getElementById('registerPassword').value;
//     const confirmhaslo = document.getElementById('registerConfirmPassword').value;


//     // Walidacja podstawowa
//     if (haslo !== confirmhaslo) {
//       alert('Hasła nie są identyczne!');
//       return;
//     }

//     if (!imie || !nazwisko || !email || !haslo) {
//       alert('Uzupełnij pola: imię, nazwisko, email i hasło!');
//       return;
//     }

//     // Dane do rejestracji
//     const registrationData = {
//       imie,
//       nazwisko,
//       email,
//       haslo,
//     };

//     try {
//       // Wysyłanie danych do serwera (API)
//       const response = await fetch('http://localhost:3000/rejestracja', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(registrationData),
//       });

//       // Obsługa ewentualnego błędu
//       if (!response.ok) {
//         // Możesz spróbować pobrać treść błędu i wyświetlić
//         throw new Error('Rejestracja nieudana!');
//       }

//       // Odczyt odpowiedzi
//       const data = await response.json();
//       console.log('Rejestracja OK:', data);
//       alert('Rejestracja przebiegła pomyślnie! Teraz możesz się zalogować.');

//       // Zamknij modal rejestracji
//       const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
//       registerModal.hide();

//       // (Opcjonalnie) otwórz modal logowania
//       const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
//       loginModal.show();

//     } catch (error) {
//       console.error('Błąd rejestracji:', error);
//       alert('Wystąpił błąd podczas rejestracji. Spróbuj ponownie.');
//     }
//   });
// }

// /**************************************************************
//  * Inicjalizacja obsługi logowania
//  **************************************************************/
// function initLogin() {
//   // Znajdujemy formularz #loginForm
//   const loginForm = document.getElementById('loginForm');
//   if (!loginForm) return;

//   loginForm.addEventListener('submit', async (e) => {
//     e.preventDefault();

//     // Pobranie wartości z formularza
//     const email = document.getElementById('loginEmail').value.trim();
//     const haslo = document.getElementById('loginPassword').value;

//     // Walidacja
//     if (!email || !haslo) {
//       alert('Podaj email i hasło!');
//       return;
//     }

//     // Dane do logowania
//     const loginData = {
//       email,
//       haslo,
//     };

//     try {
//       // Wyślij żądanie POST do API
//       const response = await fetch('http://localhost:3000/logowanie', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include', // w razie użycia sesji/cookie
//         body: JSON.stringify(loginData),
//       });

//       if (!response.ok) {
//         throw new Error('Logowanie nieudane!');
//       }

//       const data = await response.json();
//       console.log('Logowanie OK:', data);

//       alert('Zalogowano pomyślnie!');

//       // Zamknij modal logowania
//       const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
//       loginModal.hide();

//       // (Opcjonalnie) przekierowanie gdzieś
//       // window.location.href = '/';

//     } catch (error) {
//       console.error('Błąd logowania:', error);
//       alert('Nieprawidłowe dane lub błąd serwera.');
//     }
//   });
// }

// async function initAuth() {
//   // Spróbuj pobrać info o aktualnym użytkowniku
//   try {
//     const res = await fetch('/whoami', {
//       method: 'GET',
//       credentials: 'include'  // żeby cookies JWT były wysyłane
//     });
//     if (res.ok) {
//       const data = await res.json();
//       // mamy np. data = { userId, name, email }
//       showUserMenu(data);
//     } else {
//       // 401 lub inny => niezalogowany
//       showLoginIcon();
//     }
//   } catch (err) {
//     console.error('Błąd whoami:', err);
//     showLoginIcon();
//   }
// }

// function showUserMenu(userData) {
//   // Pokaż #userMenu, ustaw np. userNameLabel
//   document.getElementById('loginIcon').style.display = 'none';
//   const userMenu = document.getElementById('userMenu');
//   userMenu.style.display = 'inline-block';

//   const userNameLabel = document.getElementById('userNameLabel');
//   userNameLabel.innerText = userData.name || 'Użytkownik';
// }

// function showLoginIcon() {
//   // Pokaż #loginIcon
//   document.getElementById('userMenu').style.display = 'none';
//   document.getElementById('loginIcon').style.display = 'inline-block';
// }

// function initLogoutLink() {
//   const logoutLink = document.getElementById('logoutLink');
//   if (!logoutLink) return;

//   logoutLink.addEventListener('click', async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch('/logout', {
//         method: 'GET', 
//         credentials: 'include'
//       });
//       // serwer -> res.clearCookie('jwt') i 200 OK
//       if (!res.ok) {
//         console.error('Wylogowanie nieudane:', res.status);
//         return;
//       }

//       // Sukces, odśwież ikony
//       showLoginIcon();
//     } catch (err) {
//       console.error('Wylogowanie error:', err);
//     }
//   });
// }


// document.addEventListener('DOMContentLoaded', () => {
//   initRegister();
//   initLogin();
//   initAuth();
//   initLogoutLink();
// });

