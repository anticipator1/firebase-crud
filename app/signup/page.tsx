"use client";
import { LoginUser } from "@/utils";
import React, { FormEventHandler, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { SignUpUser } from "@/utils";

interface FormInput {
  email: string;
  password: string;
  fullName: string;
}

export default function page() {
  //router
  const router = useRouter();

  //react hook form

  // Hide and Show password with eye button
  const [showPassword, setShowPassword] = useState(false);
  const { register, getValues, handleSubmit, reset } = useForm<FormInput>();

  const onSubmit: SubmitHandler<FormInput> = (formData) => {
    const { email, password, fullName } = formData;
    SignUpUser(email, password, router);
  };

  return (
    <section>
      <h1 className="text-3xl text-center mt-6 font-bold">Sign Up</h1>
      <form
        className="px-6 py-12 max-w-4xl mx-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          type="text"
          placeholder="Full name"
          className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"
          {...register("fullName", {
            required: "Please enter your full name!",
            maxLength: 20,
          })}
        />

        <input
          type="email"
          placeholder="Email address"
          className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Please enter a valid email!",
            },
          })}
        />

        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"
            {...register("password", {
              required: "Please enter a password",
              minLength: {
                value: 8,
                message: "Password must be at least 6 characters",
              },
            })}
          />

          {showPassword ? (
            <AiFillEyeInvisible
              className="absolute right-3 top-3 text-xl cursor-pointer"
              onClick={() => setShowPassword((prevState) => !prevState)}
            />
          ) : (
            <AiFillEye
              className="absolute right-3 top-3 text-xl cursor-pointer"
              onClick={() => setShowPassword((prevState) => !prevState)}
            />
          )}
        </div>

        <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">
          <p className="mb-6">
            Have an account?
            <Link
              href="/"
              className="text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1"
            >
              Sign in
            </Link>
          </p>
        </div>
        <button
          className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800"
          type="submit"
        >
          Sign up
        </button>
      </form>
    </section>
  );
}
