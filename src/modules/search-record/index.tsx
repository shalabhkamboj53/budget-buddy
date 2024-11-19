import { useCallback, useEffect, useState } from "react";
import { Income, Expense } from "../../utils/types";
import { RootState, useAppSelector } from "../../redux/store";
import Breadcrumb from "../../components/breadcrumb";

const SearchRecord = () => {
  const [filteredData, setFilteredData] = useState<Income[] | Expense[]>([]);

  const onSearch = useCallback((data: Income[] | Expense[]) => {
    setFilteredData(data);
  }, []);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [category, setCategory] = useState<string>("All");

  const incomeData = useAppSelector((state: RootState) => state.income.incomes);
  const expenseData = useAppSelector(
    (state: RootState) => state.expense.expenses
  );

  const filterData = useCallback(() => {
    let data: Income[] | Expense[] = [];

    if (category === "Income") {
      data = [...incomeData];
    } else if (category === "Expense") {
      data = [...expenseData];
    } else {
      data = [...incomeData, ...expenseData];
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = data.filter((item: Income | Expense) => {
      return (
        item.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        item.amount.toString().includes(lowerCaseSearchTerm)
      );
    });

    setFilteredData(filtered);

    onSearch(filtered);
  }, [searchTerm, category, incomeData, expenseData, onSearch]);

  useEffect(() => {
    filterData();
  }, [searchTerm, category, incomeData, expenseData, filterData]);


  const breadcrumbItems = [
    { label: "Home", url: "/" },
    { label: "Search Records" },
  ];

  return (
    <div className="p-5 w-full h-full">
      <Breadcrumb items={breadcrumbItems} />
      <div className="bg-base-200 px-5 pt-5 pb-8 rounded-md">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div>
            <label className="label">Search Term</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or amount"
            />
          </div>

          <div>
            <label className="label">Category</label>
            <select
              className="select select-bordered w-full"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-base-200 p-5">
        <h3 className="text-lg font-bold">Search Results</h3>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full mt-2">
            <thead>
              <tr>
                <th>Category</th>
                <th>Source / Title</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item: Income | Expense) => (
                  <tr key={item.id}>
                    <td>
                      {(item as Income).category || (item as Expense).category}
                    </td>
                    <td>{item.title}</td>
                    <td>Rs. {item.amount}</td>
                    <td>{new Date(item.date).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SearchRecord;
