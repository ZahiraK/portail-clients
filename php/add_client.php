<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Fonction TRÈS LONGUE avec plusieurs responsabilités
function addNewClient($clientData) {
    // Valider les données
    if (empty($clientData['name']) || empty($clientData['email'])) {
        return ['success' => false, 'message' => 'Le nom et l\'email sont obligatoires'];
    }
    
    // Valider l'email
    if (!filter_var($clientData['email'], FILTER_VALIDATE_EMAIL)) {
        return ['success' => false, 'message' => 'Email invalide'];
    }
    
    // Lire les clients existants
    $filePath = '../data/clients.json';
    $clients = [];
    
    if (file_exists($filePath)) {
        $data = file_get_contents($filePath);
        $clients = json_decode($data, true) ?: [];
    }
    
    // Vérifier si l'email existe déjà
    foreach ($clients as $client) {
        if ($client['email'] === $clientData['email']) {
            return ['success' => false, 'message' => 'Un client avec cet email existe déjà'];
        }
    }
    
    // Ajouter le nouveau client
    $newClient = [
        'id' => count($clients) + 1,
        'name' => trim($clientData['name']),
        'email' => trim($clientData['email']),
        'phone' => isset($clientData['phone']) ? trim($clientData['phone']) : '',
        'address' => isset($clientData['address']) ? trim($clientData['address']) : '',
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    $clients[] = $newClient;
    
    // Sauvegarder
    if (file_put_contents($filePath, json_encode($clients, JSON_PRETTY_PRINT))) {
        return ['success' => true, 'message' => 'Client ajouté avec succès'];
    } else {
        return ['success' => false, 'message' => 'Erreur lors de la sauvegarde'];
    }
}

// Traiter la requête
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if ($input) {
        $result = addNewClient($input);
        echo json_encode($result);
    } else {
        echo json_encode(['success' => false, 'message' => 'Données invalides']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
}
?>