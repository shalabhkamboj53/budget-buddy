import { useEffect, useRef, useState } from "react";
import { RootState, useAppDispatch, useAppSelector } from "../../redux/store";
import { Income } from "../../utils/types";
import { removeIncome } from "../../redux/slices/incomeSlice";
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
import { mkConfig, generateCsv, download } from "export-to-csv";
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

const PreviewIncome = () => {
  const [incomeSortedData, setIncomeSortedData] = useState<Income[]>([]);
  const [modalData, setModalData] = useState<Income | null>(null);
  const incomeData = useAppSelector((state: RootState) => state.income);
  const onDeleteModal = useRef<HTMLDialogElement | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const sortedIncome = [...incomeData.incomes].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    setIncomeSortedData(sortedIncome);
  }, [incomeData]);

  // Helper functions to calculate income for today, this week, and this year
  const calculateIncomeForToday = () => {
    const today = new Date().setHours(0, 0, 0, 0);
    return incomeData.incomes
      .filter((income) => new Date(income.date).setHours(0, 0, 0, 0) === today)
      .reduce((acc, income) => acc + income.amount, 0);
  };

  const calculateIncomeForThisWeek = () => {
    const today = new Date();
    const firstDayOfWeek = today.getDate() - today.getDay(); // Sunday as the first day of week
    const startOfWeek = new Date(today.setDate(firstDayOfWeek)).setHours(
      0,
      0,
      0,
      0
    );

    return incomeData.incomes
      .filter((income) => new Date(income.date).getTime() >= startOfWeek)
      .reduce((acc, income) => acc + income.amount, 0);
  };

  const calculateIncomeForThisYear = () => {
    const currentYear = new Date().getFullYear();
    return incomeData.incomes
      .filter((income) => new Date(income.date).getFullYear() === currentYear)
      .reduce((acc, income) => acc + income.amount, 0);
  };

  if (incomeData.incomes.length > 0) {
    const deleteIncomeHandler = (item: Income) => {
      setModalData(item);
      if (onDeleteModal.current) {
        onDeleteModal.current.showModal();
      }
    };

    const confirmDeleteIncomeHandler = () => {
      if (modalData?.id) {
        dispatch(removeIncome(modalData.id));
        if (onDeleteModal.current) {
          onDeleteModal.current.close();
        }
      }
    };

    const totalIncome = incomeData.totalIncome ?? 0;
    const recentIncomeAmount = incomeData?.incomes[0]?.amount ?? 0;

    const chartData = {
      labels: incomeSortedData.map((item) =>
        new Date(item.date).toLocaleDateString()
      ),
      datasets: [
        {
          label: "Income Over Time",
          data: incomeSortedData.map((item) => item.amount),
          fill: false,
          borderColor: "rgba(75,192,192,1)",
          tension: 0.1,
        },
      ],
    };

    const csvConfig = mkConfig({ useKeysAsHeaders: true });

    const csv = generateCsv(csvConfig)(incomeData.incomes);

    const downloadCsv = () => {
      download(csvConfig)(csv);
    };

    const breadcrumbItems = [
      { label: "Home", url: "/" },
      { label: "Income", url: "/income" },
      { label: "Preview Income" },
    ];

    return (
      <div className="p-5 w-full h-full">
        <Breadcrumb
          items={breadcrumbItems}
          button={{ label: "Export Income Data As CSV", onClick: downloadCsv }}
        />
        <div className="px-10 py-8 bg-base-200 grid lg:grid-cols-3 grid-cols-1 gap-10 mb-6 rounded-xl">
          <div className="card bg-neutral text-neutral-content">
            <div className="card-body items-center text-center">
              <h2 className="card-title">Total Income</h2>
              <p>Rs. {`${parseInt(totalIncome.toString())}`}</p>
            </div>
          </div>
          <div className="card bg-neutral text-neutral-content">
            <div className="card-body items-center text-center">
              <h2 className="card-title">Recent</h2>
              <p>Rs. {`${parseInt(recentIncomeAmount.toString())}`}</p>
            </div>
          </div>
        </div>

        <div className="px-10 py-8 bg-base-200 grid lg:grid-cols-3 grid-cols-1 gap-10 rounded-xl">
          <div className="card bg-neutral text-neutral-content">
            <div className="card-body items-center text-center">
              <h2 className="card-title">Income Today</h2>
              <p>Rs. {`${parseInt(calculateIncomeForToday().toString())}`}</p>
            </div>
          </div>

          <div className="card bg-neutral text-neutral-content">
            <div className="card-body items-center text-center">
              <h2 className="card-title">Income This Week</h2>
              <p>Rs. {`${parseInt(calculateIncomeForThisWeek().toString())}`}</p>
            </div>
          </div>

          <div className="card bg-neutral text-neutral-content">
            <div className="card-body items-center text-center">
              <h2 className="card-title">Income This Year</h2>
              <p>Rs. {`${parseInt(calculateIncomeForThisYear().toString())}`}</p>
            </div>
          </div>
        </div>

        <div className="px-10 py-8 bg-base-200 mt-5 rounded-xl">
          <h3 className="pb-10 text-2xl">Income Graph</h3>
          <div className="chart-container mb-5">
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  title: { display: true, text: "Income Over Time" },
                },
              }}
            />
          </div>
        </div>

        <div className="px-10 py-8 bg-base-200 mt-5 rounded-xl">
          <h3 className="pb-10 text-2xl">Income List</h3>
          <div className="overflow-x-auto">
            <Table
              incomeSortedData={incomeSortedData}
              deleteIncomeHandler={deleteIncomeHandler}
            />
          </div>
        </div>

        {modalData && (
          <dialog ref={onDeleteModal} className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Confirm Deletion</h3>
              <p className="py-4">
                Do you really want to delete the income details for{" "}
                <strong>{modalData.title}</strong> from {modalData.date}?
              </p>
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn">No</button>
                </form>
                <button className="btn" onClick={confirmDeleteIncomeHandler}>
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

export default PreviewIncome;
