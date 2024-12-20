const fetchClientsButton = document.getElementById("fetchClients");
const clientList = document.getElementById("clientList");
const searchClientInput = document.getElementById("searchClient");
const backToTopButton = document.getElementById("backToTop");
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
const searchClientInputToEdit = document.getElementById("searchClientToEdit");
const searchButtonEdit = document.getElementById("searchButtonEdit");
const editClientFormContainer = document.getElementById(
  "editClientFormContainer"
);
const editClientForm = document.getElementById("editClientForm");
const searchClientDeleteInput = document.getElementById("searchClientDelete");
const searchButtonDelete = document.getElementById("searchButtonDelete");
const deleteResults = document.getElementById("deleteResults");
const deleteClientButton = document.getElementById("deleteClientButton");
const searchClientToAddProductInput = document.getElementById(
  "searchClientToAddProduct"
);
const searchClientInputToAddProduct = document.getElementById(
  "searchClientToAddProduct"
);
const searchButtonAddProduct = document.getElementById(
  "searchButtonAddProduct"
);
const addProductFormContainer = document.getElementById(
  "addProductFormContainer"
);
const addProductForm = document.getElementById("addProductForm");
let clientIdToAddProduct = null; // Variabile per memorizzare l'ID del cliente da cui aggiungere il prodotto

const viewDailyIncomeBtn = document.getElementById("view-daily-income-btn");
const dailyIncomeResult = document.getElementById("daily-income-result");
const incomeAmount = document.getElementById("income-amount");
const closeDailyIncomeBtn = document.getElementById("close-daily-income");
const dailyIncomeSection = document.getElementById("daily-income-section");

fetchClientsButton.addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `https://dashboard.stepsofdance.com/api/clienti`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  const clients = await response.json();
  clientList.innerHTML = clients
    .map(
      (client) => `
            <div class="client-info">
        <h3>Informazioni Cliente</h3>
        <div class="client-details">
          <span><strong>Nome:</strong> ${client.nome}</span><br>
          <span><strong>Cognome:</strong> ${client.cognome}</span><br>
          <span><strong>Scuola:</strong> ${client.scuola}</span><br>
          <span><strong>Luogo:</strong> ${client.luogo}</span><br>
          <span><strong>Telefono:</strong> ${client.telefono}</span><br>
          <span><strong>Note:</strong> ${
            client.note || "Nessuna nota"
          }</span><br>
        </div>
      </div>
      <div class="purchases">
        <h3>Acquisti</h3>
        ${
          client.acquisti.length > 0
            ? `<ul class="purchase-list">
              ${client.acquisti
                .map(
                  (acquisto) => `
                <li class="purchase-item">
                  <p><strong>Prodotto:</strong> ${acquisto.product}</p>
                  <p><strong>Prezzo:</strong> €${acquisto.price.toFixed(2)}</p>
                  <p><strong>Data d'acquisto:</strong> ${new Date(
                    acquisto.date
                  ).toLocaleDateString("it-IT")}</p>
                  <p><strong>Note:</strong> ${
                    acquisto.notes || "Nessuna nota"
                  }</p>
                </li>
              `
                )
                .join("")}
             </ul>`
            : "<p>Nessun acquisto registrato</p>"
        }
      </div>
        `
    )
    .join("");
});

