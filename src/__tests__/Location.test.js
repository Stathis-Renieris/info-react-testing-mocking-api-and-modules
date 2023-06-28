// mocking Browser APIs and modules
// http://localhost:3000/location

import * as React from "react";
import { render, screen, act } from "@testing-library/react";
import Location from "../components/Location";

// The Location component uses a module which in turn uses the window.navigator.geolocation.getCurrentPosition API which is not supported from jsdom, so we have to mock it:
beforeAll(() => {
  window.navigator.geolocation = {
    getCurrentPosition: jest.fn(),
  };
});

// This is a handy utility function which allows us to create a promise that we can resolve/reject on demand:
function deferred() {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

test("displays the users current location", async () => {
  expect.assertions(4);

  const fakePosition = {
    coords: {
      latitude: 35,
      longitude: 139,
    },
  };

  const { promise, resolve } = deferred();

  // Now we need to mock the geolocation's getCurrentPosition function
  // To mock something you need to know its API and simulate that in your mock:
  // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition
  //
  // here's an example of the API:
  // function success(position) {}
  // function error(error) {}
  // navigator.geolocation.getCurrentPosition(success, error)
  window.navigator.geolocation.getCurrentPosition.mockImplementation(
    (callback) => {
      promise.then(() => callback(fakePosition));
    }
  );

  render(<Location />);

  // We verify the loading spinner is showing up
  expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();

  // We wait for the promise to be resolved just to simulate the API behavior
  await act(async () => {
    resolve();
    await promise;
  });

  // We verify the loading spinner is no longer in the document
  expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument();

  // We verify the latitude and longitude appear correctly in the document
  expect(screen.getByText(/latitude/i)).toHaveTextContent(
    `Latitude: ${fakePosition.coords.latitude}`
  );
  expect(screen.getByText(/longitude/i)).toHaveTextContent(
    `Longitude: ${fakePosition.coords.longitude}`
  );
});

/*
eslint
  no-unused-vars: "off",
*/
