/**
 * Test the strength of user passwords
 */
var masheryTestPassword = (function () {

	'use strict';

	// Variables
	var exports = {};
	var pwNew = '#passwd_new';
	var pwConfirm = '#passwd_again';
	var valid = 'valid';
	var requirements;

	var hasLetters = function (password) {

		if (!requirements[0]) return;

		// If passes
		if (/[A-Za-z]/.test(password.value)) {
			requirements[0].classList.add(valid);
			return true;
		}

		// If fails
		requirements[0].classList.remove(valid);
		return false;

	};

	var hasNumbers = function (password) {

		if (!requirements[1]) return;

		// If passes
		if (/[0-9]/.test(password.value)) {
			requirements[1].classList.add(valid);
			return true;
		}

		// If fails
		requirements[1].classList.remove(valid);
		return false;

	};

	var isLongEnough = function (password) {

		if (!requirements[2]) return;

		// If passes
		if (password.value.length > 7) {
			requirements[2].classList.add(valid);
			return true;
		}

		// If fails
		requirements[2].classList.remove(valid);
		return false;

	};

	var testPassword = function (password) {

		// Run tests
		var letters = hasLetters(password);
		var numbers = hasNumbers(password);
		var long = isLongEnough(password);

		// Adjust class
		if (letters && numbers && long) {
			password.classList.add(valid);
		} else {
			password.classList.remove(valid);
		}

	};

	var confirmPassword = function (newPW, confirmPW) {

		if (!newPW || !confirmPW) return;

		if (newPW.value === confirmPW.value) {
			// If they match
			confirmPW.classList.add('valid');
		} else {
			// If they don't
			confirmPW.classList.remove('valid');
		}

	};

	var startTests = function (event) {

		var newPW = document.querySelector(pwNew);
		var confirmPW = document.querySelector(pwConfirm);

		// If password field
		if (event.target.closest(pwNew)) {
			testPassword(event.target);
			confirmPassword(newPW, confirmPW);
			return;
		}

		// If password confirm field
		if (event.target.closest(pwConfirm)) {
			confirmPassword(newPW, confirmPW);
		}

	};

	exports.destroy = function () {
		var valid = document.querySelectorAll('#passwd_requirements .' + valid + ', ' + pwNew + ', ' + pwConfirm);
		valid.forEach(function (field) {
			field.classList.remove(valid);
		});
		document.removeEventListener('input', startTests, false);
		requirements = null;
	};

	exports.init = function () {
		requirements = document.querySelectorAll('#passwd_requirements li');
		document.addEventListener('input', startTests, false);
	};

	return exports;

})();