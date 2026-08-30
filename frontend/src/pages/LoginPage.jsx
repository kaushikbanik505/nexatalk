import { useState } from "react";
import { ArrowRightIcon, EyeIcon, EyeOffIcon, ShipWheelIcon } from "lucide-react";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";
import StarryBackground from "../components/StarryBackground";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-base-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <StarryBackground />

      <Link
        to="/"
        className="absolute top-6 left-6 z-10 flex items-center gap-2 text-sm text-base-content/70 hover:text-primary transition-colors"
      >
        <ShipWheelIcon className="size-5" />
        <span className="font-mono font-bold tracking-wider">NexaTalk</span>
      </Link>

      <div className="relative z-10 border border-primary/20 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
        {/* LOGIN FORM SECTION */}
        <div className="w-full lg:w-1/2 p-8 sm:p-10 flex flex-col justify-center">
          {/* ERROR MESSAGE DISPLAY */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response?.data?.message || "Something went wrong. Please try again."}</span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome back</h2>
                  <p className="text-sm text-base-content/60 mt-2">
                    Sign in to continue your language journey
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="form-control w-full space-y-2">
                    <label className="label">
                      <span className="label-text font-medium">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="hello@example.com"
                      className="input input-bordered w-full focus:input-primary"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-control w-full space-y-2">
                    <label className="label">
                      <span className="label-text font-medium">Password</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="input input-bordered w-full pr-10 focus:input-primary"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="size-5" />
                        ) : (
                          <EyeIcon className="size-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full gap-2 mt-2"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRightIcon className="size-4" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-sm text-base-content/60">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-primary font-medium hover:underline">
                      Create one
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* BRAND SECTION */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-primary/15 via-base-200 to-secondary/10 items-center justify-center p-10 border-l border-primary/10">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-8">
              <ShipWheelIcon className="size-8 text-primary" />
              <span className="font-mono text-2xl font-bold tracking-wider">NexaTalk</span>
            </div>

            <h3 className="text-2xl font-bold tracking-tight leading-snug">
              Real conversations with real people, worldwide.
            </h3>
            <p className="mt-4 text-base-content/70">
              Chat and video call with language partners matched to your goals — practice never
              felt this natural.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
