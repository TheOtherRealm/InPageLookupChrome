(function () {
	const commandNames = ["getSelectedPedia", "getSelectedTionary", "removeSelected"];
	const options = [{ "name": "getSelectedPedia", "description": "Look up a highlighted word or phrase in Wikipedia", "shortcut": "ControlLeft+ShiftLeft+Digit1" }, { "name": "getSelectedTionary", "description": "Look up a highlighted word or phrase in Wiktionary", "shortcut": "ControlLeft+ShiftLeft+Digit2" }, { "name": "removeSelected", "description": "Hide the iframe", "shortcut": "ControlLeft+ShiftLeft+Backquote" }];
	/**
	 * Convert a key press into the relevent code
	 */
	$('.keyCodes').keydown(function (e) {
		e.preventDefault();
		const keyCodeBox = this.value;
		if(this.value==''){
			this.value = e.code;
		}else{
		this.value = keyCodeBox + '+' + e.code;
		}
	});
	$('#clear').click(function (e) {
		e.preventDefault();
		$('.keyCodes').each(function(k){
			this.value = '' 
		});
	});
	/**
	 * Update the UI: set the value of the commands textboxs.
	 */
	function updateUI() {
		var commands = browser.storage.local.get('options');
		commands.then((c) => {
			if (c.options) {
				for (var i = 0; i < c.options.length; i++) {
					for (commandName of commandNames) {
						if (c.options[i].name === commandName) {
							// console.log(command.shortcut, commandNames[0]);
							document.querySelector('#' + commandName).value = c.options[i].shortcut;
						}
					}
				}
			} else {
				resetShortcut();
			}
		});
	}
	/**
	 * Update the commands based on the input.
	 */
	function updateShortcut() {
		const forms = document.querySelectorAll('form');
		const form = forms[0];
		let combo = { "options": [] };
		let nOfOpt = 0;
		[...form.elements].forEach((input) => {
			if (input.type != "submit") {
				combo.options.push({
					name: commandNames[nOfOpt++],
					shortcut: input.value
				});
			}
		})
		browser.storage.local.set(combo);
	}
	/**
	 * Reset the commands and update the textbox.
	 */
	function resetShortcut() {
		var o = JSON.parse(JSON.stringify(options));
		browser.storage.local.set({ "options": o })
			.then(updateUI, onError)
	}
	/**
	 * Update the UI when the page loads.
	 */
	document.addEventListener('DOMContentLoaded', updateUI);
	/**
	 * Handle update and reset button clicks
	 */
	document.querySelector('#update').addEventListener('click', updateShortcut);
	document.querySelector('#reset').addEventListener('click', resetShortcut);
	function onError(error) {
		console.log(error)
	}
})(jQuery);