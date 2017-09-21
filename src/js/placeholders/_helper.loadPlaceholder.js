var loadPlaceholder = function () {
	var insertStyles = function () {
		var ref = window.document.getElementsByTagName('script')[0];
		var ss = document.createElement('style');
		ss.id = 'placeholder-styles';
		ss.innerHTML = '@-webkit-keyframes a{0%{background-color:#d3d3d3}50%{background-color:#e5e5e5}to{background-color:#d3d3d3}}@keyframes a{0%{background-color:#d3d3d3}50%{background-color:#e5e5e5}to{background-color:#d3d3d3}}.loading .placeholder{-webkit-animation:a 1.5s ease-in infinite;animation:a 1.5s ease-in infinite;background-color:#e5e5e5}.loading .placeholder-hero{height:20em}.loading .placeholder-heading{height:3em;width:55%}.loading .placeholder-sentence{height:1.5em;margin-bottom:.5em}.loading .placeholder-sentence-last{width:85%}.loading .placeholder-paragraph{height:8em;margin-top:1.5625em}.loading .placeholder-btn{height:3em;width:8em}.loading .placeholder-btn,.loading .placeholder-heading,.loading .placeholder-hero,.loading .placeholder-paragraph{margin-bottom:1.5625em}';
		ref.parentNode.insertBefore(ss, ref);
	};
	document.documentElement.className += ' loading';
	var placeholder = document.createElement('div');
	placeholder.id = 'app-wrapper';
	placeholder.innerHTML =
		'<!-- Old Browser Warning -->' +
		'<!--[if lt IE 9]>' +
			'<section class="container">' +
				'Did you know that your web browser is a bit old? Some of the content on this site might not work right as a result. <a href="http://whatbrowser.org">Upgrade your browser</a> for a faster, better, and safer web experience.' +
			'</section>' +
		'<![endif]-->' +

		'<div id="app" class="tabindex" tabindex="-1">' +

			'<nav id="nav-user-wrapper">' +
				'<div class="text-small padding-top-small padding-bottom-small">&nbsp;</div>' +
			'</nav>' +

			'<nav id="nav-primary-wrapper">' +
				'<div class="padding-top-small padding-bottom-small">&nbsp;</div>' +
			'</nav>' +

			'<!-- tabindex="-1" hack for skipnav link: https://code.google.com/p/chromium/issues/detail?id=37721 -->' +
			'<main class="tabindex" tabindex="-1" id="main-wrapper">' +

				'<div class="placeholder placeholder-hero"></div>' +

				'<section class="container">' +
					'<div class="placeholder placeholder-heading"></div>' +

					'<div class="placeholder placeholder-sentence"></div>' +
					'<div class="placeholder placeholder-sentence placeholder-sentence-last"></div>' +

					'<div class="placeholder placeholder-paragraph"></div>' +

					'<div class="placeholder placeholder-sentence"></div>' +
					'<div class="placeholder placeholder-sentence"></div>' +
					'<div class="placeholder placeholder-sentence placeholder-sentence-last"></div>' +

					'<div class="placeholder placeholder-paragraph"></div>' +

					'<div class="placeholder placeholder-btn"></div>' +
				'</section>' +

			'</main>' +

			'<footer id="footer-wrapper">' +

				'<div id="footer-1-wrapper">' +
					'<div class="container">' +
						'<hr>' +
						'<p>&nbsp;</p>' +
					'</div>' +
				'</div>' +

				'<nav id="nav-secondary-wrapper"></nav>' +

				'<div id="footer-2-wrapper"></div>' +

				'<div id="mashery-made">' +
					'<div class="container">' +
						'<p><a href="http://mashery.com"><img src="https://support.mashery.com/public/Mashery/images/masherymade.png"></a></p>' +
					'</div>' +
				'</div>' +

			'</footer>';
		document.body.insertBefore(placeholder, document.body.lastChild.nextSibling);
		insertStyles();
};