const express = require("express");
const path = require("path");
const multer = require("multer");
const bodyParser = require("body-parser");
const axios = require("axios");
const fs = require("fs");
const moment = require("moment");
const sequelize = require("sequelize");
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "./uploads")); // set destination
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    ); // set filename
  },
});

const { cars } = require("./models");
const { Op } = require('sequelize');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));
app.use(bodyParser.json());

// CREATE DATA CARS
app.get("/create-data", (req, res) => {
  res.render("create");
});

app.post(
  "/api/cars",
  multer({ storage: diskStorage }).single("imgCars"),
  (req, res) => {
    const car = new cars({
      name: req.body.name,
      rentCost: req.body.rentCost,
      size: req.body.size,
      imgCars: req.file.filename,
    });
    car.save().then((result) => {
      res.send('<script>window.location.href="/";</script>');
    });
  }
);

// READ DATA CARS
app.get("/", (req, res) => {
  axios.get("http://localhost:3000/api/cars").then((response) => {
    res.render("index", {
        cars: response.data,
        moment: moment,
      });
  }).catch((error) => {
    console.log(error);
  });
});

app.get("/api/cars", async (req, res) => {
  try {
    Cars = await cars.findAll();
    res.status(200).json(Cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE DATA CARS
app.get("/edit-car/:id", (req, res) => {
    axios
    .get("http://localhost:3000/api/cars/" + req.params.id)
    .then((response) => {
      res.render("update", { cars: response.data, sizeOptions: ["small", "medium", "large"] });
    })
    .catch((error) => {
      console.log(error);
    });
})

app.get("/api/cars/:id", async (req, res) => {
    try {
        const Cars = await cars.findOne({
          where: { id: req.params.id },
        });
        res.status(200).json(Cars);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
})

app.post("/api/cars/:id", 
multer({ storage: diskStorage }).single("imgCars"),
  async (req, res) => {
    try {
        const { name, rentCost, size } = req.body;
        const imgCars = req.file.filename;
        const Cars = await cars.findOne({
          where: { id: req.params.id },
        });
        fs.unlink(path.join(__dirname, "../uploads/" + Cars.imgCars), (err) => {
          if (err) {
            console.log(err);
          }
        });
        await cars.update(
          {
            name,
            rentCost,
            size,
            imgCars
          },
          {
            where: { id: req.params.id },
          }
        );
        res.send('<script>window.location.href="/";</script>');
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
  }
);

// DELETE DATA CARS
app.get("/api/cars/delete/:id", async (req, res) => {
      const id = req.params.id;
      cars.destroy({
        where: {
          id,
        },
      });
      res.redirect("/");
    });

// FILTER CAR
app.get("/size", (req, res) => {
  axios.get("http://localhost:3000/api/filter?filter=" + req.query.filter).then((response) => {
    res.render("index", {
        cars: response.data,
        moment: moment,
      });
  }).catch((error) => {
    console.log(error);
  });
});

app.get("/api/filter", async (req, res) => {
  if (req.query.filter) {
    Cars = await cars.findAll({
        where: {
            size: {
                [Op.substring]: req.query.filter
            }
        },
    });
    res.status(200).json(Cars);
} else {
  Cars = await cars.findAll();
    res.status(200).json(Cars);
} 
});

// SEARCH CAR
app.post("/search", (req, res) => {
  if (req.body.search === "" || req.body.search === null) {
    return res.redirect("/");
  } else {
    axios
      .get("http://localhost:3000/api/search/" + req.body.search)
      .then((response) => {
        res.render("index", { cars: response.data, moment: moment });
      })
      .catch((error) => {
        console.log(error);
      });
  }
})

app.get("/api/search/:search", async (req, res) => {
  try {
    const lookFor = req.params.search.toLowerCase();
    Cars = await cars.findAll({
      where: {
        name: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("name")),
          "LIKE",
          "%" + lookFor + "%"
        ),
      },
    });
    res.status(200).json(Cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})


app.listen(PORT, () => {
  console.log(`App Running on http://localhost:` + PORT);
});
