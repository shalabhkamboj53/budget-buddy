import { Link } from "react-router-dom";
import { Income } from "../../utils/types";

type Props = {
    incomeSortedData: Income[];
    deleteIncomeHandler: (item: Income) => void;
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
        {props.incomeSortedData.map((item) => (
          <tr key={item.id}>
            <td>{item.category}</td>
            <td>{item.title}</td>
            <td>{item.date}</td>
            <td>{item.amount}</td>
            <td>
              <Link to={`/income/edit/${item.id}`} className="btn btn-neutral">
                Edit
              </Link>
            </td>
            <td>
              <button
                className="btn btn-warning"
                onClick={() => props.deleteIncomeHandler(item)}
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
