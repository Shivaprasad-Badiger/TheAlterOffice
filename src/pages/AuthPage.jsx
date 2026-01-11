import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import useAuthStore from "../store/authStore";
import LoadingSpinner from "../components/LoadingSpinner";
import image1 from "../assets/branding/dc597494c40bb0fd0e168494b84b1b2b.png";
import image2 from "../assets/branding/c862f1ea8a586d737528dccfd2363004.png";
import image3 from "../assets/branding/0c89da65a004e4f412a86eb5cde33adb.png";
import image4 from "../assets/branding/5beb7e681006f103fc15c10cf78c95a6.png";
import image5 from "../assets/branding/66c9da0774bf0b45b020839469eb9db2.png";
import image6 from "../assets/branding/226326267c072588ee5d44a348cf48de.png";
import image7 from "../assets/branding/cbee766eb05d851754d1499048b6e390.png";
import image8 from "../assets/branding/8b0532ff490cf1da3f105bff7ab9f284.png";
import image9 from "../assets/branding/49a959926bc560b46056df7c41a10eca.png";
import logo from "../assets/branding/e5883ae0261c0b95b3d799ea23271ef18084f911.png";
import Google from "../assets/branding/Google.png";

const AuthPage = () => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    username: "",
  });

  const { signIn, signUp, signInWithGoogle } = useAuthStore();

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          console.error('Sign in error:', error.message);
        }
      } else {
        const { error } = await signUp(formData.email, formData.password, {
          full_name: formData.fullName,
          username: formData.username,
        });
        if (error) {
          console.error('Sign up error:', error.message);
        } else {
          console.log("Account created! Please check your email to verify.");
        }
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        console.error('Google sign in error:', error.message);
        setGoogleLoading(false);
      }
      // Don't set loading to false on success - user will be redirected
    } catch (error) {
      console.error("Failed to sign in with Google:", error);
      setGoogleLoading(false);
    }
  };

  // Background images matching the design
  const backgroundImages = [
    image1,
    image4,
    image7,
    image2,
    image5,
    image8,
    image3,
    image6,
    image9,
  ];

  const BackgroundGrid = () => (
    <div className="absolute inset-0 overflow-hidden">
      <div className="grid grid-cols-3 gap-1 h-full">
        {/* Column 1 */}
        <div className="flex flex-col gap-1 h-full">
          <div className="overflow-hidden flex-1">
            <img
              src={backgroundImages[0]}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden flex-1">
            <img
              src={backgroundImages[1]}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden flex-1">
            <img
              src={backgroundImages[2]}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-1 h-full -mt-12 md:-mt-20">
          <div className="overflow-hidden flex-1">
            <img
              src={backgroundImages[3]}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden flex-1">
            <img
              src={backgroundImages[4]}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden flex-1">
            <img
              src={backgroundImages[5]}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-1 h-full">
          <div className="overflow-hidden flex-1">
            <img
              src={backgroundImages[6]}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden flex-1">
            <img
              src={backgroundImages[7]}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden flex-1">
            <img
              src={backgroundImages[8]}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (showEmailForm) {
    return (
      <div className="h-screen bg-white relative overflow-hidden flex flex-col">
        <BackgroundGrid />

        {/* Form Container */}
        <div className="relative z-10 w-full h-full flex flex-col justify-end">
          <div className="bg-white rounded-t-[63px] shadow-2xl border border-gray-100 flex-shrink-0">
            {/* Header */}
            <div className="flex items-center justify-between p-4 pt-6">
              <button
                onClick={() => setShowEmailForm(false)}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                ← Back
              </button>
              <h2
                className="text-xl font-semibold"
                style={{ fontFamily: "Karla" }}
              >
                {isLogin ? "Sign In" : "Sign Up"}
              </h2>
              <div className="w-16"></div>
            </div>

            {/* Form */}
            <div className="px-6 py-4 pb-8">
              <form onSubmit={handleSubmit} className="space-y-3">
                {!isLogin && (
                  <>
                    <div>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Full Name"
                        required
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Username"
                        required
                      />
                    </div>
                  </>
                )}

                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Email"
                    required
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-[26px] transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : isLogin ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              {/* Toggle */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Sign in"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white relative overflow-hidden flex flex-col">
      <BackgroundGrid />

      {/* White overlay gradient from bottom */}
      <div className="relative z-10 w-full h-full flex flex-col justify-end">
        <div className="bg-white rounded-t-[63px] shadow-2xl border border-gray-100 flex-shrink-0">
          <div className="text-center p-8 w-full">
            <h1 className="mb-3 flex items-center justify-center gap-1">
              <img src={logo} alt="Logo" className="w-[46px] h-[34px]" />
              <span
                className="text-[28px] font-semibold text-gray-900 leading-[100%]"
                style={{ fontFamily: "Karla" }}
              >
                Vibesnap
              </span>
            </h1>
            <p
              className="text-black text-[16px] font-normal"
              style={{ fontFamily: "Kumbh Sans" }}
            >
              Moments That Matter, Shared Forever.
            </p>
          </div>

          <div className="w-full flex flex-col items-center space-y-4 mb-8 px-10">
            <button
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full max-w-[280px] h-[50px] bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-[26px] flex items-center justify-center space-x-3 transition-colors shadow-lg text-base disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <img src={Google} alt="Google Logo" />
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            <div className="flex items-center w-full max-w-[280px] my-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <button
              onClick={() => setShowEmailForm(true)}
              className="w-full max-w-[280px] h-[50px] bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-[26px] border-2 border-gray-900 transition-colors text-base"
            >
              Sign Up with Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
