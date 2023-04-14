//main lists
let dogList = [];
let shoppingCart = [];

//logo click for index.html
$(document).ready(function () {
  $("li.logo img").click(function () {
    window.location.href = "index.html";
  });
});

//input add and storeing on admin.html
$(document).ready(function () {
  if (localStorage.getItem("dogList")) {
    dogList = JSON.parse(localStorage.getItem("dogList"));
  }

  $("#add-dog-btn").click(function (event) {
    event.preventDefault();

    const breed = $("#breed-input").val();
    const age = parseInt($("#age-input").val());
    const price = parseInt($("#price-input").val());
    const img1 = $("#img1-input").val();
    const img2 = $("#img2-input").val();
    const newDog = {
      breed: breed,
      age: age,
      price: price,
      img1: img1,
      img2: img2,
    };
    dogList.push(newDog);
    localStorage.setItem("dogList", JSON.stringify(dogList));

    //delete the input fields
    $("#dog-form")[0].reset();
  });
});

//making the cards on the index.html
$(document).ready(function () {
  let dogCards = $("#dog-article");

  for (let i = 0; i < dogList.length; i++) {
    let card = $("<div>").addClass("card");
    let container = $("<div>").addClass("img-container");
    let leftButton = $("<button>")
      .addClass("btn btn-dark rounded-circle btn-lg mx-auto left-button")
      .html("&lt;");
    let img = $("<img>").addClass("card-img-top").attr("src", dogList[i].img1);
    let rightButton = $("<button>")
      .addClass("btn btn-dark rounded-circle btn-lg mx-auto right-button")
      .html("&gt;");
    let cardBody = $("<div>").addClass("card-body");
    let breed = $("<h5>")
      .addClass("card-title text-center")
      .text(dogList[i].breed);
    let age = $("<p>")
      .addClass("card-text text-center")
      .text("Age: " + dogList[i].age);
    let price = $("<p>")
      .addClass("card-text text-center")
      .text("Price: $" + dogList[i].price);
    let cartButton = $("<button>")
      .addClass("btn btn- rounded-pill mx-auto cart-button")
      .text("Add to cart");

    container.append(leftButton);
    container.append(img);
    container.append(rightButton);
    card.append(container);
    cardBody.append(breed);
    cardBody.append(age);
    cardBody.append(price);
    cardBody.append(cartButton);
    card.append(cardBody);

    //buttons working continously
    leftButton.on("click", function () {
      if (img.attr("src") === dogList[i].img2) {
        img.attr("src", dogList[i].img1);
      } else {
        img.attr("src", dogList[i].img2);
      }
    });
    rightButton.on("click", function () {
      if (img.attr("src") === dogList[i].img1) {
        img.attr("src", dogList[i].img2);
      } else {
        img.attr("src", dogList[i].img1);
      }
    });

    //add to cart
    cartButton.on("click", function () {
      shoppingCart.push(dogList[i]);
      console.log(shoppingCart);
      $(".cart-count").text(shoppingCart.length);

      localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
    });

    dogCards.append(card);
  }
});

//add footer hiding on index.html
$(document).ready(function () {
  $("#footer").show();
  $("#ok").click(function () {
    $("#footer").hide();
  });
});

//making the table of the dogs, and add sorting on the admin.html
$(document).ready(function () {
  let table = $("<table>").addClass("table table-striped");
  let thead = $("<thead>");
  let tbody = $("<tbody>");

  //add sorting, make the th row
  let headers = $("<tr>");
  headers.append(
    $("<th>")
      .text("BREED ↾")
      .on("click", function () {
        sortTable(0);
      })
  );
  headers.append(
    $("<th>")
      .text("AGE ↾")
      .on("click", function () {
        sortTable(1);
      })
  );
  headers.append(
    $("<th>")
      .text("PRICE ↾")
      .on("click", function () {
        sortTable(2);
      })
  );
  headers.append($("<th>"));
  thead.append(headers);

  //making the table rows
  for (let i = 0; i < dogList.length; i++) {
    let row = $("<tr>");
    row.append($("<td>").text(dogList[i].breed));
    row.append($("<td>").text(dogList[i].age));
    row.append($("<td>").text("$" + dogList[i].price));
    let deleteButton = $("<button>")
      .addClass("btn btn-danger delete-button")
      .text("Delete");
    deleteButton.data("index", i);
    let deleteTd = $("<td>").append(deleteButton);
    row.append(deleteTd);
    tbody.append(row);
  }

  table.append(thead);
  table.append(tbody);
  $("#admin-article").append(
    $("<div>").addClass("table-responsive").append(table)
  );

  //make delete button work
  $(".delete-button").on("click", function () {
    let index = $(this).data("index");
    dogList.splice(index, 1);
    $(this).closest("tr").remove();
    localStorage.setItem("dogList", JSON.stringify(dogList));
  });

  //table sortyng by value
  function sortTable(n) {
    console.log("sortTable", n);
    let rows = table.find("tbody tr").get();
    rows.sort(function (a, b) {
      let A = getCellValue(a, n);
      let B = getCellValue(b, n);

      //get off the $ at price colunm
      if (n == 2) {
        A = A.substring(1);
        B = B.substring(1);
      }

      //make it numbers
      if ([1, 2].includes(n)) {
        A = parseInt(A);
        B = parseInt(B);
      }

      //sort it
      if (A < B) {
        return -1;
      }
      if (A > B) {
        return 1;
      }
      return 0;
    });

    //changeing the arrow next to the th elements
    if (table.find("th").eq(n).text().includes("↾")) {
      rows.reverse();
      table
        .find("th")
        .eq(n)
        .text(table.find("th").eq(n).text().replace("↾", "⇃"));
    } else {
      table.find("th").text(function (i, text) {
        return text.replace("⇃", "↾");
      });
      table
        .find("th")
        .eq(n)
        .text(table.find("th").eq(n).text().replace("↾", "⇃"));
    }
    $.each(rows, function (index, row) {
      table.children("tbody").append(row);
    });
  }

  function getCellValue(row, n) {
    return $(row).children("td").eq(n).text();
  }
});

