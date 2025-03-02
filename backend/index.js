// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const multer = require("multer");
// const jwt = require("jsonwebtoken");
// const path = require("path");
// const cors = require("cors");//Cross origin resource sharing
// const port = process.env.PORT || 4000;
// const fs = require('fs'); 

// app.use(express.json());
// app.use(cors());

// const Users = require('./usermodels'); // Adjust the path according to your file structure

// app.use(express.static(path.join(__dirname, '../frontend/build')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
// });

// mongoose.connect("mongodb://localhost:27017/ecommercelogin")
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

//   app.post('/login', async (req, res) => {
//     console.log("Login");
//     let success = false;
//     let user = await Users.findOne({ email: req.body.email });
//     if (user) {
//       const passCompare = req.body.password === user.password;
//       if (passCompare) {
//         const data = {
//           user: {
//             id: user.id
//           }
//         }
//         success = true;
//         console.log(user.id);
//         const token = jwt.sign(data, 'secret_ecom');
//         res.json({ success, token });
//       }
//       else {
//         return res.status(400).json({ success: success, errors: "please try with correct email/password" })
//       }
//     }
//     else {
//       return res.status(400).json({ success: success, errors: "please try with correct email/password" })
//     }
//   })
// app.post('/signup', async (req, res) => {
//     console.log("Sign Up");
//     let success = false;
//     let check = await Users.findOne({ email: req.body.email });
//     if (check) {
//       return res.status(400).json({ success: success, errors: "existing user found with this email" });
//     }
    
//     const user = new Users({
//       name: req.body.username,
//       email: req.body.email,
//       password: req.body.password,
     
//     });
    
//     await user.save();
//     const data = {
//       user: {
//         id: user.id
//       }
//     };
  
//     const token = jwt.sign(data, 'secret_ecom');
//     success = true;
//     res.json({ success, token });
//   });
//   //Image Storage Engine 
//   const uploadDir = './upload/images';
//   if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
//   }
//   // Set up multer storage
//   const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//       cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
//     }
//   });
//   const upload = multer({ storage: storage });
//   // Define the upload endpoint
//   app.post("/upload", upload.single('product'), (req, res) => {
//     if (!req.file) {
//       return res.status(400).json({ success: 0, message: "No file uploaded" });
//     }
//     res.json({
//       success: 1,
//       image_url: `/images/${req.file.filename}`
//     });
//   });

// // Route for Images folder
// app.use('/images', express.static('upload/images'));


// // // MiddleWare to fetch user from token
// // const fetchuser = async (req, res, next) => {
// //   const token = req.header("auth-token");
// //   if (!token) {
// //     res.status(401).send({ errors: "Please authenticate using a valid token" });
// //   }
// //   try {
// //     const data = jwt.verify(token, "secret_ecom");
// //     req.user = data.user;
// //     next();
// //   } catch (error) {
// //     res.status(401).send({ errors: "Please authenticate using a valid token" });
// //   }
// // };

// const fetchuser = (req, res, next) => {
//   const token = req.header("auth-token");

//   // Check if token is provided
//   if (!token) {
//     return res.status(401).json({ errors: "Please authenticate using a valid token" });
//   }

//   try {
//     // Verify token and extract user data
//     const data = jwt.verify(token, "secret_ecom");
//     req.user = data.user; // Attach user to the request object
//     next(); // Pass control to the next middleware
//   } catch (error) {
//     console.error("JWT Verification Error:", error.message); // Log the error for debugging
//     res.status(401).json({ errors: "Invalid or expired token. Please authenticate again." });
//   }
// };






// // Schema for creating user model
// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, unique: true, required: true },
//   password: { type: String, required: true },
//   cartData: { type: Object },
//   date: { type: Date, default: Date.now },
// });


