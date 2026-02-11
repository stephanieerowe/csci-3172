// add focus/blur styling for key form inputs.
document.addEventListener("DOMContentLoaded", () => {
	const inputIds = ["firstName", "lastName", "email"];
	const inputs = inputIds
		.map((id) => document.getElementById(id))
		.filter(Boolean);

	inputs.forEach((input) => {
		input.addEventListener("focus", () => {
			input.classList.add("active");
		});

		input.addEventListener("blur", () => {
			input.classList.remove("active");
		});
	});
});