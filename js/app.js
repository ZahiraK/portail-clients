// Variables globales - certaines non utilisées intentionnellement
let clientsData = [];
let currentEditingId = null;
let unusedVariable = "Je ne sers à rien"; // VARIABLE NON UTILISÉE
let anotherUnusedVar = 42; // VARIABLE NON UTILISÉE

// Fonction TRÈS LONGUE avec plusieurs responsabilités
function initializeApplication() {
    console.log("Initialisation de l'application...");
    
    // Éléments DOM
    const addClientBtn = document.getElementById('add-client-btn');
    const clientModal = document.getElementById('client-modal');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.getElementById('cancel-btn');
    const clientForm = document.getElementById('client-form');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    // Événements
    if (addClientBtn) {
        addClientBtn.addEventListener('click', function() {
            showModal('add');
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    
    if (clientForm) {
        clientForm.addEventListener('submit', handleFormSubmit);
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', performSearch);
    }
    
    // Charger les clients
    loadClients();
    
    // Initialiser d'autres choses...
    setupOtherThings();
    setupMoreThings();
    andEvenMoreSetup();
}

function setupOtherThings() {
    console.log("Configuration supplémentaire...");
}

function setupMoreThings() {
    console.log("Encore plus de configuration...");
}

function andEvenMoreSetup() {
    console.log("Configuration finale...");
}

// Fonction pour charger les clients
function loadClients() {
    fetch('php/clients.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur réseau');
            }
            return response.json();
        })
        .then(data => {
            clientsData = data;
            displayClients(data);
        })
        .catch(error => {
            console.error('Erreur:', error);
            displayClients([]);
        });
}

// Fonction pour afficher les clients
function displayClients(clients) {
    const clientList = document.getElementById('client-list');
    if (!clientList) return;
    
    clientList.innerHTML = '';
    
    if (clients.length === 0) {
        clientList.innerHTML = '<p class="no-clients">Aucun client trouvé</p>';
        return;
    }
    
    clients.forEach(client => {
        const clientCard = document.createElement('div');
        clientCard.className = 'client-card';
        clientCard.innerHTML = `
            <h4>${escapeHtml(client.name)}</h4>
            <p>📧 ${escapeHtml(client.email)}</p>
            ${client.phone ? `<p>📞 ${escapeHtml(client.phone)}</p>` : ''}
            ${client.address ? `<p>🏠 ${escapeHtml(client.address)}</p>` : ''}
            <div class="client-actions">
                <button onclick="editClient(${client.id})" class="btn-small">Modifier</button>
                <button onclick="deleteClient(${client.id})" class="btn-small btn-danger">Supprimer</button>
            </div>
        `;
        clientList.appendChild(clientCard);
    });
}

// Échapper le HTML pour la sécurité
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Afficher le modal
function showModal(mode, client = null) {
    const modal = document.getElementById('client-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('client-form');
    
    if (mode === 'edit' && client) {
        modalTitle.textContent = 'Modifier le Client';
        document.getElementById('client-name').value = client.name || '';
        document.getElementById('client-email').value = client.email || '';
        document.getElementById('client-phone').value = client.phone || '';
        document.getElementById('client-address').value = client.address || '';
        currentEditingId = client.id;
    } else {
        modalTitle.textContent = 'Ajouter un Client';
        form.reset();
        currentEditingId = null;
    }
    
    modal.style.display = 'block';
}

// Fermer le modal
function closeModal() {
    const modal = document.getElementById('client-modal');
    modal.style.display = 'none';
}

// Gérer la soumission du formulaire
function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('client-name').value,
        email: document.getElementById('client-email').value,
        phone: document.getElementById('client-phone').value,
        address: document.getElementById('client-address').value
    };
    
    if (currentEditingId) {
        updateClient(currentEditingId, formData);
    } else {
        addClient(formData);
    }
}

// Ajouter un client
function addClient(clientData) {
    fetch('php/add_client.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            closeModal();
            loadClients();
        } else {
            alert('Erreur: ' + result.message);
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'ajout du client');
    });
}

// Modifier un client
function updateClient(clientId, clientData) {
    clientData.id = clientId;
    
    fetch('php/edit_client.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            closeModal();
            loadClients();
        } else {
            alert('Erreur: ' + result.message);
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Erreur lors de la modification du client');
    });
}

// Supprimer un client
function deleteClient(clientId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
        return;
    }
    
    fetch('php/delete_client.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: clientId })
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            loadClients();
        } else {
            alert('Erreur: ' + result.message);
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression du client');
    });
}

// Recherche de clients
function performSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    if (!searchTerm) {
        displayClients(clientsData);
        return;
    }
    
    const filteredClients = clientsData.filter(client => 
        client.name.toLowerCase().includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm) ||
        (client.phone && client.phone.includes(searchTerm))
    );
    
    displayClients(filteredClients);
}

// Fonctions globales pour les boutons
window.editClient = function(clientId) {
    const client = clientsData.find(c => c.id == clientId);
    if (client) {
        showModal('edit', client);
    }
};

window.deleteClient = deleteClient;

// DUPLICATION - mêmes fonctions répétées
function searchClients() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    if (!searchTerm) {
        displayClients(clientsData);
        return;
    }
    
    const filteredClients = clientsData.filter(client => 
        client.name.toLowerCase().includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm) ||
        (client.phone && client.phone.includes(searchTerm))
    );
    
    displayClients(filteredClients);
}

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', initializeApplication);