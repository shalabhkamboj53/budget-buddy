import React from "react";
import { RootState, useAppDispatch, useAppSelector } from "../../redux/store";
import { addExpense } from "../../redux/slices/expenseSlice";
import { Bounce, toast } from "react-toastify";
import Breadcrumb from "../../components/breadcrumb";

const AddExpense = () => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state: RootState) => {
    return state.user;
  });

  const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    if ((form[4] as HTMLInputElement).value != "") {
      dispatch(
        addExpense({
          userId: `${userData.id}`,
          title: (form[0] as HTMLInputElement).value,
          amount: parseInt((form[1] as HTMLInputElement).value),
          category: (form[2] as HTMLInputElement).value,
          date: (form[3] as HTMLInputElement).value,
          note: (form[4] as HTMLInputElement).value,
          createdAt: new Date().toLocaleDateString(),
        })
      );
      toast.success("Expense Added Successfully", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      form.reset();
    } else {
      dispatch(
        addExpense({
          userId: `${userData.id}`,
          title: (form[0] as HTMLInputElement).value,
          amount: parseInt((form[1] as HTMLInputElement).value),
          category: (form[2] as HTMLInputElement).value,
          date: (form[3] as HTMLInputElement).value,
          createdAt: new Date().toLocaleDateString(),
        })
      );
      toast.success("Expense Added Successfully", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      form.reset();
    }
  };

  const breadcrumbItems = [
    { label: "Home", url: "/" },
    { label: "Expenses", url: "/expenses" },
    { label: "Add Expense" },
  ];

  return (
    <div className="p-5 w-full h-full">
      <Breadcrumb items={breadcrumbItems} />
      <div
        className="bg-base-200 w-full p-10 rounded-xl"
        style={{ boxShadow: "1px 0px 20px #242b32" }}
      >
        <h2 className="mb-5">Add Expenses</h2>
        <form onSubmit={formSubmitHandler}>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
            <div>
              <label className="input input-bordered flex items-center gap-2">
                Title
                <input type="text" className="grow" required />
              </label>
            </div>
            <div>
              <label className="input input-bordered flex items-center gap-2">
                Amount (Rs.)
                <input type="number" className="grow" required />
              </label>
            </div>
            <div>
              <select className="select select-bordered w-full">
                <option defaultValue={""}>Select Category</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Rent/Mortage">Rent/Mortgage</option>
                <option value="Utilities">Utilities</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Shopping">Shopping</option>
                <option value="Education">Education</option>
                <option value="Misc">Misc</option>
              </select>
            </div>
            <div>
              <label className="input input-bordered flex items-center gap-2">
                Date
                <input type="date" className="grow" max={new Date().toISOString().split("T")[0]} required />
              </label>
            </div>
            <div className="lg:col-span-2">
              <label className="form-control">
                <div className="label">
                  <span className="label-text">Note (optional)</span>
                </div>
                <textarea
                  className="textarea textarea-bordered h-24"
                  placeholder="Note"
                ></textarea>
              </label>
            </div>
          </div>
          <button className="btn mt-5 btn-outline">Add Expense</button>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
