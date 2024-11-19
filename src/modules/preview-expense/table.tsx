import { Link } from "react-router-dom";
import { Expense } from "../../utils/types";

interface Props {
    expenseSortedData: Expense[];
    deleteExpenseHandler: (item: Expense) => void;
};

const Table = (props: Props) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Category</th>
          <th>Source</th>
          <th>Date</th>
          <th>Amount</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {props.expenseSortedData.map((item) => (
          <tr key={item.id}>
            <td>{item.category}</td>
            <td>{item.title}</td>
            <td>{item.date}</td>
            <td>{item.amount}</td>
            <td>
              <Link
                to={`/expenses/edit/${item.id}`}
                className="btn btn-neutral"
              >
                Edit
              </Link>
            </td>
            <td>
              <button
                className="btn btn-warning"
                onClick={() => props.deleteExpenseHandler(item)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
