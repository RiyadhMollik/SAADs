import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
function Login() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);

  const API_URL = "https://iinms.brri.gov.bd/api/users/login";

  // Get user location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to get your location');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser');
    }
  };

  // Get location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

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
          userLat: userLocation?.lat,
          userLng: userLocation?.lng,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.error || "Login failed. Please try again.");
      }
      // Store user ID in localStorage
      localStorage.setItem("userId", data.user.id);
      toast.success("Login successful!");
      
           // Check if user is Agromet Scientist and has active meetings
      if (data.isAgrometScientist && data.activeMeetings && data.activeMeetings.length > 0) {
        const meetingMessages = data.activeMeetings.map(meeting => 
          `${meeting.title}: ${meeting.message}`
        ).join('\n');
        
        const shouldProceed = window.confirm(
          `Welcome! You have active meetings:\n\n${meetingMessages}\n\nWould you like to proceed to the attendance page?`
        );
        
        if (shouldProceed) {
          window.location.href = '/attendance';
        } else {
          window.location.href = '/';
        }
      } else {
        // Redirect to the home page
        window.location.href = '/';
      }
      if (data.isAgrometScientist) {
        let message = "Welcome! ";
        
        // Check for auto-marked meetings
        if (data.autoMarkedMeetings && data.autoMarkedMeetings.length > 0) {
          const autoMarkedMessages = data.autoMarkedMeetings.map(meeting => 
            `✅ ${meeting.title}: ${meeting.message}`
          ).join('\n');
          message += `\n\n🎉 Attendance automatically marked for:\n${autoMarkedMessages}`;
        }
        
        // Check for other meetings (too far, etc.)
        if (data.otherMeetings && data.otherMeetings.length > 0) {
          const otherMessages = data.otherMeetings.map(meeting => 
            `ℹ️ ${meeting.title}: ${meeting.message}`
          ).join('\n');
          message += `\n\n📋 Other meetings:\n${otherMessages}`;
        }
        
        if (data.autoMarkedMeetings?.length > 0 || data.otherMeetings?.length > 0) {
          const shouldProceed = window.confirm(
            `${message}\n\nWould you like to proceed to the attendance page?`
          );
          
          if (shouldProceed) {
            window.location.href = '/attendance';
          } else {
            window.location.href = '/';
          }
        } else {
          // No active meetings
          window.location.href = '/';
        }
      } else {
        // Redirect to the home page
        window.location.href = '/';
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/pexels-elina-sazonova-1838552.jpg')", // Your background image URL
      }}
    >
      {/* Black overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div> {/* This is the black layer */}

      <div className="bg-white p-8 rounded-lg shadow-lg w-96 opacity-90 z-10 relative"> {/* Add `relative` and `z-10` for layering */}
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
              className={`bg-[#1F4E3B] w-full text-white px-4 py-2 rounded-lg font-bold hover:bg-[#17432E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F4E3B] ${isLoading ? "opacity-50 cursor-not-allowed" : ""
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
