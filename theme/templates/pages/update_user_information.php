<?php
$UC = new User();
$user = $UC->getKbhffUser();

$this->pageTitle("Brugeroplysninger");
?>

<div class="scene user_information i:user_information">
	<h1>Brugeroplysninger</h1>
	<h2>Her kan du rette i dine brugeroplysninger.</h2>

	<?= $UC->formStart("updateUserInformation", ["class" => "form_user"]) ?>

<?	if(message()->hasMessages()): ?>
		<p class="errormessage">
<?		$messages = message()->getMessages(array("type" => "error"));
		foreach($messages as $message): ?>
			<?= $message ?><br>
<?		endforeach;?>
		</p>
		<p class="errormessage">
<?		$messages = message()->getMessages(array("type" => "message"));
		foreach($messages as $message): ?>
			<?= $message ?><br>
<?		endforeach;?>
		</p>
<?	message()->resetMessages(); ?>

<?	endif; ?>

		<fieldset>
			<?= 
				$UC->input("nickname", [
					"type" => "string",
					"label" => "Kaldenavn",
					"value" => $user["nickname"],
					"required" => false,
					"hint_message" => "Skriv dit kaldenavn (kan også bare være dit navn)",
					"error_message" => "",
				]),
			
				$UC->input("firstname", [
					"type" => "string",
					"label" => "Fornavn",
					"value" => $user["firstname"],
					"required" => true,
					"hint_message" => "Skriv dit fornavn",
					"error_message" => "Du skal angive et fornavn.",
				]),

				$UC->input("lastname", [
					"type" => "string",
					"label" => "Efternavn",
					"value" => $user["lastname"],
					"required" => true,
					"hint_message" => "Skriv dit efternavn",
					"error_message" => "Du skal angive et efternavn.",
				]),

				$UC->input("email", [
					"type" => "email",
					"label" => "E-mail",
					"value" => $user["email"],
					"required" => true,
					"hint_message" => "Den e-mail du bruger til at logge ind med, og få e-mails fra",
					"error_message" => "Ugyldig email",
				]),

				$UC->input("mobile", [
					"type" => "string",
					"label" => "Mobil",
					"value" => $user["mobile"],
					"hint_message" => "Skriv dit mobiltelefonnummer, så vi kan sende dig beskeder",
					"error_message" => "Ugyldigt nummer",
				]);
			?>
		</fieldset>

		<ul class="actions">
			<?= $UC->submit("Opdater", array("class" => "primary", "wrapper" => "li.save")) ?>
			<li class="cancel"><a href="/" class="button">Anullér</a></li>
		</ul>
	<?= $UC->formEnd() ?>

</div>