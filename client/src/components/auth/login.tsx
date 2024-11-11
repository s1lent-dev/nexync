"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForgotPassword, useLogin } from "@/utils/api";
import { ArrowRight, Eye, EyeClosed } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/context/toast/toast";

// Define separate schemas for login and forgot password
const loginSchema = z.object({
  usernameOrEmail: z.string().min(6, "Username or email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address").regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, {
    message: "Email must end with @gmail.com",
  }),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const { showSuccessToast, showErrorToast } = useToast();
  const { loginUser } = useLogin();
  const { forgotPassword } = useForgotPassword();
  const router = useRouter();

  // Initialize login form with its own schema
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  // Initialize forgot password form with its own schema
  const {
    register: registerForgotPassword,
    handleSubmit: handleForgotPasswordSubmit,
    formState: { errors: forgotPasswordErrors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Handle login submission
  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const res = await loginUser(values);
      if (res?.statusCode === 202) {
        showSuccessToast("Login successful");
        router.push('/');
      } else {
        showErrorToast(res.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle forgot password submission
  const onForgotPasswordSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    try {
      const res = await forgotPassword(values.email);
      if (res.statusCode === 200) {
        showSuccessToast("Password reset link sent to your email");
        setIsForgotPassword(false);
      } else {
        showErrorToast(res.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="pb-12.5 pt-32.5 lg:pb-25 lg:pt-45 xl:pb-30 xl:pt-50">
      <div className="relative z-10 mx-auto max-w-screen-lg px-7.5 pb-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
        <div className="absolute inset-0 z-0 h-2/3 rounded-lg bg-gradient-to-t from-transparent to-bg_card1"></div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: -50 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          animate="visible"
          transition={{ duration: 1, delay: 0.25 }}
          viewport={{ once: true }}
          className="relative z-10 bg-bg_dark1 pt-16 pl-16 pr-16 pb-2 shadow-solid-8 rounded-lg border-slate-600"
        >
          <h2 className="mb-16 text-center text-3xl font-semibold text-font_main">
            {isForgotPassword ? "Reset Password" : "Login to Your Account"}
          </h2>

          {!isForgotPassword && (
            <div className="flex items-center gap-8 mb-8">
              <button
                title="Sign in with Google"
                type="button"
                className="text-font_dark flex w-full items-center justify-center rounded-sm border border-slate-500 bg-bg_card1 px-6 py-3 text-base outline-none transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:text-primary"
                onClick={() => (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`)}
              >
                <Image src="/google.webp" width={25} height={25} alt="Google" className="mr-3" />
                Google
              </button>
              <button
                title="Sign in with Github"
                type="button"
                className="text-font_dark flex w-full items-center justify-center rounded-sm border border-slate-500 bg-bg_card1 px-6 py-3 text-base outline-none transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:text-primary"
                onClick={() => (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/github`)}
              >
                <Image src="/github.webp" width={25} height={25} alt="Github" className="mr-3" />
                Github
              </button>
            </div>
          )}

          {!isForgotPassword && (
            <div className="mb-14 flex items-center justify-center">
              <span className="bg-bg_card2 h-[1px] w-full max-w-[200px] sm:block"></span>
              <p className="text-font_light w-full px-5 text-center text-base">
                Or, login with your email
              </p>
              <span className="bg-bg_card2 h-[1px] w-full max-w-[200px] sm:block"></span>
            </div>
          )}

          {isForgotPassword ? (
            <form onSubmit={handleForgotPasswordSubmit(onForgotPasswordSubmit)}>
              <div className="mb-12 flex flex-col gap-8">
                <div className="flex flex-col w-full">
                  <input
                    {...registerForgotPassword("email")}
                    type="email"
                    placeholder="Email"
                    className={`border-b border-bg_card2 bg-transparent pb-4 focus:border-primary focus:placeholder:text-font_main focus-visible:outline-none ${forgotPasswordErrors.email ? "border-red-500" : ""}`}
                  />
                  {forgotPasswordErrors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {forgotPasswordErrors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap w-full items-center justify-center">
                <button
                  title="Reset Password"
                  type="submit"
                  className="inline-flex items-center gap-3 rounded-full bg-bg_card2 px-6 py-3 font-medium text-font_main duration-300 ease-in-out hover:border-primary hover:text-primary"
                >
                  Reset Password
                  <ArrowRight size={24} />
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit(onLoginSubmit)}>
              <div className="mb-12 flex flex-col gap-8">
                <div className="flex gap-4 w-full">
                  <div className="flex flex-col w-full">
                    <input
                      {...registerLogin("usernameOrEmail")}
                      type="text"
                      placeholder="Username or Email"
                      className={`border-b border-bg_card2 bg-transparent pb-4 focus:border-primary focus:placeholder:text-font_main focus-visible:outline-none ${loginErrors.usernameOrEmail ? 'border-red-500' : ''}`}
                    />
                    {loginErrors.usernameOrEmail && (
                      <p className="text-red-500 text-sm mt-1">
                        {loginErrors.usernameOrEmail.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col w-full relative">
                    <input
                      {...registerLogin("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className={`border-b border-bg_card2 bg-transparent pb-4 pr-10 focus:border-primary focus:placeholder:text-font_main focus-visible:outline-none ${loginErrors.password ? "border-red-500" : ""}`}
                    />
                    <div
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-3 cursor-pointer text-gray-500"
                    >
                      {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                    </div>
                    {loginErrors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {loginErrors.password.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap w-full items-center justify-center">
                <button
                  title="Login"
                  type="submit"
                  className="inline-flex items-center gap-3 rounded-full bg-bg_card2 px-6 py-3 font-medium text-font_main duration-300 ease-in-out hover:border-primary hover:text-primary"
                >
                  Login
                  <ArrowRight size={24} />
                </button>
              </div>
            </form>
          )}

          <div className="mt-12 border-t border-bg_card2 py-5 text-center flex flex-row justify-between">
            <p className="text-font_light text-base">
              {isForgotPassword ? (
                <button type="button" onClick={() => setIsForgotPassword(false)} className="text-font_dark hover:text-primary">
                  Login
                </button>
              ) : (
                <button type="button" onClick={() => setIsForgotPassword(true)} className="text-font_dark hover:text-primary">
                  Forgot Password?
                </button>
              )}
            </p>
            <p className="text-font_light text-base">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary">
                Register
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Login;
