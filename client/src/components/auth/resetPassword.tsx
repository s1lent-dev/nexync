"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPassword } from "@/hooks/auth";
import { ArrowRight, Eye, EyeClosed } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/context/toast/toast";

const schema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password is required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const ResetPassword = () => {
    
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { showSuccessToast, showErrorToast } = useToast();
    const { resetPassword } = useResetPassword();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        }
    });

    const onSubmit = async (values: z.infer<typeof schema>) => {
        try {
            if(!token) {
                showErrorToast("Invalid token");
                return;
            }
            const res = await resetPassword(values.password, token);
            console.log(res);
            if (res?.statusCode === 200) {
                showSuccessToast("Password reset successful");
                router.push('/login');
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
                        Reset Password
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <div className="mb-8 flex flex-col gap-12 items-center">
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

                        <div className="flex flex-wrap w-full items-center justify-center">
                            <button
                                title="Login"
                                type="submit"
                                className="inline-flex items-center gap-3 rounded-full bg-bg_card2 px-6 py-3 font-medium text-font_main duration-300 ease-in-out hover:border-primary hover:text-primary"
                            >
                                Reset Password
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

export default ResetPassword;
