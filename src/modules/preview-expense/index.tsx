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
        <>
          <Breadcrumb
            items={breadcrumbItems}
            button={{
              label: "Export Income Data As CSV",
              onClick: downloadCsv,
            }}
          />
          <div className="px-10 py-8 bg-base-200 grid lg:grid-cols-2 grid-cols-1 gap-10 rounded-xl">
            <div className="card bg-neutral text-neutral-content">
              <div className="card-body items-center text-center">
                <h2 className="card-title">Total Expenses</h2>
                <p>Rs. {totalExpense}</p>
              </div>
            </div>
            <div className="card bg-neutral text-neutral-content">
              <div className="card-body items-center text-center">
                <h2 className="card-title">Recent</h2>
                <p>Rs. {recentExpenseAmount}</p>
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
        </>

        <div className="px-10 py-8 bg-base-200 mt-5 rounded-xl">
        <h3 className="pb-10 text-2xl">Expense List</h3>
          <div className="overflow-x-auto">
            <Table expenseSortedData={expenseSortedData} deleteExpenseHandler={deleteExpenseHandler} />
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
