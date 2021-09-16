import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

export default function CheckoutForm() {
  //Payment Method using Stripe
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Create Payment Method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    //If doesn`t exist Error
    if (!error) {
      const { id } = paymentMethod;

      //Send the Data to the Server(Back)
      try {
        const { data } = await axios.post(
          "http://localhost:3001/api/checkout",
          {
            id,
            amount: 1000,
          }
        );
        console.log(data);
      } catch (error) {
        console.log(error);
      }

      //Clean the form
      elements.getElement(CardElement).clear();
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button>Buy</button>
    </form>
  );
}
