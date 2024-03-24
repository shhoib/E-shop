"use client"
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import './globals.css'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import NavBar from './components/nav/Navbar';
import Footer from './components/footer/Footer';
import CartProvider from '@/providers/CartProvider';
import { Toaster } from 'react-hot-toast';

const poppins = Poppins({ subsets: ['latin'], weight : ['400','700'] });

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// export const metadata: Metadata = {
//   title: 'E-Shop',
//   description: 'e-commerce app',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${poppins.className} text-slate-700`}>
        <Toaster toastOptions={{style:{ background:'rgb(51 65 85', color:'#fff'}}}/>
        <CartProvider>
        <div className='flex flex-col min-h-screen'>
         <NavBar/>
         <Elements stripe={stripePromise}>
         <main className='flex-grow'>{children}</main>
         </Elements>
         <Footer/>
        </div>
        </CartProvider>
      </body>
    </html>
  )
}
