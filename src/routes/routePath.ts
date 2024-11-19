import AddExpense from "../modules/add-expense";
import AddIncome from "../modules/add-income";
import Dashboard from "../modules/dashboard";
import EditExpense from "../modules/edit-expense";
import EditIncome from "../modules/edit-income";
import Login from "../modules/login";
import PreviewExpenses from "../modules/preview-expense";
import PreviewIncome from "../modules/preview-income";
import SearchRecord from "../modules/search-record";
import { routePathType } from "../utils/types";

const routePaths:routePathType[]= [
    {
        path: '/login',
        components: Login,
        isPrivate: false
    },
    {
        path: '/',
        components: Dashboard,
        isPrivate: true
    },
    {
        path: '/expenses/add',
        components: AddExpense,
        isPrivate: true
    },
    {
        path: '/income/add',
        components: AddIncome,
        isPrivate: true
    },
    {
        path: '/income',
        components: PreviewIncome,
        isPrivate: true
    },
    {
        path: '/income/edit/:id',
        components: EditIncome,
        isPrivate: true
    },
    {
        path: '/expenses',
        components: PreviewExpenses,
        isPrivate: true
    },
    {
        path: '/expenses/edit/:id',
        components: EditExpense,
        isPrivate: true
    },
    {
        path: '/search',
        components: SearchRecord,
        isPrivate: true
    },
]

export default routePaths