"use client";

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import React from "react";

// eslint-disable-next-line @next/next/no-async-client-component
const PaymentButton =  () => {

    const stripe = useStripe();
    const elements = useElements();

    const handlePayment = async ()=>{
        
        const cardElement = elements?.getElement("card");

    try {
        if (!stripe || !cardElement) return null;
        const { data } = await axios.post("/api/create-payment-intent", {
            data: { amount: 89 },
        });
        const clientSecret = data;
        
        await stripe?.confirmCardPayment(clientSecret, {
            payment_method: { card: cardElement },
        });
        console.log('completed');  
    } catch (error) {
      console.log(error);
    }
    }

  return (
    <div>
        <CardElement />
        <button onClick={handlePayment}>pay</button>
    </div>
  )
}

export default PaymentButton