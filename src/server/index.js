const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");

const app = express();

//Using stripe in the Back
const stripe = new Stripe(
  "sk_test_51JQAouFWmGEeX4od3qJjkwW2cdTVunEMWXE9PgKcNaz0sU2DvmGqLMHAIhuix7usRB1f6oSbE9ZfkD92GKRTmVdv001bFGHwHL"
);

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.post("/api/checkout", async (req, res) => {
  //Create the payment intent
  try {
    const { id, amount } = req.body;

    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description: "",
      paymentMethod: id,
      confirm: true,
    });

    console.log(payment);

    res.send({ msg: "Succesfull payment" });

    //Catch the Error
  } catch (error) {
    console.log(error);
    res.json({ msg: error.raw.message });
  }
});

app.listen(3001, () => {
  console.log("Server on port", 3001);
});
