const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const appServer = express();
appServer.use(express.json());
appServer.use(express.urlencoded({ extended: true }));

appServer.use(express.static("public"));

const PORT = process.env.PORT || 8888;
const clientId = process.env.PP_CLIENT_ID;
const clientSecret = process.env.PP_CLIENT_SECRET;
const sandBoxAccesTokenUrl = "https://api-m.sandbox.paypal.com/v1/oauth2/token";
const sandBoxOrdersUrl = "https://api-m.sandbox.paypal.com/v2/checkout/orders";

//Mock products
const mock = [
  {
    items: [
      {
        name: "Red Bull",
        quantity: "2",
        unit_amount: {
          currency_code: "BRL",
          value: "50.00",
        },
      },
      {
        name: "Coca Cola",
        quantity: "1",
        unit_amount: {
          currency_code: "BRL",
          value: "30.00",
        },
      },
      {
        name: "Sprite",
        quantity: "3",
        unit_amount: {
          currency_code: "BRL",
          value: "20.00",
        },
      },
    ],
    amount: {
      currency_code: "BRL",
      value: "190.00",
      breakdown: {
        item_total: {
          currency_code: "BRL",
          value: "190.00",
        },
      },
    },
  },
];

/* Routes: */

appServer.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/index.html");
});

// Get Access Token
appServer.get("/get-access-token", async (req, res) => {
  const accessTokenData = await getAccessToken();
  //console.log(accessTokenData);
  res.json(accessTokenData);
});

// Create Order
appServer.post("/create-order", (req, res) => {
  getAccessToken().then((accessToken) => {
    // Building a json to create an order
    let createOrderJson = {
      intent: "CAPTURE",
      purchase_units: mock,
      payment_source: {
        paypal: {
          name: {
            given_name: "Arthur",
            surname: "Nonato",
          },
          email_address: "arthur.test.env@gmail.com",
          phone: {
            phone_number: {
              national_number: "15551234567",
            },
          },
          address: {
            address_line_1: "22 Anderson Lane",
            address_line_2: "",
            admin_area_1: "NJ",
            admin_area_2: "South Plainfield",
            postal_code: "07080",
            country_code: "US",
          },
        },
      },
    };
    //Stringfy
    let createOrderStr = JSON.stringify(createOrderJson);
    //Make the Rest call
    console.log(accessToken);

    axios
      .post(sandBoxOrdersUrl, createOrderStr, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        console.error(error);
      });
  });
});

// Complete Order
appServer.post("/complete-order", (req, res) => {
  get_access_token()
    .then((access_token) => {
      console.log(req.body.order_id);
      console.log(req.body.intent);
      // fetch(
      //   endpoint_url +
      //     "/v2/checkout/orders/" +
      //     req.body.order_id +
      //     "/" +
      //     req.body.intent,
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${access_token}`,
      //     },
      //   }
      // )
      //   .then((res) => res.json())
      //   .then((json) => {
      //     console.log(json);
      //     res.send(json);
      //   }); //Send minimal data to client
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

// getAccessToken function
async function getAccessToken() {
  const returnedData = await axios({
    url: `${sandBoxAccesTokenUrl}`,
    data: "grant_type=client_credentials",
    method: "post",
    auth: {
      username: clientId,
      password: clientSecret,
    },
  });
  //console.log("function getAccessToken(): " + returnedData.data.access_token);
  return returnedData.data.access_token;
}

appServer.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`);
});
