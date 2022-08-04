class TEGUtilities {
	constructor() {
		let __instance = this;

		__instance.windowSize = {
			// window size flags
			isSmall: false,
			isMedium: false,
			isLarge: false,
			isLarger: false,
			isTall: false,

			// options for calculating the flags
			options: {
				smallMaxWidth: 740,
				mediumMaxWidth: 1024,
				largeMaxWidth: 2048,
				tallMinHeight: 820,
				inclusive: true, // should the window size comparisons include the break points?

				// allow customizable callback
				afterWindowSize: function () {

					if (console) {
						console.log('The default TEGUtilities.windowSize.afterWindowSize() method does nothing.');
					} // end log
					return false;
				},
			}, // end windowSize.options

			/**
			 * windowSize.update
			 */
			update: function () {
				if (windowSize.options.inclusive) {
					windowSize.isSmall = window.innerWidth <= windowSize.options.smallMaxWidth;
					windowSize.isMedium =
							TEGUtilities.betweenInclude(window.innerWidth, windowSize.options.smallMaxWidth, windowSize.options.mediumMaxWidth, TEGUtilities.BTWN_INCL_HIGHER);
					windowSize.isLarge =
							TEGUtilities.betweenInclude(window.innerWidth, windowSize.options.mediumMaxWidth, windowSize.options.largeMaxWidth, TEGUtilities.BTWN_INCL_HIGHER);
					windowSize.isTall = (window.innerHeight >= windowSize.options.tallMinHeight);
				} else {
					windowSize.isSmall = window.innerWidth < windowSize.options.smallMaxWidth;
					windowSize.isMedium =
							TEGUtilities.betweenInclude(window.innerWidth, windowSize.options.smallMaxWidth, windowSize.options.mediumMaxWidth, TEGUtilities.BTWN_INCL_NONE);
					windowSize.isLarge =
							TEGUtilities.betweenInclude(window.innerWidth, windowSize.options.mediumMaxWidth, windowSize.options.largeMaxWidth, TEGUtilities.BTWN_INCL_NONE);
					windowSize.isTall = (window.innerHeight > windowSize.options.tallMinHeight);
				}
				windowSize.isLarger = window.innerWidth > windowSize.options.largeMaxWidth;
				windowSize.options.afterWindowSize();
			}, // end windowSize.update()

			/**
			 * windowSize.init
			 * @param {Object} Options
			 */
			init: function (Options) {
				this.options = {...this.options, ...Options};
				window.windowSize = this;
				window.windowSize.update();
			}, // end windowSize.init()
		}; // end windowSize

		// identify empty objects
		if (typeof Object.prototype.isEmpty === 'undefined') Object.prototype.isEmpty = function () { return Object.entries(this).length === 0; }
	} // end constructor()

	static get BTWN_INCL_NONE() { return 0; }

	static get BTWN_INCL_LOWER() { return 1; }

	static get BTWN_INCL_HIGHER() { return 2; }

	static get BTWN_INCL_BOTH() { return 3; }

	/**
	 * between
	 * Returns TRUE if value is strictly between minimum and maximum.
	 *
	 * @param {number} value, number to test
	 * @param {number} minimum, lowest point of acceptable range
	 * @param {number} maximum, highest point of acceptable range
	 * @returns {boolean} TRUE if value is between minimum and maximum
	 */
	static between(value, minimum, maximum) {
		return TEGUtilities.betweenInclude(value, minimum, maximum, TEGUtilities.BTWN_INCL_NONE);
	} // end between()

	/**
	 * betweenInclude
	 * Returns TRUE if value is between minimum and maximum allowing optional inclusion
	 * of either or both limits.
	 *
	 * @param {number} value, number to test
	 * @param {number} minimum, lowest point of acceptable range
	 * @param {number} maximum, highest point of acceptable range
	 * @param {number} inclusive, whether to include the end points as acceptable values
	 * @returns {boolean} TRUE if value is between minimum and maximum
	 */
	static betweenInclude(value, minimum, maximum, inclusive) {
		// bulletproof the arguments
		const btwnValue = value || 0,
				getMinimum = minimum || 0,
				getMaximum = maximum || 0,
				btwnMinimum = Math.min(getMinimum, getMaximum),
				btwnMaximum = Math.max(getMinimum, getMaximum);
		let btwnInclusive = inclusive || TEGUtilities.BTWN_INCL_NONE;

		// if inclusive, do inclusive comparison
		switch (btwnInclusive) {
			case TEGUtilities.BTWN_INCL_LOWER:
				return btwnValue >= btwnMinimum &&
				       btwnValue < btwnMaximum;

			case TEGUtilities.BTWN_INCL_HIGHER:
				return btwnValue > btwnMinimum &&
				       btwnValue <= btwnMaximum;

			case TEGUtilities.BTWN_INCL_BOTH:
				return btwnValue >= btwnMinimum &&
				       btwnValue <= btwnMaximum;

			default:
				return btwnValue > btwnMinimum &&
				       btwnValue < btwnMaximum;
		}
	} // end between()

	/**
	 * debounce
	 * Wait to run a function until a certain time has passed since the last call.
	 *
	 * @param {Function} originalFunction, original function to debounce
	 * @param {Number} timeout, timeout in milliseconds for setTimout() call
	 * @param {Array} otherArgs, an array of any other arguments needed by the function
	 * @returns {Function} a wrapper around originalFunction that limits execution
	 */
	static debounce(originalFunction, timeout, otherArgs) {
		let timer;
		// make otherArgs optional
		otherArgs = otherArgs || [];

		return function () {
			// ignore all calls until there aren't any for the specified period
			clearTimeout(timer);
			// set a new timeout for the specified delay
			timer = setTimeout(function () {
				// call the function in context and with additional arguments
				originalFunction.apply(this, otherArgs);
			}, timeout);
		}; // return the function wrapped in a setTimeout structure
	} // end debounce()

	/**
	 * throttle
	 * Don't run a function more often than a certain period of time.
	 *
	 * @param {Function} originalFunction, original function
	 * @param {Number} timeout, timeout in milliseconds for setTimout() call
	 * @param {Array} [otherArgs], an array of any other arguments needed by the function
	 * @returns {Function} a wrapper around originalFunction that limits execution
	 */
	static throttle(originalFunction, timeout, otherArgs) {
		let needInvoke = true;
		// make otherArgs optional
		otherArgs = otherArgs || [];

		return function () {
			if (!needInvoke) return false;

			// prevent next run
			needInvoke = false;
			// call the function in context and with additional arguments
			originalFunction.apply(this, otherArgs);
			// try again after the timeout
			setTimeout(function () { needInvoke = true; }, timeout);
		}; // end throttling wrapper
	} // end throttle()

	/**
	 * preloadImages
	 * Allow preload of images for faster update of display.
	 *
	 * @param {String[, String, ...]} arguments, one or more strings containing valid image URLs
	 * @returns {Array} a jQuery object containing the preloaded images
	 */
	static preloadImages() {
		let returnImages = [];

		for (let offset in arguments) {
			let sourcePath = arguments[offset];

			if (typeof sourcePath === 'string') {
				let newImage = document.createElement('img');
				newImage.setAttribute('src', sourcePath);
				returnImages.push(newImage);
			}
		}

		return returnImages;
	}

	/**
	 * addCMSLandmarks
	 * Add role attributes using a CMS's ability to add class names.
	 *
	 * @param {Array} allowed, list of allowed rote attribute values
	 */
	static addCMSLandmarks(allowed = ['banner',
	                                  'complementary',
	                                  'contentinfo',
	                                  'form',
	                                  'main',
	                                  'navigation',
	                                  'region',
	                                  'search',
	                                  'alert',
	                                  'log',
	                                  'marquee',
	                                  'status',
	                                  'timer'])
	{
		document.querySelectorAll('[class*="aria-landmark-"]').forEach(function (element) {
			element.classList.forEach(function (item) {
				const isRole = item.indexOf('aria-landmark-') === 0,
						roleValue = item.substring(item.indexOf('aria-landmark-') + 14),
						isLabel = item.indexOf('aria-label-') === 0,
						labelValue = item.substring(item.indexOf('aria-label-') + 11).replace(/[-_]/g, ' ');

				if (isRole &&
				    element.getAttribute('role') === null &&
				    allowed.includes(roleValue))
				{
					element.setAttribute('role', roleValue)
				}

				if (isLabel &&
				    element.getAttribute('aria-label') === null &&
				    labelValue !== null)
				{
					element.setAttribute('aria-label', labelValue);
				}
			});
		});
	}
} // end TEGUtilities
