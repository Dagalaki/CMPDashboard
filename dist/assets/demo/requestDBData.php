<?php
header("Content-Type: application/json");
	$servername = "localhost";
	$username = "cmp_user";
	$password = "fjurtiolunb";
	$db = "cmp";
	$conn = null;

	$action=$_GET["action"];
	$vendorlist= $_GET["vendorlist"];
	$vendorsTotal= 41;
	$from = $_GET["from"];
	$to=$_GET["to"];

	// Create connection
	$conn = new mysqli($servername, $username, $password, $db);

	// Check connection
	if ($conn->connect_error) {
	  die("Connection failed: " . $conn->connect_error);
	}

	if($action == "getOverallStats"){
		$tableName = $_GET["table"];
		$query = "SELECT consent_date, total, partially_accepted_percentage, accepted_percentage, rejected_percentage FROM ".$tableName." WHERE consent_date BETWEEN '".$_GET["from"]."' AND '".$_GET["to"]."' ORDER BY consent_date";
		$result = $conn->query($query);
		$labels = [];
		$pr_data = [];
		$a_data = [];
		$r_data = [];
		$total = [];
		if ($result->num_rows > 0) {
		    while ($row = $result->fetch_assoc()) {
		        $labels[] = $row['consent_date'];
		        $pr_data[] = (int) $row['partially_accepted_percentage'];
		        $a_data[] = (int) $row['accepted_percentage'];
		        $r_data[] = (int) $row['rejected_percentage'];
		        $total[] = (int) $row['total'];
		    }
		} else {
		    echo "No results found for the given date range.";
		}

		$response = [
		    "labels" => $labels,
		    "pr_data" => $pr_data,
		    "a_data" => $a_data,
		    "r_data" => $r_data,
		    "total" => $total
		];
		echo json_encode($response);
	}
	
	if($action == "total"){
		//accepted
		$query = "SELECT 
    COUNT(DISTINCT edited_users.user_id) AS total_users_edited_consent
FROM 
    -- Subquery to find all users who have consented to any of the vendors in the given range
    (SELECT DISTINCT user_id
     FROM VendorConsents
     WHERE DATE(timestamp) BETWEEN '2024-11-19' AND '2024-11-19') AS all_users

JOIN
    -- Subquery to find users who have edited their consent (more than one consent entry for a vendor)
    (SELECT user_id
     FROM VendorConsents
     WHERE vendor_id IN (40,50,39,128,78,758,755,98,278,812,373,140,68,32,76,52,285,293,70,21,788,126,394,707,1126,136,1057,16,264,25,565,156,24,11,793,202,1127,985,115,1019,1206,758)
     AND DATE(timestamp) BETWEEN '2024-11-19' AND '2024-11-19'
     GROUP BY user_id, vendor_id
     HAVING COUNT(*) >= 1) AS edited_users
ON all_users.user_id = edited_users.user_id";



	}else if($action == "partially_accepted"){

		$query = "SELECT all_users.consent_date,(COUNT(DISTINCT all_vendors_accepted.user_id) / COUNT(DISTINCT all_users.user_id)) * 100 AS partially_accepted_percentage FROM (SELECT DISTINCT user_id, DATE(timestamp) AS consent_date FROM VendorConsents WHERE DATE(timestamp) BETWEEN '".$from."' AND '".$to."') AS all_users LEFT JOIN (SELECT user_id, DATE(timestamp) AS consent_date FROM VendorConsents WHERE vendor_id IN (".$vendorlist.") AND consent_value = 1 AND DATE(timestamp) BETWEEN '".$from."' AND '".$to."' GROUP BY DATE(timestamp), user_id HAVING COUNT(DISTINCT vendor_id) < ".$vendorsTotal.") AS all_vendors_accepted ON all_users.user_id = all_vendors_accepted.user_id AND all_users.consent_date = all_vendors_accepted.consent_date GROUP BY all_users.consent_date ORDER BY all_users.consent_date";

			$result = $conn->query($query);

			
			if ($result === false) {
			    die("(".$q.")Error in query execution: " . $conn->error);
			}

			
			$labels = [];
			$data = [];

			while ($row = $result->fetch_assoc()) {
			    $labels[] = $row['consent_date']; 
			    $data[] = (float) $row['partially_accepted_percentage'];
			}

			$ret = [
			    'labels' => $labels,
			    'pr_data' => $data
			];

			echo json_encode($ret);
			exit();

	}else if($action== "refused"){

/* 
AND consent_value = 0
..
HAVING COUNT(DISTINCT vendor_id) = 41)*/
	}else if($action=="accepted"){
		/* 
AND consent_value = 1
..
HAVING COUNT(DISTINCT vendor_id) = 41)*/


	}
	if($conn) $conn->close();

?>
