import React, { Component } from "react";
import "./App.css";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./checkoutForm";
import firebase from "./firebase";

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
            // eslint-disable-next-line
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

  render() {
    return (
      <div>
        <Elements stripe={stripePromise}>
          <div className="phone-auth">
            <form onSubmit={this.onSignInSubmit}>
              <div className="phone_login">
                <h2>Phone Login</h2>
                <div id="recaptcha-container"></div>
                <input type="number" />
              </div>
              <button type="submit">Submit</button>
            </form>
          </div>
          <div className="payment">
            <h2>Payment Method</h2>

            <CheckoutForm />
          </div>
        </Elements>
      </div>
    );
  }
}
