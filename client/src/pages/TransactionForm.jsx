import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { format } from 'date-fns';
import { ArrowLeft, Save } from 'lucide-react';

const TransactionForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        notes: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Other'];

    useEffect(() => {
        if (id) {
            const fetchTransaction = async () => {
                try {
                    const { data } = await api.get(`/transactions/${id}`);
                    setFormData({
                        title: data.title,
                        amount: data.amount,
                        category: data.category,
                        date: format(new Date(data.date), 'yyyy-MM-dd'),
                        notes: data.notes || '',
                    });
                } catch (err) {
                    setError('Failed to fetch transaction details');
                }
            };
            fetchTransaction();
        }
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await api.put(`/transactions/${id}`, formData);
            } else {
                await api.post('/transactions', formData);
            }
            navigate('/transactions');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save transaction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="mb-6 flex items-center">
                <button onClick={() => navigate('/transactions')} className="mr-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{id ? 'Edit Transaction' : 'Add New Transaction'}</h1>
                    <p className="text-sm text-slate-500">Fill in the details below to track your expense.</p>
                </div>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 flex items-center">{error}</div>}

            <form onSubmit={handleSubmit} className="card p-8">
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="title">
                        Title
                    </label>
                    <input
                        className="input-field"
                        id="title"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Grocery Shopping at Walmart"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="amount">
                            Amount
                        </label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                                className="input-field pl-7"
                                id="amount"
                                type="number"
                                step="0.01"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="category">
                            Category
                        </label>
                        <select
                            className="input-field bg-white"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="date">
                        Date
                    </label>
                    <input
                        className="input-field"
                        id="date"
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="notes">
                        Notes <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <textarea
                        className="input-field min-h-[100px]"
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Add any additional details..."
                    />
                </div>

                <div className="flex items-center justify-end space-x-4 border-t border-slate-100 pt-6">
                    <button
                        className="btn-secondary"
                        type="button"
                        onClick={() => navigate('/transactions')}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn-primary"
                        type="submit"
                        disabled={loading}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'Saving...' : 'Save Transaction'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TransactionForm;
