const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");


const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username?.trim() || !email?.trim() || !password?.trim()) {
            return res.status(400).json({ msg: "กรุณากรอกข้อมูลให้ครบถ้วน" });
        }

        //validate email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ msg: "อีเมลไม่ถูกต้อง" });
        }

        //validate username
        const existingUser = await prisma.user.count({
            where: {
                OR: [
                    { username: username },
                    { email: email }
                ]
            }
        });
        if (existingUser >= 1) {
            return res.status(400).json({ msg: "มีผู้ใช้งานหรืออีเมลนี้อยู่แล้ว" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: hashedPassword
            },
        })
        return res.status(201).json({ msg: "สร้างบัญชีผู้ใช้สำเร็จ" });

    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการลงทะเบียน:", error);
        return res.status(500).json({ msg: "Server error" });
    }
}

const login = async (req, res) => {
    try {

        const { username, password } = req.body;

        //validate input
        if (!username?.trim() || !password?.trim()) {
            res.status(400);
            return res.status(400).json({ msg: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน" });
        }
        // validate user
        const user = await prisma.user.findMany({
            where: {
                username: username,
            }
        })

        if (!user) {
            res.status(404);
            return res.status(400).json({ msg: "ไม่พบบัญชีชื่อผู้ใช้งานนี้" });
        }

        const checkpassword = await bcrypt.compare(password, user.password)
        if (checkpassword) {
            const accessToken = jwt.sign({
                user: {
                    username: user.username,
                    email: user.email,
                    id: user.id,
                    role: user.role
                }
            },
                process.env.TOKEN_SECRET,
                { expiresIn: "1d" }
            );
            return res.status(200).json({
                msg: "เข้าสู่ระบบสำเร็จ",
                token: accessToken,
            })
        } else {
            return res.status(401).json({ msg: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
        }
    } catch (error) {
    console.error("พบปัญหาในการเข้าสู่ระบบ :", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
    register,
    login
}