// // Schema for creating Product
// const Product = mongoose.model("Product", {
//   id: { type: Number, required: true },
//   name: { type: String, required: true },
//   description: { type: String, required: true },
//   image: { type: String, required: true },
//   category: { type: String, required: true },
//   new_price: { type: Number },
//   old_price: { type: Number },
//   date: { type: Date, default: Date.now },
//   avilable: { type: Boolean, default: true },
// });


// // ROOT API Route For Testing
// app.get("/", (req, res) => {
//   res.send("Root");
// });





// // endpoint for getting all products data
// app.get("/allproducts", async (req, res) => {
//   let products = await Product.find({});
//   console.log("All Products");
//   res.send(products);
// });


// // endpoint for getting latest products data
// app.get("/newcollections", async (req, res) => {
//   let products = await Product.find({});
//   let arr = products.slice(0).slice(-8);
//   console.log("New Collections");
//   res.send(arr);
// });


// // endpoint for getting womens products data
// app.get("/popularinwomen", async (req, res) => {
//   let products = await Product.find({ category: "women" });
//   let arr = products.splice(0, 4);
//   console.log("Popular In Women");
//   res.send(arr);
// });

// // endpoint for getting womens products data
// app.post("/relatedproducts", async (req, res) => {
//   console.log("Related Products");
//   const {category} = req.body;
//   const products = await Product.find({ category });
//   const arr = products.slice(0, 4);
//   res.send(arr);
// });


// // Create an endpoint for saving the product in cart
// app.post('/addtocart', fetchuser, async (req, res) => {
//   console.log("Add Cart");
//   let userData = await Users.findOne({ _id: req.user.id });
//   userData.cartData[req.body.itemId] += 1;
//   await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
//   res.send("Added")
// })


// // Create an endpoint for removing the product in cart
// app.post('/removefromcart', fetchuser, async (req, res) => {
//   console.log("Remove Cart");
//   let userData = await Users.findOne({ _id: req.user.id });
//   if (userData.cartData[req.body.itemId] != 0) {
//     userData.cartData[req.body.itemId] -= 1;
//   }
//   await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
//   res.send("Removed");
// })


// // Create an endpoint for getting cartdata of user
// app.post('/getcart', fetchuser, async (req, res) => {
//   console.log("Get Cart");
//   let userData = await Users.findOne({ _id: req.user.id });
//   res.json(userData.cartData);

// })


// // Create an endpoint for adding products using admin panel
// app.post("/addproduct", async (req, res) => {
//   let products = await Product.find({});
//   let id;
//   if (products.length > 0) {
//     let last_product_array = products.slice(-1);
//     let last_product = last_product_array[0];
//     id = last_product.id + 1;
//   }
//   else { id = 1; }
//   const product = new Product({
//     id: id,
//     name: req.body.name,
//     description: req.body.description,
//     image: req.body.image,
//     category: req.body.category,
//     new_price: req.body.new_price,
//     old_price: req.body.old_price,
//   });
//   await product.save();
//   console.log("Saved");
//   res.json({ success: true, name: req.body.name })
// });


// // Create an endpoint for removing products using admin panel
// app.post("/removeproduct", async (req, res) => {
//   await Product.findOneAndDelete({ id: req.body.id });
//   console.log("Removed");
//   res.json({ success: true, name: req.body.name })
// });








// app.listen(port, (error) => {
//     if (!error) console.log("Server Running on port " + port);
//     else console.log("Error : ", error);
//   });




// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const multer = require("multer");
// const jwt = require("jsonwebtoken");
// const path = require("path");
// const cors = require("cors");
// const port = process.env.PORT || 4000;
// const fs = require("fs");

// app.use(express.json());
// app.use(cors());

// // Models
// const Users = require('./usermodels');
// const Product = require('./models/Product'); // Adjust the path if necessary

// // Serve static files (images)
// app.use('/images', express.static('upload/images'));

// // Connect to MongoDB
// mongoose.connect("mongodb://localhost:27017/ecommercelogin")
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));



