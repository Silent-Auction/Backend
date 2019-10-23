# Backend
API link: https://silent-auction-bw.herokuapp.com/
Documentation: https://silent-auction-bw.herokuapp.com/apidoc/

# Endpoints

## api/auth

| Method Type 	| Resource Type 	|   Route   	| Description 	| Parameters/Body Request                                                            	| Response                     	|
|-------------	|---------------	|:---------:	|------------:	|------------------------------------------------------------------------------------	|------------------------------	|
| POST        	| Create        	| /register 	|       Register a user 	| username: String<br> password: String<br> first_name: String <br>last_name: String (optional) <br> is_seller: Boolean (defaults to false) 	| id number                    	|
| POST        	| Create        	|   /login  	|         Login. Returns token if successful 	|  username: String<br>password: String                

## api/users (Token Required)

| Method Type 	| Resource Type 	| Route 	|                                                                                                                                                   Description 	| Parameters/Body Request 	| Response          	|
|-------------	|---------------	|:-----:	|--------------------------------------------------------------------------------------------------------------------------------------------------------------:	|-------------------------	|-------------------	|
| GET         	| Request       	|   /   	|  Request user information and auctions associated with user. <br> Seller: Auctions that user has posted. <br>  Buyer: Auctions that user has bid on. <br>|  None                   	|  User information 	|

## api/auctions (Token Required)

| Method Type 	| Resource Type 	| Route 	|                                Description 	| Parameters/Body Request                                                                                                                           	| Response                                                                                                                                                                                            	|
|-------------	|---------------	|:-----:	|-------------------------------------------:	|---------------------------------------------------------------------------------------------------------------------------------------------------	|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| GET         	| Request       	|   /   	|      Request information for all auctions  	|  None                                                                                                                                             	|  Array<br> Auction info:<br>  Auction seller info<br> Auction name, description<br> start and end dates<br> starting price<br> URL to image.<br>  Bids<br> Date, price, and user who placed bid<br> 	|
| GET         	| Request       	| /:id  	| Request information for a specific auction 	| id: Auction id                                                                                                                                    	| Same as above                                                                                                                                                                                       	|
| POST        	| Create        	| /     	| Create an auction                          	| Requires the seller role <br> name: String <br> description: String (optional) <br> date_starting: Date <br> date_ending: Date <br> image: String 	| id of auction                                                                                                                                                                                       	|
| PUT         	| Update        	| /:id  	| Edit an auction                            	| Same as above. Only description and date_ending can be edited after a bid has been placed on an auction                                           	| number of records updated                                                                                                                                                                           	|
| DELETE      	| Delete        	| /:id  	| Delete an auction                          	| None                                                                                                                                              	|                                                                                                                                                                                                     	|

# api/bids

| Method Type 	| Resource Type 	|     Route    	|                                                                                                                  Description 	| Parameters/Body Request                                                                              	| Response                                                                             	|
|-------------	|---------------	|:------------:	|-----------------------------------------------------------------------------------------------------------------------------:	|------------------------------------------------------------------------------------------------------	|--------------------------------------------------------------------------------------	|
| GET         	| Request       	| /:id         	| Request information for a specific bid                                                                                       	| id: Bid id                                                                                           	|  User info (username and first name) <br> Price of bid <br> Date bid was placed <br> 	|
| POST        	| Create        	| /:auction_id 	| Places a bid on auction with specified ID. Must be placed on an active auction and bid must be higher than the current price 	| Params: <br> auction_id: Auction id <br>   Request: <br> Requires the buyer role <br> price: Integer 	| id of bid                                                                            	|
| PUT         	| Update        	| /:id         	| Edit a bid. Must be the most recent bid                                                                                      	|   Params:<br>  id: Bid id <br> Request: <br>  price: Integer                                         	| number of records updated                                                            	|
| DELETE      	| Delete        	| /:id         	| Delete a bid. Must be the most recent bid                                                                                    	| id: Bid id                                                                                           	| number of records deleted                                                            	|