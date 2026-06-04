<?php

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

require_once("config.php");

$firstName = $data["firstName"];
$lastName = $data["lastName"];
$email = $data["email"];
$phone = $data["phone"];
$userId = $data["userId"];

$stmt = $conn->prepare(
    "INSERT INTO Contacts
    (FirstName, LastName, Email, Phone, UserID)
    VALUES (?, ?, ?, ?, ?)"
);

$stmt->bind_param(
    "ssssi",
    $firstName,
    $lastName,
    $email,
    $phone,
    $userId
);

if($stmt->execute())
{
    echo json_encode(["error" => ""]);
}
else
{
    echo json_encode(["error" => "Failed to add contact"]);
}

$stmt->close();
$conn->close();

?>