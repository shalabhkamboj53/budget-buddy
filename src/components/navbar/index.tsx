import { Link } from "react-router-dom";
import { clearUser } from "../../redux/slices/userSlice";
import { RootState, useAppDispatch, useAppSelector } from "../../redux/store";
import { Bounce, toast } from "react-toastify";

type propsType = {
    children: React.ReactNode
}

const Navbar = ({children}:propsType) => {
  const userData = useAppSelector((state: RootState) => state.user);

  const dispatch = useAppDispatch();

  const logoutHandler = () => {
    dispatch(clearUser());
    toast.warn('Logout Successfully', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
    });
  };

  return (
    <div>
      <div className="navbar bg-base-200">
        <div className="flex-1">
          <label htmlFor="my-drawer-2" className="btn drawer-button lg:hidden">
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
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </label>
          <Link to={'/'}>
            <span className="text-xl font-bold ms-3">BUDGET BUDDY</span>
          </Link>
        </div>
        <div className="flex-none">
            <button className="btn" onClick={logoutHandler}>Logout</button>
        </div>
      </div>

      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          {children}
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            <div className="text-center mb-10">
                <img src={userData.image} className="w-[80%] mx-auto rounded-full mb-5" alt="" />
                <span className="text-xl">
                    Hi, {userData.first_name}
                </span>
            </div>
            <li>
                <Link to={'/'}>Dashboard</Link>
            </li>
            <li>
              <a>Income</a>
              <ul>
                <li>
                    <Link to={'/income/add'}>Add Income</Link>
                </li>
                <li>
                    <Link to={'/income'}>Preview Income</Link>
                </li>
              </ul>
            </li>
            <li>
              <a>Expenses</a>
              <ul>
                <li>
                    <Link to={'/expenses/add'}>Add Expenses</Link>
                </li>
                <li>
                    <Link to={'/expenses'}>Preview Expenses</Link>
                </li>
              </ul>
            </li>
            <li>
                <Link to={'/search'}>Search Records</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
