import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Receipt, LogOut, PlusCircle, Wallet } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center group">
                            <div className="bg-indigo-600 rounded-lg p-1.5 mr-2 group-hover:scale-110 transition-transform duration-200">
                                <Wallet className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 tracking-tight">BellCorp</span>
                        </Link>

                        <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                            <Link
                                to="/dashboard"
                                className={`${isActive('/dashboard')
                                        ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                    } inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium rounded-t-md transition-all duration-200`}
                            >
                                <LayoutDashboard className={`w-4 h-4 mr-2 ${isActive('/dashboard') ? 'text-indigo-600' : 'text-slate-400'}`} />
                                Dashboard
                            </Link>
                            <Link
                                to="/transactions"
                                className={`${isActive('/transactions')
                                        ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                    } inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium rounded-t-md transition-all duration-200`}
                            >
                                <Receipt className={`w-4 h-4 mr-2 ${isActive('/transactions') ? 'text-indigo-600' : 'text-slate-400'}`} />
                                Transactions
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <Link
                            to="/transactions/add"
                            className="hidden sm:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow transition-all duration-200 active:scale-95 mr-4"
                        >
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Expense
                        </Link>

                        <div className="flex items-center border-l border-slate-200 pl-4 ml-2">
                            <div className="flex flex-col items-end mr-3 hidden md:flex">
                                <span className="text-sm font-medium text-slate-900">{user?.name}</span>
                                <span className="text-xs text-slate-500">{user?.email}</span>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3 border border-indigo-200">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <button
                                onClick={logout}
                                className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
