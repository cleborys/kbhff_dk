
<?php

/**
 * Manages pickup dates.
 * 
 **/
class Pickupdate extends Model {

	/**
	* Initialization: set variable names and validation rules for Pickupdate model.
	*
	* @return void 
	*/
	function __construct() {

		// Construct Model class, passing the Pickupdate model as a parameter. 
		// The Model class is constructed *before* adding values to Pickupdate model to ensure Pickupdate overwrites the standard values of Model 
		parent::__construct(get_class());


		// Define the name of table in database
		$this->db = SITE_DB.".shop_pickupdates";


		// pickup date
		$this->addToModel("pickupdate", array(
			"type" => "date",
			"label" => "Pickup date",
			"required" => true,
			"hint_message" => "State the pickup date", 
			"error_message" => "You must enter a pickup date."
		));

		$this->addToModel("comment", array(
			"type" => "text",
			"label" => "Comment",
			"hint_message" => "Anything unusual? Note it here.",
			"error_message" => "Invalid text."
		));

		
	}
	
	/**
	 * Get list of pickupdates from database.
	 *
	 * @return array|false Pickupdate object. False on error. 
	 */
	function getPickupdates($_options = false) {

		// define default sorting order
		$order = "pickupdate ASC";
		

		if($_options !== false) {
			foreach($_options as $_option => $_value) {
				switch($_option) {
					case "order"           : $order                = $_value; break;
				}
			}
		}

		$query = new Query();
		$sql = "SELECT * FROM ".$this->db;		

		$sql .= " ORDER BY $order";


		if($query->sql($sql)) {
			return $query->results();
		}
		
		return false;
	}

	
	/**
	 * Saves the pickupdate to the database.
	 * 
	 * @param array $action REST parameters of current request
	 * @return array|false Pickupdate id. False on error.
	 */
	function savePickupdate($action) {
		
		$this->getPostedEntities();

		
		if(count($action) == 1 && $this->validateList(["pickupdate", "comment"])) {
			
			$query = new Query();
			$query->checkDbExistence($this->db);
			
			// Get posted values
			$pickupdate = $this->getProperty("pickupdate", "value");
	
			
			// Check if the pickupdate is already created (to avoid faulty double entries)  
			$sql = "SELECT * FROM ".$this->db." WHERE pickupdate='$pickupdate'";
			if(!$query->sql($sql)) {


				// enter the pickupdate into the database
				$sql = "INSERT INTO ".$this->db." SET pickupdate='$pickupdate'";
				
				// if successful, add message and return pickupdate id
				if($query->sql($sql)) {
					
					$pickupdate_id = $query->lastInsertId();

					// add the new pickupdate to all departments
					include_once("classes/system/department.class.php");
					$DC = new Department();

					$departments = $DC->getDepartments();
					foreach($departments as $department) {
						
						$DC->addPickupdate($department["id"], $pickupdate_id);
					}
					
					message()->addMessage("Pickup date created");
					return ["item_id" => $pickupdate_id];
				}
			}
			else {
				message()->addMessage("This pickup date already exists.", ["type" => "error"]);
				return false;
			}

		}

		// something went wrong
		message()->addMessage("Could not create pickup date.", ["type" => "error"]);
		return false;
	}

	/**
	 * Get a single pickupdate from database.
	 *
	 * @param array|boolean $_options Associative array containing unsorted function parameters.
	 * 		$id				int			Pickupdate id
	 * 		$name			string		Pickupdate name
	 * 		$department_id	int			Will search for active pickupdate for given department
	 * 
	 * @return array|false Pickupdate item (via callback to Query->result(0))
	 */
	function getPickupdate($_options = false) {

		// Define default values
		$id = false;
		$pickupdate = false;
		
		// Search through $_options to find recognized parameters
		if($_options !== false) {
			foreach($_options as $_option => $_value) {
				switch($_option) {
					case "id"                   : $id             = $_value; break;
					case "pickupdate"                 : $pickupdate           = $_value; break;
				}
			}
		}


		// Query database for pickupdate with specific id.
		if($id) {
			$query = new Query();
			$sql = "SELECT * FROM ".$this->db." WHERE id = '$id'";
			if($query->sql($sql)) {
				return $query->result(0);
			}
		}
		else if($pickupdate) {
			$query = new Query();
			$sql = "SELECT * FROM ".$this->db." WHERE pickupdate = '$pickupdate'";
			if($query->sql($sql)) {
				return $query->result(0);
			}
		}

		return false;
	}

	/**
	 * Update a single pickupdate.
	 *
	 * @param array $action REST parameters of current request
	 * @return array|false Updated Pickupdate data object
	 */
	function updatePickupdate($action) {

		// Get content of $_POST array which have been "quality-assured" by Janitor 
		$this->getPostedEntities();

		// Check that the number of REST parameters is as expected.
		if(count($action) == 2) {
			
			$id = $action[1];

			$old_pickupdate = $this->getPickupdate(["id" => $id])["pickupdate"] ?? false;
			$new_pickupdate = $this->getProperty("pickupdate", "value");


			$comment = $this->getProperty("comment", "value");


			$query = new Query();

			// base sql
			$sql = "UPDATE ".$this->db." SET modified_at=CURRENT_TIMESTAMP";

			if($new_pickupdate) {
				$sql .= ", pickupdate='$new_pickupdate'";
			}
			if($comment) {
				$sql .= ", comment = '$comment'";
			}
			
			$sql .= " WHERE id = '$id'";
			// debug($sql);

			// Check if the pickupdate is already created (to avoid faulty double entries)  
			if($new_pickupdate == $old_pickupdate || !$query->sql("SELECT * FROM ".$this->db." WHERE pickupdate='$new_pickupdate'")) {


				// if successful, add message and return the pickupdate data object
				if($query->sql($sql)) {
					message()->addMessage("Pickup date updated");
	
					global $page;
					$user_id = session()->value("user_id");
					$page->addLog("Pickupdate: pickupdate id:$id updated by user_id:$user_id; sql = '$sql'");
	
					return $this->getPickupdate(["id"=>$id]);
				}
				
			}
			else {
				message()->addMessage("This pickup date already exists.", ["type" => "error"]);
				return false;
			}


		}

		// something went wrong
		return false;
	}

	/**
	 * Delete a single pickupdate.
	 *
	 * @param array $action REST parameters
	 * @return boolean
	 */
	function deletePickupdate($action) {

		// Checks for unexpected number of parameters
		if(count($action) == 2) {
			
			// Ask the database to delete the row with the id that came from $action. 
			$id = $action[1];
			$query = new Query();
			
			$sql = "DELETE FROM ".$this->db." WHERE id = '$id'";
			if($query->sql($sql)) {
				message()->addMessage("Pickupdate deleted");

				global $page;
				$user_id = session()->value("user_id");
				$page->addLog("Pickupdate: pickupdate id:$id deleted by user_id:$user_id");

				return true;		
			}

		}
		message()->addMessage("Pickupdate could not be deleted.", array("type" => "error"));
		return false;
	}

}

?>