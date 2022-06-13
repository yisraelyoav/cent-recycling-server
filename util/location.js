require("dotenv").config();
const HttpError = require("../DL/models/httpError");
const axios = require("axios");
// console.log(process.env.API_KEY);
// //cleaning the api key string
// const api_key = process.env.API_KEY.substring(
//   0,
//   process.env.API_KEY.length - 1
// );
// console.log({ api_key });
async function getCoordinatesForAddress(address) {
  // return{
  //     lat: 32.0504941,
  //     lng: 35.345551,
  // }
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${process.env.API_KEY}`
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