searchButton.addEventListener("click", async () => {
  const searchTerm = searchClientInput.value.trim();

  if (!searchTerm) {
    alert("Inserisci un termine di ricerca.");
    return;
  }

  const searchTerms = searchTerm.split(" ").filter((term) => term);

  let queryParams = [];
  if (searchTerms[0]) queryParams.push(`nome=${searchTerms[0]}`);
  if (searchTerms[1]) queryParams.push(`cognome=${searchTerms[1]}`);
  if (searchTerms[2]) queryParams.push(`scuola=${searchTerms[2]}`);

  const queryString = queryParams.join("&");

  const token = localStorage.getItem("token");
  const response = await fetch(
    `https://dashboard.stepsofdance.com/api/clienti/search?${queryString}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const results = await response.json();

  if (results.length > 0) {
    searchResults.innerHTML = results
      .map(
        (client) => `
         <div class="client-info">
          <h3>Informazioni Cliente</h3>
          <div class="client-details">
            <span><strong>Nome:</strong> ${client.nome}</span><br>
            <span><strong>Cognome:</strong> ${client.cognome}</span><br>
            <span><strong>Scuola:</strong> ${client.scuola}</span><br>
            <span><strong>Luogo:</strong> ${client.luogo}</span><br>
            <span><strong>Telefono:</strong> ${client.telefono}</span><br>
            <span><strong>Note:</strong> ${
              client.note || "Nessuna nota"
            }</span><br>
          </div>
          <div class="purchases">
            <h3>Acquisti</h3>
            ${
              client.acquisti.length > 0
                ? `<ul class="purchase-list">
                  ${client.acquisti
                    .map(
                      (acquisto) => `
                    <li class="purchase-item">
                      <p><strong>Prodotto:</strong> ${acquisto.product}</p>
                      <p><strong>Prezzo:</strong> €${acquisto.price.toFixed(
                        2
                      )}</p>
                      <p><strong>Data d'acquisto:</strong> ${new Date(
                        acquisto.date
                      ).toLocaleDateString("it-IT")}</p>
                      <p><strong>Note:</strong> ${
                        acquisto.notes || "Nessuna nota"
                      }</p>
                      <button class="delete-btn btn btn-danger" data-client-id="${
                        client._id
                      }" data-product-id="${
                        acquisto._id
                      }">Elimina Prodotto</button>
                    </li>
                  `
                    )
                    .join("")}
                 </ul>`
                : "<p>Nessun acquisto registrato</p>"
            }
          </div>
         </div>
        `
      )
      .join("");

    // Aggiungi event listener per ciascun bottone di eliminazione
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", async () => {
        const clientId = button.getAttribute("data-client-id");
        const productId = button.getAttribute("data-product-id");

        if (confirm("Sei sicuro di voler eliminare questo acquisto?")) {
          try {
            const response = await fetch(
              `https://dashboard.stepsofdance.com/api/clienti/${clientId}/delete/${productId}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (response.ok) {
              alert("Acquisto eliminato con successo!");
              // Rimuovi l'elemento dall'HTML
              button.closest(".purchase-item").remove();
            } else {
              const errorData = await response.json();
              console.error("Errore durante la cancellazione:", errorData);
              alert("Errore durante l'eliminazione dell'acquisto.");
            }
          } catch (error) {
            console.error("Errore di rete o di fetch:", error);
            alert("Errore di rete durante l'eliminazione dell'acquisto.");
          }
        }
      });
    });
  } else {
    searchResults.innerHTML = "<p>Nessun cliente trovato.</p>";
  }
});

closeSearchButton.addEventListener("click", () => {
  searchResults.innerHTML = "";
  searchClientInput.value = "";
  clientList.innerHTML = "";
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

  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://dashboard.stepsofdance.com/api/clienti`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newClient),
      }
    );

    // Stampa la risposta del server

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

  const token = localStorage.getItem("token");
  const response = await fetch(
    `https://dashboard.stepsofdance.com/api/clienti/search?${queryParams.join(
      "&"
    )}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  // Ricevi i risultati dalla risposta dell'API
  const results = await response.json();

  // Mostra i risultati
  if (results.length > 0) {
    searchResultsSchool.innerHTML = results
      .map(
        (client) => `
         <div class="client-info">
        <h3>Informazioni Cliente</h3>
        <div class="client-details">
          <span><strong>Nome:</strong> ${client.nome}</span><br>
          <span><strong>Cognome:</strong> ${client.cognome}</span><br>
          <span><strong>Scuola:</strong> ${client.scuola}</span><br>
          <span><strong>Luogo:</strong> ${client.luogo}</span><br>
          <span><strong>Telefono:</strong> ${client.telefono}</span><br>
          <span><strong>Note:</strong> ${
            client.note || "Nessuna nota"
          }</span><br>
        </div>
      </div>
      <div class="purchases">
        <h3>Acquisti</h3>
        ${
          client.acquisti.length > 0
            ? `<ul class="purchase-list">
              ${client.acquisti
                .map(
                  (acquisto) => `
                <li class="purchase-item">
                  <p><strong>Prodotto:</strong> ${acquisto.product}</p>
                  <p><strong>Prezzo:</strong> €${acquisto.price.toFixed(2)}</p>
                  <p><strong>Data d'acquisto:</strong> ${new Date(
                    acquisto.date
                  ).toLocaleDateString("it-IT")}</p>
                  <p><strong>Note:</strong> ${
                    acquisto.notes || "Nessuna nota"
                  }</p>
                </li>
              `
                )
                .join("")}
             </ul>`
            : "<p>Nessun acquisto registrato</p>"
        }
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

  const token = localStorage.getItem("token");
  const response = await fetch(
    `https://dashboard.stepsofdance.com/api/clienti/search?${queryParams.join(
      "&"
    )}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  // Ricevi i risultati dalla risposta dell'API
  const results = await response.json();

  // Mostra i risultati
  if (results.length > 0) {
    searchResultsSurname.innerHTML = results
      .map(
        (client) => `
          <div class="client-info">
        <h3>Informazioni Cliente</h3>
        <div class="client-details">
          <span><strong>Nome:</strong> ${client.nome}</span><br>
          <span><strong>Cognome:</strong> ${client.cognome}</span><br>
          <span><strong>Scuola:</strong> ${client.scuola}</span><br>
          <span><strong>Luogo:</strong> ${client.luogo}</span><br>
          <span><strong>Telefono:</strong> ${client.telefono}</span><br>
          <span><strong>Note:</strong> ${
            client.note || "Nessuna nota"
          }</span><br>
        </div>
      </div>
      <div class="purchases">
        <h3>Acquisti</h3>
        ${
          client.acquisti.length > 0
            ? `<ul class="purchase-list">
              ${client.acquisti
                .map(
                  (acquisto) => `
                <li class="purchase-item">
                  <p><strong>Prodotto:</strong> ${acquisto.product}</p>
                  <p><strong>Prezzo:</strong> €${acquisto.price.toFixed(2)}</p>
                  <p><strong>Data d'acquisto:</strong> ${new Date(
                    acquisto.date
                  ).toLocaleDateString("it-IT")}</p>
                  <p><strong>Note:</strong> ${
                    acquisto.notes || "Nessuna nota"
                  }</p>
                </li>
              `
                )
                .join("")}
             </ul>`
            : "<p>Nessun acquisto registrato</p>"
        }
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

