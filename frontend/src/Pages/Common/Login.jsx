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
    <div className="min-h-screen flex font-sans text-gray-900">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-7/12 relative overflow-hidden bg-gray-900">
        <img
          src={gmritImage}
          alt="GMRIT Campus"
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-blue-900/85 to-purple-900/80 backdrop-blur-sm"></div>

        {/* Decorative Circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white h-full">
          <div className="mb-12">
            <h1 className="text-5xl font-extrabold mb-6 tracking-tight leading-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-100">WEBSAGA</span>
            </h1>
            <p className="text-xl text-blue-100/90 font-light max-w-lg leading-relaxed">
              The Next-Gen Academic ERP System for GMR Institute of Technology. Streamlining education through innovation.
            </p>
          </div>

          <div className="space-y-6 max-w-lg">
            {[
              { title: "Automated Question Paper Generation", desc: "Intelligent selection based on Bloom's taxonomy" },
              { title: "Comprehensive Course Management", desc: "Manage programs, branches, and regulations seamlessly" },
              { title: "Secure Cloud Database", desc: "Powered by enterprise-grade Supabase PostgreSQL" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-1">
                <div className="mr-4 mt-1 bg-blue-500/20 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white">{item.title}</h3>
                  <p className="text-sm text-blue-200/80 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-sm text-blue-300/60 font-medium">
            Trusted by over 5000+ students and faculty members.
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-gray-50 relative">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-gray-100 relative z-10">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-block p-3 rounded-full bg-indigo-50 mb-4">
              <img
                src={gmritLogo}
                alt="GMRIT Logo"
                className="h-12 w-12 object-contain"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Sign In</h2>
            <p className="mt-2 text-sm text-gray-500">Access your admin or faculty dashboard</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                  Email Address or ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="text"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200 outline-none sm:text-sm"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200 outline-none sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer select-none">
                  Remember me
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            © 2026 GMR Institute of Technology. All rights reserved.
          </p>
        </div>

        {/* Background Pattern for Right Side */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default Login;
