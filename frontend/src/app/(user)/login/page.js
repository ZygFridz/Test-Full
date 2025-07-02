"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "../../../context/userContext";
const jwt = require("jsonwebtoken");

export default function LoginPage() {
    const router = useRouter();
    const { session, setSession } = useSession();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const res = await fetch("http://localhost:3005/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                alert(result.msg || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
                return;
            }

            const { token } = result;
            localStorage.setItem("token", token);

            const decoded = jwt.decode(token);
            setSession(decoded);
            console.log(decoded);

            router.push("/");

        } catch (err) {
            console.error("Login Error:", err);
            alert("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
            <h2 className="text-2xl font-semibold mb-4">Login</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input
                    type="text"
                    {...register("username", { required: "Username is required" })}
                    placeholder="Username"
                    className="w-full p-2 border rounded"
                />
                {errors.username && (
                    <p className="text-red-500 text-sm">{errors.username.message}</p>
                )}

                <input
                    type="password"
                    {...register("password", { required: "Password is required" })}
                    placeholder="Password"
                    className="w-full p-2 border rounded"
                />
                {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}

                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
                    Login
                </button>

                <div className="text-center mt-4 text-sm">
                    หากคุณยังไม่มีบัญชี{" "}
                    <span
                        className="text-blue-600 hover:underline cursor-pointer"
                        onClick={() => router.push("/register")}
                    >
                        สร้างบัญชี
                    </span>
                </div>
                <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="mt-4 text-sm text-gray-600 hover:underline"
                >
                    ← กลับหน้าหลัก
                </button>
            </form>
        </div>
    );
}
