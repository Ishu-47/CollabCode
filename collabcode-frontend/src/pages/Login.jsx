import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";
import { setToken } from "../utils/auth";

export default function Login() {
    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form, [e.target.name]: e.target.value,
        });
    };

    const handleLogin = async () => {
        try {
            setLoading(true);
            const res = await loginUser(form);
            setToken(res.data.token);
            navigate("/");
        } catch (err) {
            alert("Invalid credentials");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="h-screen flex items-center justify-center bg-gray-900 text-white">

            <div className="bg-gray-800 p-8 rounded-2xl w-96 shadow-xl">

                <h1 className="text-2xl font-bold mb-6 text-center">
                    Welcome Back 👋
                </h1>

                <input
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                    className="w-full p-3 mb-3 rounded bg-gray-700 outline-none"
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    className="w-full p-3 mb-4 rounded bg-gray-700 outline-none"
                />

                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-500 hover:bg-blue-600 p-3 rounded"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="text-sm text-gray-400 mt-4 text-center">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-green-400">
                        Register
                    </Link>
                </p>

            </div>
        </div>
    );
}