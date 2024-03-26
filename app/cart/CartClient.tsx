'use client'
import { useCart } from "@/hooks/UseCart"
import Link from "next/link";
import {MdArrowBack} from 'react-icons/md'
import Heading from "../components/Heading";
import Button from "../components/Button";
import ItemContent from "./ItemContent";
import { formatPrice } from "@/utils/formatPrice";
import Head from 'next/head';
import Script from 'next/script'
import PaymentButton from "../components/paymentButton/PaymentButton";
import { checkout } from "../api/create-payment-intent/route";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );
  
const CartClient = () => {

    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
        })
          .then((res) => res.json())
          .then((data) => setClientSecret(data.clientSecret));
      }, []);
    
      const appearance = {
        theme: 'stripe',
      };
      const options = {
        clientSecret,
        appearance,
      };

    const {cartProducts,handleClearCart,cartTotalAmount} = useCart();

    if(!cartProducts || cartProducts.length === 0){
        return (
            <div className="flex flex-col items-center">
                <div className="text-2xl">Your Cart is empty</div>
                <div className="text-slate-500 flex items-center gap-1 mt-2">
                    <Link href={'/'} className="text-slate-500">
                     <MdArrowBack/>
                     <span>Start Shopping</span>
                    </Link>
                </div>
            </div>
        )
    }

  

  return (
    <div>
        {/* <Head> */}
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      {/* </Head> */}
        <Heading title='Shopping Cart' center/>
        <div className="grid grid-cols-5 text-xs gap-4 pb-2 items-center mt-8">
            <div className="col-span-2 justify-self-start">PRODUCT</div>
            <div className="justify-self-center">PRICE</div>
            <div className="justify-self-center">QUANTITY</div>
            <div className="justify-self-end">TOTAL</div>
        </div>

        <div>
            {cartProducts && cartProducts.map((item)=>{
                return <ItemContent key={item.id} item={item}/>
            })}
        </div>

        <div className="border-t-[1.5px] border-slate-200 py-4 flex justify-between gap-4">
            <div className="w-[90px]">
                <Button label='Clear Cart' onClick={()=>{handleClearCart()}} small outline />
            </div>

            <div className="text-sm flex flex-col gap-1 items-start">
                 <div className="flex justify-between w-full text-base font-semibold">
                    <span>SubTotal</span>
                    <span>{formatPrice(cartTotalAmount)}</span>
                 </div>
                    <p className="text-slate-500">Taxes and shipping calculate at checkout</p>

                    <Elements options={options} stripe={stripePromise}>
                    <PaymentButton/>
                    </Elements>


                    <Link href={'/'} className="text-slate-500 flex items-center gap-1 mt-2" >
                     <MdArrowBack/>
                     <span>Continue Shopping</span>
                    </Link>
            </div>
        </div>
    </div>
  )
}

export default CartClient