//   app.post('/login', async (req, res) => {
//     console.log("Login");
//     let success = false;
//     let user = await Users.findOne({ email: req.body.email });
//     if (user) {
//       const passCompare = req.body.password === user.password;
//       if (passCompare) {
//         const data = {
//           user: {
//             id: user.id
//           }
//         }
//         success = true;
//         console.log(user.id);
//         const token = jwt.sign(data, 'secret_ecom');
//         res.json({ success, token });
//       }
//       else {
//         return res.status(400).json({ success: success, errors: "please try with correct email/password" })
//       }
//     }
//     else {
//       return res.status(400).json({ success: success, errors: "please try with correct email/password" })
//     }
//   })
// app.post('/signup', async (req, res) => {
//     console.log("Sign Up");
//     let success = false;
//     let check = await Users.findOne({ email: req.body.email });
//     if (check) {
//       return res.status(400).json({ success: success, errors: "existing user found with this email" });
//     }
    
//     const user = new Users({
//       name: req.body.username,
//       email: req.body.email,
//       password: req.body.password,
     
//     });
    
//     await user.save();
//     const data = {
//       user: {
//         id: user.id
//       }
//     };
  
//     const token = jwt.sign(data, 'secret_ecom');
//     success = true;
//     res.json({ success, token });
//   });


// // Middleware to authenticate user from token
// const fetchuser = (req, res, next) => {
//   const token = req.header("auth-token");
//   if (!token) {
//     return res.status(401).json({ errors: "Please authenticate using a valid token" });
//   }

//   try {
//     const data = jwt.verify(token, "secret_ecom");
//     req.user = data.user;
//     next();
//   } catch (error) {
//     console.error("JWT Verification Error:", error.message);
//     res.status(401).json({ errors: "Invalid or expired token. Please authenticate again." });
//   }
// };




// // Upload images
// const uploadDir = './upload/images';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
//   }
// });
// const upload = multer({ storage: storage });

// // API Endpoints
// app.post("/upload", upload.single('product'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ success: 0, message: "No file uploaded" });
//   }
//   res.json({ success: 1, image_url: `/images/${req.file.filename}` });
// });

// app.post('/addproduct', async (req, res) => {
//   let products = await Product.find({});
//   let id;
//   if (products.length > 0) {
//     let last_product = products.slice(-1)[0];
//     id = last_product.id + 1;
//   } else {
//     id = 1;
//   }

//   const product = new Product({
//     id: id,
//     name: req.body.name,
//     description: req.body.description,
//     image: req.body.image,
//     category: req.body.category,
//     new_price: req.body.new_price,
//     old_price: req.body.old_price,
//   });

//   await product.save();
//   res.json({ success: true, name: req.body.name });
// });

// app.get("/allproducts", async (req, res) => {
//   try {
//     const products = await Product.find({});
//     res.json(products);
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({ error: "Failed to fetch products" });
//   }
// });

// // Serve the React app
// app.use(express.static(path.join(__dirname, '../frontend/build')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
// });

// // Start server
// app.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });


// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
// const multer = require("multer");
// const path = require("path");
// const cors = require("cors");
// const port = process.env.PORT || 4000;
// const fs = require('fs'); 
// const Users = require('./usermodels.js');
// const generateToken = require('./Middlewares/jwtMiddleware.js');
// const { isAdminAuthenticated } = require("./Middlewares/jwtAuthMiddleware.js");
// const cookieParser = require("cookie-parser");
// const cartController = require("./controllers/cartController.js");



// app.use(cookieParser());


// app.use(express.json());
// app.use(cors());

// // Database Connection With MongoDB
// mongoose.connect("mongodb://localhost:27017/ecommercelogin")
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));



//   //Image Storage Engine 
//   const uploadDir = './upload/images';
//   if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
//   }
//   // Set up multer storage
//   const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//       cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
//     }
//   });
//   const upload = multer({ storage: storage });
//   // Define the upload endpoint
//   app.post("/upload", upload.single('product'), (req, res) => {
//     if (!req.file) {
//       return res.status(400).json({ success: 0, message: "No file uploaded" });
//     }
//     res.json({
//       success: 1,
//       image_url: `/images/${req.file.filename}`
//     });
//   });



