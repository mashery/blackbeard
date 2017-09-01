/*!
 * blackbeard vbeta: Future portal layout
 * (c) 2017 Chris Ferdinandi
 * LicenseRef-All Rights Reserved License
 * http://github.com/mashery/blackbeard
 */

var ioDocs = (function () {

	'use strict';

	//
	// Variables
	//

	// Public API placeholder
	var exports = {};
	var hideClass = 'io-docs-hide';
	var credentials, credentialsForm, descriptions, controls, endpointLists, apiSelect, methods, endpoints, enableHSSM, enableAce, enableBeautify, enablePrism, prismStyles, authTimer, syncTokenValue;



	//
	// Methods
	//

	var spaces = function (len) {
		var s = '',
			indent = len * 4;

		for (var i = 0; i < indent; i++) {
			s += " ";
		}

		return s;
	};

	var formatJSON = function (jsonString) {
		return JSON.stringify(jsonString, null, '    ');
	};

	var formatString = function (string) {
		return string.replace(new RegExp('&nbsp;', 'g'), ' ').replace(new RegExp('<br>', 'g'), '\n');
	};

	var formatHeaders = function (headerMap) {
		var headersString = '';

		for (var headerName in headerMap) {
			if (headerMap.hasOwnProperty(headerName)) {
				var headerValue = headerMap[headerName];
				headersString += headerName + ': ' + headerValue + '\r\n';
			}
		}

		return headersString;
	};

	// Cause the browser to "select" all the text in an element
	var selectElementText = function (elem) {
		elem.focus();
		var range;
		if (window.getSelection && document.createRange) {
			var sel = window.getSelection();
			range = document.createRange();
			range.selectNodeContents(elem);
			sel.removeAllRanges();
			sel.addRange(range);
		} else if (doc.body.createTextRange) {
			range = document.body.createTextRange();
			range.moveToElementText(el);
			range.select();
		}
	};

	var formatXML = function (str) {
		var xml = '';

		// add newlines
		str = str.replace(/(>)(<)(\/*)/g, "$1\r$2$3");

		// add indents
		var pad = 0,
			indent,
			node;

		// split the string
		var strArr = str.split("\r");

		// check the various tag states
		for (var i = 0, len = strArr.length; i < len; i++) {
			indent = 0;
			node = strArr[i];

			if (node.match(/.+<\/\w[^>]*>$/)) { //open and closing in the same line
				indent = 0;
			} else if (node.match(/^<\/\w/) && pad > 0) { // closing tag
				pad -= 1;
			} else if (node.match(/^<\w[^>]*[^\/]>.*$/)) { //opening tag
				indent = 1;
			} else {
				indent = 0;
			}

			xml += spaces(pad) + node + "\r";
			pad += indent;
		}

		return xml;

	};

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

	var toggle = function (elem) {
		if (!elem) return;
		elem.classList.toggle(hideClass);
	};

	var hideCredentials = function () {
		credentials.forEach((function (credential) {
			hide(credential);
		}));
	};

	var hideOauth2Credentials = function () {
		document.querySelectorAll('.credentials.oauth2').forEach((function(credential) {
			if (credential.matches('.credentials_start')) return;
			hide(credential);
		}));
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
		authTimer = window.setInterval((function () {
			if (oAuth2AuthWindow.closed !== false) { // when the window is closed
				window.clearInterval(authTimer); // clear the timer
				setOAuth2AuthorizeCode(window.auth_code); // set the auth code from the popup window
				delete window.auth_code; // clear the auth code just in case
			}
		}), 200);

		$.ajax({
			async: true,
			headers: {
				'X-Ajax-Synchronization-Token': syncTokenValue
			},
			data: {
				apiId: apiSelect.value,
				client_id: client_id,
				client_secret: client_secret,
				auth_flow: 'auth_code'
			},
			dataType: 'json',
			global: false,
			timeout: 10000,
			type: 'POST',
			url: '/io-docs/getoauth2authuri',
			error: function (jqXHR, textStatus, errorThrown) {
				alert(jqXHR.responseText);
			},
			success: function (data, textStatus, jqXHR) {
				if (data.success) {
					oAuth2AuthWindow.location.href = data.authorize_uri;
					oAuth2AuthWindow.focus();
					// } else {  TODO:  Should this return an error on failure?
					// self.resetOAuth2AccessToken();
					// alert(jqXHR.responseText);
					// alert("ERROR: 324  --  Sorry there was an error getting an access token. Try again later.");
				} else {
					oAuth2AuthWindow.close();
				}
			}
		});

	};

	var sendImplicitAccessToken = function (token, errorCallback, successCallback) {
		$.ajax({
			async: true,
			headers: {
				'X-Ajax-Synchronization-Token': syncTokenValue
			},
			data: {
				apiId: apiSelect.value,
				access_token: token.access_token,
				expires_in: token.expires_in,
				token_type: token.token_type
			},
			dataType: 'json',
			global: false,
			timeout: 10000,
			type: 'POST',
			url: '/io-docs/catchOauth2ImplicitToken',
			error: function () {
				alert('Sorry, there was an error processing the response from the OAuth2 server. Try again later');
			},
			success: function (data) {
				if (data.success) {
					self.setOAuth2AccessToken(token.access_token);
				} else {
					alert('Sorry, but there was an error during the account authorization process. Either the credentials were not entered correctly, or permission was denied by the account holder. Please try again.');
				}
			}
		});
	};

	var getImplicitAccessToken = function (client_id) {

		// open empty window before async call (async code triggers popup blocker on window.open)
		var oAuth2AuthWindow = window.open(null, 'masheryOAuth2AuthWindow', 'width=300,height=400');

		window.clearInterval(authTimer); // clear the timer
		authTimer = window.setInterval((function () {
			if (oAuth2AuthWindow.closed !== false) { // when the window is closed
				window.clearInterval(authTimer); // clear the timer
				sendImplicitAccessToken(window.access_token); // set the auth code from the popup window
				delete window.access_token; // clear the auth code just in case
			}
		}), 200);

		$.ajax({
			async: true,
			headers: {
				'X-Ajax-Synchronization-Token': syncTokenValue
			},
			data: {
				apiId: apiSelect.value,
				client_id: client_id,
				auth_flow: 'implicit'
			},
			dataType: 'json',
			global: false,
			timeout: 10000,
			type: 'POST',
			url: '/io-docs/getoauth2authuri',
			error: function (jqXHR, textStatus, errorThrown) {
				alert(jqXHR.responseText);
			},
			success: function (data, textStatus, jqXHR) {
				if (data.success) {
					oAuth2AuthWindow.location.href = data.authorize_uri;
					oAuth2AuthWindow.focus();
				} else {
					oAuth2AuthWindow.close();
					self.resetOAuth2AccessToken();
					// TODO:  Should this display an error on failure?
					// alert(jqXHR.responseText);
				}
			}
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
		$.ajax({
			async: true,
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
			dataType: 'json',
			global: false,
			timeout: 10000,
			type: 'GET',
			url: '/io-docs/getoauth2accesstoken',
			error: function (jqXHR, textStatus, errorThrown) {
				alert(jqXHR.responseText);
			},
			success: function (data, textStatus, jqXHR) {
				if (data.success) {
					self.setOAuth2AccessToken(data.result.access_token);
				} else {
					self.resetOAuth2AccessToken();
					alert(jqXHR.responseText);
				}
			}
		});
	};

	var getAccessTokenFromClientCred = function (client_id, client_secret) {
		$.ajax({
			async: true,
			headers: {
				'X-Ajax-Synchronization-Token': syncTokenValue
			},
			data: {
				apiId: apiSelect.value,
				auth_flow: 'client_cred',
				client_id: client_id,
				client_secret: client_secret
			},
			dataType: 'json',
			global: false,
			timeout: 10000,
			type: 'GET',
			url: '/io-docs/getoauth2accesstoken',
			error: function (jqXHR, textStatus, errorThrown) {
				alert(jqXHR.responseText);
			},
			success: function (data, textStatus, jqXHR) {
				if (data.success) {
					self.setOAuth2AccessToken(data.result.access_token);
				} else {
					self.resetOAuth2AccessToken();
					alert(jqXHR.responseText);
				}
			}
		});
	};

	var exchangeAuthCodeforAccessToken = function () {
		var authCode = document.querySelector('#apiOAuth2AuthorizeCode');

		$.ajax({
			async: true,
			headers: {
				'X-Ajax-Synchronization-Token': syncTokenValue
			},
			data: {
				apiId: apiSelect.value,
				auth_flow: 'auth_code',
				authorization_code: document.querySelector('#apiOAuth2AuthorizeCode').value
			},
			dataType: 'json',
			global: false,
			timeout: 10000,
			type: 'GET',
			url: '/io-docs/getoauth2accesstoken',
			error: function (jqXHR, textStatus, errorThrown) {
				alert(jqXHR.responseText);
			},
			success: function (data, textStatus, jqXHR) {
				if (data.success) {
					self.setOAuth2AccessToken(data.result.access_token);
				} else {
					self.resetOAuth2AccessToken();
					alert(jqXHR.responseText);
				}
			}
		});

	};

	var getWssFields = function () {

		var wssFields;
		var apiStoreElem = document.querySelector('#api' + apiSelect.value);
		var wssFieldsValue = apiStoreElem.getAttribute('data-auth-wss-fields');

		if (wssFieldsValue && wssFieldsValue.length > 0) {
			wssFields = JSON.parse(wssFieldsValue);
		}

		return wssFields || [];
	};

	var hideDescriptions = function () {
		descriptions.forEach((function (description) {
			hide(description);
		}));
	};

	var showDescriptions = function (id) {
		var selectedDescriptions = document.querySelectorAll('#apiDescription' + id);
		hideDescriptions();
		selectedDescriptions.forEach((function (description) {
			show(description);
		}));
	};

	var hideControls = function () {
		hide(controls);
	};

	var showControls = function () {
		show(controls);
	};

	var hideEndpointLists = function () {
		endpointLists.forEach((function (list) {
			hide(list);
		}));
	};

	var showEndpointLists = function (id) {
		var selectedEndpoints = document.querySelectorAll('[data-api-id="' + id + '"]');
		selectedEndpoints.forEach((function (list) {
			show(list);
		}));
	};

	var a11y = function () {
		var buttons = document.querySelectorAll('#toggleEndpoints, #toggleMethods, .method div.title');
		buttons.forEach((function (button) {
			button.setAttribute('role', 'button');
		}));
	};

	var showAllEndpoints = function () {
		endpoints.forEach((function (endpoint) {
			show(endpoint);
		}));
	};

	var toggleAllEndpoints = function () {
		var showEndpoints = document.querySelector('li.endpoint > ul.methods.' + hideClass) ? true : false;
		endpoints.forEach((function (endpoint) {
			if (showEndpoints) {
				show(endpoint);
			} else {
				hide(endpoint);
			}
		}));
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
		methods.forEach((function(method) {
			hide(method);
		}));
	};

	var toggleAllMethods = function () {
		var showMethods = document.querySelector('li.method form.' + hideClass) ? true : false;
		methods.forEach((function (method) {
			if (showMethods) {
				show(method);
			} else {
				hide(method);
			}
		}));
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

					available_keys.forEach((function (v, k) {
						var label = '';
						if (v.application) {
							label = v.application + ': ' + v.key;
						} else {
							label = v.key;
						}
						secret.innerHTML += '<option data-secret="' + v.secret + '" value="' + v.key + '">' + label + '</option>';
					}));

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
					auth_flows.forEach((function (v, k) {

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

					}));
				}

				if (available_keys && available_keys.length > 0) {

					var oauth2PresetKeys = document.querySelector('#apiOAuth2PresetKeys');

					oauth2PresetKeys.innerHTML = '';
					oauth2PresetKeys += '<option value="__manual">Manual Input</option>';

					available_keys.forEach((function (v, k) {
						oauth2PresetKeys.innerHTML += '<option data-secret="' + v.secret + '" value="' + v.key + '">' + v.application + '</option>';
					}));

					show(document.querySelector('#apiOAuth2PresetKeysContainer'));
				}

				oauth2ChangeHandler(oauth2FlowType);

				break;

			case 'soapWssSecurityAuth':

				var token_types = JSON.parse(apiStoreElem.getAttribute('data-auth-wss-token-types'));

				if (token_types) {

					token_types.forEach((function (v, k) {
						if (v === 'soapWssUserNameToken') {

							var container = document.querySelector('#apiSoapWssUserNameTokenAuthCredFlowContainer');
							var wssFields = getWssFields();
							var i;
							var newField;

							show(container);

							// clear fields before adding to avoid duplicates
							container.querySelectorAll('.SoapWssUserNameTokenAuthGenerated').forEach((function (field) {
								field.remove();
							}));

							wssFields.forEach((function (field) {
								newField =
									'<div class="SoapWssUserNameTokenAuthGenerated">' +
										'<label for="apiSoapWssUserNameTokenAuth' + wssFields[i] + '">' + wssFields[i] + ':</label>' +
										'<input type="text"  id="apiSoapWssUserNameTokenAuth' + wssFields[i] + '"/>' +
									'</div>';
								container.append(newField);
							}));

						} else if (v == 'soapWssBinarySecurityToken') {
							show(document.querySelector('#apiSoapWssBinarySecurityTokenAuthCredFlowContainer'));
						}
					}));
				}

				break;
			case 'soapBasic':
				show(document.querySelector('#apiSoapBasicAuthCredFlowContainer'));
				break;
			default:
				break;
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

		}

		hide(textarea); // hide original textarea
		editorEl.style.height = window.getComputedStyle(textarea).height;
		editorEl.style.display = '';

	};

	var prepareSchemaProperties = function (schema) {

		if (!schema.properties) return;

		schema.properties.forEach((function (property, propertyName) {

			if (!property.title) {
				// Default to using the property name if no title is specified for the property
				property.title = propertyName.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (function (str) {
					return str.toUpperCase();
				}));
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

		}));
	};

	// private function to generate schema options from the definition properties
	var getSchemaOptions = function (schema) {

		// init options
		var options = {};

		// ensure valid properties
		if (!schema.properties) return;

		schema.properties.forEach((function (value, key) {

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

		}));

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
		endpointLists.forEach((function (list) {

			var schemas = window.mashery.content.schemas[list.id];
			if (!schemas || Object.keys(schemas).length < 1) return;

			// Find all of the nested elements that should contain alpaca form for the request body
			var requestBodySchemaContainers = list.querySelectorAll('.requestBodySchemaContainer');

			requestBodySchemaContainers.forEach((function (container) {

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
					"postRender": function (requestBodyAlpacaForm) {
						// In order to extract the alpaca form data as a JSON object on form submit,
						// store a reference to the alpaca form object in the method form element
						// @todo associated with list.id, not jQuery version of $data
						// window.mashery.content.alpaca[list.id] = requestBodyAlpacaForm;
						$.data(methodForm, 'requestBodyAlpacaForm', requestBodyAlpacaForm);
					}
				});

			}));

		}));

		enableAce = true;

	};

	var renderSchemas = function () {

		endpointLists.forEach((function (list) {
			var schemas = window.mashery.content.schemas[list.id];
			if (!schemas || Object.keys(schemas).length < 1) return;
			schemas.forEach((function (schema, schemaID) {
				if (!schema.title) {
					schema.title = schemaId;
				}
				prepareSchemaProperties(schema);
			}));
		}));

		// Undo any previously generated schemas
		var containers = document.querySelectorAll('.requestBodySchemaContainer');
		containers.forEach((function (container) {
			container.innerHTML = '';
		}));

		// Render Alpaca forms
		renderAlpacaForms();

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

		// @todo Fix this: resize Ace Editor on type
		// if (event.target.closest('.ace_editor')) {
		// 	console.log('yes');
		// 	resizeEditor(event.target.closest('.ace_editor'));
		// }

	};

	var resizeEditor = function (editor) {
		var textarea = editor.closest('form').querySelector('.requestBody');
		if (!textarea) return;
		editor.style.height = '';
		var editorHeight = window.getComputedStyle(editor).height;
		var textHeight = window.getComputedStyle(textarea).height;

		// ensure not  less than the original text area
		if (parseInt(height, 10) > parseInt(window.getComputedStyle(textarea).height, 10)) {
			editor.style.height = editorHeight;
		} else {
			editor.style.height = textHeight;
		}
	};

	var showManualSecretHandler = function () {
		var apiStoreElem = document.querySelector('#api' + apiSelect.value);

		hide(document.querySelector('#apiSecretContainer'));
		hide(document.querySelector('#apiKeySecretListContainer'));
		hide(document.querySelector('#apiKeyContainer'));
		show(document.querySelector('#apiKeyContainer'));

		if (apiStoreElem.getAttribute('data-secret') === '1') {
			show(document.querySelector('#apiSecretContainer'));
		}
	};

	var clearResults = function (link) {

		// Get responseBoxes
		var responseBoxes = link.closest('form').querySelectorAll('div.result, div.error');

		// Delete the response box
		responseBoxes.forEach((function (box) {
			box.remove();
		}));

		// Delete clear link
		link.remove();

	};

	var clickHandler = function (event) {

		if (event.target.closest('.select-all')) {
			event.preventDefault();
			selectElementText(event.target.parentNode.querySelector('pre'));
		}

		else if (event.target.closest('.endpoint h3.title')) {
			toggleEndpoint(event.target.closest('.endpoint'));
		}

		else if (event.target.closest('.method div.title')) {
			toggleMethod(event.target.closest('.method'));
			renderAceEditor(event.target);
		}

		else if (event.target.closest('#toggleEndpoints')) {
			event.preventDefault();
			toggleAllEndpoints();
		}

		else if (event.target.closest('#toggleMethods')) {
			event.preventDefault();
			toggleAllMethods();
		}

		else if (event.target.closest('#apiOAuth2AuthPassCredExchangeButton')) {
			event.preventDefault();
			getAccessTokenFromPasswordCred(
				document.querySelector('#apiOAuth2ClientIdPasswordCred').value,
				document.querySelector('#apiOAuth2ClientSecretPasswordCred').value,
				document.querySelector('#apiOAuth2Username').value,
				document.querySelector('#apiOAuth2Password').value
			);
		}

		else if (event.target.closest('#apiOAuth2AuthClientCredExchangeButton')) {
			event.preventDefault();
			getAccessTokenFromClientCred(
				document.querySelector('#apiOAuth2ClientIdClientCred').value,
				document.querySelector('#apiOAuth2ClientSecretClientCred').value
			);
		}

		else if (event.target.closest('#apiOAuth2AuthorizationButton')) {
			event.preventDefault();
			getAuthorizationCode(
				document.querySelector('#apiOAuth2ClientIdAuthCode').value,
				document.querySelector('#apiOAuth2ClientSecretAuthCode').value
			);
		}

		else if (event.target.closest('#apiOAuth2ImplicitExchangeButton')) {
			event.preventDefault();
			getImplicitAccessToken(
				document.querySelector('#apiOAuth2ClientIdImplicit').value
			);
		}

		else if (event.target.closest('#apiOAuth2AuthExchangeButton')) {
			event.preventDefault();
			exchangeAuthCodeforAccessToken();
		}

		else if (event.target.closest('#showManualKeySecret')) {
			event.preventDefault();
			showManualSecretHandler();
		}

		else if (event.target.closest('.clear-results')) {
			event.preventDefault();
			clearResults(event.target.closest('.clear-results'));
		}

	};

	// https://plainjs.com/javascript/ajax/serialize-form-data-into-an-array-46/
	var serializeArray = function (form) {
		var field, l, s = [];
		if (typeof form === 'object' && form.nodeName === 'FORM') {
			var len = form.elements.length;
			for (var i = 0; i < len; i++) {
				field = form.elements[i];
				if (field.name && !field.disabled && field.type !== 'file' && field.type !== 'reset' && field.type !== 'submit' && field.type !== 'button') {
					if (field.type === 'select-multiple') {
						l = form.elements[i].options.length;
						for (j = 0; j < l; j++) {
							if (field.options[j].selected)
								s[s.length] = { name: field.name, value: field.options[j].value };
						}
					} else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
						s[s.length] = { name: field.name, value: field.value };
					}
				}
			}
		}
		return s;
	};

	var submitHandler = function (event) {

		if (!event.target.matches('.method > form')) return;

		event.preventDefault();

		// Get response box, form params, and api values
		var responseBox = event.target.querySelector('div.result');
		var errorBox = event.target.querySelector('div.error');
		// var params = serializeArray(event.target);
		var params = $(event.target).serializeArray();
		var apiId = {
			name: 'apiId',
			value: apiSelect.value
		};
		var apiKey = {
			name: 'apiKey',
			value: document.querySelector('#apiKey').value
		};
		var apiSecret = {
			name: 'apiSecret',
			value: document.querySelector('#apiSecret').value
		};
		var basicAuthName = {
			name: 'basicAuthName',
			value: document.querySelector('#apiBasicAuthUsername').value
		};
		var basicAuthPass = {
			name: 'basicAuthPass',
			value: document.querySelector('#apiBasicAuthPassword').value
		};
		var soapBasicAuthName = {
			name: 'soapBasicAuthName',
			value: document.querySelector('#apiSoapBasicAuthUsername').value
		};
		var soapBasicAuthPass = {
			name: 'soapBasicAuthPass',
			value: document.querySelector('#apiSoapBasicAuthPassword').value
		};
		var soapWssUserNameTokenAuthName = {
			name: 'soapWssUserNameTokenAuthName',
			value: document.querySelector('#apiSoapWssUserNameTokenAuthUsername').value
		};
		var soapWssBinarySecurityTokenAuthToken = {
			name: 'soapWssBinarySecurityTokenAuthToken',
			value: document.querySelector('#apiSoapWssBinarySecurityTokenAuthToken').value
		};

		// Get the Alpaca-generated request body form (if the method defines request JSON schema).
		var requestBodyAlpacaForm = $.data(event.target, 'requestBodyAlpacaForm');
		// @todo switch to this later
		// var requestBodyAlpacaForm = window.mashery.content.alpaca[event.target.closest('.endpointList').id];
		var requestBodyJson;
		var wssFields = getWssFields();
		var fileFields = event.target.querySelectorAll('[type="file"]'); // get any file fields
		var fileLimit = 850000; // setting matching file limit check
		var fileLimitExceeded = false; // initial setting of file limit check

		if (requestBodyAlpacaForm) {
			requestBodyJson = {
				name: 'requestBodyJson',
				value: JSON.stringify(requestBodyAlpacaForm.getValue()) // @todo replace this jquery version with someone else
			};
		}

		// Get api key and secret from key/secret list if enabled
		var apiKeySecretInput = document.querySelector('#apiKeySecret');
		if (!apiKeySecretInput.closest('#apiKeySecretListContainer.' + hideClass)) {
			// Replace api key and secret values
			apiKey.value = apiKeySecretInput.value;

			if (!enableHSSM) { // if hssm NOT enabled get it from the data attribute
				apiSecret.value = apiKeySecretInput.options[apiKeySecretInput.selectedIndex].getAttribute('data-secret');
			}
		}

		// Add additional values to params
		params.push(apiId, apiKey, apiSecret, basicAuthName, basicAuthPass, soapBasicAuthName, soapBasicAuthPass, soapWssUserNameTokenAuthName, soapWssBinarySecurityTokenAuthToken);

		wssFields.forEach((function (value, index) {
			var field = document.querySelector('#apiSoapWssUserNameTokenAuth' + value);
			params.push({
				name: 'soapWssUserNameTokenAuth' + value,
				value: field.value
			});
		}));

		if (requestBodyJson) {
			params.push(requestBodyJson);
		}

		if (fileFields.length > 0) { // we got some file fields
			var formData = new FormData(); // create a form data object to post

			params.forEach((function (param) {
				formData.append(param.name, param.value); // add param to form data
			}));

			fileFields.forEach((function (field) {
				var file = field.files[0]; // get reference to the first file
				if (file && (file.size > fileLimit)) {
					fileLimitExceeded = true;
				} else {
					formData.append(field.getAttribute('name'), file || ''); // add the file field or empty string
				}
			}));

			params = formData; // let's use the new formdata as our params
		}

		// If response node doesn't exist, create it
		if (!responseBox) {
			// Add clear link
			var clearLink = document.createElement('a');
			clearLink.className = 'clear-results';
			clearLink.setAttribute('href', '#');
			clearLink.setAttribute('role', 'button');
			clearLink.innerHTML = 'Clear Results';
			event.target.querySelector('input[type=submit]').after(clearLink);

			// Build select link
			var selectLink = document.createElement('div');
			selectLink.innerHTML = '<a class="select-all" role="button" href="#">Select Content</a>';

			// Build response box
			responseBox = document.createElement('div');
			responseBox.className = 'result';
			responseBox.innerHTML =
				// Add request uri
				'<div class="call">' +
					'<h4 class="call">Request URI</h4>' +
					'<pre class="call"><code id="callCode"></code></pre>' +
				'</div>' +

				// Add request headers
			'<div class="requestHeaders ' + hideClass + '">' +
					'<h4 class="requestHeaders">Request Headers</h4>' +
					selectLink.innerHTML +
					'<pre class="requestHeaders"><code id="requestHeadersCode"></code></pre>' +
				'</div>' +

				// Add request cookies
			'<div class="requestCookies ' + hideClass + '">' +
					'<h4 class="requestCookies">Request Cookies</h4>' +
					selectLink.innerHTML +
					'<pre class="requestCookies"><code id="requestCookiesCode"></code></pre>' +
				'</div>' +

				// Add request body
			'<div class="requestBody ' + hideClass + '">' +
					'<h4 class="requestBody">Request Body</h4>' +
					selectLink.innerHTML +
					'<pre class="requestBody"><code id="requestBodyCode"></code></pre>' +
				'</div>' +

				// Add response status
				'<div class="responseStatus">' +
					'<h4 class="responseStatus">Request Status</h4>' +
					selectLink.innerHTML +
					'<pre class="responseStatus"><code id="responseStatusCode"></code></pre>' +
				'</div>' +

				// Add response headers
				'<div class="headers">' +
					'<h4 class="headers">Response Headers</h4>' +
					selectLink.innerHTML +
					'<pre class="headers"><code id="headersCode"></code></pre>' +
				'</div>' +

				// Add response cookies
				'<div class="responseCookies ' + hideClass + '">' +
					'<h4 class="responseCookies">Response Cookies</h4>' +
					selectLink.innerHTML +
					'<pre class="responseCookies"><code id="responseCookiesCode"></code></pre>' +
				'</div>' +

				// Add response body
				'<div class="response">' +
					'<h4 class="response">Response Body</h4>' +
					selectLink.innerHTML +
					'<pre class="response"><code id="responseCode"></code></pre>' +
				'</div>';

			// Add response box to form and show it
			event.target.append(responseBox);
		}

		// Response Box is shown by default
		show(responseBox);

		if (!errorBox) {
			// Build response box
			errorBox = document.createElement('div');
			errorBox.className = 'error ' + hideClass;
			errorBox.innerHTML =
				'<h4 class="error">Error</h4>' +
				'<pre class="error"><code id="errorCode"></code></pre>';
			event.target.append(errorBox);
		}

		// Error Box is hidden by default
		hide(errorBox);

		if (fileLimitExceeded) { // check for file limit
			errorBox.querySelector('#errorCode').innerHTML = 'The selected file exceeds the maximum allowed limit of ' + Math.ceil(fileLimit / 1000) + 'kb.';
			hide(responseBox);
			show(errorBox);
		} else {
			$.ajax({
				url: '/io-docs/call-api',
				type: 'POST',
				headers: {
					'X-Ajax-Synchronization-Token': syncTokenValue
				},
				data: params,
				// check for file posting and change ajax options, else use defaults
				contentType: (fileFields.length > 0 ? false : 'application/x-www-form-urlencoded; charset=UTF-8'),
				processData: (fileFields.length > 0 ? false : true),
				dataType: 'json',
				beforeSend: function () {
					// Show loading text for response areas
					responseBox.querySelectorAll('pre code').forEach((function (area) {
						area.innerHTML = 'Loading...';
						area.classList.remove('error');
					}));
				},
				error: function (jqXHR, textStatus, errorThrown) {
					errorBox.querySelector('#errorCode').innerHTML = jqXHR.responseText;
					hide(responseBox);
					show(errorBox);
				},
				success: function (data) {
					// Init formatted text
					var formattedText = data.responseBody;
					var contentType = data.responseHeaders && data.responseHeaders['Content-Type'] || '';
					var validResponse = (data.status.code > 0 || data.status.text) || formattedText.length > 0;

					// Set up call request
					responseBox.querySelector('#callCode').innerHTML = data.requestUri;

					// Set up call request headers
					if (Object.keys(data.requestHeaders).length > 0) {
						var preRequestHeaders = responseBox.querySelector('#requestHeadersCode');
						preRequestHeaders.innerHTML = formatHeaders(data.requestHeaders);
						preRequestHeaders.classList.add('lang-http');
						show(responseBox.querySelector('.requestHeaders'));
					} else {
						responseBox.querySelector('#requestHeadersCode').innerHTML = '';
						hide(responseBox.querySelector('.requestHeaders'));
					}

					// Set up call request cookies
					if (data.requestCookies.length > 0) {
						var preRequestCookies = responseBox.querySelector('#requestCookiesCode');
						preRequestCookies.innerHTML = formatJSON(data.requestCookies);
						preRequestCookies.classList.add('lang-javascript');
						show(responseBox.querySelector('.requestCookies'));
					} else {
						responseBox.querySelector('#requestCookiesCode').innerHTML = '';
						hide(responseBox.querySelector('.requestCookies'));
					}

					// Set up call request body
					if (data.requestBody.length > 0) {
						var preRequestBody = responseBox.querySelector('#requestBodyCode');
						preRequestBody.innerHTML = data.requestBody;
						preRequestBody.classList.add('lang-javascript');
						show(responseBox.querySelector('.requestBody'));
					} else {
						responseBox.querySelector('#requestBodyCode').innerHTML = '';
						hide(responseBox.querySelector('.requestBody'));
					}

					// Set up response status
					var respStatus = responseBox.querySelector('#responseStatusCode');
					respStatus.innerHTML = data.status.code + ' ' + data.status.text;
					if (data.status.code >= 400) {
						respStatus.classList.add('error');
					} else {
						respStatus.classList.remove('error');
					}
					var respStatusClasses = (respStatus.className.match(/(^|\s)status-code-\d+/g) || []);
					respStatusClasses.forEach((function (className) {
						respStatus.classList.remove(className.trim());
					}));
					respStatus.classList.add('status-code-' + data.status.code);
					if (data.status.code > 0 || data.status.text) {
						show(responseBox.querySelector('.responseStatus'));
					} else {
						hide(responseBox.querySelector('.responseStatus'));
					}

					// Set up response headers
					var respHeaders = responseBox.querySelector('#headersCode');
					respHeaders.innerHTML = formatHeaders(data.responseHeaders);
					respHeaders.classList.add('lang-http');
					if (data.status.code >= 400) {
						respHeaders.classList.add('error');
					} else {
						respHeaders.classList.remove('error');
					}
					var respHeadersClasses = (respStatus.className.match(/(^|\s)status-code-\d+/g) || []);
					respHeadersClasses.forEach((function (className) {
						respHeaders.classList.remove(className.trim());
					}));
					respHeaders.classList.add('status-code-' + data.status.code);
					if (Object.keys(data.responseHeaders).length > 0) {
						show(responseBox.querySelector('.headers'));
					} else {
						hide(responseBox.querySelector('.headers'));
					}

					// Filter format if available content type
					switch (contentType.split(';')[0]) {
						// Parse types as JSON
						case 'application/javascript':
						case 'application/json':
						case 'application/x-javascript':
						case 'application/x-json':
						case 'text/javascript':
						case 'text/json':
						case 'text/x-javascript':
						case 'text/x-json':
							responseBox.querySelector('#responseCode').classList.add('lang-javascript');
							if (enableBeautify) {
								try {
									// js_beautify will format it if it's JSON or JSONP
									formattedText = js_beautify(formattedText, { 'preserve_newlines': false });
								} catch (err) {
									// js_beautify didn't like it, return it as it was
									formattedText = data.responseBody;
								}
							} else {
								formattedText = data.responseBody;
							}

							break;

						// Parse types as XHTML
						case 'application/xml':
						case 'text/xml':
						case 'text/html':
						case 'text/xhtml':
							responseBox.querySelector('#responseCode').classList.add('lang-markup');
							formattedText = formatXML(formattedText) || '';
							break;
						default:
							break;
					}

					// Set response text
					var respBoxResp = responseBox.querySelector('#responseCode');
					respBoxResp.innerHTML = formattedText;
					if (data.status.code >= 400) {
						respBoxResp.classList.add('error');
					} else {
						respBoxResp.classList.remove('error');
					}
					var respBoxRespClasses = (respBoxResp.className.match(/(^|\s)status-code-\d+/g) || []);
					respBoxRespClasses.forEach((function (className) {
						respBoxResp.classList.remove(className.trim());
					}));
					respBoxResp.classList.add('status-code-' + data.status.code);
					if (validResponse) {
						show(responseBox.querySelector('.response'));
					} else {
						hide(responseBox.querySelector('.response'));
					}

					// display service errors
					if (data.errorMessage.length > 0) {
						var errorBoxPre = errorBox.querySelector('#errorCode');
						errorBoxPre.innerHTML = data.errorMessage;
						errorBoxPre.classList.add('lang-markup');
						show(errorBox);
					}

					// Fire pretty print on nodes
					if ('Prism' in window) {
						Prism.highlightAll();
					}
				}
			});
		}

	};

	var loadDependencies = function () {

		// Load Alpaca
		if ('jQuery' in window) {
			m$.loadJS('/public/Mashery/scripts/vendor/alpaca.min.js', renderSchemas);
		} else {
			m$.loadJS('https://code.jquery.com/jquery-1.8.3.min.js', (function () {
				m$.loadJS('/public/Mashery/scripts/vendor/alpaca.min.js', renderSchemas);
			}));
		}

		// Load Ace
		m$.loadJS('/public/Mashery/scripts/Mashery/ace/ace.js');

		// Load Beautify
		m$.loadJS('/public/Mashery/scripts/Mashery/beautify.js', (function () {
			enableBeautify = true;
		}));

	};

	var blurHandler = function (event) {
		if (typeof (event.target.closest) !== 'function') return;
		var editor = event.target.closest('.ace_editor');
		if (!editor) return;
		var textarea = editor.closest('form').querySelector('.requestBody');
		if (!textarea) return;
		textarea.value = editor.querySelector('.ace_content').innerText;
	};

	exports.destroy = function () {

		// Remove Prism styles if loaded just for this page
		if (prismStyles) {
			prismStyles.remove();
		}

		// Remove event listeners
		window.removeEventListener('change', changeHandler, false);
		document.removeEventListener('click', clickHandler, false);
		document.removeEventListener('submit', submitHandler, false);
		window.removeEventListener('blur', blurHandler, true);

		// Reset variables
		credentials = null;
		credentialsForm = null;
		descriptions = null;
		controls = null;
		endpointLists = null;
		apiSelect = null;
		methods = null;
		endpoints = null;
		enableHSSM = null;
		enableAce = null;
		enableBeautify = null;
		enablePrism = null;
		prismStyles = null;
		authTimer = null;
		syncTokenValue = null;

	};

	exports.init = function () {

		// Destroy any previous inits
		exports.destroy();

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

		// Setup
		window.mashery.content.alpaca = {};

		// Event listeners
		window.addEventListener('change', changeHandler, false);
		document.addEventListener('click', clickHandler, false);
		document.addEventListener('submit', submitHandler, false);
		window.addEventListener('blur', blurHandler, true);

		// Methods
		loadDependencies();
		hideAllMethods();
		// renderSchemas(); // Load dependencies is in here...
		setSyncTokenValue();
		a11y();

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