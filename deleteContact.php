<?php
	$inData = getRequestInfo();
	
	$id = $inData["id"];
	$conn = new mysqli("localhost", "cop4331c", "smallproject1", "cop4331c");

	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        $query = "DELETE from contact where id='" . $id . "'";
        if ($result = $conn->query($query) != TRUE)
        {
            http_response_code(400);
			header("HTTP/1.0 400 Bad Request");
            returnWithError( $conn->error);
        }
        else
        {
            returnWithError("");
        }
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
