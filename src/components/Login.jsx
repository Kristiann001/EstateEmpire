import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
        const response = await fetch('http://127.0.0.1:5000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        if (response.ok) {
          onLogin(email);
          navigate('/');
        } else {
          const data = await response.json();
          setErrorMessage(data.message || 'Login failed');
        }
      } catch (error) {
        setErrorMessage('Login failed: ' + error.message);
      }
    const accountType = "agent"; // This should be fetched from server response

    if (accountType === "agent") {
      navigate("/agent");
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-center">Log In</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full p-2 border rounded mt-1"
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            {...register("password")}
            className="w-full p-2 border rounded mt-1"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded mt-4"
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