backToTopButton.addEventListener("click", () => {
  searchResults.innerHTML = ""; // Cancella eventuali risultati di ricerca
  searchClientInput.value = ""; // Pulisci il campo di ricerca
  clientList.innerHTML = ""; // Pulisci la lista dei clienti o fai una chiamata per mostrare tutti i clienti
  searchResultsSurname.innerHTML = ""; // Cancella i risultati di ricerca
  searchClientInputSurname.value = ""; // Pulisci il campo di ricerca
  searchResultsSchool.innerHTML = ""; // Cancella i risultati di ricerca
  searchClientInputSchool.value = ""; // Pulisci il campo di ricerca
});

// edit client form
searchButtonEdit.addEventListener("click", async () => {
  const searchTerm = searchClientInputToEdit.value.trim();

  // Controlla se il campo è vuoto
  if (!searchTerm) {
    alert("Inserisci un termine di ricerca.");
    return;
  }

  // Suddividi il termine di ricerca in parole
  const searchTerms = searchTerm.split(" ").filter((term) => term); // Rimuove eventuali spazi vuoti

  // Crea una query string dinamica
  let queryParams = [];
  if (searchTerms[0]) queryParams.push(`nome=${searchTerms[0]}`);
  if (searchTerms[1]) queryParams.push(`cognome=${searchTerms[1]}`);

  const queryString = queryParams.join("&");

  // Fai la chiamata API con la query string generata
  const token = localStorage.getItem("token");
  const response = await fetch(
    `https://dashboard.stepsofdance.com/api/clienti/search?${queryString}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  const results = await response.json();

  if (results.length > 0) {
    const client = results[0]; // Prendi il primo cliente trovato

    // Riempi il form con i dati del cliente
    document.getElementById("editName").value = client.nome;
    document.getElementById("editSurname").value = client.cognome;
    document.getElementById("editTelephone").value = client.telefono;
    document.getElementById("editSchool").value = client.scuola;
    document.getElementById("editLocation").value = client.luogo;
    document.getElementById("editNotes").value = client.note;

    // Mostra il form di modifica
    editClientFormContainer.style.display = "block";
  } else {
    alert("Nessun cliente trovato.");
    editClientFormContainer.style.display = "none";
  }
});

editClientForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const updatedClient = {
    nome: document.getElementById("editName").value,
    cognome: document.getElementById("editSurname").value,
    telefono: document.getElementById("editTelephone").value,
    scuola: document.getElementById("editSchool").value,
    luogo: document.getElementById("editLocation").value,
    note: document.getElementById("editNotes").value,
  };

  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://dashboard.stepsofdance.com/api/clienti`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedClient),
      }
    );

    if (response.ok) {
      alert("Cliente aggiornato con successo!");
      editClientFormContainer.style.display = "none"; // Nascondi il form di modifica
      searchClientInputToEdit.value = ""; // Pulisci il campo di ricerca
    } else {
      const errorData = await response.json();
      console.error("Errore dall'API:", errorData);
      alert("Errore durante l'aggiornamento del cliente.");
    }
  } catch (error) {
    console.error("Errore di rete o di fetch:", error);
    alert("Errore di rete durante l'aggiornamento del cliente.");
  }
});

