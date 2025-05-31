import { useState } from "react"; // Changed from preact/hooks
import { NavLink } from 'react-router-dom'; // Use NavLink

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const activeStyle = "text-indigo-400 border-b-2 border-indigo-400"; // Adjusted active style for current design
  const inactiveStyle = "hover:text-indigo-400";

  const navItems = [
    { to: "/", text: "Running" },
    { to: "/cycling", text: "Cycling" },
    { to: "/swimming", text: "Swimming" },
    { to: "/activities", text: "All Activities" },
  ];

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-6 py-3 md:flex md:justify-between md:items-center">
        <div className="flex items-center justify-between">
          <div>
            {/* Brand link can also be a NavLink if it should highlight when on home */}
            <NavLink to="/" className="text-xl font-bold hover:text-gray-300">
              Strava Stats
            </NavLink>
          </div>
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="hover:text-gray-300 focus:outline-none focus:text-gray-300"
              aria-label="toggle menu"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                {isOpen ? (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu open: "block", Menu closed: "hidden" */}
        <div
          className={`w-full md:flex md:items-center md:justify-end ${isOpen ? "block" : "hidden"}`} // Toggle based on isOpen
        >
          <div className="flex flex-col md:flex-row md:ml-6">
            {navItems.map((item) => (
              <NavLink
                key={item.text}
                to={item.to}
                className={({ isActive }) => 
                  `my-2 text-sm md:my-0 md:mx-4 ${isActive ? activeStyle : inactiveStyle}`
                }
                onClick={() => setIsOpen(false)} // Close mobile menu on click
              >
                {item.text}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
