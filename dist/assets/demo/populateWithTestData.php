<?php

	$servername = "localhost";
	$username = "cmp_user";
	$password = "fjurtiolunb";
	$db = "cmp";
	$conn = null;

	$conn = new mysqli($servername, $username, $password, $db);

	
	if ($conn->connect_error) {
	  die("Connection failed: " . $conn->connect_error);
	}


	function generateTestData($startDate, $endDate) {
    $data = [];
    $currentDate = strtotime($startDate);
    $end = strtotime($endDate);

    while ($currentDate <= $end) {
        $date = date('Y-m-d', $currentDate);
        $partiallyAccepted = rand(0, 100);
        $accepted = rand(0, 100);
        $rejected = rand(0, 100);
        $total = rand(50, 1000); 

        $data[] = [
            'consent_date' => $date,
            'partially_accepted_percentage' => $partiallyAccepted,
            'accepted_percentage' => $accepted,
            'rejected_percentage' => $rejected,
            'total' => $total
        ];

        $currentDate = strtotime('+1 day', $currentDate);
    }

    return $data;
}

	$testData = generateTestData('2024-10-19', '2024-11-19');


	$stmt = $conn->prepare("INSERT INTO VendorConsentStatistics 
    (consent_date, partially_accepted_percentage, accepted_percentage, rejected_percentage, total) 
    VALUES (?, ?, ?, ?, ?)");

	$stmt->bind_param("siiii", $consentDate, $partiallyAccepted, $accepted, $rejected, $total);

		foreach ($testData as $row) {
		    $consentDate = $row['consent_date'];
		    $partiallyAccepted = $row['partially_accepted_percentage'];
		    $accepted = $row['accepted_percentage'];
		    $rejected = $row['rejected_percentage'];
		    $total = $row['total'];

		    $stmt->execute();
		}
	$stmt->close();
	if($conn) $conn->close();
?>