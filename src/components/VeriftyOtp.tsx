"use client";
import axios from "axios";
import { ArrowRight, ChevronLeft, Loader2, Lock, Mail } from "lucide-react";
import { redirect, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { useAppData, user_service } from "@/context/AppContext";
import Loading from "./Loading";
import toast from "react-hot-toast/headless";

const VeriftyOtp = () => {
  const {isAuth,setIsAuth,setUser, loading: userLoading, fetchChats,fetchUsers} = useAppData();
  const [loading, setLoading] = React.useState<boolean>(false);

  const searchParams = useSearchParams();
  const email: string = searchParams.get("email") || "";

  const [otp, setOtp] = React.useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = React.useState<string>("");
  const [resendLoading, setResendLoading] = React.useState<boolean>(false);
  const [timer, setTimer] = React.useState<number>(60);
  const inputrefs = React.useRef<Array<HTMLInputElement | null>>([]);
  const router = useRouter();

  const handleSubmit = async (
    e: React.FormEvent<HTMLElement>,
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter a valid OTP");
      setLoading(false);
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(`${user_service}/api/v1/user/verify`, {
        email,
        enteredOtp: otpValue,
      });
      // console.log(data);
      toast.success(data.message);
      Cookies.set("token", data.token, {
        expires: 15,
        secure: false, // this is alway true but we have to host on aws so we have to set it to false the aws give the http url not the https
        path: "/",
      });
      setOtp(["", "", "", "", "", ""]);
      inputrefs.current[0]?.focus();
      setUser(data.user);
      setIsAuth(true);
      setLoading(false);
      fetchChats();
      fetchUsers();
      // router.push("/dashboard");
    } catch (error: any) {
      console.log(error);
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!email) {
      router.push("/login");
    }
    if (timer > 0) {
      const timerId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [timer]);

  const handleInputChange = (index: number, value: string): void => {
    if (value.length > 1) {
      return;
    }
    if (value === "") {
      inputrefs.current[index]?.focus();
    } else {
      inputrefs.current[index + 1]?.focus();
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");
    if (value && index < 6) {
      inputrefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputrefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    const digit = pastedData.filter((char) => /\d/.test(char));
    if (digit.length === 6) {
      const newOtp = [...otp];
      digit.forEach((char, index) => {
        if (index < 6) {
          newOtp[index] = char;
        }
      });
      setOtp(newOtp);
      setError("");
      if (digit.length < 6) {
        inputrefs.current[digit.length]?.focus();
      }
    }
  };

  const handleResendOtp = async (): Promise<void> => {
    setResendLoading(true);
    setError("");
    try {
      const { data } = await axios.post(`${user_service}/api/v1/user/login`, {
        email,
      });
      // console.log(data);
      toast.success(data.message);
      setTimer(60);
    } catch (error: any) {
      console.log(error);
      setError(error.response.data.message);
    } finally {
      setResendLoading(false);
    }
  };
  if(userLoading) return <Loading />;
  if(isAuth) redirect("/chat");

  return (
    <div>
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-gray-700 p-8 rounded-lg shadow-md">
            <div className="text-center mb-8 relative">
              <button
                className="absolute top-0 left-0 p-2 text-gray-200 hover:text-white"
                onClick={() => router.back()}
              >
                <ChevronLeft size={20} color="white" />
              </button>
              <div className="mx-auto w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <Lock size={40} color="white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-3">
                Verify Your Email
              </h1>
              <p className="text-gray-300 text-lg">
                Enter your OTP to continue your journey OTP is sended to your
                email address
              </p>
              <p className="text-gray-300 text-lg">{email}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-4 text-center"
                >
                  Enter OTP Here
                </label>
                <div className="flex justify-between">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      ref={(el) => {
                        inputrefs.current[index] = el;
                      }}
                      className="w-12 h-12 text-center text-2xl font-bold text-white bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ))}
                </div>
                {error && (
                  <p className="text-red-500 text-center mt-2">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white  py-4 px-6 rounded-lg transition-colors font-semibold disabled:opacity-50   disabled:cursor-not-allowed mt-2"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span> Verify Code</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </button>
              </div>
            </form>
            <div className="mt-6 text-center">
              <p className="text-gray-300 text-sm mb-4">
                Didn't receive a code?
              </p>
              {timer > 0 ? (
                <p className="text-gray-300 text-sm">
                  Resend Code in {timer} seconds
                </p>
              ) : (
                <button onClick={handleResendOtp}
                  className="text-blue-600 hover:text-blue-700"
                  disabled={resendLoading}
                >
                  {resendLoading ? "Resending..." : "Resend Code"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VeriftyOtp;
