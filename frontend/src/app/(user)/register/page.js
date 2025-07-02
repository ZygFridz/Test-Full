"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        if (data.password !== data.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const res = await fetch("http://localhost:3005/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error("Registration failed");
            }

            console.log("Register Data:", data);
            router.push("/login"); // ✅ ไปหน้า login หลังสมัครสำเร็จ

        } catch (err) {
            console.error("Register Error:", err);
            alert("การสมัครไม่สำเร็จ");
        }
    };

    const password = watch("password");

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
            <h2 className="text-2xl font-semibold mb-4">Register</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input
                    {...register("username", { required: "Username is required" })}
                    placeholder="Username"
                    className="w-full p-2 border rounded"
                />
                {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

                <input
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    placeholder="Email"
                    className="w-full p-2 border rounded"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

                <input
                    type="password"
                    {...register("password", { required: "Password is required", minLength: 6 })}
                    placeholder="Password"
                    className="w-full p-2 border rounded"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

                <input
                    type="password"
                    {...register("confirmPassword", {
                        required: "Confirm password is required",
                        validate: (value) => value === password || "Passwords do not match",
                    })}
                    placeholder="Confirm Password"
                    className="w-full p-2 border rounded"
                />
                {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                )}

                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
                    Register
                </button>
                <div className="text-center mt-4 text-sm">
                    หากมีบัญชีอยู่แล้ว?{" "}
                    <span
                        className="text-blue-600 hover:underline cursor-pointer"
                        onClick={() => router.push("/login")}
                    >
                        ลงชื่อเข้าใช้
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
