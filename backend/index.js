const express = require("express");
const app = express();
//const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { OAuth2Client } = require("google-auth-library");
const fs = require("fs");


const port = process.env.PORT || 4000;
const GOOGLE_CLIENT_ID = "739102172608-6d69ujbfmu9jpvpqj3134f6ql1tnrcpp.apps.googleusercontent.com"; // Replace with your Google Client ID
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

app.use(cookieParser());
app.use(express.json());
app.use(cors());

// // MongoDB Connection
// mongoose
//   .connect("mongodb://localhost:27017/ecommercelogin", { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));
const mysql = require("mysql2");

// Create MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ojas1804",
  database: "my_database", // Make sure this database exists
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
  } else {
    console.log("Connected to MySQL!");
  }
});


// User Model
//const userSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   password: String, // For standard login. Leave blank for Google users.
//   cartData: Object,
// });
//const Users = mongoose.model("Users", userSchema);

// Product Model
// const Product = mongoose.model("Product", {
//   id: { type: Number, required: true },
//   name: { type: String, required: true },
//   description: { type: String, required: true },
//   image: { type: String, required: true },
//   category: { type: String, required: true },
//   new_price: Number,
//   old_price: Number,
//   date: { type: Date, default: Date.now },
//   available: { type: Boolean, default: true },
// });

// Middleware to verify JWT
const fetchuser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ errors: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).json({ errors: "Invalid token" });
  }
};

// Image Upload (Multer)
const uploadDir = "./upload/images";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage: storage });

app.post("/upload", upload.single("product"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: 0, message: "No file uploaded" });
  }
  res.json({ success: 1, image_url: `/images/${req.file.filename}` });
});
app.use("/images", express.static("upload/images"));

// Google Sign-In
app.post("/google-signin", async (req, res) => {
  const { token } = req.body;
  try {
    // Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const { name, email } = ticket.getPayload();
    let user = await Users.findOne({ email });

    // Create a new user if not found
    if (!user) {
      const cart = Array.from({ length: 300 }).reduce((acc, _, i) => ({ ...acc, [i]: 0 }), {});
      user = new Users({ name, email, password: "", cartData: cart });
      await user.save();
    }

    const jwtPayload = { user: { id: user.id } };
    const authToken = jwt.sign(jwtPayload, "secret_ecom", { expiresIn: "1h" });

    res.json({ success: true, token: authToken });
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    res.status(400).json({ success: false, errors: "Google Sign-In failed" });
  }
});

// Standard Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await Users.findOne({ email });
  if (!user || user.password !== password) {
    return res.status(400).json({ success: false, errors: "Invalid email or password" });
  }

  const jwtPayload = { user: { id: user.id } };
  const authToken = jwt.sign(jwtPayload, "secret_ecom", { expiresIn: "1h" });

  res.json({ success: true, token: authToken });
});

// Standard Signup
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await Users.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, errors: "User already exists" });
  }

  const cart = Array.from({ length: 300 }).reduce((acc, _, i) => ({ ...acc, [i]: 0 }), {});
  const newUser = new Users({ name: username, email, password, cartData: cart });
  await newUser.save();

  const jwtPayload = { user: { id: newUser.id } };
  const authToken = jwt.sign(jwtPayload, "secret_ecom", { expiresIn: "1h" });

  res.json({ success: true, token: authToken });
});

// Get All Products
app.get("/allproducts", async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// Add to Cart
app.post("/addtocart", fetchuser, async (req, res) => {
  const { itemId } = req.body;
  const user = await Users.findById(req.user.id);

  if (!user.cartData[itemId]) user.cartData[itemId] = 0;
  user.cartData[itemId] += 1;

  await user.save();
  res.json({ success: true, cart: user.cartData });
});

// Remove from Cart
app.post("/removefromcart", fetchuser, async (req, res) => {
  const { itemId } = req.body;
  const user = await Users.findById(req.user.id);

  if (user.cartData[itemId]) user.cartData[itemId] -= 1;
  if (user.cartData[itemId] < 0) user.cartData[itemId] = 0;

  await user.save();
  res.json({ success: true, cart: user.cartData });
});

// Get Cart Data
app.post("/getcart", fetchuser, async (req, res) => {
  const user = await Users.findById(req.user.id);
  res.json(user.cartData);
});


// Get User Data
app.get('/getuser', fetchuser, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id).select('-password'); // Exclude password
    if (!user) {
      return res.status(400).json({ success: false, errors: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, errors: 'Server error' });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});