let clientIdToDelete = null; // Variabile per memorizzare l'ID del cliente da eliminare

searchButtonDelete.addEventListener("click", async () => {
  const searchTerm = searchClientDeleteInput.value.trim();

  if (!searchTerm) {
    alert("Inserisci un termine di ricerca.");
    return;
  }

  const searchTerms = searchTerm.split(" ").filter((term) => term);
  let queryParams = [];
  if (searchTerms[0]) queryParams.push(`nome=${searchTerms[0]}`);
  if (searchTerms[1]) queryParams.push(`cognome=${searchTerms[1]}`);

  const queryString = queryParams.join("&");
  const token = localStorage.getItem("token");
  const response = await fetch(
    `https://dashboard.stepsofdance.com/api/clienti/search?${queryString}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const results = await response.json();

  if (results.length > 0) {
    const client = results[0]; // Prendi il primo cliente trovato
    clientIdToDelete = client._id; // Usa '_id' per accedere all'ID corretto

    deleteResults.innerHTML = `
      <div class="client-info">
        <h3>Informazioni Cliente</h3>
        <div class="client-details">
          <span><strong>Nome:</strong> ${client.nome}</span><br>
          <span><strong>Cognome:</strong> ${client.cognome}</span><br>
          <span><strong>Scuola:</strong> ${client.scuola}</span><br>
          <span><strong>Luogo:</strong> ${client.luogo}</span><br>
          <span><strong>Telefono:</strong> ${client.telefono}</span><br>
          <span><strong>Note:</strong> ${
            client.note || "Nessuna nota"
          }</span><br>
        </div>
      </div>
      <div class="purchases">
        <h3>Acquisti</h3>
        ${
          client.acquisti.length > 0
            ? `<ul class="purchase-list">
              ${client.acquisti
                .map(
                  (acquisto) => `
                <li class="purchase-item">
                  <p><strong>Prodotto:</strong> ${acquisto.product}</p>
                  <p><strong>Prezzo:</strong> €${acquisto.price.toFixed(2)}</p>
                  <p><strong>Data d'acquisto:</strong> ${new Date(
                    acquisto.date
                  ).toLocaleDateString("it-IT")}</p>
                  <p><strong>Note:</strong> ${
                    acquisto.notes || "Nessuna nota"
                  }</p>
                </li>
              `
                )
                .join("")}
             </ul>`
            : "<p>Nessun acquisto registrato</p>"
        }
      </div>
    `;
    deleteClientButton.style.display = "block"; // Mostra il pulsante elimina
  } else {
    deleteResults.innerHTML = "<p>Nessun cliente trovato.</p>";
    deleteClientButton.style.display = "none"; // Nascondi il pulsante elimina
  }
});

// Sposta questo codice fuori dalla funzione di ricerca
deleteClientButton.addEventListener("click", async () => {
  if (!clientIdToDelete) {
    alert("Nessun cliente selezionato per l'eliminazione.");
    return;
  }

  try {
    const deleteResponse = await fetch(
      `https://dashboard.stepsofdance.com/api/clienti/${clientIdToDelete}`,
      {
        method: "DELETE",
      }
    );

    if (deleteResponse.ok) {
      alert("Cliente eliminato con successo!");
      deleteResults.innerHTML = ""; // Pulisci i risultati
      searchClientDeleteInput.value = ""; // Pulisci il campo di ricerca
      clientIdToDelete = null; // Resetta l'ID del cliente
      deleteClientButton.style.display = "none"; // Nascondi il pulsante elimina
    } else {
      alert("Errore durante l'eliminazione del cliente.");
    }
  } catch (error) {
    console.error("Errore di rete durante l'eliminazione:", error);
    alert("Errore di rete durante l'eliminazione del cliente.");
  }
});

