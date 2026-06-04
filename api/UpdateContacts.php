<?php

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

require_once("config.php");

$id = $data["id"];
$firstName = $data["firstName"];
$lastName = $data["lastName"];
$email = $data["email"];
$phone = $data["phone"];
$userId = $data["userId"];

$stmt = $conn->prepare(
    "UPDATE Contacts
     SET FirstName=?,
         LastName=?,
         Email=?,
         Phone=?
     WHERE ID=? AND UserID=?"
);

$stmt->bind_param(
    "ssssii",
    $firstName,
    $lastName,
    $email,
    $phone,
    $id,
    $userId
);

if($stmt->execute())
{
    echo json_encode(["error" => ""]);
}
else
{
    echo json_encode(["error" => "Update failed"]);
}

$stmt->close();
$conn->close();

?>