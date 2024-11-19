import { useEffect, useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import { RootState, useAppSelector } from "../../redux/store";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import NoDataFound from "../../components/no-data";
import Breadcrumb from "../../components/breadcrumb";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const Dashboard = () => {
  const incomeData = useAppSelector((state: RootState) => state.income);
  const expenseData = useAppSelector((state: RootState) => state.expense);

  const isDataAvailable =
    incomeData.incomes.length === 0 || expenseData.expenses.length === 0;

  const [trendData, setTrendData] = useState<{
    labels: string[];
    incomeData: number[];
    expenseData: number[];
  }>({
    labels: [],
    incomeData: [],
    expenseData: [],
  });

  const [categoryData, setCategoryData] = useState<{
    categories: string[];
    incomeCategories: number[];
    expenseCategories: number[];
  }>({
    categories: [],
    incomeCategories: [],
    expenseCategories: [],
  });

  const [pieChartData, setPieChartData] = useState({
    income: 0,
    expense: 0,
  });

  const [incomeCategoryPieData, setIncomeCategoryPieData] = useState({
    labels: [] as string[],
    data: [] as number[],
  });

  const [expenseCategoryPieData, setExpenseCategoryPieData] = useState({
    labels: [] as string[],
    data: [] as number[],
  });

  useEffect(() => {
    const sortedIncome = [...incomeData.incomes].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const sortedExpenses = [...expenseData.expenses].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const incomeLabels = sortedIncome.map((item) =>
      new Date(item.date).toLocaleDateString()
    );
    const expenseLabels = sortedExpenses.map((item) =>
      new Date(item.date).toLocaleDateString()
    );

    const incomeAmounts = sortedIncome.map((item) => item.amount);
    const expenseAmounts = sortedExpenses.map((item) => item.amount);

    setTrendData({
      labels: [...new Set([...incomeLabels, ...expenseLabels])],
      incomeData: incomeAmounts,
      expenseData: expenseAmounts,
    });

    const incomeCategoryMap: Record<string, number> = {};
    sortedIncome.forEach((item) => {
      incomeCategoryMap[item.category] =
        (incomeCategoryMap[item.category] || 0) + item.amount;
    });

    const expenseCategoryMap: Record<string, number> = {};
    sortedExpenses.forEach((item) => {
      expenseCategoryMap[item.category] =
        (expenseCategoryMap[item.category] || 0) + item.amount;
    });

    setCategoryData({
      categories: ["Salary", "Investment", "Part-Time", "Bonus", "Others"],
      incomeCategories: Object.values(incomeCategoryMap),
      expenseCategories: Object.values(expenseCategoryMap),
    });

    const totalIncome = sortedIncome.reduce(
      (acc, item) => acc + item.amount,
      0
    );
    const totalExpense = sortedExpenses.reduce(
      (acc, item) => acc + item.amount,
      0
    );

    setPieChartData({
      income: totalIncome,
      expense: totalExpense,
    });

    setIncomeCategoryPieData({
      labels: Object.keys(incomeCategoryMap),
      data: Object.values(incomeCategoryMap),
    });

    setExpenseCategoryPieData({
      labels: Object.keys(expenseCategoryMap),
      data: Object.values(expenseCategoryMap),
    });
  }, [incomeData, expenseData]);

  const lineChartData = {
    labels: trendData.labels,
    datasets: [
      {
        label: "Income",
        data: trendData.incomeData,
        borderColor: "rgba(75,192,192,1)",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Expense",
        data: trendData.expenseData,
        borderColor: "rgba(255,99,132,1)",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const barChartData = {
    labels: categoryData.categories,
    datasets: [
      {
        label: "Income by Category",
        data: categoryData.incomeCategories,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
      {
        label: "Expense by Category",
        data: categoryData.expenseCategories,
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
      },
    ],
  };

  const pieChartDataOptions = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [pieChartData.income, pieChartData.expense],
        backgroundColor: ["rgba(75,192,192,0.6)", "rgba(255,99,132,0.6)"],
        hoverOffset: 4,
      },
    ],
  };

  const incomeCategoryPieChartOptions = {
    labels: incomeCategoryPieData.labels,
    datasets: [
      {
        data: incomeCategoryPieData.data,
        backgroundColor: [
          "rgba(75,192,192,0.6)",
          "rgba(255,99,132,0.6)",
          "rgba(153,102,255,0.6)",
          "rgba(255,159,64,0.6)",
          "rgba(255,205,86,0.6)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const expenseCategoryPieChartOptions = {
    labels: expenseCategoryPieData.labels,
    datasets: [
      {
        data: expenseCategoryPieData.data,
        backgroundColor: [
          "rgba(75,192,192,0.6)",
          "rgba(255,99,132,0.6)",
          "rgba(153,102,255,0.6)",
          "rgba(255,159,64,0.6)",
          "rgba(255,205,86,0.6)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const breadcrumbItems = [{ label: "Home", url: "/" }, { label: "Dashboard" }];

  return (
    <div className="p-5 w-full h-full">
      <Breadcrumb items={breadcrumbItems} />
      <div className="mb-6">
        {!isDataAvailable && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <div className="card bg-base-200 p-5">
                <h3 className="font-bold text-lg">Income vs Expense</h3>
                <Pie data={pieChartDataOptions} />
              </div>

              <div className="card bg-base-200 p-5">
                <h3 className="font-bold text-lg">
                  Income Breakdown by Category
                </h3>
                <Pie data={incomeCategoryPieChartOptions} />
              </div>

              <div className="card bg-base-200 p-5">
                <h3 className="font-bold text-lg">
                  Expense Breakdown by Category
                </h3>
                <Pie data={expenseCategoryPieChartOptions} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 mt-4">
              <div className="card bg-base-200 p-5">
                <h3 className="font-bold text-lg">Income vs Expense Trends</h3>
                <Line data={lineChartData} />
              </div>

              <div className="card bg-base-200 p-5">
                <h3 className="font-bold text-lg">Category Breakdown</h3>
                <Bar data={barChartData} />
              </div>
            </div>
          </>
        )}

        {isDataAvailable && <NoDataFound />}
      </div>
    </div>
  );
};

export default Dashboard;
