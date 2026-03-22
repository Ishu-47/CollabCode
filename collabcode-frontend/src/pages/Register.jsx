import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/api";
import { setToken } from "../utils/auth";

export default function Register() {
    const [form, setForm] = useState({
        username: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        }
        );
    };

    const handleRegister = async () => {
        try {
            setLoading(true);
            const res = await registerUser(form);

            const token = res.data.token;
            setToken(token);
            navigate("/");
        } catch (err) {
            alert(err.response?.data || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-2xl w-96 shadow-xl">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    Create Account 🚀
                </h1>

                <input
                    name="usernane"
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
                <button onClick={handleRegister}
                    className="w-full bg-green-500 hover:bg-green-600 p-3 rounded">
                    {loading ? "Creating..." : "Register"}
                </button>

                <p className="text-sm text-gray-400 mt-4 text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-400">
                        Login
                    </Link>
                </p>

            </div>
        </div>
    )
}