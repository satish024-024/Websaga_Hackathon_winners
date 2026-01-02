import React, { useState } from "react";
import { BASE_URL } from "../../constants/baseUrl";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { addUserDetails } from "../../features/UserSlice";
import gmritLogo from "../../assets/gmrit_logo.jpeg";
import gmritImage from "../../assets/gmrit.jpeg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: email,
        password: password,
      });

      const { token, user } = response.data;
      Cookies.set("token", token);
      dispatch(addUserDetails({ token: token, user: user })); // user object should be { ...data, role: ... }

      toast.success("Login successful!");

      // DEBUG: Check what we received
      console.log('Login Response - User Object:', user);
      console.log('Login Response - User Role:', user.role);

      // Redirect based on Role
      // Backend returns role in 'user.role'
      if (user.role === 'admin') {
        console.log('Redirecting to Admin Panel');
        navigate("/admin/adminPanel");
      } else if (user.role === 'faculty') {
        console.log('Redirecting to Faculty Dashboard');
        navigate("/faculty/dashboard");
      } else if (user.role === 'student') {
        console.log('Redirecting to Student Page');
        navigate(`/student/${user.user_id || user.id}/details`);
      } else {
        // Default fallback
        console.log('Unknown role, redirecting to unauthorized');
        navigate("/unauthorized");
      }

    } catch (err) {
      console.error("Login error:", err.response ? err.response.data : err);
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900">
        <img
          src={gmritImage}
          alt="GMRIT Campus"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 to-blue-900/90"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to WEBSAGA
          </h1>
          <p className="text-lg text-gray-200 mb-8">
            Academic ERP System for GMR Institute of Technology
          </p>
          <div className="space-y-4">
            <div className="flex items-start">
              <svg className="w-6 h-6 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="font-semibold">Automated Question Paper Generation</h3>
                <p className="text-sm text-gray-300">Intelligent selection based on Bloom's taxonomy</p>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="w-6 h-6 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="font-semibold">Comprehensive Course Management</h3>
                <p className="text-sm text-gray-300">Manage programs, branches, and regulations</p>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="w-6 h-6 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="font-semibold">Secure Cloud Database</h3>
                <p className="text-sm text-gray-300">Powered by Supabase PostgreSQL</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <img
              src={gmritLogo}
              alt="GMRIT Logo"
              className="h-16 w-16 mb-4"
            />
            <h2 className="text-center text-3xl font-bold text-gray-900">
              Sign in to WEBSAGA
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              GMR Institute of Technology
            </p>
          </div>

          {/* Login Form */}
          <div className="mt-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address or ID
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="text"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your email or ID"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Demo Credentials</span>
                </div>
              </div>
              <div className="mt-6 bg-gray-50 rounded-md p-4">
                <p className="text-xs text-gray-600 mb-2">For testing purposes:</p>
                <p className="text-sm font-mono text-gray-800">
                  Email: <span className="font-semibold">admin@websaga.com</span>
                </p>
                <p className="text-sm font-mono text-gray-800">
                  Password: <span className="font-semibold">admin123</span>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-gray-500">
            © 2026 GMR Institute of Technology. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
