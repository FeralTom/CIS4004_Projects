<?php

header("Content-Type: application/json");

$data = json_decode(
    file_get_contents("php://input"),
    true
);

if ($data === null)
{
    echo json_encode([
        "error" => "No JSON received"
    ]);
    exit();
}

require_once("config.php");

$login    = $data["login"];
$password = $data["password"];

$stmt = $conn->prepare(
    "SELECT
        ID,
        FirstName,
        LastName,
        Password
    FROM Users
    WHERE Login=?"
);

$stmt->bind_param("s", $login);
$stmt->execute();

$result = $stmt->get_result();

if($row = $result->fetch_assoc())
{
    if(
        password_verify(
            $password,
            $row["Password"]
        )
    )
    {
        echo json_encode([
            "id" => $row["ID"],
            "firstName" => $row["FirstName"],
            "lastName" => $row["LastName"],
            "error" => ""
        ]);
    }
    else
    {
        echo json_encode([
            "error" => "Invalid login"
        ]);
    }
}
else
{
    echo json_encode([
        "error" => "Invalid login"
    ]);
}

$stmt->close();
$conn->close();

?>