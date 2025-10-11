import { useState, useRef, useEffect } from "react";
import axios from "axios";

const Header = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userPicture, setUserPicture] = useState(localStorage.getItem("picture"));

  const headerRef = useRef(null);
  const searchInputRef = useRef(null);

  const isLoggedIn = !!localStorage.getItem("token");

  // Click outside to close search, mobile menu, and dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsSearchVisible(false);
        setIsMobileMenuOpen(false);
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-focus search input
  useEffect(() => {
    if (isSearchVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchVisible]);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update profile picture dynamically if it changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setUserPicture(localStorage.getItem("picture"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Handlers
  const handleSearchClick = (e) => {
    e.preventDefault();
    setIsSearchVisible(true);
  };
  const handleMuteClick = () => setIsMuted(!isMuted);
  const handleNotificationsClick = () => console.log("Notifications clicked!");

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post(
          "http://localhost:5000/auth/revoke",
          { token },
          { headers: { "Content-Type": "application/json" } }
        );
        console.log("Token revoked successfully from backend.");
      }
    } catch (err) {
      console.error("Failed to revoke token:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      localStorage.removeItem("picture");
      setUserPicture(null);
      window.location.reload();
    }
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`flex justify-center transition-all duration-300 z-50 ${
          isScrolled ? "fixed top-0 left-0 w-full" : "sticky top-4"
        }`}
      >
        <div
          className={`${
            isScrolled
              ? "w-full rounded-none px-6 md:px-20"
              : "w-[90%] md:w-[75%] lg:w-[85%] xl:w-[60%] rounded-full"
          } bg-white bg-opacity-90 backdrop-blur-lg border border-gray-200 shadow-md px-6 h-16 flex justify-between items-center transition-all duration-300`}
        >
          {/* Logo */}
          <div className="flex flex-row items-center gap-3">
            <img className="h-12 rounded-lg" src="PrepVio-logo.png" alt="LOGO" />
            <h1 className="font-bold text-2xl">Prepvio</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <div className="relative">
              {!isSearchVisible ? (
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900"
                  onClick={handleSearchClick}
                >
                  Search
                </a>
              ) : (
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  className={`px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ring-900 transition-all duration-300 ease-in-out ${
                    isScrolled ? "w-72" : "w-48"
                  }`}
                />
              )}
            </div>

            <a href="#" className="text-gray-600 hover:text-gray-900">
              About
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Explore
            </a>

            <button onClick={handleMuteClick} className="text-gray-600 hover:text-gray-900">
              {isMuted ? "Unmute" : "Mute"}
            </button>

            <button
              onClick={handleNotificationsClick}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405C17.653 14.894 17 13.985 17 12V9c0-3.313-2.687-6-6-6S5 
                  5.687 5 9v3c0 1.985-.653 2.894-1.595 3.595L2 17h5m5 
                  0v3a2 2 0 01-2 2H9a2 2 0 01-2-2v-3"
                />
              </svg>
            </button>

            {/* Conditional Login / Profile */}
            {isLoggedIn ? (
              <div className="relative">
                <img
                  src={userPicture || "https://i.pravatar.cc/40"}
                  alt="Profile"
                  className="h-10 w-10 rounded-full cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                />
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-2">
                    <a
                      href="/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <a href="/login" className="text-gray-600 hover:text-gray-900">
                  Login
                </a>
                <button className="bg-gray-900 text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800">
                  Get Started
                </button>
              </>
            )}
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden flex items-center justify-center text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-md px-6 py-4 space-y-4">
          <a href="#" className="block text-gray-600 hover:text-gray-900">
            About
          </a>
        
          <a href="#" className="block text-gray-600 hover:text-gray-900">
            Explore
          </a>
          <button onClick={handleMuteClick} className="block text-gray-600 hover:text-gray-900">
            {isMuted ? "Unmute" : "Mute"}
          </button>
          <button onClick={handleNotificationsClick} className="block text-gray-600 hover:text-gray-900">
            Notifications
          </button>

          {isLoggedIn ? (
            <div>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <img src={userPicture || "https://i.pravatar.cc/40"} alt="Profile" className="h-8 w-8 rounded-full" />
                Profile
              </button>
              {isDropdownOpen && (
                <div className="mt-2 bg-white border rounded-lg shadow-lg py-2">
                  <a
                    href="/dashboard"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <a href="/login" className="block text-gray-600 hover:text-gray-900">
                Login
              </a>
              <button className="w-full bg-gray-900 text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800">
                Get Started
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Header;