//passworld the admin.html
$(document).ready(function () {
  // check if password is correct
  function checkPassword() {
    const password = $("#password").val();
    if (password === "Doggy0404") {
      let passwordObj = { password: password };
      localStorage.setItem("adminPassword", JSON.stringify(passwordObj));
      $("#password-form").hide();
      $("#main-admin-article").show();
    } else {
      alert("Password is not correct. Please try again.");
    }
  }

  // submit password form
  $("#submit-btn").click(checkPassword);

  //check password
  const savedPassword = JSON.parse(localStorage.getItem("adminPassword"));
  if (savedPassword && savedPassword.password === "Doggy0404") {
    $("#password-form").hide();
    $("#main-admin-article").show();
  } else {
    $("#password-form").show();
    $("#main-admin-article").hide();
  }

  //log out button
  $(".btn-dark").click(function () {
    localStorage.removeItem("adminPassword");
    $("#password").val("");
    $("#password-form").show();
    $("#amain-admin-article").hide();
  });
});

//maikng the shoppingCart table on the shoppig-cart html
$(document).ready(function () {
  let shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
  $(".cart-count").text(shoppingCart.length);

  let table = $("<table>").addClass("table table-striped");
  let thead = $("<thead>");
  let tbody = $("<tbody>");

  let headers = $("<tr>");
  headers.append($("<th>").text("BREED"));
  headers.append($("<th>").text("AGE"));
  headers.append($("<th>").text("PRICE"));
  headers.append($("<th>"));
  thead.append(headers);

  //if nothing in basket empty, else add the table
  if (shoppingCart.length === 0) {
    let emptyMessage = $("<div>")
      .text("Your basket is empty!")
      .addClass("basket-empty");
    $("#shopping-cart-container").append(emptyMessage);
  } else {
    for (let i = 0; i < shoppingCart.length; i++) {
      let row = $("<tr>");
      row.append($("<td>").text(shoppingCart[i].breed));
      row.append($("<td>").text(shoppingCart[i].age));
      row.append($("<td>").text("$" + shoppingCart[i].price));

      //add delete button
      let deleteButton = $("<button>")
        .addClass("btn btn-danger delete-button")
        .text("Delete");
      deleteButton.data("index", i);
      let deleteTd = $("<td>").append(deleteButton);
      row.append(deleteTd);
      tbody.append(row);
    }

    table.append(thead);
    table.append(tbody);
    $("#shopping-cart-container").html(
      $("<div>").addClass("table-responsive").append(table)
    );

    //delete object from the cart list

    $(".delete-button").on("click", function () {
      let index = $(this).data("index");
      shoppingCart.splice(index, 1);
      $(this).closest("tr").remove();
      localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
    });

    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
  }
});

//make the orderList and store
shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
const ordersList = JSON.parse(localStorage.getItem("ordersList")) || [];

//save the datas to the orderList
$(document).ready(function () {
  shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];

  const orderForm = document.querySelector("#order-form");
  shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
  const ordersList = JSON.parse(localStorage.getItem("ordersList")) || [];

  $("#order-form").on("submit", function (event) {
    event.preventDefault();
    const email = $("#email").val();
    const name = $("#name").val();
    const address = $("#address").val();

    const order = { email, name, address, shoppingCart };
    ordersList.push(order);
    localStorage.setItem("ordersList", JSON.stringify(ordersList));

    // Clear the cart
    localStorage.setItem("shoppingCart", JSON.stringify([]));

    //Hide the basket and the input, show the thank you message
    $("#order-form").hide();
    $("#shopping-cart-container").hide();
    $("#order-dogs-text").hide();
    $("#thank-you-window").show();
    $("#thank-you-message").text("Thank you for your order!");
    $("#buy-more-button").show();

    return false;
  });

  //Buy more button
  $("#buy-more-button").on("click", function () {
    window.location.href = "index.html";
  });
});

