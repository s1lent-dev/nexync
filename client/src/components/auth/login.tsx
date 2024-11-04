"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/utils/api";
import { ArrowRight } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define the Zod schema for form validation
const schema = z.object({
  usernameOrEmail: z.string().min(1, "Username or email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  
  const { loginUser } = useLogin();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    }
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try { 
      const res = await loginUser(values);
      console.log(res);
      if (res?.statusCode === 202) {
        router.push('/');
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
            Login to Your Account
          </h2>
          
          <div className="flex items-center gap-8 mb-8">
            <button
              title="Sign in with Google"
              type="button"
              className="text-font_dark flex w-full items-center justify-center rounded-sm border border-slate-500 bg-bg_card1 px-6 py-3 text-base outline-none transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:text-primary"
              onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
            >
              <Image
                src="/google.webp"
                width={25}
                height={25}
                alt="Google"
                className="mr-3"
              />
              Google
            </button>
            <button
              title="Sign in with Github"
              type="button"
              className="text-font_dark flex w-full items-center justify-center rounded-sm border border-slate-500 bg-bg_card1 px-6 py-3 text-base outline-none transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:text-primary"
              onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/github`}
            >
              <Image
                src="/github.webp"
                width={25}
                height={25}
                alt="Github"
                className="mr-3"
              />
              Github
            </button>
          </div>

          <div className="mb-14 flex items-center justify-center">
            <span className="bg-bg_card2 h-[1px] w-full max-w-[200px] sm:block"></span>
            <p className="text-font_light w-full px-5 text-center text-base">
              Or, login with your email
            </p>
            <span className="bg-bg_card2 h-[1px] w-full max-w-[200px] sm:block"></span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-12 flex flex-col gap-8">
              <div className="flex gap-4 w-full"> {/* Change here for horizontal alignment */}
                <div className="flex flex-col w-full">
                  <input
                    {...register("usernameOrEmail")}
                    type="text"
                    placeholder="Username or Email"
                    className={`border-b border-bg_card2 bg-transparent pb-4 focus:border-primary focus:placeholder:text-font_main focus-visible:outline-none ${errors.usernameOrEmail ? 'border-red-500' : ''}`}
                  />
                  {errors.usernameOrEmail && <p className="text-red-500 text-sm mt-1">{errors.usernameOrEmail.message}</p>}
                </div>

                <div className="flex flex-col w-full">
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="Password"
                    className={`border-b border-bg_card2 bg-transparent pb-4 focus:border-primary focus:placeholder:text-font_main focus-visible:outline-none ${errors.password ? 'border-red-500' : ''}`}
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
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

            <div className="mt-12 border-t border-bg_card2 py-5 text-center">
              <p className="text-font_light text-base">
                Don&apos;t have an account?{" "}
                <Link href='/register' className="text-primary">
                  register
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Login;
