'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingCart, FileText, TrendingUp, Shield } from 'lucide-react';

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              PurchaseFlow
            </span>
          </div>
          <Link href="/login">
            <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block">
            <span className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold">
              Modern Purchase Order Management
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Streamline Your
            </span>
            <br />
            <span className="text-slate-900">Purchase Orders</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto">
            Manage suppliers, track orders, and automate your procurement process with our intuitive platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/login">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-lg px-8 py-6 group">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-slate-200">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Easy Order Creation</h3>
            <p className="text-slate-600">
              Create and manage purchase orders with our intuitive multi-step form. Add products, set terms, and submit in minutes.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-slate-200">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Real-time Tracking</h3>
            <p className="text-slate-600">
              Monitor order status from draft to completion. Get instant updates and maintain full visibility of your procurement pipeline.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-slate-200">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Secure & Reliable</h3>
            <p className="text-slate-600">
              Enterprise-grade security with role-based access control. Your data is encrypted and backed up automatically.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-md mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-slate-600">
          <p>&copy; 2024 PurchaseFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
