<?php 

    $servername = "localhost";
    $username = "cmp_user";
    $password = "fjurtiolunb";
    $db = "cmp";
    $conn = null;


$conn = new mysqli($servername, $username, $password, $db);

    // Check connection
    if ($conn->connect_error) {
      die("Connection failed: " . $conn->connect_error);
    }

    $url = 'https://vendor-list.consensu.org/v3/vendor-list.json';

// Fetch the JSON data
$jsonData = file_get_contents($url);
if ($jsonData === false) {
    die("Failed to retrieve JSON data from $url");
}

$data = json_decode($jsonData, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    die("Invalid JSON data: " . json_last_error_msg());
}

$vendors = $data['vendors'] ?? [];

$query = "SELECT TCFv2_ID FROM AllowedVendors";
$result = $conn->query($query);

if (!$result) {
    die("Database query failed: " . $conn->error);
}

$allowedVendors = [];
while ($row = $result->fetch_assoc()) {
    $allowedVendors[] = $row['TCFv2_ID'];
}

$filteredVendors = array_filter($vendors, function ($vendor, $id) use ($allowedVendors) {
    return in_array($id, $allowedVendors) && !empty($vendor['specialFeatures']);
}, ARRAY_FILTER_USE_BOTH);

// Extract vendor information with special purposes
$response = [];
foreach ($filteredVendors as $id => $vendor) {
    $response[] = [
        'id' => $id,
        'name' => $vendor['name'],
        'specialPurposes' => $vendor['specialFeatures'] ?? []
    ];
}

$conn->close();

// Return the result as JSON
header('Content-Type: application/json');
echo json_encode($response, JSON_PRETTY_PRINT);

?>