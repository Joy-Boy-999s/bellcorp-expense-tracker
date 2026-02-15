import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Wallet } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left side - Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="flex items-center mb-8">
                        <div className="bg-indigo-600 rounded-lg p-2 mr-3">
                            <Wallet className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-slate-900 tracking-tight">BellCorp</span>
                    </div>

                    <div>
                        <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Please enter your details to sign in.
                        </p>
                    </div>

                    <div className="mt-8">
                        <div className="mt-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100 animate-fade-in">{error}</div>}

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                        Email address
                                    </label>
                                    <div className="mt-1 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            className="input-field pl-10"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                        Password
                                    </label>
                                    <div className="mt-1 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            className="input-field pl-10"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
                                            Remember me
                                        </label>
                                    </div>

                                    <div className="text-sm">
                                        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                            Forgot your password?
                                        </a>
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full btn-primary py-3"
                                    >
                                        {isLoading ? 'Signing in...' : 'Sign in'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="mt-6 relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-slate-500">Don't have an account?</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link to="/register" className="w-full btn-secondary py-3 text-center block">
                                Create an account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Image/Gradient */}
            <div className="hidden lg:block relative w-0 flex-1">
                <div className="absolute inset-0 h-full w-full bg-slate-900 object-cover">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-800 opacity-90"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
                        <h1 className="text-4xl font-bold mb-6 text-center">Track your expenses effortlessly</h1>
                        <p className="text-lg text-indigo-100 text-center max-w-lg">
                            Gain improved financial clarity with BellCorp. Manage transactions, view insights, and take control of your budget.
                        </p>
                        <img
                            src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1951&q=80"
                            alt="Financial Growth"
                            className="mt-12 rounded-2xl shadow-2xl border-4 border-white/10 max-w-md transform rotate-3 hover:rotate-0 transition-transform duration-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
