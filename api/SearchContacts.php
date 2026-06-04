<?php

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

require_once("config.php");

$search = "%" . $data["search"] . "%";
$userId = $data["userId"];

$stmt = $conn->prepare(
    "SELECT ID, FirstName, LastName, Email, Phone
     FROM Contacts
     WHERE UserID = ?
     AND (
        FirstName LIKE ?
        OR LastName LIKE ?
        OR Email LIKE ?
        OR Phone LIKE ?
     )"
);

$stmt->bind_param(
    "issss",
    $userId,
    $search,
    $search,
    $search,
    $search
);

$stmt->execute();

$result = $stmt->get_result();

$contacts = [];

while($row = $result->fetch_assoc())
{
    $contacts[] = $row;
}

echo json_encode([
    "results" => $contacts,
    "error" => ""
]);

$stmt->close();
$conn->close();

?>