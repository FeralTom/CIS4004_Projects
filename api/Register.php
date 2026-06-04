
<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");

require_once("config.php");

$data = json_decode(file_get_contents("php://input"), true);

if ($data === null)
{
    echo json_encode([
        "error" => "No JSON received"
    ]);
    exit();
}

if (
    !isset($data["firstName"]) ||
    !isset($data["lastName"]) ||
    !isset($data["login"]) ||
    !isset($data["password"])
)
{
    echo json_encode([
        "error" => "Missing required fields"
    ]);
    exit();
}

$firstName = trim($data["firstName"]);
$lastName  = trim($data["lastName"]);
$login     = trim($data["login"]);
$password  = $data["password"];

$stmt = $conn->prepare(
    "SELECT ID FROM Users WHERE Login = ?"
);

if (!$stmt)
{
    echo json_encode([
        "error" => "Prepare failed: " . $conn->error
    ]);
    exit();
}

$stmt->bind_param("s", $login);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0)
{
    echo json_encode([
        "error" => "User already exists"
    ]);
    $stmt->close();
    $conn->close();
    exit();
}

$stmt->close();

$hashedPassword = password_hash(
    $password,
    PASSWORD_DEFAULT
);

$stmt = $conn->prepare(
    "INSERT INTO Users
    (FirstName, LastName, Login, Password)
    VALUES (?, ?, ?, ?)"
);

if (!$stmt)
{
    echo json_encode([
        "error" => "Insert prepare failed: " . $conn->error
    ]);
    exit();
}

$stmt->bind_param(
    "ssss",
    $firstName,
    $lastName,
    $login,
    $hashedPassword
);

if ($stmt->execute())
{
    echo json_encode([
        "error" => ""
    ]);
}
else
{
    echo json_encode([
        "error" => "Registration failed: " . $stmt->error
    ]);
}

$stmt->close();
$conn->close();

?>