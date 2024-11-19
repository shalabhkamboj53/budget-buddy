import { useEffect, useRef, useState } from "react";
import { RootState, useAppDispatch, useAppSelector } from "../../redux/store";
import { Expense } from "../../utils/types";
import { removeExpense } from "../../redux/slices/expenseSlice";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import NoDataFound from "../../components/no-data";
import Breadcrumb from "../../components/breadcrumb";
import { download, generateCsv, mkConfig } from "export-to-csv";
import Table from "./table";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PreviewExpenses = () => {
  const expenseData = useAppSelector((state: RootState) => state.expense);
  const [modalData, setModalData] = useState<Expense | null>(null);
  const [expenseSortedData, setExpenseSortedData] = useState<Expense[]>([]);
  const dispatch = useAppDispatch();
  const onDeleteModal = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const sortedExpenses = [...expenseData.expenses].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    setExpenseSortedData(sortedExpenses);
  }, [expenseData]);

  // Helper functions to calculate expenses for today, this week, and this year
  const calculateExpenseForToday = () => {
    const today = new Date().setHours(0, 0, 0, 0);
    return expenseData.expenses
      .filter(
        (expense) => new Date(expense.date).setHours(0, 0, 0, 0) === today
      )
      .reduce((acc, expense) => acc + expense.amount, 0);
  };

  const calculateExpenseForThisWeek = () => {
    const today = new Date();
    const firstDayOfWeek = today.getDate() - today.getDay(); // Sunday as the first day of week
    const startOfWeek = new Date(today.setDate(firstDayOfWeek)).setHours(
      0,
      0,
      0,
      0
    );

    return expenseData.expenses
      .filter((expense) => new Date(expense.date).getTime() >= startOfWeek)
      .reduce((acc, expense) => acc + expense.amount, 0);
  };

  const calculateExpenseForThisYear = () => {
    const currentYear = new Date().getFullYear();
    return expenseData.expenses
      .filter((expense) => new Date(expense.date).getFullYear() === currentYear)
      .reduce((acc, expense) => acc + expense.amount, 0);
  };

  if (expenseData.expenses.length > 0) {
    const deleteExpenseHandler = (item: Expense) => {
      setModalData(item);
      if (onDeleteModal.current) {
        onDeleteModal.current.showModal();
      }
    };

    const confirmDeleteExpenseHandler = () => {
      if (modalData?.id) {
        dispatch(removeExpense(modalData.id));
        if (onDeleteModal.current) {
          onDeleteModal.current.close();
        }
      }
    };

    const totalExpense = expenseData.totalExpense ?? 0;
    const recentExpenseAmount = expenseData?.expenses[0]?.amount ?? 0;

    const chartData = {
      labels: expenseSortedData.map((item) =>
        new Date(item.date).toLocaleDateString()
      ),
      datasets: [
        {
          label: "Expense Over Time",
          data: expenseSortedData.map((item) => item.amount),
          fill: false,
          borderColor: "rgba(255,99,132,1)",
          tension: 0.1,
        },
      ],
    };

    const csvConfig = mkConfig({ useKeysAsHeaders: true });

    const csv = generateCsv(csvConfig)(expenseData.expenses);

    const downloadCsv = () => {
      download(csvConfig)(csv);
    };

    const breadcrumbItems = [
      { label: "Home", url: "/" },
      { label: "Expenses", url: "/expenses" },
      { label: "Preview Expense" },
    ];

    return (
      <div className="p-5 w-full h-full">
        <Breadcrumb
          items={breadcrumbItems}
          button={{
            label: "Export Expense Data As CSV",
            onClick: downloadCsv,
          }}
        />
        <div className="px-10 py-8 bg-base-200 grid lg:grid-cols-3 grid-cols-1 gap-10 rounded-xl mb-6">
          <div className="card bg-neutral text-neutral-content">
            <div className="card-body items-center text-center">
              <h2 className="card-title">Total Expenses</h2>
              <p>Rs. {`${parseInt(totalExpense.toString())}`}</p>
            </div>
          </div>
          <div className="card bg-neutral text-neutral-content">
            <div className="card-body items-center text-center">
              <h2 className="card-title">Recent</h2>
              <p>Rs. {`${parseInt(recentExpenseAmount.toString())}`}</p>
            </div>
          </div>
        </div>

        <div className="px-10 py-8 bg-base-200 grid lg:grid-cols-3 grid-cols-1 gap-10 rounded-xl">

          <div className="card bg-neutral text-neutral-content">
            <div className="card-body items-center text-center">
              <h2 className="card-title">Expenses Today</h2>
              <p>Rs. {`${parseInt(calculateExpenseForToday().toString())}`}</p>
            </div>
          </div>

          <div className="card bg-neutral text-neutral-content">
            <div className="card-body items-center text-center">
              <h2 className="card-title">Expenses This Week</h2>
              <p>Rs. {`${parseInt(calculateExpenseForThisWeek().toString())}`}</p>
            </div>
          </div>

          <div className="card bg-neutral text-neutral-content">
            <div className="card-body items-center text-center">
              <h2 className="card-title">Expenses This Year</h2>
              <p>Rs. {`${parseInt(calculateExpenseForThisYear().toString())}`}</p>
            </div>
          </div>
        </div>

        <div className="px-10 py-8 bg-base-200 mt-5 rounded-xl">
          <h3 className="pb-10 text-2xl">Expense Graph</h3>
          <div className="chart-container mb-5">
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  title: { display: true, text: "Expense Over Time" },
                },
              }}
            />
          </div>
        </div>

        <div className="px-10 py-8 bg-base-200 mt-5 rounded-xl">
          <h3 className="pb-10 text-2xl">Expense List</h3>
          <div className="overflow-x-auto">
            <Table
              expenseSortedData={expenseSortedData}
              deleteExpenseHandler={deleteExpenseHandler}
            />
          </div>
        </div>

        {modalData && (
          <dialog ref={onDeleteModal} className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Confirm Deletion</h3>
              <p className="py-4">
                Do you really want to delete the expense details for{" "}
                <strong>{modalData.title}</strong> from {modalData.date}?
              </p>
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn">No</button>
                </form>
                <button className="btn" onClick={confirmDeleteExpenseHandler}>
                  Yes
                </button>
              </div>
            </div>
          </dialog>
        )}
      </div>
    );
  } else {
    return (
      <div className="p-5 w-full h-full">
        <NoDataFound />
      </div>
    );
  }
};

export default PreviewExpenses;
