<?php
	$inData = getRequestInfo();
	
	$userName = $inData["user"];

	$conn = new mysqli("localhost", "cop4331c", "smallproject1", "cop4331c");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$uid = "select id from user where name ='" . $userName . "'";
		$result = $conn->query($uid);
		if ($result->num_rows > 0)
		{
			while ($row = $result->fetch_assoc())
			{
				$uid = $row["id"];
			}
		}
		else
		{
			http_response_code(400);
			header("HTTP/1.0 400 Bad Request");
			$err = "User ID not found.";
			returnWithError( $err );
			exit;
		}
		
		$sql = "select * from contact where uid='" . $uid . "';";
		if( $result = $conn->query($sql) != TRUE )
		{
			returnWithError( $conn->error );
		}
		else
		{		
			
			$query = "select * from contact where uid='" . $uid . "'";
			$select = $conn->query($query);
			$rows = array();

			while($temp = mysqli_fetch_assoc($select))
			{
				$rows[] = $temp;
			}
			echo $rows->num_rows;
			echo json_encode( $rows );
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
