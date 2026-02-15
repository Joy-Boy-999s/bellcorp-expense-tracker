import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { format } from 'date-fns';
import { Filter, Search, Edit, Trash2, ChevronLeft, ChevronRight, Download, Plus } from 'lucide-react';

const Transactions = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    const filters = {
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        minAmount: searchParams.get('minAmount') || '',
        maxAmount: searchParams.get('maxAmount') || '',
        startDate: searchParams.get('startDate') || '',
        endDate: searchParams.get('endDate') || '',
        page: searchParams.get('page') || '1',
    };

    const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Other'];

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== filters.search) {
                updateFilter('search', searchTerm);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams(searchParams);
            const { data } = await api.get(`/transactions?${params.toString()}`);
            setTransactions(data.data);
            setPagination({
                page: data.page,
                totalPages: data.totalPages,
                total: data.total,
            });
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch transactions', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [searchParams]);

    const updateFilter = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        if (key !== 'page') {
            newParams.set('page', '1');
        }
        setSearchParams(newParams);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await api.delete(`/transactions/${id}`);
                fetchTransactions();
            } catch (error) {
                console.error('Failed to delete', error);
            }
        }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <div className="space-y-6 animate-fade-in text-gray-800">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Transactions</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage and track your financial history.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 flex space-x-3">
                    <button className="btn-secondary">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </button>
                    <Link to="/transactions/add" className="btn-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Transaction
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="card p-5">
                <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6 lg:grid-cols-12 items-end">
                    <div className="sm:col-span-3 lg:col-span-4">
                        <label htmlFor="search" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                            Search
                        </label>
                        <div className="relative rounded-xl shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                name="search"
                                id="search"
                                className="input-field pl-10"
                                placeholder="Search by title or notes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3 lg:col-span-2">
                        <label htmlFor="category" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                            Category
                        </label>
                        <select
                            id="category"
                            className="input-field bg-white"
                            value={filters.category}
                            onChange={(e) => updateFilter('category', e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="sm:col-span-3 lg:col-span-3">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Amount</label>
                        <div className="flex space-x-2">
                            <input
                                type="number"
                                placeholder="Min"
                                className="input-field text-sm"
                                value={filters.minAmount}
                                onChange={(e) => updateFilter('minAmount', e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                className="input-field text-sm"
                                value={filters.maxAmount}
                                onChange={(e) => updateFilter('maxAmount', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3 lg:col-span-3">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Date Range</label>
                        <div className="flex space-x-2">
                            <input
                                type="date"
                                className="input-field text-sm"
                                value={filters.startDate}
                                onChange={(e) => updateFilter('startDate', e.target.value)}
                            />
                            <input
                                type="date"
                                className="input-field text-sm"
                                value={filters.endDate}
                                onChange={(e) => updateFilter('endDate', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Transaction
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th scope="col" className="relative px-6 py-4">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center">
                                            <div className="bg-slate-100 p-3 rounded-full mb-3">
                                                <Search className="w-6 h-6 text-slate-400" />
                                            </div>
                                            <p className="font-medium text-slate-900">No transactions found</p>
                                            <p className="text-sm">Try adjusting your search or filters</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((transaction) => (
                                    <tr key={transaction._id} className="hover:bg-slate-50/80 transition-colors duration-150 group">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                                            {format(new Date(transaction.date), 'MMM d, yyyy')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-slate-900">{transaction.title}</div>
                                            {transaction.notes && <div className="text-xs text-slate-400 truncate max-w-xs">{transaction.notes}</div>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2.5 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                {transaction.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                                            {formatCurrency(transaction.amount)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <Link to={`/transactions/edit/${transaction._id}`} className="text-slate-400 hover:text-indigo-600 bg-white p-1.5 rounded-lg border border-slate-200 hover:border-indigo-200 shadow-sm transition-all">
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button onClick={() => handleDelete(transaction._id)} className="text-slate-400 hover:text-red-600 bg-white p-1.5 rounded-lg border border-slate-200 hover:border-red-200 shadow-sm transition-all">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="bg-white px-4 py-4 flex items-center justify-between border-t border-slate-100">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => updateFilter('page', String(pagination.page - 1))}
                                disabled={pagination.page <= 1}
                                className="btn-secondary"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => updateFilter('page', String(pagination.page + 1))}
                                disabled={pagination.page >= pagination.totalPages}
                                className="ml-3 btn-secondary"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-slate-500">
                                    Showing <span className="font-medium text-slate-900">{(pagination.page - 1) * 10 + 1}</span> to <span className="font-medium text-slate-900">{Math.min(pagination.page * 10, pagination.total)}</span> of{' '}
                                    <span className="font-medium text-slate-900">{pagination.total}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => updateFilter('page', String(pagination.page - 1))}
                                        disabled={pagination.page <= 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-200 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                                    >
                                        <span className="sr-only">Previous</span>
                                        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                    <span className="relative inline-flex items-center px-4 py-2 border border-slate-200 bg-white text-sm font-medium text-slate-700">
                                        Page {pagination.page} / {pagination.totalPages}
                                    </span>
                                    <button
                                        onClick={() => updateFilter('page', String(pagination.page + 1))}
                                        disabled={pagination.page >= pagination.totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-200 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                                    >
                                        <span className="sr-only">Next</span>
                                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Transactions;
