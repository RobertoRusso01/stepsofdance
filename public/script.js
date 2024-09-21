const fetchClientsButton = document.getElementById("fetchClients");
const clientList = document.getElementById("clientList");
const searchClientInput = document.getElementById("searchClient");

const searchButton = document.getElementById("searchButton");

const closeSearchButton = document.getElementById("closeSearch");
const searchResults = document.getElementById("searchResults");
const addClientForm = document.getElementById("addClientForm");
const closeSearchButton2 = document.getElementById("closeSearch2"); // Aggiungi questa linea per selezionare il pulsante
const searchClientInputSchool = document.getElementById("searchClientSchool");
const searchButtonSchool = document.getElementById("searchButtonSchool");
const closeSearchButtonSchool = document.getElementById("closeSearchSchool");
const searchResultsSchool = document.getElementById("searchResultsSchool");
const searchClientInputSurname = document.getElementById("searchClientSurname");
const searchButtonSurname = document.getElementById("searchButtonSurname");
const closeSearchButtonSurname = document.getElementById("closeSearchSurname");
const searchResultsSurname = document.getElementById("searchResultsSurname");

fetchClientsButton.addEventListener("click", async () => {
  const response = await fetch("http://3.67.185.158:3000/api/clienti/");
  const clients = await response.json();
  clientList.innerHTML = clients
    .map(
      (client) => `
            <div class="client-row">
                <span>${client.nome}</span>
                <span>${client.cognome}</span>
                <span>${client.scuola}</span>
                <span>${client.telefono}</span>
                <span>${client.note}</span>
            </div>
        `
    )
    .join("");
});

searchButton.addEventListener("click", async () => {
  const searchTerm = searchClientInput.value.trim();

  // Controlla se il campo è vuoto
  if (!searchTerm) {
    alert("Inserisci un termine di ricerca.");
    return;
  }

  // Suddividi il termine di ricerca in parole
  const searchTerms = searchTerm.split(" ").filter((term) => term); // Rimuove eventuali spazi vuoti

  // Crea una query string dinamica
  let queryParams = [];

  // Aggiungi ogni termine come possibile filtro, rispettando l'ordine
  if (searchTerms[0]) queryParams.push(`nome=${searchTerms[0]}`);
  if (searchTerms[1]) queryParams.push(`cognome=${searchTerms[1]}`);
  if (searchTerms[2]) queryParams.push(`scuola=${searchTerms[2]}`);

  // Unisci i parametri in una query string
  const queryString = queryParams.join("&");

  // Fai la chiamata API con la query string generata
  const response = await fetch(
    `http://3.67.185.158:3000/api/clienti/search?${queryString}`
  );

  // Ricevi i risultati dalla risposta dell'API
  const results = await response.json();

  // Mostra i risultati
  if (results.length > 0) {
    searchResults.innerHTML = results
      .map(
        (client) => `
          <div class="result-item client-row">
            <span>${client.nome}</span>
            <span>${client.cognome}</span>
            <span>${client.scuola}</span>
            <span>${client.telefono}</span>
            <span>${client.note}</span>
          </div>
        `
      )
      .join("");
  } else {
    searchResults.innerHTML = "<p>Nessun cliente trovato.</p>";
  }
});

closeSearchButton.addEventListener("click", () => {
  searchResults.innerHTML = "";
  searchClientInput.value = "";
  clientList.innerHTML = ""; // Riporta indietro la lista dei clienti
});

closeSearchButton2.addEventListener("click", () => {
  searchResults.innerHTML = ""; // Cancella eventuali risultati di ricerca
  searchClientInput.value = ""; // Pulisci il campo di ricerca
  clientList.innerHTML = ""; // Pulisci la lista dei clienti o fai una chiamata per mostrare tutti i clienti
});

addClientForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const newClient = {
    nome: document.getElementById("name").value,
    cognome: document.getElementById("surname").value,
    telefono: document.getElementById("telephone").value,
    scuola: document.getElementById("school").value,
    luogo: document.getElementById("location").value,
    note: document.getElementById("notes").value,
  };

  // Stampa l'oggetto che stai inviando per debug
  console.log("Nuovo cliente:", newClient);

  try {
    const response = await fetch("http://3.67.185.158:3000/api/clienti", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newClient),
    });

    // Stampa la risposta del server
    console.log("Risposta dal server:", response);

    if (response.ok) {
      alert("Cliente aggiunto con successo!");
      addClientForm.reset();
    } else {
      // Stampa l'errore specifico dal server
      const errorData = await response.json();
      console.error("Errore dall'API:", errorData);
      alert("Errore durante l'aggiunta del cliente.");
    }
  } catch (error) {
    // Gestisci eventuali errori di rete
    console.error("Errore di rete o di fetch:", error);
    alert("Errore di rete durante l'aggiunta del cliente.");
  }
});

searchButtonSchool.addEventListener("click", async () => {
  const searchTerm = searchClientInputSchool.value.trim();

  // Controlla se il campo è vuoto
  if (!searchTerm) {
    alert("Inserisci un termine di ricerca.");
    return;
  }

  // Crea una query string dinamica solo per la scuola
  const queryParams = [`scuola=${searchTerm}`];

  // Fai la chiamata API con la query string generata
  const response = await fetch(
    `http://3.67.185.158:3000/api/clienti/search?${queryParams.join("&")}`
  );

  // Ricevi i risultati dalla risposta dell'API
  const results = await response.json();

  // Mostra i risultati
  if (results.length > 0) {
    searchResultsSchool.innerHTML = results
      .map(
        (client) => `
          <div class="result-item client-row">
            <span>${client.nome}</span>
            <span>${client.cognome}</span>
            <span>${client.scuola}</span>
            <span>${client.telefono}</span>
            <span>${client.note}</span>
          </div>
        `
      )
      .join("");
  } else {
    searchResultsSchool.innerHTML =
      "<p>Nessun cliente trovato per questa scuola.</p>";
  }
});

// Funzione per resettare i risultati della ricerca scuola
closeSearchButtonSchool.addEventListener("click", () => {
  searchResultsSchool.innerHTML = ""; // Cancella i risultati di ricerca
  searchClientInputSchool.value = ""; // Pulisci il campo di ricerca
});

searchButtonSurname.addEventListener("click", async () => {
  const searchTerm = searchClientInputSurname.value.trim();

  // Controlla se il campo è vuoto
  if (!searchTerm) {
    alert("Inserisci un cognome.");
    return;
  }

  // Crea la query string dinamica per cercare per cognome
  const queryParams = [`cognome=${searchTerm}`];

  // Fai la chiamata API con la query string generata
  const response = await fetch(
    `http://3.67.185.158:3000/api/clienti/search?${queryParams.join("&")}`
  );

  // Ricevi i risultati dalla risposta dell'API
  const results = await response.json();

  // Mostra i risultati
  if (results.length > 0) {
    searchResultsSurname.innerHTML = results
      .map(
        (client) => `
          <div class="result-item client-row">
            <span>${client.nome}</span>
            <span>${client.cognome}</span>
            <span>${client.scuola}</span>
            <span>${client.telefono}</span>
            <span>${client.note}</span>
          </div>
        `
      )
      .join("");
  } else {
    searchResultsSurname.innerHTML =
      "<p>Nessun cliente trovato per questo cognome.</p>";
  }
});

// Funzione per resettare i risultati della ricerca per cognome
closeSearchButtonSurname.addEventListener("click", () => {
  searchResultsSurname.innerHTML = ""; // Cancella i risultati di ricerca
  searchClientInputSurname.value = ""; // Pulisci il campo di ricerca
});

$(document).ready(function () {
  // Mostra il pulsante quando si scorre giù
  $(window).scroll(function () {
    if ($(this).scrollTop() > 200) {
      $("#backToTop").fadeIn();
    } else {
      $("#backToTop").fadeOut();
    }
  });

  // Quando il pulsante viene cliccato, torna in cima
  $("#backToTop").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 600);
  });
});
