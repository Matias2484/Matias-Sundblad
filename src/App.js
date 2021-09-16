import React, { Component } from "react";
import "./App.css";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./checkoutForm";
import firebase from "./firebase";
import { GoogleMap, DistanceMatrixService } from "@react-google-maps/api";

const stripePromise = loadStripe(
  "pk_test_51JQAouFWmGEeX4odlkQmbhbHUp3CKtVyX8x3IAZOECCAv0E7LUzOZJoUyBS8C5LTiPBgpQNd3ZdNb2oBfZeRZFCR00fcFxXLfG"
);

export default class App extends Component {
  setUpRecaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          this.onSignInSubmit();
        },
      }
    );
  };

  onSignInSubmit = (e) => {
    e.preventDefault();
    this.setUpRecaptcha();
    var phoneNumber = "+5491157944253";
    var appVerifier = window.recaptchaVerifier;
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        const code = window.prompt("Enter OTP");
        confirmationResult
          .confirm(code)
          .then((result) => {
            // User signed in successfully.
            const user = result.user;

            console.log("User is signed in");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //Google Map API, calculate distance between two points
  state = {
    response: null,
    travelMode: "DRIVING",
    origin: "",
    destination: "",
  };
  distanceCallback = (response) => {
    console.log("Hello");
    console.log(response);

    if (response !== null) {
      if (response.status === "OK") {
        this.setState(() => ({
          response,
        }));
      } else {
        console.log("response: ", response);
      }
    }
  };

  //Travel Mode
  checkDriving = ({ target: { checked } }) => {
    checked &&
      this.setState(() => ({
        travelMode: "DRIVING",
      }));
  };

  //Travel Origin
  getOrigin = (ref) => {
    this.origin = ref;
  };

  //Travel Destination
  getDestination = (ref) => {
    this.destination = ref;
  };

  onClick = () => {
    if (this.origin.value !== "" && this.destination.value !== "") {
      this.setState(() => ({
        origin: this.origin.value,
        destination: this.destination.value,
      }));
    }
  };

  onMapClick = (...args) => {
    console.log("onClick args: ", args);
  };

  render() {
    return (
      <div>
        <div>
          <div>
            <div>
              <div>
                <div>
                  <label htmlFor="ORIGIN">Origin</label>

                  <input id="ORIGIN" type="text" ref={this.getOrigin} />
                </div>
              </div>

              <div>
                <div>
                  <label htmlFor="DESTINATION">Destination</label>

                  <input
                    id="DESTINATION"
                    className="form-control"
                    type="text"
                    ref={this.getDestination}
                  />
                </div>
              </div>
            </div>

            <div>
              <div>
                <input
                  id="DRIVING"
                  name="travelMode"
                  type="radio"
                  checked={this.state.travelMode === "DRIVING"}
                  onChange={this.checkDriving}
                />
                <label htmlFor="DRIVING">Driving</label>
              </div>
            </div>

            <button type="button" onClick={this.onClick}>
              Build Route
            </button>
          </div>

          <div className="map-container">
            <GoogleMap id="map" zoom={14} center="" options="">
              <DistanceMatrixService
                options={{
                  destinations: this.state.destination,
                  origins: this.state.origin,
                  travelMode: this.state.travelMode,
                }}
                callback={this.distanceCallback}
              />
            </GoogleMap>
          </div>
        </div>
        <Elements stripe={stripePromise}>
          <div className="phone-auth">
            <form onSubmit={this.onSignInSubmit}>
              <div>
                <h2>Phone Login</h2>
                <input type="number" />
              </div>
              <button type="submit">Submit</button>
            </form>
          </div>
          <CheckoutForm />
        </Elements>
      </div>
    );
  }
}
