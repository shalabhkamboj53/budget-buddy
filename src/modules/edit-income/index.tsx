import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RootState, useAppDispatch, useAppSelector } from "../../redux/store";
import { Income } from "../../utils/types";
import { updateIncome } from "../../redux/slices/incomeSlice";
import Breadcrumb from "../../components/breadcrumb";

const EditIncome = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const incomeData = useAppSelector((state: RootState) => state.income.incomes);
  const incomeItem = incomeData.find((income: Income) => income.id === id);

  useEffect(() => {
    if (!incomeItem) {
      navigate("/income");
    }
  }, [incomeItem, navigate]);

  const [formData, setFormData] = useState<Income>({
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
    if (incomeItem) {
      setFormData({ ...incomeItem });
    }
  }, [incomeItem]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
      dispatch(updateIncome({ id: formData.id, updates: formData }));
    }
    navigate("/income");
  };

  const breadcrumbItems = [
    { label: "Home", url: "/" },
    { label: "Income", url: "/income" },
    { label: "Edit Income" },
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
                <option value="Salary">Salary</option>
                <option value="Investment">Investment</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Bonus">Bonus</option>
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
                placeholder="Income Source"
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
                onClick={() => navigate("/income")}
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

export default EditIncome;
