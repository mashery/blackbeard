var ioDocs = (function () {

	'use strict';

	//
	// @NOTES
	//

	//
	// Variables
	//

	// Public API placeholder
	var exports = {};
	var hideClass = 'io-docs-hide';
	var credentials, credentialsForm, descriptions, controls, endpointLists, apiSelect, methods, endpoints, enableHSSM, enableAce, authTimer, syncTokenValue;



	//
	// Methods
	//

	var getEditorMode = function (mode) {
		// check for JSON
		if (typeof (mode) === 'string' && mode.toLowerCase().indexOf('json') >= 0) {
			return 'json';
		}
		return 'text'; // default mode
	};

	var getAuthType = function (api) {
		return api.getAttribute('data-auth-type');
	};

	var getApiKeys = function (api) {
		return JSON.parse(api.getAttribute('data-available-keys'));
	};

	var isBasicAuthEnabled = function (api) {
		return (api.getAttribute('data-basic-auth') === 'true');
	};

	var show = function (elem) {
		if (!elem) return;
		elem.classList.remove(hideClass);
	};

	var hide = function (elem) {
		if (!elem) return;
		elem.classList.add(hideClass);
	};

	var hideCredentials = function () {
		credentials.forEach(function (credential) {
			hide(credential);
		});
	};

	var hideOauth2Credentials = function () {
		document.querySelectorAll('.credentials.oauth2').forEach(function(credential) {
			if (credential.matches('.credentials_start')) return;
			hide(credential);
		});
	};

	var setOAuth2AuthorizeCode = function (code) {

		var codeField = document.querySelector('#apiOAuth2AuthorizeCode');
		var api = document.querySelector('#api' + apiSelect.value);

		if (codeField) {
			codeField.value = code;
		}

		show(document.querySelector('#apiOAuth2AuthorizeCodeContainer'));

		if (!api || api.getAttribute('data-auto-exchange-auth-code') !== '1') return;
		hide(document.querySelector('#apiOAuth2AuthExchangeButton'));

		// @todo
		exchangeAuthCodeforAccessToken();

	};

	var setSyncTokenValue = function () {
		var token = credentialsForm.querySelector('input[name=ajax_synchronization_token]');
		syncTokenValue = token ? token.value : '';
	};

	var getAuthorizationCode = function (client_id, client_secret) {

		// open empty window before async call (async code triggers popup blocker on window.open)
		var oAuth2AuthWindow = window.open(null, 'masheryOAuth2AuthWindow', 'width=300,height=400');

		window.clearInterval(authTimer); // clear the timer
		authTimer = window.setInterval(function () {
			if (oAuth2AuthWindow.closed !== false) { // when the window is closed
				window.clearInterval(authTimer); // clear the timer
				setOAuth2AuthorizeCode(window.auth_code); // set the auth code from the popup window
				delete window.auth_code; // clear the auth code just in case
			}
		}, 200);

		atomic.ajax({
			url: '/io-docs/getoauth2authuri',
			type: 'POST',
			headers: {
				'X-Ajax-Synchronization-Token': syncTokenValue
			},
			data: {
				apiId: apiSelect.value,
				client_id: client_id,
				client_secret: client_secret,
				auth_flow: 'auth_code'
			},
			responseType: 'json',
		}).success(function (data){
			if (data.success) {
				oAuth2AuthWindow.location.href = data.authorize_uri;
				oAuth2AuthWindow.focus();
				// } else {  @todo Should this return an error on failure?
				// self.resetOAuth2AccessToken();
				// alert(jqXHR.responseText);
				// alert("ERROR: 324  --  Sorry there was an error getting an access token. Try again later.");
			} else {
				oAuth2AuthWindow.close();
			}
		}).error(function (data) {
			alert(data);
		});

	};

	var sendImplicitAccessToken = function (token, errorCallback, successCallback) {

		atomic.ajax({
			url: '/io-docs/catchOauth2ImplicitToken',
			type: 'POST',
			headers: {
				'X-Ajax-Synchronization-Token': syncTokenValue
			},
			data: {
				apiId: apiSelect.value,
				access_token: token.access_token,
				expires_in: token.expires_in,
				token_type: token.token_type
			},
			responseType: 'json',
		}).success(function (data) {
			if (data.success) {
				// @todo
				setOAuth2AccessToken(token.access_token);
			} else {
				alert('Sorry, but there was an error during the account authorization process. Either the credentials were not entered correctly, or permission was denied by the account holder. Please try again.');
			}
		}).error(function (data) {
			alert('Sorry, there was an error processing the response from the OAuth2 server. Try again later.');
		});

	};

	var getImplicitAccessToken = function (client_id) {

		// open empty window before async call (async code triggers popup blocker on window.open)
		var oAuth2AuthWindow = window.open(null, 'masheryOAuth2AuthWindow', 'width=300,height=400');

		window.clearInterval(authTimer); // clear the timer
		authTimer = window.setInterval(function () {
			if (oAuth2AuthWindow.closed !== false) { // when the window is closed
				window.clearInterval(authTimer); // clear the timer
				sendImplicitAccessToken(window.access_token); // set the auth code from the popup window
				delete window.access_token; // clear the auth code just in case
			}
		}, 200);

		atomic.ajax({
			url: '/io-docs/getoauth2authuri',
			type: 'POST',
			headers: {
				'X-Ajax-Synchronization-Token': syncTokenValue
			},
			data: {
				apiId: apiSelect.value,
				client_id: client_id,
				auth_flow: 'implicit'
			},
			responseType: 'json',
		}).success(function (data) {
			if (data.success) {
				oAuth2AuthWindow.location.href = data.authorize_uri;
				oAuth2AuthWindow.focus();
			} else {
				oAuth2AuthWindow.close();
				resetOAuth2AccessToken();
				// @todo Should this display an error on failure?
				// alert(jqXHR.responseText);
			}
		}).error(function (data) {
			alert(data);
		});

	};

	var resetOAuth2AccessToken = function () {
		var token = document.querySelector('#apiOAuth2AccessToken');
		if (token) {
			token.value = '';
		}
		hide(document.querySelector('#apiOAuth2AccessTokenContainer'));
	};

	var setOAuth2AccessToken = function (newToken) {
		var token = document.querySelector('#apiOAuth2AccessToken');
		if (token) {
			token.value = newToken;
		}
		hide(document.querySelector('#apiOAuth2AccessTokenContainer'));
	};

	var getAccessTokenFromPasswordCred = function (client_id, client_secret, username, password) {

		atomic.ajax({
			url: '/io-docs/getoauth2accesstoken',
			type: 'GET',
			headers: {
				'X-Ajax-Synchronization-Token': syncTokenValue
			},
			data: {
				apiId: apiSelect.value,
				auth_flow: 'password_cred',
				client_id: client_id,
				client_secret: client_secret,
				username: username,
				password: password
			},
			responseType: 'json',
		}).success(function (data) {
			if (data.success) {
				setOAuth2AccessToken(data.result.access_token);
			} else {
				resetOAuth2AccessToken();
				alert(data);
			}
		}).error(function (data) {
			alert(data);
		});

	};

	var getAccessTokenFromClientCred = function (client_id, client_secret) {

		atomic.ajax({
			url: '/io-docs/getoauth2accesstoken',
			type: 'GET',
			headers: {
				'X-Ajax-Synchronization-Token': syncTokenValue
			},
			data: {
				apiId: apiSelect.value,
				auth_flow: 'client_cred',
				client_id: client_id,
				client_secret: client_secret
			},
			responseType: 'json',
		}).success(function (data) {
			if (data.success) {
				setOAuth2AccessToken(data.result.access_token);
			} else {
				resetOAuth2AccessToken();
				alert(data);
			}
		}).error(function (data) {
			alert(data);
		});

	};

	var exchangeAuthCodeforAccessToken = function () {
		var authCode = document.querySelector('#apiOAuth2AuthorizeCode');
		atomic.ajax({
			url: '/io-docs/getoauth2accesstoken',
			type: 'GET',
			headers: {
				'X-Ajax-Synchronization-Token': syncTokenValue
			},
			data: {
				apiId: apiSelect.value,
				auth_flow: 'auth_code',
				authorization_code: authCode ? authCode.value : null
			},
			responseType: 'json',
		}).success(function (data) {
			if (data.success) {
				setOAuth2AccessToken(data.result.access_token);
			} else {
				resetOAuth2AccessToken();
				alert(data);
			}
		}).error(function (data) {
			alert(data);
		});

	};

	var hideDescriptions = function () {
		descriptions.forEach(function (description) {
			hide(description);
		});
	};

	var showDescriptions = function (id) {
		var selectedDescriptions = document.querySelectorAll('#apiDescription' + id);
		hideDescriptions();
		selectedDescriptions.forEach(function (description) {
			show(description);
		});
	};

	var hideControls = function () {
		hide(controls);
	};

	var showControls = function () {
		show(controls);
	};

	var hideEndpointLists = function () {
		endpointLists.forEach(function (list) {
			hide(list);
		});
	};

	var showEndpointLists = function (id) {
		var selectedEndpoints = document.querySelectorAll('[data-api-id="' + id + '"]');
		selectedEndpoints.forEach(function (list) {
			show(list);
		});
	};

	// @todo
	var a11y = function () {
		// 1. Add role="button" to links, heading, etc. that are clickable
	};

	var showAllEndpoints = function () {
		endpoints.forEach(function (endpoint) {
			show(endpoint);
		});
	};

	var toggleAllEndpoints = function () {
		var showEndpoints = document.querySelector('li.endpoint > ul.methods.' + hideClass) ? true : false;
		endpoints.forEach(function (endpoint) {
			if (showEndpoints) {
				show(endpoint);
			} else {
				hide(endpoint);
			}
		});
		if (!showEndpoints) {
			hideAllMethods();
		}
	};

	var toggleEndpoint = function (endpoint) {
		var methods = endpoint.querySelector('ul.methods');
		if (!methods) return;
		if (methods.classList.contains(hideClass)) {
			show(methods);
		} else {
			hide(methods);
		}
	};

	var hideAllMethods = function () {
		methods.forEach(function(method) {
			hide(method);
		});
	};

	var toggleAllMethods = function () {
		var showMethods = document.querySelector('li.method form.' + hideClass) ? true : false;
		methods.forEach(function (method) {
			if (showMethods) {
				show(method);
			} else {
				hide(method);
			}
		});
		if (showMethods && document.querySelector('li.endpoint > ul.methods.' + hideClass)) {
			showAllEndpoints();
		}
	};

	var toggleMethod = function (method) {
		var form = method.querySelector('form');
		if (!form) return;
		if (form.classList.contains(hideClass)) {
			show(form);
		} else {
			hide(form);
		}
	};

	var hideAll = function () {
		hideCredentials();
		hideDescriptions();
		hideControls();
		hideEndpointLists();
	};

	var showCredentials = function () {

		hideAll();
		credentialsForm.reset();

		var apiStoreElem = document.querySelector('#api' + apiSelect.value);
		var auth_type = getAuthType(apiStoreElem);
		var authBox = document.querySelector('.credentials_start.' + auth_type);
		var available_keys = getApiKeys(apiStoreElem);

		if (isBasicAuthEnabled(apiStoreElem)) {
			show(document.querySelector('#apiBasicAuthCredFlowContainer'));
		}

		switch (auth_type) {
			case 'key':
				hide(document.querySelector('#apiSecretContainer'));
				hide(document.querySelector('#apiKeySecretListContainer'));
				hide(document.querySelector('#apiKeyContainer'));

				if (available_keys && available_keys.length) {

					var secret = document.querySelector('#apiKeySecret');
					secret.innerHTML = '';

					available_keys.forEach(function (v, k) {
						var label = '';
						if (v.application) {
							label = v.application + ': ' + v.key;
						} else {
							label = v.key;
						}
						secret.innerHTML += '<option data-secret="' + v.secret + '" value="' + v.key + '">' + label + '</option>';
					});

					show(document.querySelector('#apiKeySecretListContainer'));

					if (enableHSSM) {
						show(document.querySelector('#apiSecretContainer'));
						hide(document.querySelector('#showManualKeySecret'));
					}

				} else {
					show(document.querySelector('#apiKeyContainer'));

					if (apiStoreElem.getAttribute('data-secret') === '1') {
						show(document.querySelector('#apiSecretContainer'));
					}
				}
				break;

			case 'oauth2':

				var auth_flows = JSON.parse(apiStoreElem.getAttribute('data-auth-flows'));
				var oauth2FlowType = document.querySelector('#apiOAuth2FlowType');

				oauth2FlowType.innerHTML = '';

				hide(document.querySelector('#apiOAuth2PresetKeysContainer'));

				if (auth_flows) {
					auth_flows.forEach(function (v, k) {

						var auth_flow_desc = function (v) {
							switch (v) {
								case 'auth_code':
									return "Authorization Code / Web Server";
								case 'implicit':
									return "Implicit / Javascript Client";
								case 'password_cred':
									return "Password Credentials";
								case 'client_cred':
									return "Client Credentials";
								default:
									return "Unknown";
							}
						};

						oauth2FlowType.innerHTML += '<option value="' + v + '">' + auth_flow_desc(v) + '</option>';

					});
				}

				if (available_keys && available_keys.length > 0) {

					var oauth2PresetKeys = document.querySelector('#apiOAuth2PresetKeys');

					oauth2PresetKeys.innerHTML = '';
					oauth2PresetKeys += '<option value="__manual">Manual Input</option>';

					available_keys.forEach(function (v, k) {
						oauth2PresetKeys.innerHTML += '<option data-secret="' + v.secret + '" value="' + v.key + '">' + v.application + '</option>';
					});

					show(document.querySelector('#apiOAuth2PresetKeysContainer'));
				}

				oauth2ChangeHandler(oauth2FlowType);

				break;

			// @todo
			// case 'soapWssSecurityAuth':

			// 	var token_types = $.parseJSON(apiStoreElem.attr('data-auth-wss-token-types'));

			// 	if (token_types) {

			// 		$.each(token_types, function (k, v) {

			// 			if (v == 'soapWssUserNameToken') {

			// 				var container = $('#apiSoapWssUserNameTokenAuthCredFlowContainer').slideDown(),
			// 					wssFields = self.getWssFields(),
			// 					i,
			// 					field;

			// 				// clear fields before adding to avoid duplicates
			// 				container.find('.SoapWssUserNameTokenAuthGenerated').remove();

			// 				for (i = 0; i < wssFields.length; i++) {
			// 					field = '<div class="SoapWssUserNameTokenAuthGenerated">';
			// 					field += '<label for="apiSoapWssUserNameTokenAuth' + wssFields[i] + '">' + wssFields[i] + ':</label>';
			// 					field += '<input type="text"  id="apiSoapWssUserNameTokenAuth' + wssFields[i] + '"/>';
			// 					field += '</div>';
			// 					container.append(field);
			// 				}
			// 			} else if (v == 'soapWssBinarySecurityToken') {
			// 				$('#apiSoapWssBinarySecurityTokenAuthCredFlowContainer').slideDown();
			// 			}

			// 		});
			// 	}

			// 	break;
			// case 'soapBasic':
			// 	$('#apiSoapBasicAuthCredFlowContainer').slideDown();
			// 	break;
			// default:
			// 	break;
		}

		show(authBox);

	};

	var selectAPI = function (id) {

		// No id selected, so hide everything
		if (!id || id.length < 1) {
			hideAll();
			return;
		}

		// Show everything that needs to be shown
		showCredentials(); // self.showApiCredentialBox(id);
		showDescriptions(id); // self.showApiDescriptionBox();
		showControls(); // self.showEMControlBox();
		hideEndpointLists(); // self.hideAllUnselectedApiEndpointLists();
		showEndpointLists(id); // self.showSelectedApiEndpointList();
		// @todo potentially later
		// self.showAllSelectedEndpoints();

	};

	var oauth2ChangeHandler = function (select) {

		hideOauth2Credentials();

		if (select.value.length < 1) return;

		switch (select.value) {
			case 'auth_code':
				show(document.querySelector('#apiOAuth2AuthCodeFlowContainer'));
				break;
			case 'implicit':
				show(document.querySelector('#apiOAuth2ImplicitFlowContainer'));
				break;
			case 'password_cred':
				show(document.querySelector('#apiOAuth2PasswordCredFlowContainer'));
				break;
			case 'client_cred':
				show(document.querySelector('#apiOAuth2ClientCredFlowContainer'));
				break;
			default:
				break;
		}

	};

	var oauth2PresetKeyChangeHandler = function (elem) {
		if ((elem.value === '__manual') || (elem.value.length < 1)) {
			document.querySelector('.oauth2_client_id_field').value = '';
			document.querySelector('.oauth2_client_secret_field').value = '';
		} else {
			document.querySelector('.oauth2_client_id_field').value = elem.value;
			document.querySelector('.oauth2_client_secret_field').value = elem.getAttribute('data-secret');
		}
	};

	var renderAceEditor = function (method) {

		console.log(enableAce);
		console.log(('ace' in window));

		if (!enableAce || !('ace' in window)) return;

		// when the method is expanded..

		var form = method.closest('li.method').querySelector('form');
		var textarea = form.querySelector('.requestBody');
		var parameters = form.querySelector('.parameters'); // get the parameters for this definition
		var mode = 'text'; // default editor mode
		var editorEl = form.querySelector('.request-body-editor'); // look for editor element

		// check for found element
		if (!editorEl) return;

		// check for previous instantiation
		if (!method.editor) {

			// check for params and get the editor mode
			if (parameters) {
				var contentType = parameters.querySelector('[name="params[Content-Type]"]');
				contentType = contentType ? contentType.value : null;
				mode = getEditorMode(contentType);
			}

			method.editor = ace.edit(editorEl); // instantiate editor
			method.editor.getSession().setMode('ace/mode/' + mode); // set the editor mode

			// on value change let's resize the height
			// method.editor.getSession().on('change', $.proxy(function () {
			// 	var height = method.editor.getSession().getScreenLength() * method.editor.renderer.lineHeight + method.editor.renderer.scrollBar.getWidth();
			// 	if (height > textarea.height()) { // ensure not  less than the original text area
			// 		editorEl.css('height', height + 'px'); // set element height
			// 		method.editor.resize(); // set resize
			// 	}
			// }, method));

			// method.editor.on('blur', $.proxy(function () { // when we lose focus
			// 	textarea.val(method.editor.getSession().getValue()); // update the text area
			// }, method));
		}

		hide(textarea); // hide original textarea
		editorEl.style.height = window.getComputedStyle(textarea).height;
		// show(editorEl);
		// @todo
		// this.editor.resize(); // update editor size
		// this.editor.focus(); // focus editor

	};

	var prepareSchemaProperties = function (schema) {

		if (!schema.properties) return;

		schema.properties.forEach(function (property, propertyName) {

			if (!property.title) {
				// Default to using the property name if no title is specified for the property
				property.title = propertyName.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, function (str) {
					return str.toUpperCase();
				});
			}

			// Re-write object schema references to enable alpaca's support for schema references
			// See: http://www.alpacajs.org/examples/components/jsonschema/references.html

			if (property.$ref && property.$ref.indexOf('#') !== 0) {
				// Re-write object schema references to be locally relative to this schema
				property.$ref = '#/definitions/' + property.$ref;
			}

			if (property.items && property.items.$ref && property.items.$ref.indexOf('#') !== 0) {
				// Re-write array item schema references to be locally relative to this schema
				property.items.$ref = '#/definitions/' + property.items.$ref;
			}

			// Recursively initialize the properties of the nested schema
			if (property.type === 'object') {
				prepareSchemaProperties(property.properties);
			} else if (property.type === 'array') {
				prepareSchemaProperties(property.items.properties);
			}

		});
	};

	// private function to generate schema options from the definition properties
	var getSchemaOptions = function (schema) {

		// init options
		var options = {};

		// ensure valid properties
		if (!schema.properties) return;

		schema.properties.forEach(function (value, key) {

			if (value.type === 'array') {
				var arrayOptions = getSchemaOptions(value.items); // recurse!

				if (!options[key]) {
					options[key] = { 'items': {} }; // init field options
				}

				options[key].toolbarSticky = true;
				options[key].fieldClass = 'iodoc-array-field';
				options[key].items.showMoveUpItemButton = false;
				options[key].items.showMoveDownItemButton = false;

				if (Object.keys(arrayOptions).length > 0) { // if recursion wasn't empty
					options[key].fields = { 'item': { 'fields': arrayOptions } }; // set proper alpaca options
				}
			} else if (value.properties) { // check for nested properties
				if (!options[key]) {
					options[key] = { 'fields': {} };
				}
				options[key].fields = getSchemaOptions(value); // recurse!
			}

		});

		return options;

	};

	var renderAlpacaForms = function () {

		// override the Alpaca Integerfield's getValue to return empty string
		// Alpaca.Fields.IntegerField.prototype.getValue = function () {
		// 	var textValue = this.field.val();
		// 	if (Alpaca.isValEmpty(textValue)) {
		// 		return '';
		// 	} else {
		// 		return parseFloat(textValue);
		// 	}
		// };

		// For each API (root ul element)
		endpointLists.forEach(function (list) {

			var schemas = window.mashery.content.schemas[list.id];
			if (!schemas || Object.keys(schemas).length < 1) return;

			// Find all of the nested elements that should contain alpaca form for the request body
			var requestBodySchemaContainers = list.querySelectorAll('.requestBodySchemaContainer');

			requestBodySchemaContainers.forEach(function (container) {

				// Get the schema ID associated with the request body
				var requestBodySchemaId = container.getAttribute('data-request-body-schema-id');
				if (!requestBodySchemaId) return;

				// Get the method form element that contains this alpaca container element
				var methodForm = container.closest('form');

				// Get the schema associated with the method's request body
				var requestBodySchema = schemas[requestBodySchemaId];

				if (!requestBodySchema || !methodForm) return;

				// Shallow copy the schema to add the definitions for use with alpaca
				// Set all of the API schemas as definitions to enable alpaca's support for schema references
				// See: http://www.alpacajs.org/examples/components/jsonschema/references.html
				var requestBodyAlpacaSchema = $.extend({ 'definitions': schemas }, requestBodySchema);
				var schemaOptions = getSchemaOptions(requestBodyAlpacaSchema); // get schema options
				var defaultValue = JSON.parse(container.getAttribute('data-request-body-default-value'));

				// Initialize the alpaca component on this container element
				$(container).alpaca({
					"schema": requestBodyAlpacaSchema,
					"data": defaultValue,
					"options": $.extend({ "name": "requestBody" }, { 'fields': schemaOptions }),
					// @todo later
					// "postRender": function (requestBodyAlpacaForm) {
					// 	// In order to extract the alpaca form data as a JSON object on form submit,
					// 	// store a reference to the alpaca form object in the method form element
					// 	// $.data(methodForm, 'requestBodyAlpacaForm', requestBodyAlpacaForm);
					// }
				});

			});

		});

		enableAce = true;

	};

	var renderSchemas = function () {

		endpointLists.forEach(function (list) {
			var schemas = window.mashery.content.schemas[list.id];
			if (!schemas || Object.keys(schemas).length < 1) return;
			schemas.forEach(function (schema, schemaID) {
				if (!schema.title) {
					schema.title = schemaId;
				}
				prepareSchemaProperties(schema);
			});
		});

		// Undo any previously generated schemas
		var containers = document.querySelectorAll('.requestBodySchemaContainer');
		containers.forEach(function (container) {
			container.innerHTML = '';
		});

		// Load jQuery and Alpaca
		if ('jQuery' in window) {
			m$.loadJS('/public/Mashery/scripts/vendor/alpaca.min.js', renderAlpacaForms);
		} else {
			m$.loadJS('https://code.jquery.com/jquery-1.8.3.min.js', function () {
				m$.loadJS('/public/Mashery/scripts/vendor/alpaca.min.js', renderAlpacaForms);
			});
		}

		// Load Ace
		m$.loadJS('/public/Mashery/scripts/Mashery/ace/ace.js');

	};

	var changeHandler = function (event) {

		if (event.target.matches('#apiOAuth2FlowType')) {
			oauth2ChangeHandler(event.target);
			return;
		}

		if (event.target.matches('#apiOAuth2PresetKeys')) {
			oauth2PresetKeyChangeHandler(event.target);
			return;
		}

		if (event.target.matches('#apiId')) {
			selectAPI(event.target.value);
		}


	};

	var clickHandler = function (event) {

		if (event.target.closest('.endpoint h3.title')) {
			toggleEndpoint(event.target.closest('.endpoint'));
		}

		if (event.target.closest('.method div.title')) {
			toggleMethod(event.target.closest('.method'));
			renderAceEditor(event.target);
		}

		if (event.target.closest('#toggleEndpoints')) {
			event.preventDefault();
			toggleAllEndpoints();
		}

		if (event.target.closest('#toggleMethods')) {
			event.preventDefault();
			toggleAllMethods();
		}

	};

	var loadDependencies = function () {
		if ('jQuery' in window) {
			m$.loadJS('/public/Mashery/scripts/vendor/alpaca.min.js', renderSchemas);
		} else {
			m$.loadJS('https://code.jquery.com/jquery-1.8.3.min.js', function () {
				m$.loadJS('/public/Mashery/scripts/vendor/alpaca.min.js', renderSchemas);
			});
		}
		// m$.loadJS('/public/Mashery/scripts/Mashery/ace/ace.js');
	};

	exports.init = function () {

		// Set variables
		credentials = document.querySelectorAll('.credentials');
		credentialsForm = document.querySelector('#credentials');
		descriptions = document.querySelectorAll('.apiDescriptionList');
		controls = document.querySelector('#controls');
		endpointLists = document.querySelectorAll('.endpointList');
		apiSelect = document.querySelector('#apiId');
		methods = document.querySelectorAll('li.method > form');
		endpoints = document.querySelectorAll('li.endpoint > ul.methods');
		enableHSSM = document.querySelector('[name=enable_high_security_secret_management]') && document.querySelector('[name=enable_high_security_secret_management]').value.length > 0 ? true : false;

		// Running!
		console.log('IO Docs is running!');

		// Event listeners
		window.addEventListener('change', changeHandler, false);
		document.addEventListener('click', clickHandler, false);

		// Methods
		hideAllMethods();
		renderSchemas();
		setSyncTokenValue();

		if (endpointLists.length === 1) {
			apiSelect.value = apiSelect.options[1].value;
			selectAPI(apiSelect.value);
		}

		if (apiSelect.value.length > 0) {
			selectAPI(apiSelect.value);
		}

	};



	//
	// Public APIs
	//

	return exports;

})();