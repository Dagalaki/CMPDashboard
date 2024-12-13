<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type, Authorization"); 
header("Content-Type: application/json");
	$servername = "localhost";
	$username = "cmp_user";
	$password = "fjurtiolunb";
	$db = "cmp";
	$conn = null;

	$action=isset($_GET["action"])? $_GET["action"] : null;
	$tableName = isset($_GET["table"])? $_GET["table"] : null;
	$selected = isset($_GET["selected"])? $_GET["selected"] : null;
	$temp = explode(",", $selected);
	$from = isset($_GET["from"])? $_GET["from"] : null;
	$to=isset($_GET["to"])? $_GET["to"] : null;

	// Create connection
	$conn = new mysqli($servername, $username, $password, $db);

	// Check connection
	if ($conn->connect_error) {
	  die("Connection failed: " . $conn->connect_error);
	}

	
if (isset($_GET['action']) && $_GET['action'] === "addVendor") {
    
    if (isset($_GET['TCFv2_ID'], $_GET['vendorName']) && !empty($_GET['TCFv2_ID']) && !empty($_GET['vendorName'])) {
        $TCFv2_ID = $_GET['TCFv2_ID'];
        $vendorName = $_GET['vendorName'];

        
        $sql = "INSERT INTO AllowedVendors (TCFv2_ID, Vendor) VALUES (?, ?)";
        $stmt = $conn->prepare($sql);

        if ($stmt) {
            $stmt->bind_param("ss", $TCFv2_ID, $vendorName);
            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "Vendor added successfully."]);
            } else {
                echo json_encode(["status" => "error", "message" => "Failed to add vendor."]);
            }
            $stmt->close(); 
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to prepare SQL statement."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid or missing parameters."]);
    }
} 


	if($action == "deleteVendor"){
		
    if (isset($_GET["TCFv2_ID"])) {
        $tcfv2_id = intval($_GET["TCFv2_ID"]); 

        $sql = "DELETE FROM AllowedVendors WHERE TCFv2_ID = ?";
        $stmt = $conn->prepare($sql);

        if ($stmt) {
            
            $stmt->bind_param("i", $tcfv2_id);

            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "Vendor deleted successfully."]);
            } else {
                echo json_encode(["status" => "error", "message" => "Failed to delete vendor."]);
            }

           
            $stmt->close();
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to prepare the statement."]);
        }

       
        $conn->close();
	    } else {
	        echo json_encode(["status" => "error", "message" => "Missing TCFv2_ID parameter."]);
	    }
    exit();

	}

	if($action == "getAllowedVendors"){

		$sql = "SELECT allowed_id, TCFv2_ID, Vendor FROM AllowedVendors ORDER BY allowed_id DESC";
		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
   		 $vendors = array();

    	while ($row = $result->fetch_assoc()) {
        	$vendors[] = $row;
    	}

    	header('Content-Type: application/json');
    	echo json_encode($vendors, JSON_PRETTY_PRINT);
	} else {
    
    	echo json_encode(array("message" => "No data found"));
	}
		$conn->close();

		exit();
	}

	if($action == "getOverallStats"){
		
		$query = "SELECT consent_date, total, partially_accepted_percentage, accepted_percentage, rejected_percentage FROM ".$tableName." WHERE consent_date BETWEEN '".$_GET["from"]."' AND '".$_GET["to"]."' ORDER BY consent_date";
		$result = $conn->query($query);
		$labels = [];
		$pr_data = [];
		$a_data = [];
		$r_data = [];
		$total = [];

		if (!$result) {
	       $response = [
	       		"action" => $action, 
	            "success" => false,
	            "error" => $conn->error,
	            "query" => $query
	        ];
	        echo json_encode($response);
	        exit;
	    }

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
			"action" => $action, 
			"query" => $query,
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
		$fieldName = ($tableName == "VendorConsents"  || $tableName == "VendorLegIntConsents")? "vendor_id" : "purpose_id";
		if($tableName == "SpecialFeaturesOptIns") $fieldName = "feature_id";
		$query = "SELECT DATE(all_users.consent_date) AS consent_date,COUNT(DISTINCT edited_users.user_id) AS total_users_edited_consent FROM (SELECT DISTINCT user_id, DATE(timestamp) AS consent_date FROM ".$tableName." WHERE DATE(timestamp) BETWEEN '".$from."' AND '".$to."') AS all_users JOIN (SELECT user_id, DATE(timestamp) AS consent_date FROM ".$tableName." WHERE ".$fieldName." IN (".$selected.") AND DATE(timestamp) BETWEEN '".$from."' AND '".$to."' GROUP BY user_id, ".$fieldName.", DATE(timestamp) HAVING COUNT(*) >= 1) AS edited_users ON all_users.user_id = edited_users.user_id AND all_users.consent_date = edited_users.consent_date GROUP BY DATE(edited_users.consent_date) ORDER BY edited_users.consent_date";

		if (!$result) {
	       $response = [
	       	"action" => $action, 
	            "success" => false,
	            "error" => $conn->error,
	            "query" => $query
	        ];
	        echo json_encode($response);
	        exit;
	    }
		$result = $conn->query($query);

			if ($result === false) {
			    die("(".$q.")Error in query execution: " . $conn->error);
			}

			$labels = [];
			$data = [];

			while ($row = $result->fetch_assoc()) {
			    $labels[] = $row['consent_date']; 
			    $data[] = (float) $row['total_users_edited_consent'];
			}

			$ret = [
				"action" => $action, 
				'query' => $query,
			    'labels' => $labels,
			    'total' => $data
			];

			echo json_encode($ret);

		exit();

	}else if($action == "partially_accepted"){
		$fieldName = ($tableName == "VendorConsents" || $tableName == "VendorLegIntConsents")? "vendor_id" : "purpose_id";
		if($tableName == "SpecialFeaturesOptIns") $fieldName = "feature_id";
		$query = "SELECT all_users.consent_date,(COUNT(DISTINCT all_vendors_accepted.user_id) / COUNT(DISTINCT all_users.user_id)) * 100 AS partially_accepted_percentage FROM (SELECT DISTINCT user_id, DATE(timestamp) AS consent_date FROM ".$tableName." WHERE DATE(timestamp) BETWEEN '".$from."' AND '".$to."') AS all_users LEFT JOIN (SELECT user_id, DATE(timestamp) AS consent_date FROM ".$tableName." WHERE ".$fieldName." IN (".$selected.") AND consent_value = 1 AND DATE(timestamp) BETWEEN '".$from."' AND '".$to."' GROUP BY DATE(timestamp), user_id HAVING COUNT(DISTINCT ".$fieldName.") < ".count($temp).") AS all_vendors_accepted ON all_users.user_id = all_vendors_accepted.user_id AND all_users.consent_date = all_vendors_accepted.consent_date GROUP BY all_users.consent_date ORDER BY all_users.consent_date";
			$result = $conn->query($query);
			if (!$result) {
		       $response = [
		       	"action" => $action, 
		            "success" => false,
		            "error" => $conn->error,
		            "query" => $query
		        ];
		        echo json_encode($response);
		        exit;
		    }

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
				"action" => $action, 
				'query' => $query,
			    'labels' => $labels,
			    'pr_data' => $data
			];

			echo json_encode($ret);
			

	}else if($action== "refused"){

/* 
AND consent_value = 0
..
HAVING COUNT(DISTINCT vendor_id) = 41)*/
$fieldName = ($tableName == "VendorConsents"  || $tableName == "VendorLegIntConsents")? "vendor_id" : "purpose_id";
if($tableName == "SpecialFeaturesOptIns") $fieldName = "feature_id";
	$query = "SELECT all_users.consent_date,(COUNT(DISTINCT all_vendors_accepted.user_id) / COUNT(DISTINCT all_users.user_id)) * 100 AS percentage FROM (SELECT DISTINCT user_id, DATE(timestamp) AS consent_date FROM ".$tableName." WHERE DATE(timestamp) BETWEEN '".$from."' AND '".$to."') AS all_users LEFT JOIN (SELECT user_id, DATE(timestamp) AS consent_date FROM ".$tableName." WHERE ".$fieldName." IN (".$selected.") AND consent_value = 0 AND DATE(timestamp) BETWEEN '".$from."' AND '".$to."' GROUP BY DATE(timestamp), user_id HAVING COUNT(DISTINCT ".$fieldName.") = ".count($temp).") AS all_vendors_accepted ON all_users.user_id = all_vendors_accepted.user_id AND all_users.consent_date = all_vendors_accepted.consent_date GROUP BY all_users.consent_date ORDER BY all_users.consent_date";
			$result = $conn->query($query);

			if (!$result) {
		       $response = [
		       	"action" => $action, 
		            "success" => false,
		            "error" => $conn->error,
		            "query" => $query
		        ];
		        echo json_encode($response);
		        exit;
		    }
			if ($result === false) {
			    die("(".$q.")Error in query execution: " . $conn->error);
			}

			$labels = [];
			$data = [];

			while ($row = $result->fetch_assoc()) {
			    $labels[] = $row['consent_date']; 
			    $data[] = (float) $row['percentage'];
			}

			$ret = [
				"action" => $action, 
				'query' => $query,
			    'labels' => $labels,
			    'r_data' => $data
			];

			echo json_encode($ret);
			

	}else if($action=="accepted"){
		/* 
AND consent_value = 1
..
HAVING COUNT(DISTINCT vendor_id) = 41)*/
$fieldName = ($tableName == "VendorConsents"  || $tableName == "VendorLegIntConsents")? "vendor_id" : "purpose_id";
if($tableName == "SpecialFeaturesOptIns") $fieldName = "feature_id";
	$query = "SELECT all_users.consent_date,(COUNT(DISTINCT all_vendors_accepted.user_id) / COUNT(DISTINCT all_users.user_id)) * 100 AS percentage FROM (SELECT DISTINCT user_id, DATE(timestamp) AS consent_date FROM ".$tableName." WHERE DATE(timestamp) BETWEEN '".$from."' AND '".$to."') AS all_users LEFT JOIN (SELECT user_id, DATE(timestamp) AS consent_date FROM ".$tableName." WHERE ".$fieldName." IN (".$selected.") AND consent_value = 1 AND DATE(timestamp) BETWEEN '".$from."' AND '".$to."' GROUP BY DATE(timestamp), user_id HAVING COUNT(DISTINCT ".$fieldName.") = ".count($temp).") AS all_vendors_accepted ON all_users.user_id = all_vendors_accepted.user_id AND all_users.consent_date = all_vendors_accepted.consent_date GROUP BY all_users.consent_date ORDER BY all_users.consent_date";
			$result = $conn->query($query);

			if (!$result) {
		       $response = [
		       	"action" => $action, 
		            "success" => false,
		            "error" => $conn->error,
		            "query" => $query
		        ];
		        echo json_encode($response);
		        exit;
		    }
			if ($result === false) {
			    die("(".$q.")Error in query execution: " . $conn->error);
			}

			$labels = [];
			$data = [];

			while ($row = $result->fetch_assoc()) {
			    $labels[] = $row['consent_date']; 
			    $data[] = (float) $row['percentage'];
			}

			$ret = [
				"action" => $action, 
				'query' => $query,
			    'labels' => $labels,
			    'a_data' => $data
			];

			echo json_encode($ret);
			

	}
	if($conn) $conn->close();

?>
