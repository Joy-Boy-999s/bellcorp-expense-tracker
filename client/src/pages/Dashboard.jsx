import { useState, useEffect } from 'react';
import api from '../api/axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { DollarSign, Wallet, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Dashboard = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const { data } = await api.get('/dashboard/summary');
                setSummary(data);
            } catch (err) {
                setError('Failed to fetch dashboard data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (error) return (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center border border-red-100">
            {error}
        </div>
    );

    if (!summary) return null;

    const { totalExpenses, categoryBreakdown, recentTransactions } = summary;

    const pieData = categoryBreakdown.map((item) => ({
        name: item._id,
        value: item.total,
    }));

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="sm:flex sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
                <div className="mt-4 sm:mt-0">
                    <span className="text-sm text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                        {format(new Date(), 'EEEE, MMMM do, yyyy')}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Expenses Card */}
                <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-xl group-hover:bg-white/20 transition-colors duration-500"></div>
                    <div className="relative z-10">
                        <div className="p-3 bg-white/20 rounded-xl w-fit mb-4 backdrop-blur-sm">
                            <Wallet className="h-6 w-6 text-white" />
                        </div>
                        <dt className="text-indigo-100 text-sm font-medium">Total Expenses</dt>
                        <dd className="mt-1 text-4xl font-bold tracking-tight">
                            {formatCurrency(totalExpenses)}
                        </dd>
                        <div className="mt-4 text-xs text-indigo-100/80 bg-white/10 w-fit px-2 py-1 rounded inline-flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Lifetime spending
                        </div>
                    </div>
                </div>

                {/* Placeholder cards for future data */}
                <div className="card p-6 border-l-4 border-emerald-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                            <DollarSign className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Good</span>
                    </div>
                    <dt className="text-slate-500 text-sm font-medium">Budget Status</dt>
                    <dd className=" text-2xl font-bold text-slate-900">On Track</dd>
                    <p className="text-sm text-slate-400 mt-1">You are within your monthly limits.</p>
                </div>

                <div className="card p-6 border-l-4 border-amber-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
                            <PieChart className="h-6 w-6" />
                        </div>
                    </div>
                    <dt className="text-slate-500 text-sm font-medium">Top Category</dt>
                    <dd className=" text-2xl font-bold text-slate-900">
                        {categoryBreakdown.length > 0 ? categoryBreakdown[0]._id : 'N/A'}
                    </dd>
                    <p className="text-sm text-slate-400 mt-1">
                        {categoryBreakdown.length > 0 ? formatCurrency(categoryBreakdown[0].total) : '$0.00'} spent
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Category Breakdown Chart */}
                <div className="card p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                        <span className="w-1 h-6 bg-indigo-500 rounded-full mr-3"></span>
                        Spending by Category
                    </h3>
                    <div className="flex-1 min-h-[300px]">
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) => formatCurrency(value)}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend
                                        layout="vertical"
                                        verticalAlign="middle"
                                        align="right"
                                        iconType="circle"
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <PieChart className="h-12 w-12 mb-2 text-slate-300" />
                                <p>No expense data available</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="card p-0 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center">
                            <span className="w-1 h-6 bg-violet-500 rounded-full mr-3"></span>
                            Recent Transactions
                        </h3>
                        <Link to="/transactions" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center hover:underline">
                            View All <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[400px]">
                        {recentTransactions.length > 0 ? (
                            <ul className="divide-y divide-slate-100">
                                {recentTransactions.map((transaction) => (
                                    <li key={transaction._id} className="p-4 hover:bg-slate-50 transition-colors duration-150 group">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center min-w-0 gap-3">
                                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors duration-200">
                                                    {/* Simple icon mapping based on first letter or generic */}
                                                    <span className="font-bold text-xs">{transaction.category.substring(0, 2).toUpperCase()}</span>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-slate-900 truncate">
                                                        {transaction.title}
                                                    </p>
                                                    <p className="text-xs text-slate-500 truncate flex items-center">
                                                        {transaction.category}
                                                        <span className="mx-1.5">•</span>
                                                        {format(new Date(transaction.date), 'MMM d, yyyy')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-base font-bold text-slate-900">
                                                -{formatCurrency(transaction.amount)}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400">
                                <p>No recent transactions.</p>
                                <Link to="/transactions/add" className="mt-4 btn-secondary text-xs">Add First Transaction</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
