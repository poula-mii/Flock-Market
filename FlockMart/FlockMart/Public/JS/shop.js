const inpFile = document.getElementById("inpFile");
const previewContainer = document.getElementById("imagePreview");
const previewImage = document.querySelector(".preview-image");
const previewText = document.querySelector(".preview-text");

const customButton = document.querySelector(".custom-input");

customButton.addEventListener("click", function() {
    inpFile.click();
})

inpFile.addEventListener("change", function(e) {
    const file = this.files[0];

    if(file) {
        const reader = new FileReader();

        previewText.style.display = "none";
        previewImage.style.display = "block";
        previewContainer.style.border = "none";

        reader.addEventListener("load", function() {
            previewImage.setAttribute("src", this.result)
        })

        reader.readAsDataURL(file);
    } else {
        previewText.style.display = null;
        previewImage.style.display = null;
        previewContainer.style.border = null;
        previewImage.setAttribute("src", "");
    }
})

$(document).ready(function() {
    $('.overlay').hide();
    $('.add-products-container').hide();
    $('.not-logged-in').hide();
    $('body').removeClass('overlay-open');

    const get_profile_url = 'https://yourstore-swe.herokuapp.com/stores/myStore';

    function getShop() {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem('shopAuth')}`);
    
        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
        }

        try {
            fetch(get_profile_url, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                $("#shop-id").text(result._id);
                $(".daily-profit").text(result.profitsDaily);
                $(".monthly-profit").text(result.profitsMonthly);
                $(".yearly-profit").text(result.profitsYearly);
                hideLoader($('.overlay-white'));
            })
            .catch((e) => {
                console.log(e);
                hideLoader($(".overlay-white"));
            })
        } catch (e) {
            console.log(e);
            hideLoader($(".overlay-white"));
        }
    }

    if(!localStorage.getItem('shopAuth')) {
        $(".overlay-white").show();
        $(".not-logged-in").show();
    } else {
        getShop();
    }


    $('.spinner').hide();
    $('.profile').hide();
    $('.products').hide();
    $('.requests').hide();
    $('.orders').hide();
    $(".history").hide();

    function showLoader(overlay) {
        overlay.show();
        $('.spinner').show();
    }

    function hideLoader(overlay) {
        overlay.hide();
        $('.spinner').hide();
        $('body').removeClass('overlay-open');
    }

    //-----------ADD PRODUCTS----------------

    $('.add-products-btn').on('click', function() {
        $('.overlay').show();
        $('.add-products-container').show();
        $('.add-products-container').removeClass("hidden");

        $('body').addClass('overlay-open');
    })

    $('.cross').on('click', function() {
        $('.overlay').hide();
        $(this).parent().hide();
        $(this).parent().addClass("hidden");

        $('body').removeClass('overlay-open');
    })

    $('.overlay').on('click', function() {
        $('.overlay').hide();
        $(this).parent('body').children('.add-products-container').hide();
        $(this).parent('body').children('.add-products-container').addClass("hidden");


        $('body').removeClass('overlay-open');
    })

    function validate(element) {
        let name = element[0].name;
        if(name == "name") {
            if(element[0].value == "" || element[0].value.length == 0) {
                element.parent('.input-field').addClass('invalid');
                throw Error("name");
            }
        } else if(name == "desc") {
            if(element[0].value == "" || element[0].value.length == 0) {
                element.parent('.input-field').addClass('invalid');
                throw Error("desc");
            }
        } else if(name == "cost") {
            if(element[0].value == "" || element[0].value.length == 0) {
                element.parent('.input-field').addClass('invalid');
                throw Error("cost");
            }
        } else if(name == "quantity") {
            if(element[0].value == "" || element[0].value <= 5) {
                element.parent('.input-field').addClass('invalid');
                throw Error("quantity");
            }
        }
    }

    const add_products_api = "https://yourstore-swe.herokuapp.com/myStore/addItem";

    $('.add-button').on('click', function(e) {
        e.preventDefault();

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append("Access-Control-Allow-Origin", '*');
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem('shopAuth')}`);

        let selected = $('input[name="tag"]:checked').val();

        const data = {
            itemName: $("#item-name").val(),
            itemDesc: $("#item-desc").val(),
            cost: $("#item-cost").val(),
            quantity: $("#item-quantity").val(),
            tags: selected,
            shopID: $("#shop-id").text(),
        }

        let json = JSON.stringify(data);

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: json,
        };

        try {
            validate($("#item-name"));
            validate($("#item-desc"));
            validate($("#item-cost"));
            validate($("#item-quantity"));

            try {
                fetch(add_products_api, requestOptions) 
                .then((response) => response.json())
                .then((result) => {
                    if(result.error || result.status == "failure") {
                        swal("Check again!", "" ,"error");
                    } else {
                        $('#add-products-form')[0].reset();
                        swal("Success", "You're all set!", "success");

                        $('.overlay').hide();
                        $(".add-products-container").hide();
                        $(".add-products-container").addClass("hidden");
                        $('body').removeClass('overlay-open');
                    }
                }) 
                .catch((e) => {
                    console.log(e);
                    $('.overlay').hide();
                    $(".add-products-container").hide();
                    $(".add-products-container").addClass("hidden");
                    $('body').removeClass('overlay-open');
                })
            } catch (e) {
                swal("Oops something went wrong!", "some error occurred!", "error");
                $('.overlay').hide();
                $(".add-products-container").hide();
                $(".add-products-container").addClass("hidden");
                $('body').removeClass('overlay-open');
            }

        } catch (e) {
            swal("Oops you missed something", "Check " + e.message, "error");
            $('.overlay').hide();
            $(".add-products-container").hide();
            $(".add-products-container").addClass("hidden");
            $('body').removeClass('overlay-open');
        }
    })

    //-----------------PROFILE------------------
    $('.count').counterUp({
        delay: 10,
        time: 1000
    });

    // ----------------ORDERS-CARD---------------------------------------

    $(".orders-container").on('click', '.view-address-btn' ,function(e) {
        e.preventDefault();

        $(this).parent().parent().children('.user-address').toggleClass("hide");
    })

    $(".order-history-container").on('click', '.view-address-btn' ,function(e) {
        e.preventDefault();

        $(this).parent().parent().children('.user-address').toggleClass("hide");
    })

    //-----------------GET PROFILE/PRODUCTS/ORDERS/REQUESTS--------------

    const get_products = 'https://yourstore-swe.herokuapp.com/myProducts';

    function getProducts() {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem('shopAuth')}`);
    
        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
        }

        try {
            return fetch(get_products, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                hideLoader($(".overlay"));
                return (result);
            })
            .catch((e) => {
                console.log(e);
                hideLoader($(".overlay"));
            })
        } catch (e) {
            console.log(e);
            hideLoader($(".overlay"));
        }
    }

    function getRequests() {
        const get_requests_api = "https://yourstore-swe.herokuapp.com/store/requested";

        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem('shopAuth')}`);
    
        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
        }

        try {
            return fetch(get_requests_api, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                hideLoader($(".overlay"));
                return result;
            })
            .catch((e) => {
                console.log(e);
                hideLoader($(".overlay"));
            })
        } catch (e) {
            console.log(e);
            hideLoader($(".overlay"));
        }
    }

    function getOrders() {
        const get_orders_api = "https://yourstore-swe.herokuapp.com/store/Orders";

        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem('shopAuth')}`);
    
        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
        }

        try {
            return fetch(get_orders_api, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                hideLoader($(".overlay"));
                return result;
            })
            .catch((e) => {
                console.log(e);
                hideLoader($(".overlay"));
            })
        } catch (e) {
            console.log(e);
            hideLoader($(".overlay"));
        }
    }

    function getOrderHistory() {
        const get_orders_api = "https://yourstore-swe.herokuapp.com/store/OrderHistory";

        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem('shopAuth')}`);
    
        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
        }

        try {
            return fetch(get_orders_api, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                hideLoader($(".overlay"));
                return result;
            })
            .catch((e) => {
                console.log(e);
                hideLoader($(".overlay"));
            })
        } catch (e) {
            console.log(e);
            hideLoader($(".overlay"));
        }
    }

    $("#statistics-btn").on("click", function(e) {
        e.preventDefault();

        $('.products').hide();
        $('.profile').hide();
        $('.requests').hide();
        $('.history').hide();
        $('.orders').hide();

        $(".statistics").show();

    })

    $("#orders-btn").on('click', function(e) {
        e.preventDefault();

        showLoader($(".overlay"));

        $('.products').hide();
        $('.profile').hide();
        $('.requests').hide();
        $('.history').hide();
        $(".statistics").hide();

        $('.orders').show();

        getOrders().then((result) => {
            createOrdersCard(result);
        })
    })

    $("#history-btn").on('click', function(e) {
        e.preventDefault();

        showLoader($(".overlay"));

        $('.products').hide();
        $('.profile').hide();
        $('.requests').hide();
        $('.orders').hide();
        $(".statistics").hide();

        $('.history').show();
        $('.order-history-container').show();

        $('.payment-history-container').hide();

        $(".order-history").addClass('history-active');
        $(".payment-history").removeClass('history-active');

        getOrderHistory().then((result) => {
            createOrderHistoryCard(result);
        })
    })

    $(".order-history").on('click', function(e) {
        e.preventDefault();

        showLoader($(".overlay"));

        $('.order-history-container').show();

        $('.payment-history-container').hide();

        $(".order-history").addClass('history-active');
        $(".payment-history").removeClass('history-active');

        getOrderHistory().then((result) => {
            createOrderHistoryCard(result);
        })
    }) 

    $("#requests-btn").on('click', function(e) {
        e.preventDefault();

        showLoader($(".overlay"));

        $('.products').hide();
        $('.profile').hide();
        $('.orders').hide();
        $('.history').hide();
        $(".statistics").hide();

        $('.requests').show();

        getRequests().then((result) => {
            createRequestCard(result);
        })

    })

    $("#profile-btn").on('click', function(e) {
        e.preventDefault();
        showLoader($(".overlay"));

        $('.products').hide();
        $('.requests').hide();
        $('.orders').hide();
        $('.history').hide();
        $(".statistics").hide();

        $('.profile').show();

        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem('shopAuth')}`);
    
        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
        }

        try {
            fetch(get_profile_url, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                $("#total-sold").text(result.totalItemsSold);
                $("#total-clicks").text(result.totalClicks);
                $("#shop-name").val(result.shopName);
                $("#shop-desc").val(result.shopDescription);
                $("#shop-email").val(result.email);
                $("#shop-owner").val(result.shopOwner);
                $("#shop-address").val(result.location.address);
                $("#shop-landmark").val(result.location.landmark);
                hideLoader($(".overlay"));
            })
            .catch((e) => {
                console.log(e);
                hideLoader($(".overlay"));
            })
        } catch (e) {
            console.log(e);
            hideLoader($(".overlay"));
        }

    })

    $("#products-btn").on('click', function(e) {
        e.preventDefault();
        showLoader($(".overlay"));

        $('.tag').removeClass('active')
        $('#all-products').addClass('active')

        $('.profile').hide();
        $('.requests').hide();
        $('.orders').hide();
        $('.history').hide();
        $(".statistics").hide();

        $('.fruits-veggies-container').hide();
        $('.meat-container').hide();
        $('.dairy-container').hide();
        $('.snacks-container').hide();
        $('.drinks-container').hide();

        $('.products').show();
        $('.all-container').show();

        getProducts().then((result) => {
            createAllCard(result);
        });

    })

    $("#all-products").on('click', function(e) {
        e.preventDefault();
        showLoader($(".overlay"));

        $('.tag').removeClass('active')
        $('#all-products').addClass('active')

        $('.fruits-veggies-container').hide();
        $('.meat-container').hide();
        $('.dairy-container').hide();
        $('.snacks-container').hide();
        $('.drinks-container').hide();

        $('.all-container').show();

        getProducts().then((result) => {
            createAllCard(result);
        });

    })

    $("#fruits-and-veg").on('click', function(e) {
        e.preventDefault();
        showLoader($(".overlay"));

        $(".tag").removeClass('active');
        $(this).addClass('active');

        $('.all-container').hide();
        $('.meat-container').hide();
        $('.dairy-container').hide();
        $('.snacks-container').hide();
        $('.drinks-container').hide();

        $('.fruits-veggies-container').show();

        getProducts().then((result) => {
            createFruitsAndVegCard(result);
        });

    })

    $("#meat-products").on('click', function(e) {
        e.preventDefault();
        showLoader($(".overlay"));

        $(".tag").removeClass('active');
        $(this).addClass('active');

        $('.all-container').hide();
        $('.fruits-veggies-container').hide();
        $('.dairy-container').hide();
        $('.snacks-container').hide();
        $('.drinks-container').hide();

        $('.meat-container').show();

        getProducts().then((result) => {
            createTaggedCard(result, "meat", $('.meat-container'));
        });

    })

    $("#dairy-products").on('click', function(e) {
        e.preventDefault();
        showLoader($(".overlay"));

        $(".tag").removeClass('active');
        $(this).addClass('active');

        $('.all-container').hide();
        $('.fruits-veggies-container').hide();
        $('.meat-container').hide();
        $('.snacks-container').hide();
        $('.drinks-container').hide();

        $('.dairy-container').show();

        getProducts().then((result) => {
            createTaggedCard(result, "dairy", $('.dairy-container'));
        });

    })

    $("#snacks-products").on('click', function(e) {
        e.preventDefault();
        showLoader($(".overlay"));

        $(".tag").removeClass('active');
        $(this).addClass('active');

        $('.all-container').hide();
        $('.fruits-veggies-container').hide();
        $('.dairy-container').hide();
        $('.meat-container').hide();
        $('.drinks-container').hide();

        $('.snacks-container').show();

        getProducts().then((result) => {
            createTaggedCard(result, "snacks", $('.snacks-container'));
        });

    })

    $("#drinks-products").on('click', function(e) {
        e.preventDefault();
        showLoader($(".overlay"));

        $(".tag").removeClass('active');
        $(this).addClass('active');

        $('.all-container').hide();
        $('.fruits-veggies-container').hide();
        $('.dairy-container').hide();
        $('.snacks-container').hide();
        $('.meat-container').hide();

        $('.drinks-container').show();

        getProducts().then((result) => {
            createTaggedCard(result, "drinks", $('.drinks-container'));
        });

    })

    function createAllCard(result) {
        if(result.length == 0) {
            $('.all-container').empty();
            $('.all-container').html("<div class='no-products-text'>No products yet!</div>");
        } else {
            let img = '';
            let output = ``;

            for(i=0; i<result.length; i++) {
                if(!result[i].picture) {
                    img = './Public/assets/default.jpg';
                } else {
                    img = result[i].picture;
                }

                let unit = "unit/s"
                if(result[i].tags == "fruits" || result[i].tags == "vegetables") {
                    unit = "Kg"
                }
                output += `
                <div class="card">
                    <img src="${img}">
                    <div class="details">
                        <div class="product-name">${result[i].itemName}</div>
                        <div class="product-cost">Cost: <span class="cost">&#8377;${result[i].cost}</span></div>
                        <div class="product-quantity">Quantity: <span class="quantity">${result[i].quantity} ${unit}</span></div>
                        <div class="product-tag">${result[i].tags}</div>
                        <div id="item-id">${result[i]._id}</div>
                        <div class="delete-item"><button class="delete-item-btn">Delete</button></div>
                    </div>
                </div>
                `
            }

            $(".all-container").empty();
            $(".all-container").html(output);
        }
    }

    function createFruitsAndVegCard(result) {
        let count = 0;

        for(i=0; i<result.length; i++) {
            if(result[i].tags == "fruits" || result[i].tags == "vegetables") {
                count++;
            }
        }

        if(count == 0) {
            $('.fruits-veggies').empty();
            $('.fruits-veggies').html("<div class='no-products-text'>No products yet!</div>");
        } else {
            let img = '';
            let output = ``;

            for(i=0; i<result.length; i++) {
                if(!result[i].picture) {
                    img = './Public/assets/default.jpg';
                } else {
                    img = result[i].picture;
                }

                if(result[i].tags == "fruits" || result[i].tags == "vegetables") {
                    output += `
                    <div class="card">
                        <img src="${img}">
                        <div class="details">
                            <div class="product-name">${result[i].itemName}</div>
                            <div class="product-cost">Cost: <span class="cost">&#8377;${result[i].cost}</span></div>
                            <div class="product-quantity">Quantity: <span class="quantity">${result[i].quantity} Kg</span></div>
                            <div id="item-id">${result[i]._id}</div>
                            <div class="delete-item"><button class="delete-item-btn">Delete</button></div>
                        </div>
                    </div>
                    `
                }

                $('.fruits-veggies-container').empty();
                $('.fruits-veggies-container').html(output);
            }
        }
    }    

    function createTaggedCard(result, tag, container) {
        let count = 0;

        for(i=0; i<result.length; i++) {
            if(result[i].tags == tag) {
                count++;
            }
        }

        if(count==0) {
            container.empty();
            container.html("<div class='no-products-text'>No products yet!</div>");
        } else {
            let img = '';
            let output = ``;

            for(i=0; i<result.length; i++) {
                if(!result[i].picture) {
                    img = './Public/assets/default.jpg';
                } else {
                    img = result[i].picture;
                }

                if(result[i].tags == tag) {
                    output += `
                    <div class="card">
                        <img src="${img}">
                        <div class="details">
                            <div class="product-name">${result[i].itemName}</div>
                            <div class="product-cost">Cost: <span class="cost">&#8377;${result[i].cost}</span></div>
                            <div class="product-quantity">Quantity: <span class="quantity">${result[i].quantity} unit/s</span></div>
                            <div id="item-id">${result[i]._id}</div>
                            <div class="delete-item"><button class="delete-item-btn">Delete</button></div>
                        </div>
                    </div>
                    `
                }

                container.empty();
                container.html(output);
        
            }    
        }
    }

    function createRequestCard(result) {
        if(result.data.length == 0) {
            $(".requests-container").empty();
            $(".requests-container").html("<div class='no-products-text'>No Requests </div>")
        } else {
            let output = ``;
            
            for(i=0; i<result.data.length; i++) {
                output += `
                <div class="requests-card">
                    <div class="requested-by">
                        <div class="requested-name">${result.data[i].userName}</div>
                        <div class="requested-phone"> <i class="fas fa-phone"></i> ${result.data[i].phoneNumber}</div>
                    </div>
                    <div class="requested-details">
                        <div class="req-name">${result.data[i].prodName}</div>
                        <div class="req-desc">${result.data[i].desc}</div>
                        <div class="req-quantity">Quantity: ${result.data[i].qty}</div>
                        <div class="delete-request-container">
                            <div class="requestID">${result.data[i]._id}</div>
                            <button class="delete-request">Delete</button>
                        </div>
                    </div>
                </div>
                `
            }

            $(".requests-container").empty();
            $(".requests-container").html(output);
        }
    }

    function createOrdersCard(result) {
        $(".orders-container").empty();
        if(result.data.length == 0) {
            $(".orders-container").empty();
            $(".orders-container").html("<div class='no-products-text'>No orders yet </div>");
        } else {
            for(i=0; i<result.data.length; i++) {
                let output = ``;
                const address = result.data[i].user.address;
                const email = result.data[i].user.email;
                const phone = result.data[i].user.phone;
                const name = result.data[i].user.name;
                const orderID = result.data[i]._id;
                const userID = result.data[i].user.userID;

                output += `
                    <div class="order-card">
                        <div class="user-info">
                            <div class="regular-info">
                                <div class="user-name">${name}</div>
                                <div class="order-id"><strong>Order ID:</strong> <p class="orderID">${orderID}</p></div>
                                <div class="user-phone"><strong>Phone:</strong> ${phone}</div>
                            </div>
                            <div class="user-address hide ">${address}</div>
                            <div class="address-btn-container">
                                <div class="userID">${userID}</div>
                                <div class="view-address-btn">View Address</div>
                                <div class="deliver-btn">Deliver</div>
                            </div>
                        </div>
                        <div class="order-items">
                `

                for(j=0; j<result.data[i].user.items.length; j++) {
                    let img;
                    if(!result.data[i].user.items[j].picture) {
                        img = "./Public/assets/default.jpg";
                    } else {
                        img = result.data[i].user.items[j].picture;
                    }

                    output += `
                    <div class="items-card">
                        <div class="item-image"><img src="${img}" alt="No image found"></div>
                        <div class="item-info">
                            <div class="item-name">${result.data[i].user.items[j].itemName}</div>
                            <div class="item-quantity"><strong>Quantity: </strong>${result.data[i].user.items[j].quantity}</div>
                        </div>
                    </div>
                    `
                }

                output += `
                    </div>
                </div>
                `

                $(".orders-container").append(output);
            }
        }
    }

    function createOrderHistoryCard(result) {
        $(".order-history-container").empty();
        if(result.data.length == 0) {
            $(".order-history-container").empty();
            $(".order-history-container").html("<div class='no-products-text'>No orders yet </div>");
        } else {
            for(i=0; i<result.data.length; i++) {
                let output = ``;
                const address = result.data[i].user.address;
                const email = result.data[i].user.email;
                const phone = result.data[i].user.phone;
                const name = result.data[i].user.name;
                const orderID = result.data[i]._id;

                output += `
                    <div class="order-history-card">
                        <div class="user-info">
                            <div class="regular-info">
                                <div class="user-name">${name}</div>
                                <div class="order-id"><strong>Order ID:</strong> ${orderID}</div>
                                <div class="user-phone"><i class="fas fa-phone"></i> ${phone}</div>
                            </div>
                            <div class="user-address hide ">${address}</div>
                            <div class="address-btn-container">
                                <div class="view-address-btn">View Address</div>
                            </div>
                        </div>
                        <div class="order-items">
                `

                for(j=0; j<result.data[i].user.items.length; j++) {
                    let img;
                    if(!result.data[i].user.items[j].picture) {
                        img = "./Public/assets/default.jpg";
                    } else {
                        img = result.data[i].user.items[j].picture;
                    }

                    output += `
                    <div class="items-card">
                        <div class="item-image"><img src="${img}" alt="No image found"></div>
                        <div class="item-info">
                            <div class="item-name">${result.data[i].user.items[j].itemName}</div>
                            <div class="item-quantity"><strong>Quantity: </strong>${result.data[i].user.items[j].quantity}</div>
                        </div>
                    </div>
                    `
                }

                output += `
                    </div>
                </div>
                `

                $(".order-history-container").append(output);
            }
        }
    }

    //-------------------DELIVER ITEM-------------------

    $("body").on("click", ".deliver-btn", function(e) {
        e.preventDefault();

        const userID = $(this).parent().children(".userID").text();
        const orderID = $(this).parents(".user-info").children(".regular-info").children(".order-id").children(".orderID").text();
        const userName = $(this).parents(".user-info").children(".regular-info").children(".user-name").text();

        
        $(".delivery-confirmation").removeClass("hidden");
        $(".confirm-head").text(`Deliver to: ${userName}`);
        $("body").addClass("overlay-open");
        $(".overlay").show();

        $(".confirm-delivery").on("click", function(e) {
            e.preventDefault();

            $(".delivery-confirmation").addClass("hidden");
            showLoader($(".overlay"));

            let delivery_api = `https://yourstore-swe.herokuapp.com/store/delivered/${userID}/${orderID}`;

            let myHeaders = new Headers();
            myHeaders.append("Authorization", `${localStorage.getItem('shopAuth')}`);

        
            let requestOptions = {
                method: 'POST',
                headers: myHeaders,
            }

            fetch(delivery_api, requestOptions)
            .then((response) => response.json())
            .then((result) => {
               
                if(result.status == 'fail') {
                    swal("Oops something went wrong", "", "error");
                    hideLoader($(".overlay"))
                } else {
                    swal("Item delivered!", "You're all set!", "success");
                    getOrders().then((result) => {
                        createOrdersCard(result);
                    })
                    hideLoader($(".overlay"));
                }
            })
            .catch((e) => {
                console.log(e)
                swal("Oops something went wrong", "" + e, "error");
            })
        })

        $(".decline-delivery").on("click", function(e) {
            e.preventDefault();

            $(".delivery-confirmation").addClass("hidden");
            $("body").removeClass("overlay-open");
            $(".overlay").hide();
        })
    })


    //-------------------DELETE ITEM--------------------

    $(".products").on('click', '.delete-item-btn' ,function(e) {
        e.preventDefault();

        const id = $(this).parent('.delete-item').parent('.details').children('#item-id').text();
        const delete_item_url = `https://yourstore-swe.herokuapp.com/myProducts/delete/${id}`;
        
        $(".overlay").show();
        $("body").addClass("overlay-open");
        $(".confirm-delete-product").removeClass("hidden");

        $(".confirm-product-delete").on("click", function(e) {
            e.preventDefault();

            $(".confirm-delete-product").addClass("hidden");

            showLoader($(".overlay"));

            let myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${localStorage.getItem('shopAuth')}`);
        
            let requestOptions = {
                method: 'PATCH',
                headers: myHeaders,
            }
    
            try {
                fetch(delete_item_url, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    hideLoader($(".overlay"));
                    swal("Item deleted!", "" ,"success");
    
                    if($(this).parents(".products").children(".all-container").length > 0) {
                        getProducts().then((result) => {
                            createAllCard(result);
                        })
                    } else if ($(this).parents(".products").children(".fruits-veggies-container").length > 0) {
                        getProducts().then((result) => {
                            createFruitsAndVegCard(result);
                        })
                    } else if ($(this).parents(".products").children(".meat-container").length > 0) {
                        getProducts().then((result) => {
                            createTaggedCard(result, "meat", $('.meat-container'));
                        });
                    } else if ($(this).parents(".products").children(".dairy-container").length > 0) {
                        getProducts().then((result) => {
                            createTaggedCard(result, "dairy", $('.dairy-container'));
                        });
                    } else if ($(this).parents(".products").children(".snacks-container").length > 0) {
                        getProducts().then((result) => {
                            createTaggedCard(result, "snacks", $('.snacks-container'));
                        });
                    } else if ($(this).parents(".products").children(".drinks-container").length > 0) {
                        getProducts().then((result) => {
                            createTaggedCard(result, "drinks", $('.drinks-container'));
                        });
                    }
                })
                .catch((e) => {
                    console.log(e);
                    hideLoader($(".overlay"));
                    swal("Aww snap!", "Some error occurred" ,"success");
                })
            } catch (e) {
                console.log(e);
                hideLoader($(".overlay"));
                swal("Aww snap!", "Some error occurred" ,"success");
            }
        })

        $(".decline-product-delete").on("click", function(e) {
            e.preventDefault();

            $(".overlay").hide();
            $("body").removeClass("overlay-open");
            $(".confirm-delete-product").addClass("hidden");
        })

    })

    //-------------------DELETE REQUEST-----------------

    $("body").on("click", ".delete-request", function(e) {
        e.preventDefault();

        let requestID = $(this).parent().children(".requestID").text();

        $(".overlay").show();
        $("body").addClass("overlay-open");
        $(".confirm-delete-request").removeClass("hidden");

        $(".confirm-request-delete").on("click", function(e) {
            e.preventDefault();

            $(".confirm-delete-request").addClass("hidden");
            showLoader($(".overlay"));

            const delete_request_api = `https://yourstore-swe.herokuapp.com/requests/remove/${requestID}`;
            let myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${localStorage.getItem('shopAuth')}`);
        
            let requestOptions = {
                method: 'PATCH',
                headers: myHeaders,
            }

            fetch(delete_request_api, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                swal("Request deletd successfully!", "You're all set", "success");
                hideLoader($(".overlay"));
                getRequests().then((result) => {
                    createRequestCard(result);
                })
            })
            .catch((e) => {
                swal("Oops something went wrong", "" + e, "error");
                hideLoader($(".overlay"));
                console.log(e);
            })
        })

    })

    $(".decline-request-delete").on("click", function(e) {
        e.preventDefault();
        
        $(".overlay").hide();
        $("body").removeClass("overlay-open");
        $(".confirm-delete-request").addClass("hidden");
    })

    //-------------------LOGOUT-------------------------

    $(".logout").on('click', function(e) {
        e.preventDefault();

        showLoader($('.overlay'));

        const logout_api = 'https://yourstore-swe.herokuapp.com/store/logout';

        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem('shopAuth')}`);
    
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
        }

        try {
            fetch(logout_api, requestOptions)
            .then((response) => response.json())
            .then((result) => {
              
                swal("Logged Out", "", "seccess");
                localStorage.removeItem('shopAuth');
                window.location.reload();
                hideLoader($(".overlay"));
            })
            .catch((e) => {
                console.log(e);
                swal("Oops something went wrong", "" + e, "error");
                hideLoader($(".overlay"));
            })
        } catch (e) {
            console.log(e);
            swal("Oops something went wrong", "" + e, "error");
            hideLoader($(".overlay"));
        }

    })

})