// // Route for Images folder
// app.use('/images', express.static('upload/images'));


// // MiddleWare to fetch user from token
// const fetchuser = async (req, res, next) => {
//   const token = req.header("auth-token");
//   if (!token) {
//     res.status(401).send({ errors: "Please authenticate using a valid token" });
//   }
//   try {
//     const data = jwt.verify(token, "secret_ecom");
//     req.user = data.user;
//     next();
//   } catch (error) {
//     res.status(401).send({ errors: "Please authenticate using a valid token" });
//   }
// };


// // Schema for creating user model
// // const Users = mongoose.model("Users", {
// //   name: { type: String },
// //   email: { type: String, unique: true },
// //   password: { type: String },
// //   cartData: { type: Object },
// //   date: { type: Date, default: Date.now() },
// // });


// // Schema for creating Product
// const Product = mongoose.model("Product", {
//   id: { type: Number, required: true },
//   name: { type: String, required: true },
//   description: { type: String, required: true },
//   image: { type: String, required: true },
//   category: { type: String, required: true },
//   new_price: { type: Number },
//   old_price: { type: Number },
//   date: { type: Date, default: Date.now },
//   avilable: { type: Boolean, default: true },
// });


// // ROOT API Route For Testing
// app.get("/", (req, res) => {
//   res.send("Root");
// });


// //for admin
// // app.post('/login1', async (req, res) => {
// //   console.log("Login");
// //   let success = false;
// //   let user = await Users.findOne({ email: req.body.email });
// //   if (user) {
// //     const passCompare = req.body.password === user.password;
// //     if (passCompare) {
// //       const data = {
// //         user: {
// //           id: user.id
// //         }
// //       }
// //       success = true;
// //       console.log(user.id);
// //       const token = jwt.sign(data, 'secret_ecom');
// //       res.json({ success, token });
// //     }
// //     else {
// //       return res.status(400).json({ success: success, errors: "please try with correct email/password" })
// //     }
// //   }
// //   else {
// //     return res.status(400).json({ success: success, errors: "please try with correct email/password" })
// //   }
// // })
// app.post('/login1', async (req, res, next) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//       return next(new ErrorHandler("Please provide the details", 400));
//   }

//   const user = await Users.findOne({ email }).select("+password");

//   if (!user) return next(new ErrorHandler("Invalid credentials", 400));

//   const passwordMatch = password === user.password; // Or await user.comparePassword(password);
//   if (!passwordMatch) {
//     return res.status(400).json({ message: "Password did not match" });
//   }

//   // if(role !== user.role) return next(new ErrorHandler("User with this role not found", 400));

//   generateToken(user, "Login Successful", 200, res);
// });

// app.post('/signup1', async (req, res) => {
//   console.log("Sign Up");
//   let success = false;
//   let check = await Users.findOne({ email: req.body.email });
//   if (check) {
//     return res.status(400).json({ success: success, errors: "existing user found with this email" });
//   }
//   let cart = {};
//   for (let i = 0; i < 300; i++) {
//     cart[i] = 0;
//   }
//   const user = new Users({
//     name: req.body.username,
//     email: req.body.email,
//     password: req.body.password,
//     cartData: cart,
//   });
//   await user.save();
//   const data = {
//     user: {
//       id: user.id
//     }
//   }

//   const token = jwt.sign(data, 'secret_ecom');
//   success = true;
//   res.json({ success, token })
// })

