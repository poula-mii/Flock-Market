$(document).ready(function() {
    $('.delivery-address').hide();
    $('.payment-methods').hide();
    $('.netbanking').hide();
    $(".overlay").hide();

    if(!localStorage.getItem("authToken")) {
        $(".not-logged-in").removeClass("hidden");
    } else {
        getAddresses();
        getProfile();
    }

    //-------------OVERLAY/SPINNER----------------------
    function showLoader(overlay) {
        overlay.show();
        $('.spinner').show();
        $('body').addClass('overlay-open');
    }
    
    function hideLoader(overlay) {
        overlay.hide();
        $('.spinner').hide();
        $("body").removeClass("overlay-open");
    }
    
    function hideOverlay(elementClass, classToHide) {
        overlay.parent().children(elementClass).addClass(classToHide);
        overlay.hide();
        $('body').removeClass('overlay-open');
    }

    $('body').on('click', ".choose-address",function(e) {
        e.preventDefault();

        if(sessionStorage.getItem("shopInCart") == "undefined" || !sessionStorage.getItem("shopInCart"))
        {
            swal("Your cart is empty!", "Try adding some items first", "error");
        } else {
            // SAVE ADDRESS IN VARIABLE
            let address = $(this).parent().children('.address-main').text();
            let address_tag = $(this).parent().children('.address-tag').text();

            // HIDE CHOOSE ADDRESS DIV
            $('.address').hide();
            
            // SET DELIVERY ADDRESS VALUE
            $('.type').text(address_tag);
            $('.type-address').text(address);

            //SHOW DELIVERY ADDRESS DIV
            $('.delivery-address').show();

            // SHOW PAYMENT OPTIONS
            $('.payment-initial').hide();
            $('.payment-methods').show();
        }
    })

    $('.change').on('click', function(e) {
        e.preventDefault();

        $('.delivery-address').hide();

        $('.address').show();

        $('.payment-methods').hide();

        $('.payment-initial').show();
    })

    $('.netbanking-btn').on('click', function(e) {
        $('.cod').hide();

        $('.netbanking').show();

        $('.cod-btn').removeClass('chosen');

        $('.netbanking-btn').addClass('chosen');
    })

    $('.cod-btn').on('click', function(e) {
        $('.netbanking').hide();

        $('.cod').show();

        $('.netbanking-btn').removeClass('chosen');

        $('.cod-btn').addClass('chosen');
    })

    //------------------------VALIDATE----------------------------------

    function validate(element) {
        let name = element[0].name;
        if(name == "flat-no") {
            if(element[0].value == "" || element[0].value.length == 0) {
                element.parent('.input-field').addClass('invalid');
                throw Error("Door/Flat No.");
            }
        } else if(name == "landmark") {
            if(element[0].value == "" || element[0].value.length <= 3) {
                element.parent('.input-field').addClass('invalid');
                throw Error("Landmark");
            }
        } else if(name == "locality") {
            if(element[0].value == "" || element[0].value.length == 3) {
                element.parent('.input-field').addClass('invalid');
                throw Error("Locality");
            }
        } 
    }

    //------------------------ADD NEW ADDRESS--------------------------- 

    $('body').on('click', '.add-address',function(e) {
        e.preventDefault();

        $('.overlay').show();
        $('.add-new-address-container').removeClass("hidden");

        $('body').addClass('overlay-open');
    })

    $('.cross').on('click', function(e) {
        e.preventDefault();

        $('.overlay').hide();
        $(this).parent().addClass("hidden");

        $('body').removeClass('overlay-open');
    })

    $(".add-new-address-btn").on("click", function(e) {
        e.preventDefault();

        const add_adress_api = `https://yourstore-swe.herokuapp.com/user/me/addAddress`;

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append("Authorization", `${localStorage.getItem('authToken')}`);

        let selected = $('input[name="type"]:checked').val()

        try {
            validate($("#flat-no"));
            validate($("#locality"));
            validate($("#landmark"));

            let location  = `${$("#flat-no").val()}, ${$("#locality").val()}, ${$("#landmark").val()}`;
            console.log(location);

            let body = {
                address: location,
                type: selected,
            }

            let json = JSON.stringify(body);
            
            let requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: json,
            }
            
            showLoader($(".overlay"));
            
            fetch(add_adress_api, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                swal("Address added!", "You're all set!", "success");
                getAddresses();
                $(".add-new-address-container").addClass("hidden");
                hideLoader($(".overlay"));
            })
            .catch((e) => {
                swal("Oops something went wrong", "" + e, "error");
                console.log(e);
            })

        } catch(e) {
            swal("Oppes you missed something!", "Check " + e, "error");
        }

    })

    //--------------------GET PROFILE-------------------------
    function getProfile() {
        const profile_api = "https://yourstore-swe.herokuapp.com/user/me";

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append("Authorization", `${localStorage.getItem('authToken')}`);

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
        }

        fetch(profile_api, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            let name = result.name.split(" ")
            $("#profile-text").text(name[0]);
        })
    }

    //---------------------ADDRESS----------------------------
    function getAddresses() {
        const address_api = "https://yourstore-swe.herokuapp.com/user/me"

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append("Authorization", `${localStorage.getItem('authToken')}`);

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
        }

        fetch(address_api, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            sessionStorage.setItem("shopInCart", result.shopInCart);
            let output = ``;
            if(result.address.length == 0) {
                output+= `
                <div class="address-card-add">
                    <i class="fas fa-map-pin"></i>
                    <div class="address-text">
                        <p class="add">Add New Address</p>
                        <button class="add-address">+</button>
                    </div>
                </div>
                `

                $(".address-grid").empty();
                $(".address-grid").html(output);
            } else {
                result.address.forEach(address => {
                    let icon = "fas fa-home";
                    let top_text = "Home" 
                    if(address.type == "work") {
                        icon = "fas fa-briefcase"
                        top_text = "Work"
                    } else if(address.type == "other") {
                        icon = "fas fa-map-marker-alt"
                        top_text = "Other"
                    }

                    output += `
                    <div class="address-card">
                        <i class="${icon}"></i>
                        <div class="address-text">
                            <p class="home address-tag">${top_text}</p>
                            <p class="address-main">${address.location}</p>
                            <button class="choose-address">deliver here</button>
                        </div>
                    </div>
                    `
                });

                output += `
                <div class="address-card-add">
                    <i class="fas fa-map-pin"></i>
                    <div class="address-text">
                        <p class="add">Add New Address</p>
                        <button class="add-address">+</button>
                    </div>
                </div>
                `

                $(".address-grid").empty();
                $(".address-grid").html(output);

            }

            hideLoader($(".overlay-white"));
        })
    }

    //---------------------GET CART---------------------------
    function getCart() {
        if(sessionStorage.getItem("shopInCart") == "undefined") {
            $(".no-items-in-cart").removeClass("hidden");
            console.log(sessionStorage.getItem("shopInCart"));
        } else {
            const get_shop_api = `https://yourstore-swe.herokuapp.com/shop/${sessionStorage.getItem("shopInCart")}`;
    
            let myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append("Authorization", `${localStorage.getItem('authToken')}`);
    
            let requestOptions = {
                method: 'GET',
                headers: myHeaders,
            }
    
            try {
                fetch(get_shop_api, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    console.log(result);
                    let img = `./Public/assets/default.jpg`;
                    if(result.data.picture) {
                        img = result.data.picture;
                    }
    
                    $(".shop-image").attr("src", img);
                    $(".shop-name").text(result.data.shopName);
                })
                .catch((e) => {
                    console.log(e);
                    swal("Oops something went wrong", "" + e, "error");
                })
    
                getCartItems();
    
            } catch (e) {
                console.log(e)
                swal("Oops something went wrong!", "" + e, "error");
            }
        }
    }

    function getCartItems() {
        $(".cart-overlay").removeClass("hidden");
        $(".cart-spinner").removeClass("hidden");
        const cart_api = `https://yourstore-swe.herokuapp.com/user/Cart`;

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append("Authorization", `${localStorage.getItem('authToken')}`);

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
        }

        fetch(cart_api, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
            if(result.length == 0) {
                $(".no-items-in-cart").removeClass("hidden");
            } else {
                let output = ``;
                let totalCost = 0;
                let delivery_cost = 0;
                result.forEach(item => {
                    let cost;
                    cost = item.cost * item.quantity;
    
                    totalCost += cost;
    
                    output += `
                    <div class="item">
                        <div class="itemID">${item._id}</div>
                        <div class="item-name">${item.itemName}</div>
                        <div class="item-quantity">
                            <div class="increase-container">
                                <div class="decrease-quantity">-</div>
                                <div class="current-quantity">${item.quantity}</div>
                                <div class="increase-quantity">+</div>
                            </div>
                        </div>
                        <div class="item-cost">&#8377;${cost}</div>
                    </div>
                    `
                })
    
                $(".item-total-cost").html(`&#8377; ${totalCost}`)
                let to_pay = totalCost + delivery_cost;
    
                $(".to-pay-cost").html(`&#8377; ${to_pay}`);
                $(".amount").html(`&#8377; ${to_pay}`);
    
                $(".items-container").empty();
                $(".items-container").html(output);
    
            }
            $(".cart-overlay").addClass("hidden");
            $(".cart-spinner").addClass("hidden");
        })
        .catch((e) => {
            console.log(e)
            swal("Oops something went wrong!", "" + e, "error");
        })
    }

    //-----------------------INCREASE/DECREASE QUANTITY----------------------

    $("body").on("click", ".increase-quantity",function(e) {
        e.preventDefault();

        $(this).parents(".cart-items").children(".cart-overlay").removeClass("hidden");
        $(this).parents(".cart-items").children(".cart-spinner").removeClass("hidden");

        const itemID = $(this).parents(".item").children(".itemID").text();
        console.log(itemID);

        const increase_api = `https://yourstore-swe.herokuapp.com/user/cart/increase/${itemID}/1`;

        let myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append("Authorization", `${localStorage.getItem('authToken')}`);

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
        }

        fetch(increase_api, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            getCartItems();
        }).catch((e) => {
            console.log(e);
            swal("Oops something went wrong!", "" + e, "error");
        })
    })

    $("body").on("click", ".decrease-quantity",function(e) {
        e.preventDefault();

        $(this).parents(".cart-items").children(".cart-overlay").removeClass("hidden");
        $(this).parents(".cart-items").children(".cart-spinner").removeClass("hidden");

        const itemID = $(this).parents(".item").children(".itemID").text();
        console.log(itemID);

        const decrease_api = `https://yourstore-swe.herokuapp.com/user/cart/increase/${itemID}/-1`;

        let myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append("Authorization", `${localStorage.getItem('authToken')}`);

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
        }

        fetch(decrease_api, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            getCartItems();
        }).catch((e) => {
            swal("Oops something went wrong!", "" + e, "error");
            console.log(e);
        })
    })

    getCart();

    //------------------------SHOW CONFIRMATION-------------------------------
    
    $(".pay-btn").on("click", function(e) {
        e.preventDefault();
        $(".payment-confirmation").removeClass("hidden");
        $(".overlay").show();
        $("body").addClass("overlay-open");
    })

    $(".decline").on("click", function(e) {
        e.preventDefault();
        $(".payment-confirmation").addClass("hidden");
        $(".overlay").hide();
        $("body").removeClass("overlay-open");
    })

    //------------------------CHECKOUT------------------------------------------
    $(".confirm").on("click", function(e) {
        e.preventDefault();

        showLoader($(".overlay"));

        const checkout_api = `https://yourstore-swe.herokuapp.com/user/checkout`;

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append("Authorization", `${localStorage.getItem('authToken')}`);

        let address = $(".type-address").text();
        let cost = $(".to-pay-cost").text().split(" ")[1];

        let body = {
            address: address,
            cost: cost,
        }
        
        let json = JSON.stringify(body);

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: json,
        }

        fetch(checkout_api, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log(result)
            $(".payment-confirmation").addClass("hidden");
            $(".overlay").hide();
            $("body").removeClass(".overlay-open");
            hideLoader($(".overlay"));
            swal("Order placed successfully", "You're all set!", "success");
            getCart();
        })
        .catch((e) => {
            swal("Oops something went wrong", "" + e, "error");
        })

    })
})