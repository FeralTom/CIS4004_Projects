<?php

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

require_once("config.php");

$id = $data["id"];
$userId = $data["userId"];

$stmt = $conn->prepare(
    "DELETE FROM Contacts
     WHERE ID=? AND UserID=?"
);

$stmt->bind_param(
    "ii",
    $id,
    $userId
);

if($stmt->execute())
{
    echo json_encode(["error" => ""]);
}
else
{
    echo json_encode(["error" => "Delete failed"]);
}

$stmt->close();
$conn->close();

?>