// //for user
// // Create an endpoint at ip/login for login the user and giving auth-token
// app.post('/login', async (req, res) => {
//   console.log("Login");
//   let success = false;
//   let user = await Users.findOne({ email: req.body.email });
//   if (user) {
//     const passCompare = req.body.password === user.password;
//     if (passCompare) {
//       const data = {
//         user: {
//           id: user.id
//         }
//       }
//       success = true;
//       console.log(user.id);
//       const token = jwt.sign(data, 'secret_ecom');
//       res.json({ success, token });
//     }
//     else {
//       return res.status(400).json({ success: success, errors: "please try with correct email/password" })
//     }
//   }
//   else {
//     return res.status(400).json({ success: success, errors: "please try with correct email/password" })
//   }
// })


// //Create an endpoint at ip/auth for regestring the user & sending auth-token
// app.post('/signup', async (req, res) => {
//   console.log("Sign Up");
//   let success = false;
//   let check = await Users.findOne({ email: req.body.email });
//   if (check) {
//     return res.status(400).json({ success: success, errors: "existing user found with this email" });
//   }
//   let cart = {};
//   for (let i = 0; i < 300; i++) {
//     cart[i] = 0;
//   }
//   const user = new Users({
//     name: req.body.username,
//     email: req.body.email,
//     password: req.body.password,
//     cartData: cart,
//   });
//   await user.save();
//   const data = {
//     user: {
//       id: user.id
//     }
//   }

//   const token = jwt.sign(data, 'secret_ecom');
//   success = true;
//   res.json({ success, token })
// })


// // endpoint for getting all products data
// app.get("/allproducts", async (req, res) => {
//   let products = await Product.find({});
//   console.log("All Products");
//   res.send(products);
// });


// // endpoint for getting latest products data
// app.get("/newcollections", async (req, res) => {
//   let products = await Product.find({});
//   let arr = products.slice(0).slice(-8);
//   console.log("New Collections");
//   res.send(arr);
// });


// // endpoint for getting womens products data
// app.get("/popularinwomen", async (req, res) => {
//   let products = await Product.find({ category: "women" });
//   let arr = products.splice(0, 4);
//   console.log("Popular In Women");
//   res.send(arr);
// });

// // endpoint for getting womens products data
// app.post("/relatedproducts", async (req, res) => {
//   console.log("Related Products");
//   const {category} = req.body;
//   const products = await Product.find({ category });
//   const arr = products.slice(0, 4);
//   res.send(arr);
// });


// // Create an endpoint for saving the product in cart
// app.post('/addtocart', fetchuser, async (req, res) => {
//   console.log("Add Cart");
//   let userData = await Users.findOne({ _id: req.user.id });
//   userData.cartData[req.body.itemId] += 1;
//   await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
//   res.send("Added")
// })


// // Create an endpoint for removing the product in cart
// app.post('/removefromcart', fetchuser, async (req, res) => {
//   console.log("Remove Cart");
//   let userData = await Users.findOne({ _id: req.user.id });
//   if (userData.cartData[req.body.itemId] != 0) {
//     userData.cartData[req.body.itemId] -= 1;
//   }
//   await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
//   res.send("Removed");
// })


// // Create an endpoint for getting cartdata of user
// app.post('/getcart', fetchuser, async (req, res) => {
//   let userData = await Users.findOne({ _id: req.user.id });
//   res.json(userData.cartData);
// });



// // Create an endpoint for adding products using admin panel
// app.post("/addproduct", isAdminAuthenticated, async (req, res) => {
//   let products = await Product.find({});
//   let id;
//   if (products.length > 0) {
//     let last_product_array = products.slice(-1);
//     let last_product = last_product_array[0];
//     id = last_product.id + 1;
//   }
//   else { id = 1; }
//   const product = new Product({
//     id: id,
//     name: req.body.name,
//     description: req.body.description,
//     image: req.body.image,
//     category: req.body.category,
//     new_price: req.body.new_price,
//     old_price: req.body.old_price,
//   });
//   await product.save();
//   console.log("Saved");
//   res.json({ success: true, name: req.body.name })
// });


