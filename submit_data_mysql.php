<?php

// Submit Data to mySQL database
// Josh de Leeuw, August 2012

// Edit this line to include your database connection script
//
//  The script you link should contain the following two lines:
//
//  $dbc = mysql_connect('localhost', 'username', 'password');
//  mysql_select_db('databasename', $dbc)
//
include('wk_database_connect.php');

// You should not need to edit below this line

function mysql_insert($table, $inserts) {
    $values = array_map('mysql_real_escape_string', array_values($inserts));
    $keys = array_keys($inserts);

    return mysql_query('INSERT INTO `'.$table.'` (`'.implode('`,`', $keys).'`) VALUES (\''.implode('\',\'', $values).'\')');
}

//foreach ($_POST as $key => $value)
// echo "Field ".htmlspecialchars($key)." is ".htmlspecialchars($value)."\n";

// get the table name 
$tab = $_POST['table'];

// decode the data object from json
$raw_trials_obj = $_POST['json'];
$trials_obj = str_replace('\"', '"', $raw_trials_obj);
$trials_obj = json_decode($trials_obj);

// get the optional data (decode as array)
$raw_opt_data = $_POST['opt_data'];
if ( isset($raw_opt_data)) {
	$opt_data = str_replace('\"', '"', $raw_opt_data);
	$opt_data = json_decode($opt_data, true);
	$opt_data_names = array_keys($opt_data);
}
else {
	$opt_data_names = NULL;
	$opt_data = NULL;
}

// go through each element of the trials object to see if there is data
// 	(some plugins may not have data associated with them)
$trials = $trials_obj[0];
for($i=1; $i<count($trials_obj); $i++)
{
	if(count($trials_obj[$i])>0){
		// if there is data, merge that data into the $trials array
		$trials = array_merge($trials, $trials_obj[$i]);
	}
}

var_dump($trials);

// for each element in the trials array, insert the row into the mysql table
for($i=0;$i<count($trials);$i++)
{
	$to_insert = (array)($trials[$i]);
	// add any optional, static parameters that got passed in (like subject id or condition)
	for($j=0;$j<count($opt_data_names);$j++){
		$to_insert[$opt_data_names[$j]] = $opt_data[$opt_data_names[$j]];
	}
	$result = mysql_insert($tab, $to_insert);
}

// confirm the results
if (!$result) {
	die('Invalid query: ' . mysql_error());
} else {
	print "successful insert!";
}

?>
