<?php

if(isset($_GET["action"]) && $_GET["action"] == "vendors"){
    $allowedVendorsUrl = "http://smarttv.anixa.tv/cmp2.2/src/vendorsDE.json";
    $list = file_get_contents($allowedVendorsUrl);
    echo $list;

    exit();
}

// Fetch the content of the vendor list JSON file
$vendorListUrl = 'https://vendor-list.consensu.org/v3/vendor-list.json';
$translationDEUrl = "https://vendor-list.consensu.org/v3/purposes-de.json";
//$translationDEUrl = "./purposes-de.json";
$vendorListContent = file_get_contents($vendorListUrl);
$translationDE = file_get_contents($translationDEUrl);


$vendorListContent = json_decode($vendorListContent, true);
$translationDE = json_decode($translationDE, true);

// Check if the content was fetched successfully
if ($vendorListContent !== false && $translationDE !== false) {
    // Set the appropriate headers for JSON response
    header('Content-Type: application/json');

    for($i=0 ; $i < count($vendorListContent["purposes"]); $i++ ){

        $vendorListContent['purposes'][''.($i+1).'']['id'] = $translationDE['purposes'][''.($i+1).'']['id'];
        $vendorListContent['purposes'][''.($i+1).'']['name'] = $translationDE['purposes'][''.($i+1).'']['name'];
        $vendorListContent['purposes'][''.($i+1).'']['description'] = $translationDE['purposes'][''.($i+1).'']['description'];
        $vendorListContent['purposes'][''.($i+1).'']['illustrations'] = $translationDE['purposes'][''.($i+1).'']['illustrations'];
    }
    

    // Output the content
    echo json_encode($vendorListContent);
} else {
    // If fetching failed, return an error message
    http_response_code(500); // Internal Server Error
    echo json_encode(['error' => 'Failed to fetch vendor list.']);
}
?>
