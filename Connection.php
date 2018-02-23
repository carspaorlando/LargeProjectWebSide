<?php

fucntion ConnectDB() {
	$dbhost = "64.37.54.24";
	$dbuser = "cop4331c";
	$dbpass = "smallproject1";
	$dbname = "cop4331c";
	
	$conn = new mysqli($dbhost, $dbuser, $dbpass, $dbname);
	
	if ($conn->connect_error) 
	{
		echo "Error: Could not connect to server.";
	}
	else
	{
		return $conn;
	}
}
?>