// Funzione per cercare il cliente
searchButtonAddProduct.addEventListener("click", async () => {
  const searchTerm = searchClientInputToAddProduct.value.trim();

  if (!searchTerm) {
    alert("Inserisci un termine di ricerca.");
    return;
  }

  const searchTerms = searchTerm.split(" ").filter((term) => term);
  let queryParams = [];
  if (searchTerms[0]) queryParams.push(`nome=${searchTerms[0]}`);
  if (searchTerms[1]) queryParams.push(`cognome=${searchTerms[1]}`);

  const queryString = queryParams.join("&");
  const token = localStorage.getItem("token");

  const response = await fetch(
    `https://dashboard.stepsofdance.com/api/clienti/search?${queryString}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const results = await response.json();

  if (results.length > 0) {
    const client = results[0]; // Prendi il primo cliente trovato
    clientIdToAddProduct = client._id; // Usa '_id' per accedere all'ID corretto

    // Mostra il form di aggiunta prodotto
    addProductFormContainer.style.display = "block";
  } else {
    alert("Nessun cliente trovato.");
    addProductFormContainer.style.display = "none";
  }
});

// Funzione per aggiungere il prodotto
addProductForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const newProduct = {
    product: document.getElementById("productName").value,
    price: parseFloat(document.getElementById("productPrice").value),
    notes: document.getElementById("productNotes").value,
    date: document.getElementById("calendarDate").value, // Usa la data selezionata dall'utente
  };

  console.log(
    `URL per aggiungere prodotto: https://dashboard.stepsofdance.com/api/clienti/${clientIdToAddProduct}/buying`
  );
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://dashboard.stepsofdance.com/api/clienti/${clientIdToAddProduct}/buying`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      }
    );

    if (response.ok) {
      alert("Prodotto aggiunto con successo!");
      addProductForm.reset();
      addProductFormContainer.style.display = "none"; // Nascondi il form dopo l'aggiunta
    } else {
      const errorData = await response.json();
      console.error("Errore dall'API:", errorData);
      alert("Errore durante l'aggiunta del prodotto.");
    }
  } catch (error) {
    console.error("Errore di rete o di fetch:", error);
    alert("Errore di rete durante l'aggiunta del prodotto.");
  }
});
// Aggiungi l'event listener per il clic sul bottone "Mostra Incasso"
viewDailyIncomeBtn.addEventListener("click", async () => {
  try {
    const response = await fetch(
      "https://dashboard.stepsofdance.com/api/incassi-oggi"
    );
    if (response.ok) {
      const data = await response.json();
      incomeAmount.textContent = `€${data.totaleIncassi}`; // Assumendo che la risposta abbia un campo "incasso"
      dailyIncomeResult.style.display = "block"; // Mostra il risultato
    } else {
      throw new Error("Errore nella chiamata API");
    }
  } catch (error) {
    console.error("Errore di rete o di fetch:", error);
    alert("Errore durante il recupero dell'incasso.");
  }
});

// Aggiungi l'event listener per il clic sul bottone "Chiudi"
closeDailyIncomeBtn.addEventListener("click", () => {
  dailyIncomeResult.style.display = "none"; // Nascondi il risultato
});

//aa
const calculateIncomeBtn = document.getElementById("calculateIncome");
const incomeAmountDisplay = document.getElementById("income-amount-2");
const resultDiv = document.getElementById("result");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const closeResultBtn = document.getElementById("closeResult"); // Aggiungi il selettore per il pulsante di chiusura

calculateIncomeBtn.addEventListener("click", async function () {
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;

  if (!startDate || !endDate) {
    alert("Seleziona entrambe le date.");
    return;
  }

  try {
    const response = await fetch(
      `https://dashboard.stepsofdance.com/api/incassi?startDate=${startDate}&endDate=${endDate}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Errore HTTP: ${response.status}`);
    }

    const data = await response.json();

    // Controlla se 'totaleIncassi' è presente
    if (data.totaleIncassi !== undefined) {
      console.log("Totale incassi ricevuto:", data.totaleIncassi);

      const formattedAmount = new Intl.NumberFormat("it-IT", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(data.totaleIncassi); // Formattiamo l'importo

      incomeAmountDisplay.textContent = formattedAmount; // Aggiorniamo il contenuto
      resultDiv.style.display = "block"; // Mostriamo il div del risultato
      console.log("Result div display:", resultDiv.style.display); // Debug
    } else {
      throw new Error("Dati non validi ricevuti dal server");
    }
  } catch (error) {
    console.error("Errore:", error);
    alert("Si è verificato un errore: " + error.message);
  }
});

// Gestisci il clic sul pulsante di chiusura
closeResultBtn.addEventListener("click", function () {
  resultDiv.style.display = "none"; // Nascondi il div del risultato
});

// delete x product
