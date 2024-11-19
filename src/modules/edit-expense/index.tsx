import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RootState, useAppDispatch, useAppSelector } from "../../redux/store";
import { Expense } from "../../utils/types";
import { updateExpense } from "../../redux/slices/expenseSlice";
import Breadcrumb from "../../components/breadcrumb";

const EditExpense = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const expenseData = useAppSelector(
    (state: RootState) => state.expense.expenses
  );
  const expenseItem = expenseData.find((expense: Expense) => expense.id === id);

  useEffect(() => {
    if (!expenseItem) {
      navigate("/expense");
    }
  }, [expenseItem, navigate]);

  const [formData, setFormData] = useState<Expense>({
    id: "",
    title: "",
    amount: 0,
    date: "",
    category: "",
    userId: "",
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    if (expenseItem) {
      setFormData({ ...expenseItem });
    }
  }, [expenseItem]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
      dispatch(updateExpense({ id: formData.id, updates: formData }));
    }
    navigate("/expenses");
  };

  const breadcrumbItems = [
    { label: "Home", url: "/" },
    { label: "Expenses", url: "/expenses" },
    { label: "Edit Expense" },
  ];

  return (
    <div className="p-5 w-full h-full">
      <Breadcrumb items={breadcrumbItems} />

      <div className="px-10 py-8 bg-base-200 mb-5">
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
          <div className="card bg-neutral text-neutral-content p-4">
            <h3 className="card-title">Date Created</h3>
            <p>{formData.createdAt}</p>
          </div>
          <div className="card bg-neutral text-neutral-content p-4">
            <h3 className="card-title">Last Updated</h3>
            <p>{new Date(formData.updatedAt!).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
          {formData.note && (
            <div className="card bg-neutral text-neutral-content p-4">
              <h3 className="card-title">Note</h3>
              <p>{formData.note}</p>
            </div>
          )}
        </div>
      </div>

      <div className="px-10 py-8 bg-base-200">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input input-bordered w-full"
              >
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Shopping">Shopping</option>
                <option value="Education">Education</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div>
              <label className="label">Source</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Expense Source"
              />
            </div>

            <div>
              <label className="label">Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Amount"
              />
            </div>

            <div>
              <label className="label">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            <div className="flex justify-end gap-4 mt-5">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/expense")}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpense;
