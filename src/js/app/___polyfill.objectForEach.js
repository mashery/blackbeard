/**
 * Object.prototype.forEach() polyfill
 */
if (!Object.prototype.forEach) {
	Object.defineProperties(Object.prototype, {
		'forEach': {
			value: function (callback) {
				if (this === null) {
					throw new TypeError('Not an object');
				}
				var obj = this;
				for (var key in obj) {
					if (obj.hasOwnProperty(key)) {
						callback.call(obj, obj[key], key, obj);
					}
				}
			},
			writable: true
		}
	});
}