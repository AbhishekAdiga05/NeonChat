"use client";

import React from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";

const LoginPage = () => {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] -z-10 animate-pulse delay-700" />

      <div className="w-full max-w-md bg-card/40 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-border/50 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col items-center text-center animate-in fade-in zoom-in duration-700">
        <div className="mb-8 p-4 bg-background/50 rounded-3xl shadow-inner">
          <Image
            src="/logo.svg"
            alt="Neon Chat logo"
            width={180}
            height={45}
            priority
            className="w-48 h-auto object-contain"
          />
        </div>

        <div className="space-y-3 mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-cyan-400 to-blue-500">
              Welcome Back
            </span>
          </h1>
          <p className="text-muted-foreground font-medium">
            Sign in to access your AI-powered workspace
          </p>
        </div>

        <Button
          variant="default"
          className="w-full h-16 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          onClick={() =>
            signIn.social({
              provider: "github",
              callbackURL: "/",
            })
          }
        >
          <Image src="/github.svg" alt="GitHub" width={24} height={24} className="mr-3 brightness-0 invert" />
          Sign in with Github
        </Button>

        <p className="mt-8 text-xs text-muted-foreground uppercase tracking-widest font-semibold opacity-50">
          Secure Authentication by Better-Auth
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
