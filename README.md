# User Management System

โจทย์: "ระบบจัดการผู้ใช้งาน (User Management System)" สร้างด้วย **Next.js**, **Prisma**, และ **REST API**  
รองรับฟีเจอร์:
- เพิ่มผู้ใช้งาน
- แก้ไขข้อมูลผู้ใช้งาน
- ลบผู้ใช้งาน
- แสดงรายการผู้ใช้งานทั้งหมด

## Installation

###  Clone โปรเจกต์

```bash
git clone https://github.com/ZygFridz/Test-Full.git
```

** Frontend **

ติดตั้ง Dependencies ด้วยคำสั่ง
```bash
npm install react-hook-form   #react-hook
npm install tailwindcss postcss autoprefixer  # install tailwind
npx tailwindcss init -p
```
run frontend ด้วยคำสั่ง 
```bash
npm run dev
```

** Backend **

ติดตั้ง Database Prisma ด้วยคำสั่ง 
```bash
npm install @prisma/client
```
ติดตั้ง dependencies
```bash
npm install cors
```

เชื่อมต่อ database โดยใส่ database_url ในไฟล์ .env ดังนี้
```bash
DATABASE_URL="mysql://root:123456@localhost:3306/test"
```
** Setup Prisma **
```bash
npx prisma generate
npx prisma migrate dev --name init
```
run backend ด้วยคำสั่ง 
```bash
npm run dev
```
## Usage

เปิดเบราว์เซอร์และเข้า http://localhost:3000

หน้าแรกจะแสดง "All Users" พร้อมปุ่ม Add User

สามารถ:

- กรอกฟอร์มเพิ่มผู้ใช้

- แก้ไข/ลบผู้ใช้งานที่มีอยู่

ฝั่ง Backend:

- API รันที่ http://localhost:3005/users

- สามารถทดสอบผ่าน Postman หรือ browser

## Project Structure
```
Test-Full/
├── backend/                   # Express.js Backend
│   ├── controllers/           # จัดการ logic ของ endpoint
│   ├── routes/                # Routing ของ API
│   ├── prisma/                # Prisma ORM schema และ migration
│   ├── services/              # Layer สำหรับ business logic
│   ├── .env                   # ไฟล์ตั้งค่าตัวแปร Backend
│   └── index.js               # Entry point ของ Backend
│
├── frontend/                  # Next.js App Router (Frontend)
│   ├── .next/                 # Build output (auto-generated)
│   ├── node_modules/          # Node.js dependencies (auto-generated)
│   ├── public/                # Static assets เช่น รูปภาพ, fonts
│   ├── src/
│   │   └── app/               # App Router directory
│   │       ├── favicon.ico    # Website icon
│   │       ├── globals.css    # Global styles
│   │       ├── layout.js      # Shared layout across pages
│   │       └── page.js        # Default route (homepage)
│   ├── .env                   # ตัวแปรสภาพแวดล้อมของ Frontend
│   ├── .gitignore             # ไฟล์หรือโฟลเดอร์ที่ไม่ต้องการให้ track
│   ├── eslint.config.mjs      # ESLint configuration
│   ├── jsconfig.json          # Path aliases และ IntelliSense
│   ├── next.config.mjs        # การตั้งค่า Next.js
│   ├── package.json           # Metadata และ dependencies
│   ├── package-lock.json      # ล็อกเวอร์ชันของ dependencies
│   ├── postcss.config.mjs     # PostCSS configuration
│   └── README.md              # เอกสารสำหรับ frontend
│
└── README.md                  # เอกสารรวมของทั้งโปรเจกต์
```

### System Requirements

- Node.js  version >= 18.x
- MySQL version 8.0  

### Database Setting

- ติดตั้ง MySQL และเปิดใช้งานเซิร์ฟเวอร์
- สร้าง Database ใหม่ เช่น `test`
- แก้ไข `.env` ในโฟลเดอร์ `backend` ให้เชื่อมต่อกับฐานข้อมูลของคุณ:

## License

[MIT](https://choosealicense.com/licenses/mit/)
