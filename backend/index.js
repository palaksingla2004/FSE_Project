const express = require("express");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { OAuth2Client } = require("google-auth-library");
const fs = require("fs");
const dotenv = require("dotenv");
const { User, Product, sequelize } = require("./models"); // Import Sequelize models

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 4000;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";
const JWT_SECRET = process.env.JWT_SECRET || "secret_ecom";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors());

// Database Connection
sequelize.sync({ alter: true })
    .then(() => console.log("✅ Database synchronized successfully!"))
    .catch(err => console.error("❌ Database sync error:", err));

// ============================
// 🛡️ JWT Middleware - Protect Routes
// ============================
const fetchUser = async (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        return res.status(401).json({ error: "Unauthorized access - Token required" });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};

// ============================
// 📂 Image Upload (Multer)
// ============================
const uploadDir = "./upload/images";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });

// ============================
// 📌 Routes
// ============================

// 🔹 Upload Image
app.post("/upload", upload.single("product"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    res.json({ success: true, image_url: `/images/${req.file.filename}` });
});
app.use("/images", express.static("upload/images"));

// 🔹 Google Sign-In
app.post("/google-signin", async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        });

        const { name, email } = ticket.getPayload();
        let user = await User.findOne({ where: { email } });

        if (!user) {
            const cart = {};
            user = await User.create({ name, email, password: "", cartData: cart });
        }

        const jwtPayload = { user: { id: user.id } };
        const authToken = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: "1h" });

        res.json({ success: true, token: authToken });
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        res.status(400).json({ success: false, error: "Google Sign-In failed" });
    }
});

// 🔹 User Signup
app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, error: "User already exists" });
        }

        const newUser = await User.create({ name: username, email, password, cartData: {} });

        const jwtPayload = { user: { id: newUser.id } };
        const authToken = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: "1h" });

        res.json({ success: true, token: authToken });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

// 🔹 User Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user || user.password !== password) {
            return res.status(400).json({ success: false, error: "Invalid email or password" });
        }

        const jwtPayload = { user: { id: user.id } };
        const authToken = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: "1h" });

        res.json({ success: true, token: authToken });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

// 🔹 Get All Products
app.get("/allproducts", async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        console.error("Fetching Products Error:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

// 🔹 Add to Cart
app.post("/addtocart", fetchUser, async (req, res) => {
    try {
        const { itemId } = req.body;
        const user = await User.findByPk(req.user.id);

        user.cartData[itemId] = (user.cartData[itemId] || 0) + 1;
        await user.save();

        res.json({ success: true, cart: user.cartData });
    } catch (error) {
        console.error("Add to Cart Error:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

// 🔹 Remove from Cart
app.post("/removefromcart", fetchUser, async (req, res) => {
    try {
        const { itemId } = req.body;
        const user = await User.findByPk(req.user.id);

        if (user.cartData[itemId]) user.cartData[itemId] = Math.max(0, user.cartData[itemId] - 1);
        await user.save();

        res.json({ success: true, cart: user.cartData });
    } catch (error) {
        console.error("Remove from Cart Error:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

// 🔹 Get Cart Data
app.post("/getcart", fetchUser, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        res.json(user.cartData);
    } catch (error) {
        console.error("Get Cart Error:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

// 🔹 Get User Data
app.get("/getuser", fetchUser, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: { exclude: ["password"] } });
        if (!user) {
            return res.status(400).json({ success: false, error: "User not found" });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error("Get User Error:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

// ============================
// 🚀 Start Server
// ============================
app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
});
