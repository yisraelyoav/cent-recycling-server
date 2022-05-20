const HttpError = require("../DL/models/http-error");
const axios = require("axios");
// const API_KEY = require("../.env");
const API_KEY = "AIzaSyDT4uxmp7Tutf1QryE49WkfIdo7JIQ8D30";

async function getCoordinatesForAddress(address) {
  // return{
  //     lat: 32.0504941,
  //     lng: 35.345551,
  // }
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );
  const data = response.data;

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Could not find location for the specified address.",
      404 //status for invalid user input
    );
    throw error;
  }
  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

module.exports = getCoordinatesForAddress;
