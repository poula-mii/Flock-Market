$(document).ready(function() {
    $('input[type="number"]').niceNumber();
    $(".overlay").hide();

    if(!sessionStorage.getItem("shopID")) {
        hideLoader($(".overlay-white"));
        $(".select-a-shop").removeClass("hidden");
    } else {
        getShop().then((result) => {
            createFruitsAndVegCard(result);
            $("#shop-name").text(result.data.shopName);
            hideLoader($(".overlay-white"));
        })
    }

    if(!localStorage.getItem('authToken'))
    {
        $("#profile-text").text("Profile");
        $("#profile").hide();
        $("#login-btn").show();
        hideLoader($('.overlay-white'));
    } else {
        $("#login-btn").hide();
        $("#profile").show();
        getProfile();
    }

    const card = $('.card');
    const info_btn = $('.info');

    //--------------------INFO DISPLAY-----------------------------

    $("body").on('click', '.info', function(e) {
        e.preventDefault();
        $(this).parent().parent().parent().children('.description').removeClass('description-hidden');
            
        $('.cross').on('click', function(e) {
            e.preventDefault();
            $(this).parent().addClass('description-hidden');
        })
    })

      //--------------------OVERLAY FUNCTIONS-------------------------
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

    //--------------------SECTION CHANGE----------------------------

    const fruits = $('.fruits');
    const meat  = $('.meat');
    const dairy = $('.dairy');
    const snacks = $('.snacks');
    const drinks = $('.drinks');

    const fruits_btn = $('#fruits-btn'); 
    const meat_btn = $('#meat-btn'); 
    const dairy_btn = $('#dairy-btn'); 
    const snacks_btn = $('#snacks-btn'); 
    const drinks_btn = $('#drinks-btn'); 

    fruits.show();
    meat.hide();
    dairy.hide();
    snacks.hide();
    drinks.hide();

    fruits_btn.on('click', function(e) {
        showLoader($(".overlay"));
        e.preventDefault();
        meat.hide();
        dairy.hide();
        snacks.hide();
        drinks.hide();
        fruits.show();
        $(".search-section").addClass("hidden");
        getShop().then((result) => {
            createFruitsAndVegCard(result);
        })
    })

    meat_btn.on('click', function(e) {
        showLoader($(".overlay"));
        e.preventDefault();
        fruits.hide();
        dairy.hide();
        snacks.hide();
        drinks.hide();
        meat.show();
        $(".search-section").addClass("hidden");

        getShop().then((result) => {
            createTaggedCard(result, 'meat', $("#meat-shop"));
        })
    })

    dairy_btn.on('click', function(e) {
        showLoader($(".overlay"));
        e.preventDefault();
        meat.hide();
        fruits.hide();
        snacks.hide();
        drinks.hide();
        dairy.show();
        $(".search-section").addClass("hidden");

        getShop().then((result) => {
            createTaggedCard(result, 'dairy', $("#dairy-shop"));
        })
    })

    snacks_btn.on('click', function(e) {
        showLoader($(".overlay"));
        e.preventDefault();
        meat.hide();
        dairy.hide();
        fruits.hide();
        drinks.hide();
        snacks.show();
        $(".search-section").addClass("hidden");

        getShop().then((result) => {
            createTaggedCard(result, 'snacks', $("#snacks-shop"));
        })
    })

    drinks_btn.on('click', function(e) {
        showLoader($(".overlay"));
        e.preventDefault();
        meat.hide();
        dairy.hide();
        snacks.hide();
        fruits.hide();
        drinks.show();
        $(".search-section").addClass("hidden");

        getShop().then((result) => {
            createTaggedCard(result, 'drinks', $("#drinks-shop"));
        })
    })

      
    //------------------------GET SHOP---------------------------

    function getShop() {
        let shopID = sessionStorage.getItem("shopID");
        const getShop_api = `https://yourstore-swe.herokuapp.com/shop/${shopID}`;

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        let requestOptions = {
            method: 'GET',
        }

        try {
            return fetch(getShop_api, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                hideLoader($(".overlay"))
                return result;
            })
            .catch((e) => {
                hideLoader($(".overlay"))
                swal("Oops something went wrong!", "" + e, "error") 
                console.log(e);
            })
        } catch (e) {   
            hideLoader($(".overlay"))  
            swal("Oops something went wrong!", "" + e, "error")
            console.log(e);
        }
    }

    //-----------------------CREATE CARD FUNCTIONS-----------------------

    function createFruitsAndVegCard(result) {
        let count = 0;

        result.data.items.forEach(item => {
            if(item.tags == "fruits" || item.tags == "vegetables") {
                count++;
            }
        });

        if(count == 0) {
            $('#fruit-shop').empty();
            $('#fruit-shop').html("<div class='no-products-text'>No fruits or vegetables</div>");
        } else {
            let img = '';
            let output = ``;

            result.data.items.forEach(item => {
                let img = `./Public/assets/default.jpg`;
                if(item.picture) {
                    img = item.picture;
                }

                let max_quatity = 10
                if(item.quantity < 10) {
                    max_quatity = item.quantity;
                }

                if(item.tags == "fruits" || item.tags == "vegetables") {
                    output += `
                    <div class="card">
                        <div class="card-overlay hidden"></div>
                        <div class="card-spinner hidden"><img src="./Public/assets/loader.gif" alt=""></div>
                        <img src="${img}" alt="" class="product-img">
                        <div class="product-details">
                            <div class="product-name">${item.itemName}</div>
                            <div class="product-cost">&#8377; ${item.cost}</div>
                            <div class="product-amount">1 Kg</div>
                            <div class="quantity-input-container">
                                <input type="number" name="quantity" min="0" max="${max_quatity}" value="0" class="product-quantity" id="quantity-to-add">
                                <div class="increase-container hidden">
                                    <div class="decrease-quantity">-</div>
                                    <div class="current-quantity">x in cart</div>
                                    <div class="increase-quantity">+</div>
                                </div>
                                <span class="info"><img src="https://img.icons8.com/cotton/64/000000/info--v5.png"/></span>
                            </div>
                            
                            <div class="btn-container">
                                <div class="itemID">${item._id}</div>
                                <button class="add-to-cart">Add to cart <i class="fas fa-shopping-cart"></i></button>
                            </div>  
                        </div>

                        <div class="description description-hidden">
                            <span class="cross">
                                <img src="https://img.icons8.com/ios/50/000000/circled-x.png"/>
                            </span>
                            <p class="description-text">${item.itemDesc}</p>
                        </div>  
                    </div>
                    `
                }
            })

            $('#fruit-shop').empty();
            $('#fruit-shop').html(output);
            $('input[type="number"]').niceNumber();
        }
    }    

    function createTaggedCard(result, tag, container) {
        let count = 0;

        result.data.items.forEach(item => {
            if(item.tags == tag) {
                count++;
            }
        })

        if(count==0) {
            container.empty();
            container.html(`<div class='no-products-text'>No products of this kind</div>`);
        } else {
            let img = './Public/assets/default.jpg';
            let output = ``;

            result.data.items.forEach(item => {
                if(item.picture) {
                    img = item.picture;
                }

                let max_quatity = 10
                if(item.quantity < 10) {
                    max_quatity = item.quantity;
                }

                if(item.tags == tag) {
                    let unit = "unit";
                    if(tag == "meat") {
                        unit = "Kg"
                    }
                    output += `
                    <div class="card">
                        <div class="card-overlay hidden"></div>
                        <div class="card-spinner hidden"><img src="./Public/assets/loader.gif" alt=""></div>
                        <img src="${img}" alt="" class="product-img">
                        <div class="product-details">
                            <div class="product-name">${item.itemName}</div>
                            <div class="product-cost">&#8377; ${item.cost}</div>
                            <div class="product-amount">1 ${unit}</div>
                            <div class="quantity-input-container">
                                <input type="number" name="quantity" min="0" max="${max_quatity}" value="0" class="product-quantity" id="quantity-to-add">
                                <div class="increase-container hidden">
                                    <div class="decrease-quantity">-</div>
                                    <div class="current-quantity">x in cart</div>
                                    <div class="increase-quantity">+</div>
                                </div>
                                <span class="info"><img src="https://img.icons8.com/cotton/64/000000/info--v5.png"/></span>
                            </div>
                            <div class="btn-container">
                                <div class="itemID">${item._id}</div>
                                <button class="add-to-cart">Add to cart <i class="fas fa-shopping-cart"></i></button>
                            </div>  
                        </div>

                        <div class="description description-hidden">
                            <span class="cross">
                                <img src="https://img.icons8.com/ios/50/000000/circled-x.png"/>
                            </span>
                            <p class="description-text">${item.itemDesc}</p>
                        </div>  
                    </div>
                    `
                }
            })

            container.empty();
            container.html(output);
            $('input[type="number"]').niceNumber();
        }    
    }

    //---------------------ADD TO CART------------------------

    $("body").on("click", ".add-to-cart", function(e) {
        e.preventDefault();
        $(this).parents(".card").children(".card-overlay").show();
        $(this).parents(".card").children(".card-spinner").show();

        if(!localStorage.getItem("authToken")) {
            $(".not-logged-in").removeClass("hidden");
            $("body").addClass("overlay-open");
            $(this).parents(".card").children(".card-overlay").hide();
            $(this).parents(".card").children(".card-spinner").hide();
        } else {
            const itemID = $(this).parent().children(".itemID").text();
            let shopID = sessionStorage.getItem("shopID");
            const quantity = $(this).parent().parent().children(".quantity-input-container").find('.product-quantity').val();
            const add_to_cart_api = `https://yourstore-swe.herokuapp.com/user/addCart/${itemID}/${quantity}`

            let myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append("Authorization", `${localStorage.getItem('authToken')}`);

            let requestOptions = {
                method: 'POST',
                headers: myHeaders,
            }

            fetch(add_to_cart_api, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if(result.error) {
                    $(".one-shop").removeClass("closed");
                    $(this).parents(".card").children(".card-overlay").hide();
                    $(this).parents(".card").children(".card-spinner").hide();
                    setTimeout(function() {
                        $(".one-shop").addClass("closed");
                    }, 5000)
                } else {
                    $(this).parent().hide();
                    $(this).parent().parent().children(".quantity-input-container").find('.product-quantity').hide();
                    $(this).parent().parent().children(".quantity-input-container").children(".nice-number").hide();
                    let increaseContainer = $(this).parent().parent().children(".quantity-input-container").children(".increase-container").removeClass("hidden");
    
                    increaseContainer.children(".current-quantity").text(`${quantity} in cart`);

                    $(this).parents(".card").children(".card-overlay").hide();
                    $(this).parents(".card").children(".card-spinner").hide();
                }

            })
        }
    })

    $(".cross").on("click", function(e) {
        e.preventDefault();
        $(".not-logged-in").addClass("hidden");
        $("body").removeClass("overlay-open");
    })

    //---------------------INCREASE/DECREASE Quantity------------

    $("body").on("click", ".increase-quantity",function(e) {
        e.preventDefault();

        $(this).parents(".card").children(".card-overlay").show();
        $(this).parents(".card").children(".card-spinner").show();

        const itemID = $(this).parents(".product-details").children(".btn-container").children(".itemID").text();
        const increase_api = `https://yourstore-swe.herokuapp.com/user/cart/increase/${itemID}/1`;
        let current_text = $(this).parent().children(".current-quantity").text().split(" ")[0];

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
            current_text++;

            $(this).parent().children(".current-quantity").text(`${current_text} in cart`);

            $(this).parents(".card").children(".card-overlay").hide();
            $(this).parents(".card").children(".card-spinner").hide();

        }).catch((e) => {
            console.log(e);
        })
    })

    $("body").on("click", ".decrease-quantity",function(e) {
        e.preventDefault();

        $(this).parents(".card").children(".card-overlay").show();
        $(this).parents(".card").children(".card-spinner").show();

        const itemID = $(this).parents(".product-details").children(".btn-container").children(".itemID").text();
        const decrease_api = `https://yourstore-swe.herokuapp.com/user/cart/increase/${itemID}/-1`;
        let current_text = $(this).parent().children(".current-quantity").text().split(" ")[0];

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
            current_text--;

            if(current_text == 0) {
                $(this).parent().hide();
                $(this).parents(".quantity-input-container").children().find('.product-quantity').show();
                $(this).parents(".quantity-input-container").children(".nice-number").show();
                $(this).parents(".product-details").children(".btn-container").show();

                $(this).parents(".card").children(".card-overlay").hide();
                $(this).parents(".card").children(".card-spinner").hide();
            } else {
                $(this).parent().children(".current-quantity").text(`${current_text} in cart`);
    
                $(this).parents(".card").children(".card-overlay").hide();
                $(this).parents(".card").children(".card-spinner").hide();
            }


        }).catch((e) => {
            console.log(e);
        })
    })

    //---------------------PROFILE-------------------------------
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
            hideLoader($(".overlay-white"));
        })
    }

    //---------------------SEARCH--------------------------------

    $("#search-btn").on("click", function(e) {
        e.preventDefault();

        fruits.hide();
        meat.hide();
        dairy.hide();
        snacks.hide();
        drinks.hide();

        $(".search-section").removeClass("hidden")
        $(".clear-btn").click();

    })

    $("#esc-btn").on('click', function(e) {
        fruits.show();
        meat.hide();
        dairy.hide();
        snacks.hide();
        drinks.hide();
        $(".search-section").addClass("hidden");
    })

    $(document).on("keyup", function(e) {
        if(e.key == "Escape") $("#esc-btn").click();
    })

    $(document).keyup(function (e) {
        if ($("#search-input").is(":focus") && (e.keyCode == 13)) {
            $("#search-input-btn").click();
        }
    })

    $(".clear-btn").on('click', function(e) {
        e.preventDefault();

        $("#search-input").val("");
        $(".search-results").empty();
    })

    $("#search-input-btn").on("click", function(e) {
        e.preventDefault();

        showLoader($(".overlay"));

        let searchQuery = $("#search-input").val();
        const search_api = `https://yourstore-swe.herokuapp.com/searchItem/${sessionStorage.getItem("shopID")}?search=${searchQuery}`;

        if(searchQuery == " " || searchQuery.length == 0) {
            $("#search-input").val("");
            $(".search-results").empty();
            hideLoader($(".overlay"));
        } else {
            let myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');

            let requestOptions = {
                method: 'GET',
                headers: myHeaders,
            }

            fetch(search_api, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                let img = './Public/assets/default.jpg';
                let output = ``;

                result.items.forEach(item => {
                    if(item.picture) {
                        img = item.picture;
                    }
    
                    let max_quatity = 10
                    if(item.quantity < 10) {
                        max_quatity = item.quantity;
                    }

                    output += `
                    <div class="card">
                        <div class="card-overlay hidden"></div>
                        <div class="card-spinner hidden"><img src="./Public/assets/loader.gif" alt=""></div>
                        <img src="${img}" alt="" class="product-img">
                        <div class="product-details">
                            <div class="product-name">${item.itemName}</div>
                            <div class="product-cost">&#8377; ${item.cost}</div>
                            <div class="product-amount">1 kg</div>
                            <div class="quantity-input-container">
                                <input type="number" name="quantity" min="0" max="${max_quatity}" value="0" class="product-quantity" id="quantity-to-add">
                                <div class="increase-container hidden">
                                    <div class="decrease-quantity">-</div>
                                    <div class="current-quantity">x in cart</div>
                                    <div class="increase-quantity">+</div>
                                </div>
                                <span class="info"><img src="https://img.icons8.com/cotton/64/000000/info--v5.png"/></span>
                            </div>
                            <div class="btn-container">
                                <div class="itemID">${item._id}</div>
                                <button class="add-to-cart">Add to cart <i class="fas fa-shopping-cart"></i></button>
                            </div>  
                        </div>

                        <div class="description description-hidden">
                            <span class="cross">
                                <img src="https://img.icons8.com/ios/50/000000/circled-x.png"/>
                            </span>
                            <p class="description-text">${item.itemDesc}</p>
                        </div>  
                    </div>
                    `
                })

                $(".search-results").empty();
                $(".search-results").html(output);

                $('input[type="number"]').niceNumber();
                hideLoader($(".overlay"));
            })
        }
    })

});