// //Create an endpoint for removing products using admin panel
// app.post("/removeproduct", async (req, res) => {
//   await Product.findOneAndDelete({ id: req.body.id });
//   console.log("Removed");
//   res.json({ success: true, name: req.body.name })
// });

// // app.post('/addtocart', fetchuser, cartController.addToCart);
// // app.post('/removefromcart', fetchuser, cartController.removeFromCart);
// // app.post('/getcart', fetchuser, cartController.getCart);




// // Starting Express Server
// app.listen(port, (error) => {
//   if (!error) console.log("Server Running on port " + port);
//   else console.log("Error : ", error);
// });

// const express = require("express");
// const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
// const multer = require("multer");
// const path = require("path");
// const cors = require("cors");
// const fs = require("fs");
// const cookieParser = require("cookie-parser");
// const { OAuth2Client } = require("google-auth-library"); // Google OAuth library
// const Users = require("./usermodels.js");

// const app = express();
// const port = process.env.PORT || 4000;

// // Middleware
// app.use(express.json());
// app.use(cookieParser());
// app.use(
//   cors({
//     origin: "http://localhost:3000", // Frontend URL
//     credentials: true, // Allow credentials
//   })
// );

// // MongoDB Connection
// mongoose
//   .connect("mongodb://localhost:27017/ecommercelogin", { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // JWT Secret Key
// const JWT_SECRET = "secret_ecom";

// // Google OAuth Client
// const googleClient = new OAuth2Client("YOUR_GOOGLE_CLIENT_ID");

// // Middleware to Fetch User
// const fetchuser = (req, res, next) => {
//   const token = req.header("auth-token");
//   if (!token) return res.status(401).send({ errors: "Please authenticate using a valid token" });

//   try {
//     const data = jwt.verify(token, JWT_SECRET);
//     req.user = data.user;
//     next();
//   } catch (error) {
//     res.status(401).send({ errors: "Please authenticate using a valid token" });
//   }
// };

// // Error Handling Middleware
// app.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   res.status(statusCode).json({ success: false, error: err.message });
// });

// // Routes

// // User Login
// app.post("/login", async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     const user = await Users.findOne({ email });
//     if (!user || user.password !== password) {
//       return res.status(400).json({ success: false, errors: "Invalid email or password" });
//     }

//     const token = jwt.sign({ user: { id: user.id } }, JWT_SECRET, { expiresIn: "1h" });
//     res.json({ success: true, token });
//   } catch (err) {
//     next(err);
//   }
// });

// // User Signup
// app.post("/signup", async (req, res, next) => {
//   try {
//     const { username, email, password } = req.body;
//     if (await Users.findOne({ email })) {
//       return res.status(400).json({ success: false, errors: "User already exists" });
//     }

//     const user = new Users({ name: username, email, password });
//     await user.save();

//     const token = jwt.sign({ user: { id: user.id } }, JWT_SECRET, { expiresIn: "1h" });
//     res.json({ success: true, token });
//   } catch (err) {
//     next(err);
//   }
// });

// // Google Login
// app.post("/google-signup", async (req, res, next) => {
//   try {
//     const { token } = req.body;
//     const ticket = await googleClient.verifyIdToken({
//       idToken: token,
//       audience: "911470685000-k0kvdp6ifki9pvmte5iih121rj1bomp4.apps.googleusercontent.com",
//     });

//     const { email, name } = ticket.getPayload();

//     let user = await Users.findOne({ email });
//     if (!user) {
//       user = new Users({ name, email, password: "" });
//       await user.save();
//     }

//     const jwtToken = jwt.sign({ user: { id: user.id } }, JWT_SECRET, { expiresIn: "1h" });
//     res.json({ success: true, token: jwtToken });
//   } catch (err) {
//     next(err);
//   }
// });

// // Other Routes ...

// // Start Server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
// const multer = require("multer");
// const path = require("path");
// const cors = require("cors");
// const port = process.env.PORT || 4000;
// const fs = require("fs");
// const cookieParser = require("cookie-parser");
// const { isAdminAuthenticated } = require("./Middlewares/jwtAuthMiddleware.js");

