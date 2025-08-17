import React from "react";

function About() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-primary/10 to-base-100">
      <div className="max-w-2xl w-full mx-4 p-8 rounded-2xl shadow-xl bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-4">
          <img
            src="https://i.ibb.co.com/997xV0ft/ee6be43b-e07b-4cf9-ab7d-3c6e8e8696ff.png"
            alt="MediMart Logo"
            className="w-12 h-12 rounded-full border-2 border-primary"
          />
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">
            About MediMart
          </h1>
        </div>
        <p className="text-gray-700 text-lg mb-4">
          <span className="font-semibold text-primary">MediMart</span> is your
          trusted online pharmacy and healthcare partner. We are dedicated to
          making healthcare accessible, affordable, and convenient for everyone.
        </p>
        <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
          <li>Wide range of genuine medicines and healthcare products</li>
          <li>Fast, reliable, and discreet delivery</li>
          <li>24/7 customer support and expert guidance</li>
          <li>Easy prescription uploads and order tracking</li>
        </ul>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="/shop"
            className="btn btn-primary px-6 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-transform"
          >
            Start Shopping
          </a>
          <a
            href="/support"
            className="btn btn-outline-primary px-6 py-2 rounded-lg font-semibold shadow hover:bg-primary/10 transition"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
}

export default About;