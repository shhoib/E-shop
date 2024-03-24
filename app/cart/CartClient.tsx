'use client'
import { useCart } from "@/hooks/UseCart"
import Link from "next/link";
import {MdArrowBack} from 'react-icons/md'
import Heading from "../components/Heading";
import Button from "../components/Button";
import ItemContent from "./ItemContent";
import { formatPrice } from "@/utils/formatPrice";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import React, { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";


const CartClient = () => {

    const {cartProducts,handleClearCart,cartTotalAmount} = useCart();

    const stripe = useStripe();
    const elements = useElements();
    console.log('payment1');

    const handlePayment = useCallback(async()=>{
        console.log('payment2');
        
        const cardElement = elements?.getElement("card");
        try {
            if (!stripe || !cardElement) return null;
            const { data } = await axios.post("/api/create-payment-intent", {
                data: { amount: 89 },
            });
            const clientSecret = data;

            await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: cardElement },
            });
        } catch (error) {
            console.log(error);
        }
    },[elements, stripe]);

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
                    <button onClick={()=>{handlePayment}}>Checkout</button>

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