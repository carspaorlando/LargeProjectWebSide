<?php
	$inData = getRequestInfo();
	
    $sqlInjection = array("'", ";", ":");
    $userName = str_replace($sqlInjection, "", $inData["user"]);
    $contactName = str_replace($sqlInjection, "", $inData["contactName"]);
    $photo = str_replace($sqlInjection, "", $inData["photo"]);
    $description = str_replace($sqlInjection, "", $inData["description"]);
    $id = str_replace($sqlInjection, "", $inData["id"]);

	$conn = new mysqli("localhost", "cop4331c", "smallproject1", "cop4331c");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        $inputValues = array($contactName, $photo, $description);
        $attributes = array("name", "photo", "description");

        for ($i = 0; $i < count($inputValues); $i++) 
        {
            if ($inputValues[$i] != NULL) 
            {
                $query = "UPDATE contact SET " . $attributes[$i] ."='" . $inputValues[$i] . "' where id='" . $id . "'";
                if($result = $conn->query($query) != TRUE)
                {
                    returnWithError( $conn->error );
                    exit;
                }
            }
        }
        
        $search = "SELECT * FROM contact where id='" . $id . "'";
        $select = $conn->query($search);

        $rows = array();
        while ($temp = mysqli_fetch_assoc($select))
        {
            $rows[] = $temp;
        }

        echo json_encode( $rows );
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendAsJson( $retValue );
	}
	
?>
