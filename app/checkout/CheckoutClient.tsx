'use client';

import { useCart } from "@/hooks/UseCart"
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import CheckoutForm from "./CheckoutForm";
import Button from "../components/Button";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

const CheckoutClient = () => {
    const {cartProducts, paymentIntent,handleSetPaymentIntent} = useCart();
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [clientSecret, setClientSecret] = useState('');
    const [paymentSuccess,setPaymentSuccess] = useState(false);

    const router = useRouter();
    console.log('paymentIntent',paymentIntent);

    useEffect(()=>{
        if(cartProducts){
           setLoading(true) 
           setError(false) 

           fetch('/api/create-payment-intent',{
            method: 'POST',
            headers:{ 'Content-Type':'application/json'},
            body:JSON.stringify({
                items: cartProducts,
                payment_intent_id :paymentIntent
            })
           }).then((res)=>{
            setLoading(false)
            if(res.status === 401){
                return router.push('/login')
            }
            return res.json()
           }).then((data)=>{
            setClientSecret(data.paymentIntent.client_secret);
            handleSetPaymentIntent(data.paymentIntent.id)
           }).catch((error)=>{
            setError(true);
            console.log(error);         
            toast.error('something went wrong')
           })
        }
    },[cartProducts, handleSetPaymentIntent, paymentIntent, router]);

    const options : StripeElementsOptions= {
        clientSecret,
        appearance: {
            theme:'stripe',
            labels:'floating'
        }
    }

    const handleSetPaymentSuccess = useCallback((val:boolean)=>{
        setPaymentSuccess(val);
        console.log(paymentSuccess);  
    },[paymentSuccess])
    

  return (
    <div className="w-full">
        {clientSecret && cartProducts &&(
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} handleSetPaymentSuccess={handleSetPaymentSuccess}/>
        </Elements>
      )}

      {loading && <div className="text-center">loading checkout</div>}
      {error && <div className="text-center text-rose-500">Something went wrong</div>}
      {paymentSuccess &&(
        <div className="flex items-center flex-col gap-4">
            <div className="text-teal-500 text-center">Payment Success</div>
            <div className="max-w-[200px] w-full">
                <Button label='Go Home' onClick={()=>router.push('/')}/>
            </div>
        </div>
      )}
    </div>
  )
}

export default CheckoutClient