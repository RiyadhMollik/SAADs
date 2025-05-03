import { useState } from "react";

function Login() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = "https://iinms.brri.gov.bd/api/users/login";

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobileNumber,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed. Please try again.");
      }

      // Store user ID in localStorage
      localStorage.setItem("userId", data.user.id);
     
      // Redirect to the home page
      window.location.href = '/' 
      alert("Login successful!");
    } catch (error) {
      alert(" Login failed. Please try again.");
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[#1F4E3B]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#1F4E3B]">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="mobileNumber"
            >
              Mobile Number
            </label>
            <input
              type="text"
              id="mobileNumber"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Enter your mobile number"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4E3B] focus:border-transparent"
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4E3B] focus:border-transparent"
              required
            />
          </div>
          {error && (
            <div className="mb-4 text-center text-red-500 font-semibold">{error}</div>
          )}
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className={`bg-[#1F4E3B] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#17432E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F4E3B] ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
