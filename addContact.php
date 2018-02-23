<?php
    $inData = getRequestInfo();

    $sqlInjection = array("'", ";", ":");
    $userName = str_replace($sqlInjection, "", $inData["user"]);
    $contactName = str_replace($sqlInjection, "", $inData["contactName"]);
    $photo = str_replace($sqlInjection, "", $inData["photo"]);
    $description = str_replace($sqlInjection, "", $inData["description"]);
    
    $conn = new mysqli("localhost", "cop4331c", "smallproject1", "cop4331c");

    if ($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    }


    else
    {
	
        $uid = "select id from user where name='" . $userName . "'";
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
            $err = "User ID not found.";
            returnWithError( $err );
        }

        $sql = "insert into contact (uid, id, name, photo, description) VALUES ('" . $uid . "',NULL,'" . $contactName . "','" . $photo . "','" . $description . "');";
	// echo $sql;
        if ($result = $conn->query($sql) != TRUE)
        {
            returnWithError( $conn->error);
        }
        else
        {
            // Retrieve most recent ID.
            $query = "SELECT LAST_INSERT_ID()";
            $result = $conn->query($query);
            if ($result->num_rows > 0)
            {
                while ($row = $result->fetch_assoc())
                {
                    $newId = $row["LAST_INSERT_ID()"];
                }
            }

            $query = "select * from contact where id='" . $newId . "'";
            $select = $conn->query($query);
            $rows = array();

            while ($temp = mysqli_fetch_assoc($select))
            {
                $rows[] = $temp;
            }

            echo json_encode( $rows );
            $conn->close();
        }
    }
    function sendAsJson( $obj ) 
    {
        header('Content-type: application/json');
        echo $obj;
    }

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
    }
    
    function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendAsJson( $retValue );
	}
?>
