import React from "react";
import { Mail, MessageCircle } from "lucide-react";

function Support() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-primary/10 to-base-100">
      <div className="max-w-2xl w-full mx-4 p-8 rounded-2xl shadow-xl bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-4">
          <MessageCircle className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">
            Support Center
          </h1>
        </div>
        <p className="text-gray-700 text-lg mb-6">
          Need help? Our support team is here for you{" "}
          <span className="font-semibold text-primary">24/7</span>. Reach out to
          us anytime and we’ll get back to you as soon as possible.
        </p>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Mail className="w-6 h-6 text-primary" />
            <a
              href="mailto:support@medimart.com"
              className="text-primary underline font-medium"
            >
              support@medimart.com
            </a>
          </div>
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-primary" />
            <span className="text-gray-700">Live Chat (Coming Soon)</span>
          </div>
        </div>
        <div className="mt-8 text-sm text-gray-500">
          For urgent queries, call us at{" "}
          <span className="font-semibold text-primary">+1-800-MEDI-MART</span>
        </div>
      </div>
    </section>
  );
}

export default Support;