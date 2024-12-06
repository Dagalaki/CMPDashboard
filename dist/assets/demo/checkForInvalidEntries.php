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

$globalVendorIds = array_keys($data['vendors'] ?? []);

$query = "SELECT TCFv2_ID, Vendor FROM AllowedVendors";
$result = $conn->query($query);

if (!$result) {
    die("Database query failed: " . $conn->error);
}

$allowedVendors = [];
while ($row = $result->fetch_assoc()) {
    $allowedVendors[] = $row;
}
$missingVendors = array_filter($allowedVendors, function ($vendor) use ($globalVendorIds) {
    return !in_array($vendor['TCFv2_ID'], $globalVendorIds);
});

$response = array_map(function ($vendor) {
    return [
        'TCFv2_ID' => $vendor['TCFv2_ID'],
        'Vendor' => $vendor['Vendor']
    ];
}, $missingVendors);

$conn->close();


header('Content-Type: application/json');
echo json_encode($response, JSON_PRETTY_PRINT);

?>