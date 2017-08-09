// Make iodocs object available only when page is finished rendering
$(document).ready(function () {
	// Set global var
	window.iodocs = (function () {

		// Private vars
		// @done
		var self = {},
			apiServiceBox = $('.services'),
			apiDescriptionListBoxes = $('.apiDescriptionList'),
			apiSelectBox = $('#apiId'),
			apiTitle = $('#apiTitle'),
			apiCredentialBox = $('.credentials'), // TODO: unused
			apiCredentialForm = $('#credentials'),
			syncTokenValue = apiCredentialForm.find('input[name=ajax_synchronization_token]').val(),
			apiKeyInput = $('#apiKey'),
			apiSecretInput = $('#apiSecret'),
			apiKeySecretInput = $('#apiKeySecret'),
			showManualKeySecret = $('#showManualKeySecret'),
			apiNameBox = $('#apiName'), // TODO: unused
			emControlBox = $('#controls'),
			apiEndpointListBoxes = $('.endpointList'),
			toggleEndpointsLink = $('#toggleEndpoints'),
			toggleMethodsLink = $('#toggleMethods'),
			apiOAuth2FlowType = $('#apiOAuth2FlowType'),
			apiOAuth2AuthBtn = $('#apiOAuth2AuthorizationButton'),
			apiOAuth2ImplABtn = $('#apiOAuth2ImplicitExchangeButton'),
			apiOAuth2CCBtn = $('#apiOAuth2AuthClientCredExchangeButton'),
			apiOAuth2PCBtn = $('#apiOAuth2AuthPassCredExchangeButton'),
			apiOAuth2AccessBtn = $('#apiOAuth2AuthExchangeButton'),
			apiBasicAuthName = $('#apiBasicAuthUsername'),
			apiBasicAuthPass = $('#apiBasicAuthPassword'),
			apiSoapBasicAuthName = $('#apiSoapBasicAuthUsername'),
			apiSoapBasicAuthPass = $('#apiSoapBasicAuthPassword'),
			apiSoapWssUserNameTokenAuthName = $('#apiSoapWssUserNameTokenAuthUsername'),
			apiSoapWssBinarySecurityTokenAuthToken = $('#apiSoapWssBinarySecurityTokenAuthToken'),
			authTimer = null,
			enableHSSM = !!$('input[name=enable_high_security_secret_management]').val();

		// Select API
		// @done
		self.selectApiById = function (id) {
			// Reset selected attribute
			apiEndpointListBoxes.attr('data-is-selected', false);
			apiDescriptionListBoxes.attr('data-is-selected', false);

			// No id selected, so hide everything
			if (!id) {
				return self.hideAll();
			}

			// Set endpoint list box as selected
			apiEndpointListBoxes.filter('#api' + id).attr('data-is-selected', true);
			apiDescriptionListBoxes.filter('#apiDescription' + id).attr('data-is-selected', true);


			// Show everything that needs to be shown
			self.showApiCredentialBox(id);
			self.showApiDescriptionBox();
			self.showEMControlBox();
			self.hideAllUnselectedApiEndpointLists();
			self.showSelectedApiEndpointList();
			self.showAllSelectedEndpoints();

			return null;
		};

		// Get Selected API Endpoint List Box
		// @done Not porting over
		self.getSelectedApiEndpointListBox = function () {
			return apiEndpointListBoxes.filter('[data-is-selected=true]');
		};

		// Get Selected API Id
		// @done
		self.getSelectedApiId = function () {
			return self.getSelectedApiEndpointListBox().attr('data-api-id');
		};

		// Show API Info Box
		// @done
		self.showApiDescriptionBox = function () {
			self.hideApiDescriptionBox();
			apiDescriptionListBoxes.filter('#apiDescription' + self.getSelectedApiId() + ':hidden').slideDown();
		};

		// Hide API Info Box
		// @done
		self.hideApiDescriptionBox = function () {
			apiDescriptionListBoxes.filter(':not(#apiDescription' + self.getSelectedApiId() + '):visible').slideUp();
		};

		// Show EM Control box
		// @done
		self.showEMControlBox = function () {
			emControlBox.filter(':hidden').slideDown();
		};

		// Hide EM Control box
		// @done
		self.hideEMControlBox = function () {
			emControlBox.filter(':visible').slideUp();
		};

		// Show API Endpoint list
		// @done
		self.showSelectedApiEndpointList = function () {
			apiEndpointListBoxes.filter('#api' + self.getSelectedApiId() + ':hidden').slideDown();
		};

		// Hide all API Endpoint lists
		// @done
		self.hideAllApiEndpointLists = function () {
			apiEndpointListBoxes.filter(':visible').slideUp();
		};

		// Hide all API Endpoint Lists that aren't id
		// @done Not porting over
		self.hideAllUnselectedApiEndpointLists = function () {
			apiEndpointListBoxes.filter(':not(#api' + self.getSelectedApiId() + '):visible').slideUp();
		};

		// Show all endpoints for shown endpoint list
		// @done Not porting over
		self.toggleAllSelectedEndpoints = function () {
			// Get all selected methods lists
			var methodsLists = apiEndpointListBoxes.find('.endpoint:visible > .methods');

			// Show all method lists if at least one is not visible
			if (methodsLists.filter(':hidden').length) {
				methodsLists.slideDown();
			} else {
				methodsLists.slideUp();
			}
		};

		// Show all selected endpoints
		// @done Not porting over
		self.showAllSelectedEndpoints = function () {
			apiEndpointListBoxes.find('.endpoint:visible > .methods:hidden').slideDown();
		};

		// Toggle all methods for shown endpoint list
		// @done Not porting over
		self.toggleAllSelectedMethods = function () {
			// Keep tabs on how many method lists are enabled
			var methodsLists = apiEndpointListBoxes.find('.endpoint:visible > .methods'),
				methodsListsCount = methodsLists.filter(':hidden').length;

			// Show all endpoints
			self.showAllSelectedEndpoints();

			// Force show forms if at least one method list wasn't shown (which is now shown)
			if (methodsListsCount) {
				return self.showAllSelectedMethods();
			}

			// Get all visible methods
			var methods = methodsLists.find('.method:visible > form');

			// Show all methods if at least one is not visible
			if (methods.filter(':hidden').length) {
				methods.slideDown();
			} else {
				methods.slideUp();
			}

			return null;
		};

		// Show all selected methods
		// @done Not porting over
		self.showAllSelectedMethods = function () {
			apiEndpointListBoxes.find('.endpoint:visible .method:visible > form:hidden').slideDown();
		};

		// Hide all selected methods
		// @done Not porting over
		self.hideAllSelectedMethods = function () {
			apiEndpointListBoxes.find('.endpoint.visible .method:visible > form:visible').slideUp();
		};

		// Hide ALL the things!
		// @done
		self.hideAll = function () {
			self.hideAllApiCredentialBoxes();
			self.hideApiDescriptionBox();
			self.hideEMControlBox();
			self.hideAllApiEndpointLists();
		};

		// Initialize API JSON schemas for use with the the alpaca (http://www.alpacajs.org) forms.
		// @done
		self.initApiSchemas = function () {
			var arrayCleaned = false;
			// For each API (root ul element)
			apiEndpointListBoxes.each(function () {

				if (!arrayCleaned) {
					arrayCleaned = true;
					// remove augmentation caused by Mashery-Base.js
					// TODO: fix Mashery-Base.js and remove this block
					for (var n in Array.prototype) {
						if (Array.prototype.hasOwnProperty(n)) {
							delete Array.prototype[n];
						}
					}
				}

				// Get the schemas associated with this API
				var apiSchemas = $.data($(this).get(0), 'apiSchemas');
				if (apiSchemas && !$.isEmptyObject(apiSchemas)) {

					$.each(apiSchemas, function (schemaId, schema) {

						if (!schema.title) {
							schema.title = schemaId;
						}

						self.initApiSchemaProperties(schema.properties);
					});
				}
			});
		};

		// Recursively initialize the properties of an object defined within a JSON schema.
		// @done
		self.initApiSchemaProperties = function (properties) {

			if (properties) {
				$.each(properties, function (propertyName, property) {

					if (!property.title) {
						// Default to using the property name if no title is specified for the property
						property.title = propertyName.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, function (str) { return str.toUpperCase(); });
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

					if (property.type === 'object') {
						// Recursively initialize the properties of the nested schema
						self.initApiSchemaProperties(property.properties);
					} else if (property.type === 'array') {
						// Recursively initialize the properties of the nested schema
						self.initApiSchemaProperties(property.items.properties);
					}
				});
			}

		};

		// Initialize the alpaca (http://www.alpacajs.org) forms for each method with a JSON schema-defined request body
		// @done
		self.initRequestBodyAlpacaForms = function () {
			// override the Alpaca Integerfield's getValue to return empty string
			Alpaca.Fields.IntegerField.prototype.getValue = function () {
				var textValue = this.field.val();
				if (Alpaca.isValEmpty(textValue)) {
					return '';
				} else {
					return parseFloat(textValue);
				}
			};

			// private function to generate schema options from the definition properties
			// @done
			function getSchemaOptions(schema) {
				var options = {}; // init options

				if (schema.properties) { // ensure valid properties
					$.each(schema.properties, function (key, value) { // generate schema options from the schema
						if (value.type === 'array') {
							var arrayOptions = getSchemaOptions(value.items); // recurse!

							if (!options[key]) {
								options[key] = { 'items': {} }; // init field options
							}

							options[key].toolbarSticky = true;
							options[key].fieldClass = 'iodoc-array-field';
							options[key].items.showMoveUpItemButton = false;
							options[key].items.showMoveDownItemButton = false;

							if (!$.isEmptyObject(arrayOptions)) { // if recursion wasn't empty
								options[key].fields = { 'item': { 'fields': arrayOptions } }; // set proper alpaca options
							}
						} else if (value.properties) { // check for nested properties
							if (!options[key]) {
								options[key] = { 'fields': {} };
							}
							options[key].fields = getSchemaOptions(value); // recurse!
						}
					});
				}

				return options;
			}

			// For each API (root ul element)
			apiEndpointListBoxes.each(function () {
				// Get the schemas associated with this API
				var apiSchemas = $.data($(this).get(0), 'apiSchemas');

				if (apiSchemas && !$.isEmptyObject(apiSchemas)) { // ensure valid schema retrieved
					// Find all of the nested elements that should contain alpaca form for the request body
					var requestBodySchemaContainers = $(this).find('.requestBodySchemaContainer');

					requestBodySchemaContainers.each(function () {
						// Get the schema ID associated with the request body
						var requestBodySchemaId = $(this).attr('data-request-body-schema-id');

						if (requestBodySchemaId) {
							// Get the method form element that contains this alpaca container element
							var methodForm = $(this).parent('form').get(0);
							// Get the schema associated with the method's request body
							var requestBodySchema = apiSchemas[requestBodySchemaId];

							if (requestBodySchema && methodForm) {
								// Shallow copy the schema to add the definitions for use with alpaca
								// Set all of the API schemas as definitions to enable alpaca's support for schema references
								// See: http://www.alpacajs.org/examples/components/jsonschema/references.html
								var requestBodyAlpacaSchema = $.extend({ 'definitions': apiSchemas }, requestBodySchema);
								var schemaOptions = getSchemaOptions(requestBodyAlpacaSchema); // get schema options
								var defaultValue = JSON.parse($(this).attr('data-request-body-default-value')) || {};

								// Initialize the alpaca component on this container element
								$(this).alpaca({
									"schema": requestBodyAlpacaSchema,
									"data": defaultValue,
									"options": $.extend({ "name": "requestBody" }, { 'fields': schemaOptions }),
									"postRender": function (requestBodyAlpacaForm) {
										// In order to extract the alpaca form data as a JSON object on form submit,
										// store a reference to the alpaca form object in the method form element
										$.data(methodForm, 'requestBodyAlpacaForm', requestBodyAlpacaForm);
									}
								});
							}
						}
					});
				}
			});
		};

        /**
         * Initialize the ACE editor
         *
         * Currently looks for request body elements and the sibling editor element
         * Instantiates the editor on request body focus and restores on blur
         */
		// @done
		self.initAceEditor = function () {
			$('.method > div.title').click(function () { // when the method is expanded
				var textarea = $(this).siblings('form').find('.requestBody'); // jquery textarea
				var parameters = textarea.siblings('.parameters'); // get the parameters for this definition
				var mode = 'text'; // default editor mode
				var editorEl = textarea.siblings('.request-body-editor'); // look for editor element

				if (editorEl.length > 0) { // check for found element
					if (!this.editor) { // check for previous instantiation
						if (parameters) { // check for params and get the editor mode
							mode = self.getEditorMode(parameters.find('[name="params[Content-Type]"]').val());
						}
						this.editor = ace.edit(editorEl[0]); // instantiate editor
						this.editor.getSession().setMode('ace/mode/' + mode); // set the editor mode
						this.editor.getSession().on('change', $.proxy(function () { // on value change let's resize the height
							var height = this.editor.getSession().getScreenLength() * this.editor.renderer.lineHeight + this.editor.renderer.scrollBar.getWidth();
							if (height > textarea.height()) { // ensure not  less than the original text area
								editorEl.css('height', height + 'px'); // set element height
								this.editor.resize(); // set resize
							}
						}, this));
						this.editor.on('blur', $.proxy(function () { // when we lose focus
							textarea.val(this.editor.getSession().getValue()); // update the text area
						}, this));
					}

					textarea.hide(); // hide original textarea
					editorEl.css('height', textarea.height()).show(); // display the editor element
					this.editor.resize(); // update editor size
					this.editor.focus(); // focus editor
				}
			});
		};

        /**
         * Helper function to retrieve the ACE editor mode to use based on a passed in string
         *
         * @params {String} mode The mode to read from, usually Content-Type
         *
         * @returns {String} The mode to set ACE to
         */
		// @done
		self.getEditorMode = function (mode) {
			if (typeof (mode) === 'string') { // ensure string
				if (mode.toLowerCase().indexOf('json') >= 0) { // check for json
					return 'json';
				}
			}

			return 'text'; // default mode
		};

		/*** START CREDENTIALS ***/

		// @done
		self.getCurrentAuthType = function () {
			var apiStoreElem = $('#api' + apiSelectBox.val()),
				auth_type = apiStoreElem.attr('data-auth-type');

			return auth_type;
		};

		// @done
		self.getBasicAuthEnabled = function () {
			var apiStoreElem = $('#api' + apiSelectBox.val()),
				basicAuth = apiStoreElem.attr('data-basic-auth');

			return (basicAuth === 'true');
		};

		// @done
		self.showApiCredentialBox = function (id) { // TODO: id is unused

			self.hideAllApiCredentialBoxes();

			apiCredentialForm.each(function () {
				this.reset();
			});

			var apiStoreElem = $('#api' + apiSelectBox.val()),
				auth_type = self.getCurrentAuthType(),
				authCSSClass = ".credentials_start." + auth_type,
				available_keys = $.parseJSON(apiStoreElem.attr('data-available-keys'));

			if (self.getBasicAuthEnabled()) {
				$('#apiBasicAuthCredFlowContainer').show();
			}

			switch (auth_type) {
				case 'key':
					$('#apiSecretContainer').hide();
					$('#apiKeySecretListContainer').hide();
					$('#apiKeyContainer').hide();

					if (available_keys && available_keys.length) {

						$('#apiKeySecret').empty();

						$.each(available_keys, function (k, v) {
							var label = '';
							if (v.application) {
								label = v.application + ": " + v.key;
							} else {
								label = v.key;
							}
							$('#apiKeySecret').append($('<option>', { value: v.key, "data-secret": v.secret }).text(label));
						});

						$('#apiKeySecretListContainer').slideDown();

						if (enableHSSM) {
							$('#apiSecretContainer').slideDown();
							showManualKeySecret.hide();
						}
					} else {
						$('#apiKeyContainer').slideDown();

						if (apiStoreElem.attr('data-secret') === "1") {
							$('#apiSecretContainer').slideDown();
						}
					}
					break;

				case 'oauth2':

					var auth_flows = $.parseJSON(apiStoreElem.attr('data-auth-flows'));

					$('#apiOAuth2FlowType').empty();

					$('#apiOAuth2PresetKeysContainer').hide();

					if (auth_flows) {
						$.each(auth_flows, function (k, v) {

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

							$('#apiOAuth2FlowType').append($('<option>', { value: v }).text(auth_flow_desc(v)));
						});
					}

					if (available_keys && available_keys.length) {
						$('#apiOAuth2PresetKeys').empty();
						$('#apiOAuth2PresetKeys').append($('<option>', { value: "__manual" }).text("Manual Input"));

						$.each(available_keys, function (k, v) {
							$('#apiOAuth2PresetKeys').append($('<option>', { value: v.key, "data-secret": v.secret }).text(v.application));
						});

						$('#apiOAuth2PresetKeysContainer').slideDown();
					}

					$('#apiOAuth2FlowType').change();

					break;
				case 'soapWssSecurityAuth':

					var token_types = $.parseJSON(apiStoreElem.attr('data-auth-wss-token-types'));

					if (token_types) {

						$.each(token_types, function (k, v) {

							if (v == 'soapWssUserNameToken') {

								var container = $('#apiSoapWssUserNameTokenAuthCredFlowContainer').slideDown(),
									wssFields = self.getWssFields(),
									i,
									field;

								// clear fields before adding to avoid duplicates
								container.find('.SoapWssUserNameTokenAuthGenerated').remove();

								for (i = 0; i < wssFields.length; i++) {
									field = '<div class="SoapWssUserNameTokenAuthGenerated">';
									field += '<label for="apiSoapWssUserNameTokenAuth' + wssFields[i] + '">' + wssFields[i] + ':</label>';
									field += '<input type="text"  id="apiSoapWssUserNameTokenAuth' + wssFields[i] + '"/>';
									field += '</div>';
									container.append(field);
								}
							} else if (v == 'soapWssBinarySecurityToken') {
								$('#apiSoapWssBinarySecurityTokenAuthCredFlowContainer').slideDown();
							}

						});
					}

					break;
				case 'soapBasic':
					$('#apiSoapBasicAuthCredFlowContainer').slideDown();
					break;
				default:
					break;
			}

			$(authCSSClass).slideDown();
		};

		// @done
		self.hideAllApiCredentialBoxes = function () {
			$('.credentials').filter(':visible').slideUp();
		};

		// @done
		self.hideOAuth2CredentialInputs = function () {
			$('.credentials.oauth2').not('.credentials_start').slideUp();
		};

		// @done
		self.setOAuth2AuthorizeCode = function (code) {
			$('#apiOAuth2AuthorizeCode').val(code);
			$('#apiOAuth2AuthorizeCodeContainer').slideDown();

			if ($('#api' + self.getSelectedApiId()).attr('data-auto-exchange-auth-code') === "1") {
				apiOAuth2AccessBtn.hide();
				self.exchangeAuthCodeforAccessToken();
			}
		};

		// @done
		self.getAuthorizationCode = function (client_id, client_secret) {
			// open empty window before async call (async code triggers popup blocker on window.open)
			var oAuth2AuthWindow = window.open(null, "masheryOAuth2AuthWindow", "width=300,height=400");

			window.clearInterval(self.authTimer); // clear the timer
			self.authTimer = window.setInterval(function () {
				if (oAuth2AuthWindow.closed !== false) { // when the window is closed
					window.clearInterval(self.authTimer); // clear the timer
					self.setOAuth2AuthorizeCode(window.auth_code); // set the auth code from the popup window
					delete window.auth_code; // clear the auth code just in case
				}
			}, 200);

			$.ajax({
				async: true,
				headers: {
					'X-Ajax-Synchronization-Token': syncTokenValue
				},
				data: {
					apiId: apiSelectBox.val(),
					client_id: client_id,
					client_secret: client_secret,
					auth_flow: "auth_code"
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

		// @done
		self.sendImplicitAccessToken = function (token, errorCallback, successCallback) {
			$.ajax({
				async: true,
				headers: {
					'X-Ajax-Synchronization-Token': syncTokenValue
				},
				data: {
					apiId: apiSelectBox.val(),
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
					alert("Sorry, there was an error processing the response from the OAuth2 server. Try again later");
				},
				success: function (data) {
					if (data.success) {
						self.setOAuth2AccessToken(token.access_token);
					} else {
						alert("Sorry, but there was an error during the account authorization process. Either the credentials were not entered correctly, or permission was denied by the account holder. Please try again.");
					}
				}
			});
		};

		// @done
		self.getImplicitAccessToken = function (client_id) {
			// open empty window before async call (async code triggers popup blocker on window.open)
			var oAuth2AuthWindow = window.open(null, "masheryOAuth2AuthWindow", "width=300,height=400");

			window.clearInterval(self.authTimer); // clear the timer
			self.authTimer = window.setInterval(function () {
				if (oAuth2AuthWindow.closed !== false) { // when the window is closed
					window.clearInterval(self.authTimer); // clear the timer
					self.sendImplicitAccessToken(window.access_token); // set the auth code from the popup window
					delete window.access_token; // clear the auth code just in case
				}
			}, 200);

			$.ajax({
				async: true,
				headers: {
					'X-Ajax-Synchronization-Token': syncTokenValue
				},
				data: {
					apiId: apiSelectBox.val(),
					client_id: client_id,
					auth_flow: "implicit"
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

		// @done
		self.resetOAuth2AccessToken = function () {
			$('#apiOAuth2AccessToken').val("");
			$('#apiOAuth2AccessTokenContainer').slideUp();
		};

		// @done
		self.setOAuth2AccessToken = function (token) {
			$('#apiOAuth2AccessToken').val(token);
			$('#apiOAuth2AccessTokenContainer').slideDown();
		};

		// @done
		self.getAccessTokenFromPasswordCred = function (client_id, client_secret, username, password) {

			$.ajax({
				async: true,
				headers: {
					'X-Ajax-Synchronization-Token': syncTokenValue
				},
				data: {
					apiId: apiSelectBox.val(),
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

		// @done
		self.getAccessTokenFromClientCred = function (client_id, client_secret) {

			$.ajax({
				async: true,
				headers: {
					'X-Ajax-Synchronization-Token': syncTokenValue
				},
				data: {
					apiId: apiSelectBox.val(),
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

		// @done
		self.exchangeAuthCodeforAccessToken = function () {
			$.ajax({
				async: true,
				headers: {
					'X-Ajax-Synchronization-Token': syncTokenValue
				},
				data: {
					apiId: apiSelectBox.val(),
					auth_flow: 'auth_code',
					authorization_code: $('#apiOAuth2AuthorizeCode').val()
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

		/*** END CREDENTIALS ***/


		// Callback for OAuth Success
		// @todo
		self.oauthSuccess = function () {
			alert('You have successfully logged in');
		};

		// @todo
		self.getWssFields = function () {

			var wssFields,
				apiStoreElem = $('#api' + apiSelectBox.val()),
				wssFieldsValue = apiStoreElem.attr('data-auth-wss-fields');

			if (wssFieldsValue && wssFieldsValue.length > 0) {
				wssFields = $.parseJSON(wssFieldsValue);
			}

			return wssFields || [];
		};

		// Bind page elements

		// Set select to add 40px to it's calculated width, padding doesn't work in IE
		// @done Not porting over
		apiSelectBox.width(apiSelectBox.outerWidth() + 40);

		// Set the span in the h2 to reflect selected option
		// @done Not porting over
		apiTitle.text(apiSelectBox.find('option:selected').text()).width(apiSelectBox.outerWidth()).height(apiSelectBox.outerHeight());

		// @done
		apiSelectBox.change(function () {
			self.selectApiById(apiSelectBox.val());
			apiTitle.text(apiSelectBox.find('option:selected').text());
		});

		// @done
		$('#apiOAuth2PresetKeys').change(function (event) {

			var selectedPresetKey = $('#apiOAuth2PresetKeys').find('> :selected');

			if ((selectedPresetKey.val() === "__manual") || (selectedPresetKey.val() === "")) {
				$('.oauth2_client_id_field').val("");
				$('.oauth2_client_secret_field').val("");
			} else {
				$('.oauth2_client_id_field').val(selectedPresetKey.val());
				$('.oauth2_client_secret_field').val(selectedPresetKey.attr('data-secret'));
			}

		});

		// @done
		apiOAuth2FlowType.change(function (event) {

			self.hideOAuth2CredentialInputs();

			if (apiOAuth2FlowType.val() === "") {
				return;
			}

			switch (apiOAuth2FlowType.val()) {
				case 'auth_code':
					$('#apiOAuth2AuthCodeFlowContainer').slideDown();
					break;
				case 'implicit':
					$('#apiOAuth2ImplicitFlowContainer').slideDown();
					break;
				case 'password_cred':
					$('#apiOAuth2PasswordCredFlowContainer').slideDown();
					break;
				case 'client_cred':
					$('#apiOAuth2ClientCredFlowContainer').slideDown();
					break;
				default:
					break;
			}

		});

		// @todo
		apiOAuth2PCBtn.click(function (event) {
			event.preventDefault();
			self.getAccessTokenFromPasswordCred(
				$('#apiOAuth2ClientIdPasswordCred').val(),
				$('#apiOAuth2ClientSecretPasswordCred').val(),
				$('#apiOAuth2Username').val(),
				$('#apiOAuth2Password').val());
		});

		// @todo
		apiOAuth2CCBtn.click(function (event) {
			event.preventDefault();
			self.getAccessTokenFromClientCred(
				$('#apiOAuth2ClientIdClientCred').val(),
				$('#apiOAuth2ClientSecretClientCred').val());
		});

		// @todo
		apiOAuth2AuthBtn.click(function (event) {
			event.preventDefault();
			self.getAuthorizationCode(
				$('#apiOAuth2ClientIdAuthCode').val(),
				$('#apiOAuth2ClientSecretAuthCode').val());
		});

		// @todo
		apiOAuth2ImplABtn.click(function (event) {
			event.preventDefault();
			self.getImplicitAccessToken(
				$('#apiOAuth2ClientIdImplicit').val());
		});

		// @todo
		apiOAuth2AccessBtn.click(function (event) {
			event.preventDefault();
			self.exchangeAuthCodeforAccessToken();
		});

		// @todo
		showManualKeySecret.click(function (event) {
			// Disable following link
			event.preventDefault();

			var apiStoreElem = $('#api' + apiSelectBox.val());

			$('#apiSecretContainer').hide();
			$('#apiKeySecretListContainer').hide();
			$('#apiKeyContainer').hide();
			$('#apiKeyContainer').slideDown();

			if (apiStoreElem.attr('data-secret') === "1") {
				$('#apiSecretContainer').slideDown();
			}
		});

		// @done
		toggleEndpointsLink.click(function (event) {
			// Disable following link
			event.preventDefault();

			self.hideAllSelectedMethods();
			self.toggleAllSelectedEndpoints();
		});

		// @done
		toggleMethodsLink.click(function (event) {
			// Disable following link
			event.preventDefault();

			self.toggleAllSelectedMethods();
		});

		// @done
		$('.endpoint > h3 > span.name').click(function (event) {
			// Disable following link
			event.preventDefault();

			// Toggle methods
			$(this).closest('.endpoint').find('.methods').slideToggle();
		});

		// @done Not porting over
		$('.list-methods > a').click(function (event) {
			// Disable following link
			event.preventDefault();

			$(this).closest('.endpoint').find('.methods:hidden').slideDown();
		});

		// @done Not porting over
		$('.expand-methods > a').click(function (event) {
			// Disable following link
			event.preventDefault();

			$(this).closest('.endpoint').find('.methods:hidden').slideDown();
			$(this).closest('.endpoint').find('.method:visible > form:hidden').slideDown();
		});

		// @done
		$('.method > div.title').click(function (event) {
			// Disable following link
			event.preventDefault();

			$(this).parent().find('form').slideToggle();
		});

		// @todo
		$('.method > form').submit(function (event) {
			// Disable actual submission
			event.preventDefault();

			// Get response box, form params, and api values
			var responseBox = $(this).children('div.result'),
				errorBox = $(this).children('div.error'),
				params = $(this).serializeArray(),
				apiId = {
					name: 'apiId',
					value: self.getSelectedApiId()
				},
				apiKey = {
					name: 'apiKey',
					value: apiKeyInput.val()
				},
				apiSecret = {
					name: 'apiSecret',
					value: apiSecretInput.val()
				},
				basicAuthName = {
					name: 'basicAuthName',
					value: apiBasicAuthName.val()
				},
				basicAuthPass = {
					name: 'basicAuthPass',
					value: apiBasicAuthPass.val()
				},
				soapBasicAuthName = {
					name: 'soapBasicAuthName',
					value: apiSoapBasicAuthName.val()
				},
				soapBasicAuthPass = {
					name: 'soapBasicAuthPass',
					value: apiSoapBasicAuthPass.val()
				},
				soapWssUserNameTokenAuthName = {
					name: 'soapWssUserNameTokenAuthName',
					value: apiSoapWssUserNameTokenAuthName.val()
				},
				soapWssBinarySecurityTokenAuthToken = {
					name: 'soapWssBinarySecurityTokenAuthToken',
					value: apiSoapWssBinarySecurityTokenAuthToken.val()
				};

			// Get the Alpaca-generated request body form (if the method defines request JSON schema).
			var methodForm = $(this).get(0);
			var requestBodyAlpacaForm = $.data(methodForm, 'requestBodyAlpacaForm');
			var requestBodyJson;
			var wssFields = self.getWssFields();
			var fileFields = $(methodForm).find('[type="file"]'); // get any file fields
			var fileLimit = 850000; // setting matching file limit check
			var fileLimitExceeded = false; // initial setting of file limit check

			if (requestBodyAlpacaForm) {
				requestBodyJson = {
					name: 'requestBodyJson',
					value: JSON.stringify(requestBodyAlpacaForm.getValue())
				};
			}

			// Get api key and secret from key/secret list if enabled
			if (apiKeySecretInput.is(':visible')) {
				// Replace api key and secret values
				apiKey.value = apiKeySecretInput.find('> :selected').val();

				if (!enableHSSM) { // if hssm NOT enabled get it from the data attribute
					apiSecret.value = apiKeySecretInput.find('> :selected').attr('data-secret');
				}
			}

			// Add additional values to params
			params.push(apiId, apiKey, apiSecret, basicAuthName, basicAuthPass, soapBasicAuthName, soapBasicAuthPass, soapWssUserNameTokenAuthName, soapWssBinarySecurityTokenAuthToken);


			for (var i = 0; i < wssFields.length; i++) {
				var field = $('#apiSoapWssUserNameTokenAuth' + wssFields[i]);

				params.push({
					name: 'soapWssUserNameTokenAuth' + wssFields[i],
					value: field.val()
				});
			}

			if (requestBodyJson) {
				params.push(requestBodyJson);
			}

			if (fileFields.length > 0) { // we got some file fields
				var formData = new FormData(); // create a form data object to post

				$.each(params, function (index, param) { // add current params to formdata
					formData.append(param.name, param.value); // add param to form data
				});
				$.each(fileFields, function (index, field) { // iterate all file fields
					var file = field.files[0]; // get reference to the first file

					if (file && (file.size > fileLimit)) {
						fileLimitExceeded = true;
					} else {
						formData.append($(field).attr('name'), file || ''); // add the file field or empty string
					}
				});

				params = formData; // let's use the new formdata as our params
			}

			// If response node doesn't exist, create it
			if (!responseBox.length) {
				// Add clear link
				$('<a class="clear-results" href="#">Clear Results</a>').css({
					display: 'none'
				}).click(function (event) {
					// Don't follow link
					event.preventDefault();

					// Delete clear link
					$(this).fadeOut(function () {
						$(this).remove();
					});

					// Slide up the response and delete it and the clear link
					$(responseBox).slideUp(function () {
						responseBox.remove();
					});
				}).insertAfter($(this).find('> input[type=submit]')).fadeIn();

				// Build select link
				var selectLink = $('<a class="select-all" href="#">Select content</a>').click(function (event) {
					// Don't follow link
					event.preventDefault();

					// Select the content from the response node
					selectElementText($(this).parent().next('pre')[0]);
				});

				// Build response box
				responseBox = $('<div class="result" />').css({
					display: 'none'
				});

				// Add request uri
				responseBox.append(
					$('<h4 class="call">Request URI</h4>'),
					$('<pre class="call" />'));

				// Add request headers
				responseBox.append(
					$('<h4 class="requestHeaders">Request Headers</h4>').hide().append(selectLink.clone(true)),
					$('<pre class="requestHeaders" />').hide());

				// Add request cookies
				responseBox.append(
					$('<h4 class="requestCookies">Request Cookies</h4>').hide().append(selectLink.clone(true)),
					$('<pre class="requestCookies prettyprint" />').hide());

				// Add request body
				responseBox.append(
					$('<h4 class="requestBody">Request Body</h4>').hide().append(selectLink.clone(true)),
					$('<pre class="requestBody prettyprint" />').hide());

				// Add response status
				responseBox.append(
					$('<h4 class="responseStatus">Response Status</h4>').append(selectLink.clone(true)),
					$('<pre class="responseStatus" />'));

				// Add response headers
				responseBox.append(
					$('<h4 class="headers">Response Headers</h4>').append(selectLink.clone(true)),
					$('<pre class="headers" />'));

				// Add response cookies
				responseBox.append(
					$('<h4 class="responseCookies">Response Cookies</h4>').hide().append(selectLink.clone(true)),
					$('<pre class="responseCookies prettyprint" />').hide());

				// Add response body
				responseBox.append(
					$('<h4 class="response">Response Body</h4>').append(selectLink.clone(true)),
					$('<pre class="response prettyprint" />'));

				// Add response box to form and show it
				responseBox.appendTo(this).slideDown();
			}

			// Response Box is shown by default
			responseBox.show();

			if (!errorBox.length) {
				// Build response box
				errorBox = $('<div class="error" />').css({
					display: 'none'
				});

				errorBox.append(
					$('<h4 class="error">Error</h4>'),
					$('<pre class="error prettyprint" />'));

				errorBox.appendTo(this);
			}

			// Error Box is hidden by default
			errorBox.hide();

			if (fileLimitExceeded) { // check for file limit
				errorBox.find('pre.error').text('The selected file exceeds the maximum allowed limit of ' + Math.ceil(fileLimit / 1000) + 'kb.');
				responseBox.hide();
				errorBox.show();
			} else {
				// Fire ajax
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
						responseBox.children('pre').text('Loading...').removeClass('error');
					},
					error: function (jqXHR, textStatus, errorThrown) {
						errorBox.find('pre.error').text(jqXHR.responseText);
						responseBox.hide();
						errorBox.show();
						// responseBox.replaceWith($('<div class="result"><h4 class="response">Error</h4><pre class="prettyprint error">' + jqXHR.responseText + '</pre></div>')).toggle(true);
					},
					success: function (data) {
						// Init formatted text
						var formattedText = data.responseBody;
						var contentType = data.responseHeaders && data.responseHeaders['Content-Type'] || '';
						var validResponse = (data.status.code > 0 || data.status.text) || formattedText.length > 0;

						// Set up call request
						responseBox.find('pre.call').text(data.requestUri);

						// Set up call request headers
						responseBox.find('pre.requestHeaders').text($(data.requestHeaders).length ? formatHeaders(data.requestHeaders) : '');
						responseBox.find('.requestHeaders').toggle($(data.requestHeaders).length ? true : false);

						// Set up call request cookies
						responseBox.find('pre.requestCookies').text($(data.requestCookies).length ? formatJSON(data.requestCookies) : '');
						responseBox.find('.requestCookies').toggle($(data.requestCookies).length ? true : false);

						// Set up call request body
						responseBox.find('pre.requestBody').text(data.requestBody || '');
						responseBox.find('.requestBody').toggle(data.requestBody ? true : false);

						// Set up response status
						responseBox.find('pre.responseStatus').text(data.status.code + ' ' + data.status.text).toggleClass('error', data.status.code >= 400).removeClass(function (index, css) {
							return (css.match(/(^|\s)status-code-\d+/g) || []).join(' ');
						}).addClass('status-code-' + data.status.code);
						responseBox.find('.responseStatus').toggle((data.status.code > 0 || data.status.text) ? true : false);

						// Set up response headers
						responseBox.find('pre.headers').text(formatHeaders(data.responseHeaders)).toggleClass('error', data.status.code >= 400).removeClass(function (index, css) {
							return (css.match(/(^|\s)status-code-\d+/g) || []).join(' ');
						}).addClass('status-code-' + data.status.code);
						responseBox.find('.headers').toggle($(data.responseHeaders).length ? true : false);

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
								try {
									// js_beautify will format it if it's JSON or JSONP
									formattedText = js_beautify(formattedText, { 'preserve_newlines': false });
								} catch (err) {
									// js_beautify didn't like it, return it as it was
									formattedText = data.responseBody;
								}
								break;

							// Parse types as XHTML
							case 'application/xml':
							case 'text/xml':
							case 'text/html':
							case 'text/xhtml':
								formattedText = formatXML(formattedText) || '';
								break;
							default:
								break;
						}

						// Set response text
						responseBox.children('pre.response').text(formattedText).toggleClass('error', data.status.code >= 400).removeClass(function (index, css) {
							return (css.match(/(^|\s)status-code-\d+/g) || []).join(' ');
						}).addClass('status-code-' + data.status.code);
						responseBox.find('.response').toggle(validResponse ? true : false);

						// display service errors
						if (data.errorMessage) {
							errorBox.find('pre.error').text(data.errorMessage);
							errorBox.show();
						}

						// Fire pretty print on nodes
						prettyPrint();
					}
				});
			}
		});

		// Auto enable endpoint list if only one exists
		// @done
		if (apiEndpointListBoxes.length === 1) {
			apiSelectBox.val(apiSelectBox.find('> [value!=""]').val()).change();
		}

		// Auto enable endpoint list if an api selection is designated as auto select
		// @done
		if (apiSelectBox.find('> [data-auto-select=1]').length) {
			apiSelectBox.val(apiSelectBox.find('> [data-auto-select=1]').val()).change();
		}

		// @todo
		self.initApiSchemas();
		self.initRequestBodyAlpacaForms();
		self.initAceEditor();

		// Return master object
		return self;
	}());
});