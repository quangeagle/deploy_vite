import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDownIcon,
  UserIcon,
  CubeIcon,
  ClipboardCheckIcon,
  OfficeBuildingIcon,
  TagIcon,
  CollectionIcon,
  ChartBarIcon,
  HomeIcon,
} from "@heroicons/react/solid";
import {} from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    axios
      .get("http://localhost:5000/api/auth/logout", { withCredentials: true })
      .then((response) => {
        console.log(response.data);
        navigate("/");
      })
      .catch((err) => console.log("Lỗi đăng xuất:", err));
  };

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProductMenu, setShowProductMenu] = useState(false);
  const [showOrderMenu, setShowOrderMenu] = useState(false);
  const [showNCCMenu, setShowNCCMenu] = useState(false);
  const [showDiscount, setDiscount] = useState(false);
  const [showCategory, setCategory] = useState(false);
  const [showKho, setKho] = useState(false);

  return (
    <nav className="w-64 bg-[#ffd040] text-white p-6">
      <h2 className="text-lg font-semibold mb-4">Menu Admin</h2>
      <ul>
        <li className="mb-2">
          <Link
            to="/dashboard"
            className="flex items-center hover:text-gray-300"
          >
            <ChartBarIcon className="w-5 h-5 mr-2" />
            Dashboard
          </Link>
        </li>
        <li className="mb-2">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center hover:text-gray-300 w-full text-left"
          >
            <UserIcon className="w-5 h-5 mr-2" />
            Quản lý người dùng
            <ChevronDownIcon
              className={`w-5 h-5 ml-auto transition-transform ${
                showUserMenu ? "rotate-180" : ""
              }`}
            />
          </button>
          {showUserMenu && (
            <ul className="ml-4 mt-2">
              <li className="mb-1">
                <Link to="/ListUser" className="hover:text-gray-300">
                  Danh sách người dùng
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li className="mb-2">
          <button
            onClick={() => setShowProductMenu(!showProductMenu)}
            className="flex items-center hover:text-gray-300 w-full text-left"
          >
            <CubeIcon className="w-5 h-5 mr-2" />
            Quản lý sản phẩm
            <ChevronDownIcon
              className={`w-5 h-5 ml-auto transition-transform ${
                showProductMenu ? "rotate-180" : ""
              }`}
            />
          </button>
          {showProductMenu && (
            <ul className="ml-4 mt-2">
              <li className="mb-1">
                <Link to="/AddProduct" className="hover:text-gray-300">
                  Thêm sản phẩm
                </Link>
              </li>
              <li className="mb-1">
                <Link to="/ListProduct" className="hover:text-gray-300">
                  Danh sách sản phẩm
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li className="mb-2">
          <button
            onClick={() => setShowOrderMenu(!showOrderMenu)}
            className="flex items-center hover:text-gray-300 w-full text-left"
          >
            <ClipboardCheckIcon className="w-5 h-5 mr-2" />
            Quản lý đơn hàng
            <ChevronDownIcon
              className={`w-5 h-5 ml-auto transition-transform ${
                showOrderMenu ? "rotate-180" : ""
              }`}
            />
          </button>
          {showOrderMenu && (
            <ul className="ml-4 mt-2">
              <li className="mb-1">
                <Link to="/ListOrder" className="hover:text-gray-300">
                  Danh sách đơn hàng
                </Link>
              </li>
              <li className="mb-1">
                <Link to="/ViewOrder" className="hover:text-gray-300">
                  Tra cứu đơn hàng
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li className="mb-2">
          <button
            onClick={() => setShowNCCMenu(!showNCCMenu)}
            className="flex items-center hover:text-gray-300 w-full text-left"
          >
            <OfficeBuildingIcon className="w-5 h-5 mr-2" />
            Quản lý nhà cung cấp
            <ChevronDownIcon
              className={`w-5 h-5 ml-auto transition-transform ${
                showNCCMenu ? "rotate-180" : ""
              }`}
            />
          </button>
          {showNCCMenu && (
            <ul className="ml-4 mt-2">
              <li className="mb-1">
                <Link to="/AddNCC" className="hover:text-gray-300">
                  Thêm nhà cung cấp
                </Link>
              </li>
              <li className="mb-1">
                <Link to="/ListNCC" className="hover:text-gray-300">
                  Danh sách nhà cung cấp
                </Link>
              </li>
            </ul>
          )}
           {showNCCMenu && (
            <ul className="ml-4 mt-2">
              
              <li className="mb-1">
                <Link to="/admin" className="hover:text-gray-300">
                Chat real time
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li className="mb-2">
          <button
            onClick={() => setDiscount(!showDiscount)}
            className="flex items-center hover:text-gray-300 w-full text-left"
          >
            <TagIcon className="w-5 h-5 mr-2" />
            Quản lý khuyến mãi
            <ChevronDownIcon
              className={`w-5 h-5 ml-auto transition-transform ${
                showDiscount ? "rotate-180" : ""
              }`}
            />
          </button>
          {showDiscount && (
            <ul className="ml-4 mt-2">
              <li className="mb-1">
                <Link to="/KhuyenMai" className="hover:text-gray-300">
                  Thêm khuyến mãi
                </Link>
              </li>
              <li className="mb-1">
                <Link to="/ListDiscount" className="hover:text-gray-300">
                  Danh sách khuyến mãi
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li className="mb-2">
          <button
            onClick={() => setCategory(!showCategory)}
            className="flex items-center hover:text-gray-300 w-full text-left"
          >
            <CollectionIcon className="w-5 h-5 mr-2" />
            Quản lý danh mục
            <ChevronDownIcon
              className={`w-5 h-5 ml-auto transition-transform ${
                showCategory ? "rotate-180" : ""
              }`}
            />
          </button>
          {showCategory && (
            <ul className="ml-4 mt-2">
              <li className="mb-1">
                <Link to="/AddCategory" className="hover:text-gray-300">
                  Thêm danh mục
                </Link>
              </li>
              <li className="mb-1">
                <Link to="/ListCategory" className="hover:text-gray-300">
                  Danh sách danh mục
                </Link>
              </li>
            </ul>
          )}
        </li>
        

        <li className="mb-2">
          <button
            onClick={() => setKho(!showKho)}
            className="flex items-center hover:text-gray-300 w-full text-left"
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            Quản lý kho
            <ChevronDownIcon
              className={`w-5 h-5 ml-auto transition-transform ${
                showKho ? "rotate-180" : ""
              }`}
            />
          </button>
          {showKho && (
            <ul className="ml-4 mt-2">
              <li className="mb-1">
                <Link to="/Kho" className="hover:text-gray-300">
                  Kho
                </Link>
              </li>
            </ul>
            
          )}

          <div className="mt-12 flex justify-center">
            <button
              onClick={handleLogout} // Logout function
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition duration-200 ease-in-out"
            >
              <FontAwesomeIcon className="text-xl" icon={faSignOutAlt} />{" "}
              {/* Logout icon */}
              <span className="text-lg">ĐĂNG XUẤT</span>
            </button>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