// // Middleware
// app.use(cookieParser());
// app.use(express.json());
// app.use(cors());

// // Database Connection
// mongoose
//   .connect("mongodb://localhost:27017/ecommercelogin")
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // Ensure upload directory exists
// const uploadDir = "./upload/images";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Set up multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
//   },
// });
// const upload = multer({ storage: storage });

// // Define the upload endpoint
// app.post("/upload", upload.single("product"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ success: 0, message: "No file uploaded" });
//   }
//   res.json({
//     success: 1,
//     image_url: `/images/${req.file.filename}`,
//   });
// });

// // Route for serving images
// app.use("/images", express.static("upload/images"));

// // Middleware to fetch user from token
// const fetchuser = async (req, res, next) => {
//   const token = req.header("auth-token");
//   if (!token) {
//     return res.status(401).json({ error: "Please authenticate using a valid token" });
//   }
//   try {
//     const data = jwt.verify(token, "secret_ecom");
//     req.user = data.user;
//     next();
//   } catch (error) {
//     res.status(401).json({ error: "Please authenticate using a valid token" });
//   }
// };

// // User Schema
// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   cartData: { type: Object, default: {} },
//   date: { type: Date, default: Date.now },
// });
// const Users = mongoose.model("Users", userSchema);

// // Product Schema
// const productSchema = new mongoose.Schema({
//   id: { type: Number, required: true },
//   name: { type: String, required: true },
//   description: { type: String, required: true },
//   image: { type: String, required: true },
//   category: { type: String, required: true },
//   new_price: { type: Number },
//   old_price: { type: Number },
//   date: { type: Date, default: Date.now },
//   available: { type: Boolean, default: true },
// });
// const Product = mongoose.model("Product", productSchema);

// // Root API Route for Testing
// app.get("/", (req, res) => {
//   res.send("Root");
// });

// // Signup Endpoint
// app.post("/signup", async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     if (!username || !email || !password) {
//       return res.status(400).json({ success: false, error: "All fields are required" });
//     }

//     const existingUser = await Users.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ success: false, error: "User already exists with this email" });
//     }

//     let cart = {};
//     for (let i = 0; i < 300; i++) {
//       cart[i] = 0;
//     }

//     const user = new Users({
//       name: username,
//       email,
//       password,
//       cartData: cart,
//     });

//     await user.save();

//     const data = { user: { id: user.id } };
//     const token = jwt.sign(data, "secret_ecom");
//     res.status(201).json({ success: true, token });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, error: "Internal server error" });
//   }
// });

// // Login Endpoint
// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ success: false, error: "All fields are required" });
//     }

//     const user = await Users.findOne({ email });
//     if (!user || user.password !== password) {
//       return res.status(400).json({ success: false, error: "Invalid email or password" });
//     }

//     const data = { user: { id: user.id } };
//     const token = jwt.sign(data, "secret_ecom");
//     res.json({ success: true, token });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, error: "Internal server error" });
//   }
// });

// // Endpoint for getting all products
// app.get("/allproducts", async (req, res) => {
//   const products = await Product.find({});
//   res.send(products);
// });

// // Endpoint for getting latest products
// app.get("/newcollections", async (req, res) => {
//   const products = await Product.find({});
//   const latestProducts = products.slice(-8);
//   res.send(latestProducts);
// });

// // Add more routes as needed...

// // Starting Express Server
// app.listen(port, (error) => {
//   if (!error) console.log("Server Running on port " + port);
//   else console.log("Error:", error);
// });
const express = require("express");
const app = express();
const mongoose = require("mongoose");
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

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/ecommercelogin", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User Model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String, // For standard login. Leave blank for Google users.
  cartData: Object,
});
const Users = mongoose.model("Users", userSchema);

// Product Model
const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: Number,
  old_price: Number,
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

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