require("dotenv").config();
const path = require("path");

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const authRoutes = require("./src/routes/authRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const productRoutes = require("./src/routes/productRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");

const cartRoutes = require("./src/routes/cartRoutes");

const orderRoutes = require("./src/routes/orderRoutes");

const dashboardRoutes = require("./src/routes/dashboardRoutes");

const userRoutes = require("./src/routes/userRoutes");

const { notFound, errorHandler } = require("./src/middleware/errorMiddleware");

const connectDB = require("./src/config/db");

const app = express();

connectDB();

app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.ADMIN_URL],
    credentials: true,
  }),
);

app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginEmbedderPolicy: false,
}));

app.use(compression());

app.use(express.json({ limit: "10mb" }));

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Toy Shop API Running...",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/products", productRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
