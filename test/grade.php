<!DOCTYPE html>
<html>
<head><title>Grade stuff</title></head>
<body style="font-family: Arial">       
<?php

$conn = new mysqli('fdb23.awardspace.net', '2804876_so', 'olympiad1', '2804876_so');
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$points=array(4,5,6,6,8,8,10,10,12,15);
$style=array(1,3,3,3,5,5,5,5,3,3);

if(!isset($_GET['team'])) {
        echo '<h3>Select a team:</h3>';
        $sql="select distinct team from entries";
        $result=$conn->query($sql);
        if ($result != FALSE) {
                while($row=$result->fetch_assoc())
                        echo '<a href="grade.php?team='.$row['team'].'">'.$row['team'].'</a><br>';
        } else
                die("database query failed - ".$sql);
} else if(!isset($_GET['session'])) {
        $team=$conn->escape_string($_GET['team']);
        echo '<h3>Select a session for '.$team.':</h3>';
        $sql="select distinct session from entries where team='".$team."'";
        $result=$conn->query($sql);
        if ($result != FALSE) {
                while($row=$result->fetch_assoc())
                        echo "<a href=\"grade.php?team=$team&session=".$row['session'].'">'.$row['session'].'</a><br>';
        } else
                die("database query failed - ".$sql);
} else {
        $team=$conn->escape_string($_GET['team']);
        echo '<div style="position: fixed; top: 10px; right: 10px; border: 1px solid black; padding: 10px; background-color: white; font-size: 18pt">Team: '.$team.'</div>';
        $session=$conn->escape_string($_GET['session']);
        $sql="select distinct problem from entries where team='$team' and session='$session' order by problem asc";
        $problem_result=$conn->query($sql);
        if ($problem_result != FALSE) {
                while($problem=$problem_result->fetch_assoc()) {
                        echo '<div style="width: 700px; border: 1px solid blue;"><div style="background-color: #ddd; padding: 10px; font-weight: bold">Problem '.$problem['problem'].' ('.$points[$problem['problem']].' points, '.$style[$problem['problem']].' style)</div><div style="padding: 10px;">';
                        $sql="select code, passed, timestamp from entries where problem=".$problem['problem']." and team='$team' and session='$session' order by timestamp desc";
                        $code_result=$conn->query($sql);
                        if ($code_result != FALSE) {
                                while($code_row=$code_result->fetch_assoc()) {
                                        $code=str_replace(" ", "&nbsp;", str_replace("\t", "&nbsp;&nbsp;&nbsp;", str_replace("\n", "<br>", $code_row['code'])));
                                        echo '<div style="border: 1px solid black; padding: 10px; font-family: monospace;';
                                        if($code_row['passed'])
                                                echo ' background-color: #8ef2a7';
                                        echo '">'.$code."</div><br><br>";
                                }
                        } else
                                die("database query failed - ".$sql);
                        echo '</div></div><br><hr><br>';
                }
        } else
                die("database query failed - ".$sql);
}        
?>

</body></html>