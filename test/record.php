<?php

// also write it to a file
$file="./submissions/${_POST['team']}_${_POST['session']}.txt";
$text="Problem ${_POST['problem']}\n${_POST['code']}\n\n----------------------------------------------------\n\n";
file_put_contents($file,$text,FILE_APPEND);

$conn = new mysqli('fdb23.awardspace.net', '2804876_so', 'olympiad1', '2804876_so');
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$team=$conn->escape_string($_POST['team']);
$problem=$conn->escape_string($_POST['problem']);
$code=$conn->escape_string($_POST['code']);
$fingerprint=$conn->escape_string($_POST['fingerprint']);
$session=$conn->escape_string($_POST['session']);

$passed=false;
if(isset($_POST['passed']))
        $passed=$conn->escape_string($_POST['passed']);

$sql="INSERT INTO `entries` (`team`, `fingerprint`, `session`, `problem`, `code`, `passed`, `timestamp`) VALUES ('$team', $fingerprint, '$session', $problem, '$code', $passed, CURRENT_TIMESTAMP)";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

?>