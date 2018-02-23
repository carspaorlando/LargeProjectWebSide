<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$name = "";

	$conn = new mysqli("localhost", "cop4331c", "smallproject1", "cop4331c");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "SELECT id,name FROM user where name='" . $inData["name"] . "' and password='" . $inData["password"] . "'";
		$result = $conn->query($sql);
		if ($result->num_rows > 0)
		{
			$row = $result->fetch_assoc();
			$name = $row["name"];
			$id = $row["id"];

			returnWithInfo($name, $id );
		}
		else
		{
			http_response_code(400);
			returnWithError("Could not find username or password");
		}
		$conn->close();
	}
	
//	returnWithInfo($name, $id );

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"name":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $name, $id )
	{
		$retValue = '{"id":' . $id . ',"name":"' . $name . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
