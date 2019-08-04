const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  afterConnection();
  
});
function afterConnection() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;

      console.log("Welcome to Bamazon! These are the items we have for sale.");

      for (let i = 0; i < res.length; i++) {
        console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price);
      }
      start();
    });
  }

  function start() {
    inquirer
      .prompt({
        name: "item",
        type: "list",
        message: "What would you like to do?",
        choices: ["PURCHASE", "EXIT"]
      })
      .then(function(answer) {
        // based on their answer, either call the bid or the post functions
        if (answer.item === "PURCHASE") {
          buying();
        } else{
          connection.end();
        }
      });
  }


  function buying() {
    // query the database for all items being auctioned
    connection.query("SELECT * FROM products", function(err, results) {
      if (err) throw err;
      // once you have the items, prompt the user for which they'd like to bid on
      inquirer
        .prompt([
          {
            name: "choice",
            type: "rawlist",
            choices: function() {
              const choiceArray = [];
              for (let i = 0; i < results.length; i++) {
                choiceArray.push(results[i].item_id + " | " + results[i].product_name);
              }
              return choiceArray;
            },
            message: "What product would you like to buy?"
          },
          {
            name: "amount",
            type: "input",
            message: "How much would you like to buy?"
          }
        ])
        .then(function(answer) {
          // get the information of the chosen item
          let chosenItem;
          for (let i = 0; i < results.length; i++) {
            if (results[i].item_name === answer.choice) {
              chosenItem = results[i];
            }
          }
  
          if (chosenItem.stock_quantity > parseInt(answer.amount)) {

            const totalAmount = stock_quantity - answer.amount

            connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                {
                  stock_quantity: totalAmount
                },
                {
                  id: chosenItem.id
                }
              ],
              function(error) {
                if (error) throw err;
                console.log("Order placed successfully!");
                start();
              }
            );
          }
          else {
            // bid wasn't high enough, so apologize and start over
            console.log("Insufficient quantity");
            start();
          }
        });
    });
  }
  