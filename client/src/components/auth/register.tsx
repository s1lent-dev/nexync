"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCheckEmail, useCheckUsername, useRegister, useVerifyEmail } from "@/hooks/auth";
import { ArrowRight, Eye, EyeClosed } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/context/toast/toast";
import useFcmToken from "@/hooks/useFcm"
import { debounce } from "lodash";

const schema = z
  .object({
    username: z.string().min(6, "Username must be at least 6 characters"),
    email: z
      .string()
      .email("Invalid email format")
      .regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, {
        message: "Email must end with @gmail.com",
      }),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const Register = () => {

  const [code, setCode] = useState<string>('');
  const [showVerifyEmail, setShowVerifyEmail] = useState<boolean>(false);
  const [FormData, setFormData] = useState<z.infer<typeof schema> | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { showSuccessToast, showErrorToast } = useToast();
  const { verifyEmail } = useVerifyEmail();
  const { registerUser } = useRegister();
  const { checkUsername } = useCheckUsername();
  const { checkEmail } = useCheckEmail();
  const router = useRouter();
  const { token } = useFcmToken();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
  });

  const debouncedCheckUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 6) {
        const res = await checkUsername(username);
        setError("username", {
          type: "manual",
          message: res,
        });
      } else {
        setError("username", {
          type: "manual",
          message: "Username must be at least 6 characters",
        });
      }
    }, 500),
    []
  );

  const debouncedCheckEmail = useCallback(
    debounce(async (email) => {
      const isValidEmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
      if (isValidEmail) {
        const res = await checkEmail(email);
        setError("email", {
          type: "manual",
          message: res,
        });
      } else {
        setError("email", {
          type: "manual",
          message: "Email must be a valid Gmail address ending with @gmail.com",
        });
      }
    }, 500),
    []
  );

  const username = watch("username");
  const email = watch("email");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  useEffect(() => {
    if (username) {
      debouncedCheckUsername(username);
    } else {
      clearErrors("username");
    }
  }, [username, debouncedCheckUsername, clearErrors]);

  useEffect(() => {
    if (email) {
      debouncedCheckEmail(email);
    } else {
      clearErrors("email");
    }
  }, [email, debouncedCheckEmail, clearErrors]);

  useEffect(() => {
    if (!password) clearErrors("password");
  }, [password, clearErrors]);

  useEffect(() => {
    if (!confirmPassword) clearErrors("confirmPassword");
  }, [confirmPassword, clearErrors]);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      setFormData(values);
      setShowVerifyEmail(true);
      const res = await verifyEmail(values.email);
      console.log(res);
      if (res?.statusCode === 200) {
        showSuccessToast("Verfication code sent to your email");
      } else {
        showErrorToast(res.message);
      }
    } catch (err) {
      console.error(err);
    }
  };


  const onVerifyEmail = async (code: string) => {
    try {
      if (FormData) {
        console.log(FormData);
        const res = await registerUser(FormData, code, token || '');
        if (res?.statusCode === 201) {
          showSuccessToast("Account created successfully. Please login to continue");
          router.push('/login');
        } else {
          showErrorToast(res.message);
        }
      } else {
        showErrorToast("Form data is missing.");
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
            Create an Account
          </h2>
          <div className="flex items-center gap-8">
            <button
              title="Sign in with Google"
              type="button"
              className="text-font_dark mb-6 flex w-full items-center justify-center rounded-sm border border-slate-500 bg-bg_card1 px-6 py-3 text-base outline-none transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:text-primary"
              onClick={() => window.location.href = `https://nexync-server.codezeniths.site/auth/google`}
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
              className="text-font_dark mb-6 flex w-full items-center justify-center rounded-sm border border-slate-500 bg-bg_card1 px-6 py-3 text-base outline-none transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:text-primary"
              onClick={() => window.location.href = `https://nexync-server.codezeniths.site/auth/github`}
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

          <div className="mb-10 flex items-center justify-center">
            <span className="bg-bg_card2 h-[1px] w-full max-w-[200px] sm:block"></span>
            <p className="text-font_light w-full px-5 text-center text-base">
              Or, register with your email
            </p>
            <span className="bg-bg_card2 h-[1px] w-full max-w-[200px] sm:block"></span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-8 flex flex-col gap-8 lg:mb-12 lg:flex-row lg:justify-between lg:gap-14">
              <div className="flex flex-col w-full lg:w-1/2">
                <input
                  {...register("username")}
                  type="text"
                  placeholder="Username"
                  className={`border-b border-bg_card2 bg-transparent pb-4 focus:border-primary focus:placeholder:text-font_main focus-visible:outline-none ${errors.username?.message?.includes("already") ? "border-red-500" : ""
                    }`}
                />
                {errors.username && (
                  <p
                    className={`${errors.username.message?.includes("available") ? "text-green-500" : "text-red-500"
                      } text-sm mt-1`}
                  >
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col w-full lg:w-1/2">
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email address"
                  className={`border-b border-bg_card2 bg-transparent pb-4 focus:border-primary focus:placeholder:text-font_main focus-visible:outline-none ${errors.email?.message?.includes("already") ? "border-red-500" : ""
                    }`}
                />
                {errors.email && (
                  <p
                    className={`${errors.email.message?.includes("available") ? "text-green-500" : "text-red-500"
                      } text-sm mt-1`}
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-8 flex flex-col gap-8 lg:mb-12 lg:flex-row lg:justify-between lg:gap-14">
              <div className="flex flex-col w-full lg:w-1/2 relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={`border-b border-bg_card2 bg-transparent pb-4 pr-10 focus:border-primary focus:placeholder:text-font_main focus-visible:outline-none ${errors.password ? "border-red-500" : ""}`}
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-3 cursor-pointer text-gray-500"
                >
                  {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>

              <div className="flex flex-col w-full lg:w-1/2 relative">
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className={`border-b border-bg_card2 bg-transparent pb-4 pr-10 focus:border-primary focus:placeholder:text-font_main focus-visible:outline-none ${errors.confirmPassword ? "border-red-500" : ""}`}
                />
                <div
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-3 cursor-pointer text-gray-500"
                >
                  {showConfirmPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {showVerifyEmail ? (
              <div className="flex flex-row gap-8 w-full relative">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  type="text"
                  placeholder="Verification Code"
                  className={`border-b border-bg_card2 bg-transparent pb-4 pr-10 focus:border-primary focus:placeholder:text-font_main focus-visible:outline-none`} />
                <button
                  title="Verify"
                  type="button"
                  className="inline-flex items-center gap-3 rounded-full bg-bg_card2 px-6 py-3 font-medium text-font_main duration-300 ease-in-out hover:border-primary hover:text-primary"
                  onClick={() => onVerifyEmail(code)}
                >
                  Verify
                  <ArrowRight size={24} />
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap w-full items-center justify-center">
                <button
                  title="Create Account"
                  type="submit"
                  className="inline-flex items-center gap-3 rounded-full bg-bg_card2 px-6 py-3 font-medium text-font_main duration-300 ease-in-out hover:border-primary hover:text-primary"
                >
                  Create Account
                  <ArrowRight size={24} />
                </button>
              </div>
            )}

            <div className="mt-12 border-t border-bg_card2 py-5 text-center">
              <p className="text-font_light text-base">
                Already have an account?{" "}
                <Link href='/login' className="text-primary">
                  login
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Register;
