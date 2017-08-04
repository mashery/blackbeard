/**
 * Test the strength of user passwords
 */
var masheryMashtips = (function () {

	'use strict';

	// Variables
	var exports = {};
	var mashtips;

	var showMashtip = function (mashtip) {
		var info = mashtip.querySelector('.mashtip-info');
		if (!info) return;
		info.classList.toggle('active');
		if (info.classList.contains('active')) {
			info.focus();
		}
	};

	var hideMashtips = function () {
		var activeTips = document.querySelectorAll('.mashtip-info.active');
		activeTips.forEach(function (mashtip) {
			mashtip.classList.remove('active');
		});
	};

	var clickHandler = function (event) {
		if (event.target.closest('.mashtip')) {
			showMashtip(event.target);
		} else {
			hideMashtips();
		}
	};

	var convertMashtips = function () {
		mashtips = document.querySelectorAll('.mashtip');
		mashtips.forEach(function (mashtip) {
			mashtip.innerHTML += '<span class="mashtip-info tabindex" tabindex="-1">' + mashtip.getAttribute('title') + '</span>';
			mashtip.setAttribute('role', 'button');
		});
	};

	var revertMaships = function () {
		var mashtipInfo = document.querySelectorAll('.mashtip-info');
		mashtipInfo.forEach(function (info) {
			info.remove();
		});
	};

	exports.destroy = function () {
		revertMaships();
		document.removeEventListener('click', clickHandler, false);
		mashtips = null;
	};

	exports.init = function () {
		convertMashtips();
		document.addEventListener('click', clickHandler, false);
	};

	return exports;

})();