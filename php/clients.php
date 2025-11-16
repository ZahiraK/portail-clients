<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Fonction pour lire les clients
function getClients() {
    $filePath = '../data/clients.json';
    
    if (!file_exists($filePath)) {
        // Créer le fichier avec un tableau vide
        file_put_contents($filePath, json_encode([]));
        return [];
    }
    
    $data = file_get_contents($filePath);
    $clients = json_decode($data, true);
    
    // Vérifier si le JSON est valide
    if (json_last_error() !== JSON_ERROR_NONE) {
        return [];
    }
    
    return $clients ?: [];
}

// Récupérer et retourner les clients
$clients = getClients();
echo json_encode($clients);
?>