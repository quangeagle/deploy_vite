import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faChevronRight,
  faChevronDown,
  faCartShopping,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, useRef } from "react";

function Header() {
  const [state, setState] = useState({
    username: "",
    selectedLocation: "Phan Văn Tri",
    categories: [],
    products: [],
    filteredProducts: [],
    searchQuery: "",
    favorites: [],
    isDropdownOpen: {
      search: false,
      user: false,
      category: false,
      favorites: false,
      location: false,
    },
  });

  const navigate = useNavigate();
  const dropdownRefs = useRef({});

  const locations = ["Phan Văn Tri", "Sala", "Phan Huy Ich"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/categories"),
          axios.get("http://localhost:5000/api/products"),
        ]);

        setState((prev) => ({
          ...prev,
          categories: categoriesRes.data,
          products: productsRes.data,
          filteredProducts: productsRes.data,
        }));
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
      }
    };

    fetchData();

    const savedUsername = localStorage.getItem("username");
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const savedLocation =
      localStorage.getItem("selectedLocation") || "Phan Văn Tri";

    setState((prev) => ({
      ...prev,
      username: savedUsername || "",
      favorites: savedFavorites,
      selectedLocation: savedLocation,
    }));
  }, []);

  const toggleDropdown = (key) => {
    setState((prev) => ({
      ...prev,
      isDropdownOpen: {
        ...prev.isDropdownOpen,
        [key]: !prev.isDropdownOpen[key],
      },
    }));
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    const filtered = state.products.filter((product) =>
      product.product_name.toLowerCase().includes(query.toLowerCase())
    );

    setState((prev) => ({
      ...prev,
      searchQuery: query,
      filteredProducts: filtered,
      isDropdownOpen: { ...prev.isDropdownOpen, search: query.length > 0 },
    }));
  };

  const handleLocationChange = (location) => {
    setState((prev) => ({
      ...prev,
      selectedLocation: location,
      isDropdownOpen: { ...prev.isDropdownOpen, location: false },
    }));
    localStorage.setItem("selectedLocation", location);
  };

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/api/auth/logout", {
        withCredentials: true,
      });

      localStorage.removeItem("username");
      setState((prev) => ({ ...prev, username: "" }));
      navigate("/");
    } catch (err) {
      console.error("Lỗi đăng xuất:", err);
    }
  };

  const handleClickOutside = (e) => {
    if (
      Object.values(dropdownRefs.current).every(
        (ref) => ref && !ref.contains(e.target)
      )
    ) {
      setState((prev) => ({
        ...prev,
        isDropdownOpen: {
          search: false,
          user: false,
          category: false,
          favorites: false,
          location: false,
        },
      }));
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header>
      <div className="bg-amber-400 h-auto w-full hidden md:flex items-center justify-center px-10 py-4">
        {/* Logo */}
        <Link to="/home" className="flex items-center">
          <img src="/emart.png" alt="Emart" className="w-36 h-8" />
        </Link>

        {/* Dropdown danh mục */}
        <div
          className="relative ml-8"
          onMouseEnter={() =>
            setState((prev) => ({
              ...prev,
              isDropdownOpen: { ...prev.isDropdownOpen, category: true },
            }))
          }
          onMouseLeave={() =>
            setState((prev) => ({
              ...prev,
              isDropdownOpen: { ...prev.isDropdownOpen, category: false },
            }))
          }
        >
          <div className="flex items-center text-white cursor-pointer pr-4 pl-2 py-1 rounded-md hover:bg-amber-500">
            <FontAwesomeIcon icon={faBars} className="text-lg" />
            <p className="ml-2 text-base">Tất cả danh mục</p>
            <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-sm" />
          </div>
          {state.isDropdownOpen.category && (
            <div className="absolute bg-gray-100 shadow-md rounded-lg mt-2 w-80 z-50 transition-all duration-300 ease-in-out">
              {state.categories.map((category) => (
                <div
                  key={category._id}
                  className="flex items-center p-3 hover:bg-yellow-200 cursor-pointer rounded-md transition-all"
                  onClick={() => navigate(`/category/${category._id}`)}
                >
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="mr-2 text-gray-600"
                  />
                  <p className="text-lg font-medium text-gray-800">
                    {category.category_name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Thanh tìm kiếm */}
        <div className="relative flex items-center justify-center ml-8">
          <input
            ref={(ref) => (dropdownRefs.current.search = ref)}
            className="bg-white w-96 h-8 rounded-2xl pl-10"
            type="text"
            value={state.searchQuery}
            onChange={handleSearchChange}
            placeholder="Tìm sản phẩm mong muốn ..."
          />
          {state.isDropdownOpen.search && (
            <div className="absolute left-0 top-full bg-white shadow-lg rounded mt-1 w-full z-50 max-h-[300px] overflow-y-auto transition-all duration-300 ease-in-out">
              {state.filteredProducts.length > 0 ? (
                state.filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    {product.product_name}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">
                  Không tìm thấy sản phẩm
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dropdown location */}
        <div className="relative flex items-center ml-8">
          <div
            className="flex items-center text-white cursor-pointer"
            onClick={() => toggleDropdown("location")}
          >
            <FontAwesomeIcon icon={faChevronDown} className="mr-2" />
            {state.selectedLocation}
          </div>
          {state.isDropdownOpen.location && (
            <div
              ref={(ref) => (dropdownRefs.current.location = ref)}
              className="absolute bg-white shadow-md rounded mt-2 w-56 z-50 transition-all duration-300 ease-in-out"
            >
              {locations.map((location) => (
                <div
                  key={location}
                  className="p-3 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleLocationChange(location)}
                >
                  {location}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tài khoản và icon */}
        <div className="ml-8 flex items-center">
          <div
            onClick={() => toggleDropdown("user")}
            className="relative text-white text-sm cursor-pointer"
          >
            Xin chào, {state.username || "Khách"}
            {state.isDropdownOpen.user && (
              <div
                ref={(ref) => (dropdownRefs.current.user = ref)}
                className="absolute bg-white shadow-lg rounded mt-2 w-56 transition-all duration-300 ease-in-out z-50"
              >
                <div
                  onClick={handleLogout}
                  className="p-3 text-gray-700 hover:bg-gray-100 cursor-pointer z-50"
                >
                  Đăng xuất
                </div>
                <div
                   onClick={() => navigate("/messages")}
                  className="p-3 text-gray-700 hover:bg-gray-100 cursor-pointer z-50"
                >
                  Nhắn tin với Admin
                </div>
              </div>
            )}
          </div>
          <FontAwesomeIcon
            icon={faHeart}
            className="ml-4 text-2xl text-white cursor-pointer"
            onClick={() => toggleDropdown("favorites")}
          />
          <FontAwesomeIcon
            icon={faCartShopping}
            className="ml-4 text-2xl text-white cursor-pointer"
            onClick={() => navigate("/cart")}
          />
              <FontAwesomeIcon
            icon={faCartShopping}
            className="ml-4 text-2xl text-white cursor-pointer"
            onClick={() => navigate("/user")}
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
