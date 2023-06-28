# API and modules mocking

We test Location component which prints user's current location on the screen.

We test the functionality of our component while mocking an API (window.navigator.geolocation.getCurrentPosition) that is not supported by jsdom with `jest.fn()`.

To run the test, use `npm test` in your terminal.
