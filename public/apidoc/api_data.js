define({ "api": [
  {
    "type": "delete",
    "url": "/api/auctions/:id",
    "title": "Delete Auction",
    "group": "Auctions",
    "permission": [
      {
        "name": "Auction Owner"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Auction's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "integer",
            "optional": false,
            "field": "Number",
            "description": "<p>of entries deleted</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 201 OK\n{\n   \"records\": 1\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./api/auctions/auction-routes.js",
    "groupTitle": "Auctions",
    "name": "DeleteApiAuctionsId"
  },
  {
    "type": "get",
    "url": "/api/auctions/",
    "title": "Request All Auctions",
    "permission": [
      {
        "name": "Buyer or Seller"
      }
    ],
    "group": "Auctions",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "auctions",
            "description": "<p>Auction</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "auctions.id",
            "description": "<p>ID</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "auctions.user_id",
            "description": "<p>User ID of owner of auction</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "auctions.seller",
            "description": "<p>Username of seller</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "auctions.first_name",
            "description": "<p>First Name of seller</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "auctions.name",
            "description": "<p>Title of auction</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "auctions.description",
            "description": "<p>Description</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "auctions.starting_price",
            "description": "<p>Starting price for item</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "auctions.date_ending",
            "description": "<p>Ending date of auction</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "auctions.image",
            "description": "<p>Link to photo of image</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "auctions.bid_count",
            "description": "<p>Number of bids placed</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "auction.current_price",
            "description": "<p>Highest bid</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "auction.last_bid_date",
            "description": "<p>Time of last bid</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success ",
          "content": "HTTP/1.1 200 OK\n[\n    {\n        \"id\": 1,\n        \"user_id\": 1,\n        \"seller\": \"testseller\",\n        \"first_name\": \"Test\",\n        \"name\": \"iPhone\",\n        \"description\": \"A beautiful space gray iphone 11\",\n        \"starting_price\": 100,\n        \"date_ending\": \"2019-12-29T08:00:00.000Z\",\n        \"image\": \"https://cdn.tmobile.com/content/dam/t-mobile/en-p/cell-phones/apple/Apple-iPhone-11-Pro/Midnight-Green/Apple-iPhone-11-Pro-Midnight-Green-frontimage.jpg\",\n        \"bid_count\": 4,\n        \"current_price\": 250,\n        \"last_bid_date\": \"2019-10-20T07:00:00.000Z\"\n    },\n    {\n        \"id\": 2,\n        \"user_id\": 1,\n        \"seller\": \"testseller\",\n        \"first_name\": \"Test\",\n        \"name\": \"Pixel Plus\",\n        \"description\": \"A Google Pixel\",\n        \"starting_price\": 100,\n        \"date_ending\": \"2019-10-20T07:00:00.000Z\",\n        \"image\": \"https://static.bhphoto.com/images/images1000x1000/1550057716_1448921.jpg\",\n        \"bid_count\": 4,\n        \"current_price\": 220,\n        \"last_bid_date\": \"2019-10-19T07:00:00.000Z\"\n    }\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Update error",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./api/auctions/auction-routes.js",
    "groupTitle": "Auctions",
    "name": "GetApiAuctions"
  },
  {
    "type": "get",
    "url": "/api/auctions/:id",
    "title": "Request Specific Auction",
    "permission": [
      {
        "name": "Buyer or Seller"
      }
    ],
    "group": "Auctions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Auction's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "content": [
          {
            "group": "content",
            "type": "Number",
            "optional": false,
            "field": "auction.id",
            "description": "<p>ID</p>"
          },
          {
            "group": "content",
            "type": "Number",
            "optional": false,
            "field": "auction.user_id",
            "description": "<p>User ID of owner of auction</p>"
          },
          {
            "group": "content",
            "type": "String",
            "optional": false,
            "field": "auction.seller",
            "description": "<p>Username of seller</p>"
          },
          {
            "group": "content",
            "type": "String",
            "optional": false,
            "field": "auction.first_name",
            "description": "<p>First Name of seller</p>"
          },
          {
            "group": "content",
            "type": "String",
            "optional": false,
            "field": "auction.name",
            "description": "<p>Title of auction</p>"
          },
          {
            "group": "content",
            "type": "String",
            "optional": false,
            "field": "auction.description",
            "description": "<p>Description</p>"
          },
          {
            "group": "content",
            "type": "Number",
            "optional": false,
            "field": "auction.starting_price",
            "description": "<p>Starting price for item</p>"
          },
          {
            "group": "content",
            "type": "Date",
            "optional": false,
            "field": "auction.date_ending",
            "description": "<p>Ending date of auction</p>"
          },
          {
            "group": "content",
            "type": "String",
            "optional": false,
            "field": "auction.image",
            "description": "<p>Link to photo of image</p>"
          },
          {
            "group": "content",
            "type": "Object[]",
            "optional": false,
            "field": "auction.bids",
            "description": "<p>Bids</p>"
          },
          {
            "group": "content",
            "type": "Number",
            "optional": false,
            "field": "auction.bids.id",
            "description": "<p>ID of Bid</p>"
          },
          {
            "group": "content",
            "type": "String",
            "optional": false,
            "field": "auction.bids.seller",
            "description": "<p>Username of seller</p>"
          },
          {
            "group": "content",
            "type": "String",
            "optional": false,
            "field": "auction.bids.first_name",
            "description": "<p>First Name of seller</p>"
          },
          {
            "group": "content",
            "type": "Number",
            "optional": false,
            "field": "auction.bids.price",
            "description": "<p>Price of Bid</p>"
          },
          {
            "group": "content",
            "type": "Date",
            "optional": false,
            "field": "auction.bids.created_at",
            "description": "<p>Date of Bid</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success ",
          "content": "HTTP/1.1 200 OK\n{\n \"id\": 1,\n \"user_id\": 1,\n \"seller\": \"testseller\",\n \"first_name\": \"Test\",\n \"name\": \"iPhone\",\n \"description\": \"A beautiful space gray iphone 11\",\n \"starting_price\": 100,\n \"date_ending\": \"2019-12-29T08:00:00.000Z\",\n \"image\": \"https://cdn.tmobile.com/content/dam/t-mobile/en-p/cell-phones/apple/Apple-iPhone-11-Pro/Midnight-Green/Apple-iPhone-11-Pro-Midnight-Green-frontimage.jpg\",\n \"bids\": [\n     {\n         \"id\": 1,\n         \"username\": \"testseller2\",\n         \"first_name\": \"Test\",\n         \"price\": 150,\n         \"created_at\": \"2019-10-19T20:00:00.000Z\"\n     },\n     {\n         \"id\": 2,\n         \"username\": \"testbuyer\",\n         \"first_name\": \"Test\",\n         \"price\": 200,\n         \"created_at\": \"2019-10-19T22:00:00.000Z\"\n     },\n   ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./api/auctions/auction-routes.js",
    "groupTitle": "Auctions",
    "name": "GetApiAuctionsId"
  },
  {
    "type": "post",
    "url": "/api/auctions/",
    "title": "Add an auction",
    "permission": [
      {
        "name": "Seller"
      }
    ],
    "group": "Auctions",
    "parameter": {
      "fields": {
        "request": [
          {
            "group": "request",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name/Title of auction</p>"
          },
          {
            "group": "request",
            "type": "Number",
            "optional": false,
            "field": "starting_price",
            "description": "<p>Starting bid</p>"
          },
          {
            "group": "request",
            "type": "Date",
            "optional": false,
            "field": "date_ending",
            "description": "<p>End Date of Auction</p>"
          },
          {
            "group": "request",
            "type": "String",
            "optional": true,
            "field": "description",
            "description": "<p>Description of product</p>"
          },
          {
            "group": "request",
            "type": "string",
            "optional": false,
            "field": "image",
            "description": "<p>URL to image</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"name\": \"iPhone\",\n  \"starting_price\": 50,\n  \"date_ending\": new Date(10/31/19),\n  \"description\": \"A brand new iPhone\",\n  \"image\": \"https://cdn.vox-cdn.com/thumbor/Pkmq1nm3skO0-j693JTMd7RL0Zk=/0x0:2012x1341/1200x800/filters:focal(0x0:2012x1341)/cdn.vox-cdn.com/uploads/chorus_image/image/47070706/google2.0.0.jpg\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "integer",
            "optional": false,
            "field": "Auction",
            "description": "<p>ID</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 201 OK\n{\n   \"id\": 5\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Update error",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./api/auctions/auction-routes.js",
    "groupTitle": "Auctions",
    "name": "PostApiAuctions"
  },
  {
    "type": "put",
    "url": "/api/auctions/:id",
    "title": "Edit an auction",
    "permission": [
      {
        "name": "Auction Owner"
      }
    ],
    "group": "Auctions",
    "parameter": {
      "fields": {
        "param": [
          {
            "group": "param",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>ID of auction</p>"
          }
        ],
        "content": [
          {
            "group": "content",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>Name/Title of auction. Cannot edit after a bid has been placed</p>"
          },
          {
            "group": "content",
            "type": "Number",
            "optional": true,
            "field": "starting_price",
            "description": "<p>Starting bid. Cannot edit after a bid has been placed</p>"
          },
          {
            "group": "content",
            "type": "Date",
            "optional": true,
            "field": "date_ending",
            "description": "<p>End Date of Auction</p>"
          },
          {
            "group": "content",
            "type": "String",
            "optional": true,
            "field": "description",
            "description": "<p>Description of product</p>"
          },
          {
            "group": "content",
            "type": "string",
            "optional": true,
            "field": "image",
            "description": "<p>URL to image</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"name\": \"iPhone\",\n  \"starting_price\": 50,\n  \"date_ending\": new Date(10/31/19),\n  \"description\": \"A brand new iPhone\",\n  \"image\": \"https://cdn.vox-cdn.com/thumbor/Pkmq1nm3skO0-j693JTMd7RL0Zk=/0x0:2012x1341/1200x800/filters:focal(0x0:2012x1341)/cdn.vox-cdn.com/uploads/chorus_image/image/47070706/google2.0.0.jpg\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "integer",
            "optional": false,
            "field": "Number",
            "description": "<p>of entries changed</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 201 OK\n{\n   \"records\": 1\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./api/auctions/auction-routes.js",
    "groupTitle": "Auctions",
    "name": "PutApiAuctionsId"
  },
  {
    "type": "get",
    "url": "/",
    "title": "Get personal user info",
    "group": "Authorization",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "user.id",
            "description": "<p>User id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.username",
            "description": "<p>Username</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.first_name",
            "description": "<p>First Name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.last_name",
            "description": "<p>Last Name</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "user.role",
            "description": "<p>Seller or buyer</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n  \"id\": 1,\n  \"username\": \"user\",\n  \"first_name\": \"Test\",\n  \"last_name\": \"User\",\n  \"role:\" true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "List error",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./auth/auth-routes.js",
    "groupTitle": "Authorization",
    "name": "Get"
  },
  {
    "type": "post",
    "url": "/api/auth/login",
    "title": "Login",
    "group": "Authorization",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "username",
            "description": "<p>Username</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>Password</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n    \"username\": \"student\",\n    \"password\": \"secretpassword\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "Token",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 201 OK\n{\n   \"token\": \"sdf890eufjiasdlkjklsdj3asdfskdlfdkfjkeladsf\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./auth/auth-routes.js",
    "groupTitle": "Authorization",
    "name": "PostApiAuthLogin"
  },
  {
    "type": "post",
    "url": "/api/auth/register",
    "title": "Register",
    "group": "Authorization",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "username",
            "description": "<p>Username</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>Password</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "first_name",
            "description": "<p>First Name</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "last_name",
            "description": "<p>Last Name. Defaults to null</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": true,
            "field": "is_seller",
            "defaultValue": "false",
            "description": "<p>Seller or Buyer. Defaults to false</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n    \"username\": \"student\",\n    \"password\": \"secretpassword\",\n    \"first_name\": \"Billy\",\n    \"last_name\": \"Thomas\",\n    \"is_seller\": false\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "integer",
            "optional": false,
            "field": "User",
            "description": "<p>ID</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 201 OK\n{\n   \"id\": 5\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Update error",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./auth/auth-routes.js",
    "groupTitle": "Authorization",
    "name": "PostApiAuthRegister"
  }
] });
