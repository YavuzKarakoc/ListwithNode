const { default: axios } = require("axios");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const app = express();
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

//deneme amaclı fakestoreapi.com dan product listesi çekme
app.get("/", async (req, res) => {
  const fkdata = [];

  const options = {
    hostname: "fakestoreapi.com",
    path: "/products",
    method: "GET",
  };

  const request = http.request(options, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      try {
        const jsonData = JSON.parse(data);
        fkdata.push(jsonData);

        const blist = [1, 2, 3, 4];

        res.json({
          message: "Hoş Geldiniz",
          blist,
          fkdata,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Sunucu hatası" });
      }
    });
  });

  request.on("error", (error) => {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası" });
  });

  request.end();
});

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// token ile uzak sunucudan data çekme
app.post("/api/debtlist", async (req, res) => {
  const { token } = req.body;
  let data = JSON.stringify({
    fieldData: {},
    script: "getData",
  });

  let config = {
    method: "patch",
    maxBodyLength: Infinity,
    url: "https://efatura.etrsoft.com/fmi/data/v1/databases/testdb/layouts/testdb/records/1",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
});

//uzak sunucudan token alma
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const credentials = Buffer.from(`${username}:${password}`).toString("base64");

  let data = JSON.stringify({});

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://efatura.etrsoft.com/fmi/data/v1/databases/testdb/sessions",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
});

const port = 3000;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
