describe('TEG Utilities', function() {
	beforeAll(function() {
		window.tu = new TEGUtilities();
		window.tu.windowSize.init();
		window.runCount = 0;
		window.debounceCount = 0;
		window.throttleCount = 0;
		window.timer;

		window.spiedUpon = {
			debounced : TEGUtilities.debounce(function() {
				                                  debounceCount++;
				                                  if (window.runCount < 300) {
					                                  window.timer = setTimeout(function() { spiedUpon.debounced(arguments); }, 200);
					                                  runCount++;
				                                  }
			                                  },
			                                  4000),
			throttled : TEGUtilities.throttle(function() {
				                                  throttleCount++;
				                                  if (window.runCount < 300) {
					                                  window.timer = setTimeout(function() { spiedUpon.throttled(arguments); }, 200);
					                                  runCount++;
				                                  }
			                                  },
			                                  4000),
		}; // end spiedUpon
	}); // end beforeAll()

	describe('windowSize should detect the size of the viewable area', function() {
		it(`should say isSmall is ${window.innerWidth <= 740}`, function() {
			expect(windowSize.isSmall).toBe(window.innerWidth <= 740);
		}); // end it('should say isSmall is ')

		it(`should say isMedium is ${window.innerWidth > 740 &&
		                             window.innerWidth <= 1024}`,
		   function() {
			   expect(windowSize.isMedium).toBe(window.innerWidth > 740 &&
			                                       window.innerWidth <= 1024);
		   }); // end it('should say isMedium is ')

		it(`should say isLarge is ${window.innerWidth > 1024 &&
		                            window.innerWidth <= 2048}`,
		   function() {
			   expect(windowSize.isLarge).toBe(window.innerWidth > 1024 &&
			                                      window.innerWidth <= 2048);
		   }); // end it('should say isLarge is ')

		it(`should say isLarger is ${window.innerWidth > 2048}`,
		   function() {
			   expect(windowSize.isLarger).toBe(window.innerWidth > 2048);
		   }); // end it('should say isLarge is ')

		it(`should say isTall is ${window.innerHeight > 2048}`,
		   function() {
			   expect(windowSize.isTall).toBe(window.innerHeight >= 820);
		   }); // end it('should say isLarge is ')
	}); // end it('should detect window size')

	it('between() should show number range inclusion', function() {
		expect(TEGUtilities.between(0, 0, 0)).toBeFalse();
		expect(TEGUtilities.between(1, 0, 2)).toBeTrue();
	}); // end it('between should show number range inclusion')

	describe('betweenInclude() should show number range inclusion', function() {
		it('should allow inclusion of limits', function() {
			expect(TEGUtilities.betweenInclude(0, 0, 0, TEGUtilities.BTWN_INCL_BOTH)).toBeTrue();
		}); // end it('should allow inclusion of limits')

		it('should should exclude values outside the limits', function() {
			expect(TEGUtilities.betweenInclude(-2, 0, 2, TEGUtilities.BTWN_INCL_BOTH)).toBeFalse();
		}); // end it('should should exclude values outside the limits')

		it('should should include values between the limits', function() {
			expect(TEGUtilities.betweenInclude(1, 0, 2)).toBeTrue();
		}); // end it('should should include values between the limits')

		it('should default to excluding the limits', function() {
			expect(TEGUtilities.betweenInclude(2, 0, 2)).toBeFalse();
		}); // end it('should default to excluding the limits')

		it('should exclude the limits when explicitly told', function() {
			expect(TEGUtilities.betweenInclude(2, 0, 2, TEGUtilities.BTWN_INCL_NONE)).toBeFalse();
		}); // end it('should exclude the limits when explicitly told')

		it('should include the higher limit when told', function() {
			expect(TEGUtilities.betweenInclude(2, 0, 2, TEGUtilities.BTWN_INCL_HIGHER)).toBeTrue();
		}); // end it('should include the higher limit when told')

		it('should include the lower limit when told', function() {
			expect(TEGUtilities.betweenInclude(0, 0, 2, TEGUtilities.BTWN_INCL_LOWER)).toBeTrue();
		}); // end it('should include the lower limit when told')
	}); // end it('between should show number range inclusion')

	describe('debounce() and throttle()', function() {
		beforeAll(function() {
			jasmine.clock().install();
			spyOn(spiedUpon, 'debounced').and.callThrough();
			spyOn(spiedUpon, 'throttled').and.callThrough();
		}); // end beforeEach()

		describe('debounce()', function() {
			it('should create a debounced function', function() {
				window.runCount = 0;
				clearTimeout(window.timer);
				spiedUpon.debounced();
				jasmine.clock().tick(5000);
				expect(spiedUpon.debounced).toHaveBeenCalledTimes(2);
				expect(window.debounceCount).toBe(1);
			}); // end it('should create a debounced function')

			it('should pass arguments', function() {
				let count         = 0,
				    results       = {},
				    noSpyDebounce = TEGUtilities.debounce(function() {
					                                          count += 1;
					                                          arguments.count = count;
					                                          results = arguments;
				                                          },
				                                          400,
				                                          ['my list', 1, 'of arguments']);
				noSpyDebounce();
				jasmine.clock().tick(500);
				expect(Object.keys(results).length).toBe(4);
				expect(results.count).toBe(1);
				expect(results['0']).toBe('my list');
				expect(results['1']).toBe(1);
				expect(results['2']).toBe('of arguments');
			}); // end it('should pass arguments')
		});

		describe('throttle()', function() {
			it('should create a throttled function', function() {
				window.runCount = 0;
				clearTimeout(window.timer);
				spiedUpon.throttled();
				jasmine.clock().tick(5000);
				expect(spiedUpon.throttled).toHaveBeenCalledTimes(2);
				expect(window.throttleCount).toBe(1);
			}); // end it('should create a debounced function')

			it('should pass arguments', function() {
				let count         = 0,
				    results       = {},
				    noSpyThrottle = TEGUtilities.throttle(function() {
					                                          results = {count: ++count, ...arguments};
				                                          },
				                                          400,
				                                          ['my other list', 2, 'of arguments']);
				noSpyThrottle();
				expect(Object.keys(results).length).toBe(4);
				expect(results.count).toBe(1);
				expect(results['0']).toBe('my other list');
				expect(results['1']).toBe(2);
				expect(results['2']).toBe('of arguments');
			}); // end it('should pass arguments')
		});

	}); // end it('should throttle a function')

	describe('preloadImages()', function() {

		it('should be preloaded', function() {
			let isLoaded  = true,
			    loadedSrc = [];

			// run the preloader and check if all the elements in the returned array have a source in the list of images
			TEGUtilities.preloadImages('preloadImages/carousel-defenders1.jpg', 'preloadImages/ff-20.jpg', 'preloadImages/hero-tscl-2.jpg')
			      .forEach(function(element) {
			      	let value = element.attributes.src.value;
				      loadedSrc.push(value);

				      if (!['preloadImages/carousel-defenders1.jpg', 'preloadImages/ff-20.jpg', 'preloadImages/hero-tscl-2.jpg'].includes(value)) {
					      isLoaded = false;
				      }
			      });

			// check if all members of the list of images are in the array taken from the generated img elements
			['preloadImages/carousel-defenders1.jpg', 'preloadImages/ff-20.jpg', 'preloadImages/hero-tscl-2.jpg']
				.forEach(function(currentSrc) {

					if (!loadedSrc.includes(currentSrc)) {
						isLoaded = false;
					}
				});
			expect(isLoaded).toBeTrue();
		});
	}); // end describe('preloadImages()')

	describe('isEmpty', () => {
		beforeAll(() => {
			empty = {};
			full = {
				'foo': 'bar'
			};
		});
		it('should return true for an empty object', () => {
			expect(empty.isEmpty()).toBeTrue();
			expect(full.isEmpty()).toBeFalse();
		}); // end it('should return true for an empty object')
	}); // end describe('isEmpty')

	describe('addCMSLandmarks', () => {
		beforeAll(() => {
			TEGUtilities.addCMSLandmarks();
		})
		it('should add a role for valid landmark values', () => {
			expect(document.querySelectorAll('[role="banner"]').length).toBe(1);
			expect(document.querySelectorAll('[role="navigation"]').length).toBe(1);
			expect(document.querySelectorAll('[role="contentinfo"]').length).toBe(1);
		}); // end it('should add a role for valid landmark values')
		it('should exclude invalid landmarks', () => {
			expect(document.querySelector('[role="header"]')).toBeNull();
		}); // end it('should exclude invalid landmarks')
	}); // end describe('addCMSLandmarks')
});
