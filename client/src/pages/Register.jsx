import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, Wallet } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
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
                            Create your account
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Start your journey to financial freedom today.
                        </p>
                    </div>

                    <div className="mt-8">
                        <div className="mt-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100 animate-fade-in">{error}</div>}

                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                                        Full Name
                                    </label>
                                    <div className="mt-1 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            className="input-field pl-10"
                                            placeholder="John Doe"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                </div>

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
                                            required
                                            className="input-field pl-10"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Must be at least 8 characters.</p>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full btn-primary py-3"
                                    >
                                        {isLoading ? 'Creating account...' : 'Create account'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="mt-6 relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-slate-500">Already have an account?</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link to="/login" className="w-full btn-secondary py-3 text-center block">
                                Sign in
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
                        <h1 className="text-4xl font-bold mb-6 text-center">Join thousands of smart savers</h1>
                        <p className="text-lg text-indigo-100 text-center max-w-lg">
                            Create an account to start tracking your expenses, visualize your spending habits, and save more.
                        </p>
                        <div className="mt-10 grid grid-cols-2 gap-4 max-w-md w-full">
                            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20">
                                <div className="text-3xl font-bold">100%</div>
                                <div className="text-indigo-200 text-sm">Free to use</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20">
                                <div className="text-3xl font-bold">Secure</div>
                                <div className="text-indigo-200 text-sm">Your data is safe</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
