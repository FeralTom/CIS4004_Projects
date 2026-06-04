<?php

$servername = "localhost";
$username = "TheBeast";
$password = "WeLoveCOP4331";
$dbname = "ContactManager";

$conn = new mysqli(
    $servername,
    $username,
    $password,
    $dbname
);

if ($conn->connect_error)
{
    die("Connection failed: " .
        $conn->connect_error);
}
?>