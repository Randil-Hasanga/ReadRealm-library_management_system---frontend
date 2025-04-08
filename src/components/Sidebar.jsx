import { ChevronFirst, ChevronLast, MoreVertical, Home, DollarSign, BookAIcon, User, BookMinus } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/ReadRealm.jpg";
import logoIcon from "../assets/icon.jpg"; // Fixed the file extension here

const menuItems = [
  { label: "Dashboard", icon: Home, path: "/" },
  { label: "Books", icon: BookAIcon, path: "/books" },
  { label: "Borrowed Books", icon: BookMinus, path: "/borrowed-books" },
  { label: "Fines", icon: DollarSign, path: "/fines" },
];

const Sidebar = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(true);

  return (
    <aside
      className={`relative h-screen transition-all bg-white shadow-sm border-r ${expanded ? "w-64" : "w-20"}`}
    >
      <nav className="h-full flex flex-col justify-between">
        {/* Header Section */}
        <div className="p-4 pb-2 flex justify-center">
          <img
            src={expanded ? logo : logoIcon}
            className={`overflow-hidden transition-all ${expanded ? "w-40" : "w-8 h-7"}`} // Adjust size
            alt="Logo"
          />
        </div>

        {/* Navigation Links */}
        <div className="flex-grow p-4 mt-5">
          <ul className="flex flex-col gap-2">
            {menuItems.map(({ label, icon: Icon, path }, index) => (
              <li
                key={index}
                className={`relative flex items-center py-2 px-3 rounded-md cursor-pointer transition-colors group ${
                  location.pathname === path
                    ? "bg-gradient-to-tr from-orange-200 to-orange-100 text-orange-800"
                    : "hover:bg-orange-100 text-gray-600"
                }`}
              >
                <Link to={path} className="flex items-center w-full">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <Icon size={24} /> {/* Fixed icon size */}
                  </div>
                  {expanded && <span className="ml-3 font-medium">{label}</span>}
                </Link>

                {!expanded && (
                  <div
                    className={`absolute left-full rounded-md px-2 py-1 ml-6
                      bg-orange-100 text-orange-800 text-md font-semibold
                      invisible opacity-20 -translate-x-3 transition-all
                      group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
                  >
                    {label}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Section */}
        <div className="border-t flex p-3 items-center">
          <img
            src="https://ui-avatars.com/api/?name=Randil+Hasanga"
            alt="User Avatar"
            className="rounded-2xl w-10 h-10 ml-2"
          />
          {expanded && (
            <div className="flex justify-between items-center overflow-hidden transition-all w-52 ml-3">
              <div className="leading-4">
                <h4 className="font-semibold">Randil Hasanga</h4>
                <span className="text-xs text-gray-600">randilhasanga@gmail.com</span>
              </div>
              <MoreVertical size={20} />
            </div>
          )}
        </div>
      </nav>

      {/* Expand Button */}
      <button
        onClick={() => setExpanded((current) => !current)}
        className="absolute right-[-25px] top-1/2 transform -translate-y-1/2 bg-orange-50 hover:bg-orange-200 p-3 rounded-full shadow-lg border transition-transform hover:scale-110"
      >
        {expanded ? <ChevronFirst size={24} /> : <ChevronLast size={24} />}
      </button>
    </aside>
  );
};

export default Sidebar;
