$(document).ready(function() {
    $(".overlay").hide();
    $("body").removeClass("overlay-open");

    if(!localStorage.getItem('authToken')) {
        $(".not-logged-in").removeClass("hidden");
    } else {
        getProfile().then((result) => {
            $("#profile-text").text(result.name);
            $("#user-name").val(result.name);
            $("#user-email").val(result.email);
            $("#user-phone").val(result.phone);
            getOrders();
        })
    }

    // ----------------LOADER FUNCTIONS---------------------

    function showLoader(overlay) {
        overlay.show();
        $('.spinner').show();
        $('body').addClass('overlay-open');
    }

    function hideLoader(overlay) {
        overlay.hide();
        $('.spinner').hide();
        $('body').removeClass('overlay-open');
    }

    // --------------PROFILE---------------------------------

    $("#profile").on('click', function(e) {
        $(".profile-sidebar").removeClass("closed");
        $(".overlay").show();
        $("body").addClass("overlay-open");

        $(".cross-profile").on('click', function() {
            $(this).parent().addClass('closed');
            $(".overlay").hide();
            $('body').removeClass('overlay-open');
        })
    })

    // --------------SECTION DISPLAY-------------------------

    $('.payments').hide();
    $('.payment-history').hide();
    $('.favorites').hide();
    $('.addresses').hide();
    $('.order-history').hide();

    $('.payments-btn').on('click', function(e) {
        e.preventDefault();
        $('.orders').hide();
        $('.favorites').hide();
        $('.addresses').hide();
        $('.order-history').hide();

        $('.payments').show();

        $('.orders-btn').removeClass('active');
        $('.favorites-btn').removeClass('active');
        $('.addresses-btn').removeClass('active');
        $('.order-history-btn').removeClass('active');

        $('.payments-btn').addClass('active');

        try {
            getProfile().then((result) => {
                console.log(result);
                if(result.paymentHistory.length == 0) {
                    $('.payments').empty();
                    $('.payments').html("<div class='no-products-text'>No payments yet!</div>");
                } else {
                    let output = ``;
                    result.paymentHistory.forEach(item => {

                        date = item.date.split("T");

                        output += `
                        <div class="payment-card">
                            <div class="payments-shopID">
                            <strong class="shopID-text">Shop Name:</strong>${item.shopName}
                            </div>
                            <div class="payments-date">
                                <strong>Date: </strong> ${date[0]}
                            </div>
                            <div class="paments-cost">
                                <strong>Total cost: </strong> ${"&#8377;"+item.totalCost}
                            </div>
                        </div>
                        `

                    })
                    $(".payments-container").empty();
                    $(".payments-container").html(output);
                }
            })
        } catch(e) {
            console.log(e);
        }
    })

    $('.order-history-btn').on('click', function(e) {
        e.preventDefault();
        $('.orders').hide();
        $('.payments').hide();
        $('.addresses').hide();
        $('.favirites').hide();

        $('.order-history').show();

        $('.orders-btn').removeClass('active');
        $('.payments-btn').removeClass('active');
        $('.addresses-btn').removeClass('active');
        $('.favorites-btn').removeClass('active');

        $('.order-history-btn').addClass('active');

        try {
            getOrderHistory();
        } catch(e) {
            console.log(e)
        }
    })

    $('.favorites-btn').on('click', function(e) {
        e.preventDefault();
        $('.orders').hide();
        $('.payments').hide();
        $('.addresses').hide();
        $('.order-history').hide();

        $('.favorites').show();

        $('.orders-btn').removeClass('active');
        $('.payments-btn').removeClass('active');
        $('.addresses-btn').removeClass('active');
        $('.order-history-btn').removeClass('active');

        $('.favorites-btn').addClass('active');
    })

    $('.addresses-btn').on('click', function(e) {
        e.preventDefault();
        $('.orders').hide();
        $('.payments').hide();
        $('.favorites').hide();
        $('.order-history').hide();

        $('.addresses').show();

        $('.orders-btn').removeClass('active');
        $('.payments-btn').removeClass('active');
        $('.favorites-btn').removeClass('active');
        $('.order-history-btn').removeClass('active');
        
        $('.addresses-btn').addClass('active');

        try {
            getAddress();
        } catch(e) {
            console.log(e);
            swal("Oops something went wrong!", "" + e, "error");
        }
    })

    $('.orders-btn').on('click', function(e) {
        e.preventDefault();
        $('.favorites').hide();
        $('.payments').hide();
        $('.addresses').hide();
        $('.order-history').hide();

        $('.orders').show();

        $('.favorites-btn').removeClass('active');
        $('.payments-btn').removeClass('active');
        $('.addresses-btn').removeClass('active');
        $('.order-history-btn').removeClass('active');
        
        
        $('.orders-btn').addClass('active');

        try {
            getOrders();
        } catch(e) {
            console.log(e);
        }
        
    })

    function getOrders() {
        getProfile().then((result) => {
            $(".orders-container").empty();
            if(result.PendingOrders.length == 0) {
                $('.orders-container').empty();
                $('.orders-container').html("<div class='no-products-text'>No orders yet!</div>");
            } else {
                console.log(result);
                result.PendingOrders.forEach(order => {
                    let output = ``;
                    output += `
                        <div class="order-card">
                        <div class="order-shop-details">
                            <div class="order-shop-name">${order.order.shopName}</div>
                        </div>
                    `
                    order.order.items.forEach(item => {
                        let img;
                        if(item.picture) {
                            img = item.picture;
                        } else {
                            img = './Public/assets/default.jpg';
                        }

                        let cost  = item.quantity * item.cost;

                        output += `
                        <div class="order-item-details">
                            <div class="order-name-container">
                                <img src="${img}" alt="No image found">
                                ${item.itemName}
                            </div>
                            <div class="order-quantity">
                                <strong>Quantity: </strong> ${item.quantity}
                            </div>
                            <div class="order-cost">
                                <strong>Cost: </strong> ${"&#8377;" +cost}
                            </div>
                        </div>
                        `
                    });

                    output += `
                        </div>
                    `

                    $('.orders-container').append(output);
                });
                
            }
            hideLoader($(".overlay-white"));
        })
    }

    function getOrderHistory() {
        getProfile().then((result) => {
            $(".order-history-container").empty();
            if(result.OrderHistory.length == 0) {
                $('.order-history-container').empty();
                $('.order-history-container').html("<div class='no-products-text'>No orders yet!</div>");
            } else {
                console.log(result);
                result.OrderHistory.forEach(order => {
                    let output = ``;
                    output += `
                        <div class="order-card">
                        <div class="order-shop-details">
                            <div class="order-shop-name">${order.order.shopName}</div>
                        </div>
                    `
                    order.order.items.forEach(item => {
                        let img;
                        if(item.picture) {
                            img = item.picture;
                        } else {
                            img = './Public/assets/default.jpg';
                        }

                        let cost  = item.quantity * item.cost;

                        output += `
                        <div class="order-item-details">
                            <div class="order-name-container">
                                <img src="${img}" alt="No image found">
                                ${item.itemName}
                            </div>
                            <div class="order-quantity">
                                <strong>Quantity: </strong> ${item.quantity}
                            </div>
                            <div class="order-cost">
                                <strong>Cost: </strong> ${"&#8377;" +cost}
                            </div>
                        </div>
                        `
                    });

                    output += `
                        </div>
                    `

                    $('.order-history-container').append(output);
                });
                
            }
            hideLoader($(".overlay-white"));
        })
    }
    

    function getProfile() {
        const profile_api = "https://yourstore-swe.herokuapp.com/user/me";

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append("Authorization", `${localStorage.getItem('authToken')}`);

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
        }

        try {
            return fetch(profile_api, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                return result
            })
            .catch((e) => {
                console.log(e);
            })
        } catch (e) {
            console.log(e);
        }
    }

    function getAddress() {
        getProfile().then((result) => {
            if(result.address.length == 0) {
                $('.address-container').empty();
                $('.address-container').html("<div class='no-products-text'>No addresses added!</div>");
            } else {
                
                let output = ``;    
                
                result.address.forEach(address => {
                    let icon = "fas fa-home"
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
                            <p class="home">${top_text}</p>
                            <p class="address-location">${address.location}</p>
                            <button class="delete-address">Delete</button>
                        </div>
                    </div>
                    `
                })

                $('.address-container').empty();
                $('.address-container').html(output);
            }
        })
    }

    //------------------DELETE ADDRESS----------------------
    $("body").on("click", '.delete-address', function(e) {
        e.preventDefault();
        let address = $(this).parent().children(".address-location").text();

        $(".overlay").show();
        $("body").addClass("overlay-open");
        $(".confirm-delete-address").removeClass("hidden");

        $(".confirm").on("click", function(e) {
            showLoader($(".overlay"));
    
            const del_address_api = `https://yourstore-swe.herokuapp.com/user/address`;
    
            let myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append("Authorization", `${localStorage.getItem('authToken')}`);
    
    
            let body = {
                location: address,
            }
    
            let json = JSON.stringify(body);
    
            let requestOptions = {
                method: 'PATCH',
                headers: myHeaders,
                body: json,
            }
    
            fetch(del_address_api, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                $(".confirm-delete-address").addClass("hidden");
                swal("Address deleted!", "You're all set!", "success");
                getAddress();
                hideLoader($(".overlay"));
            })
            .catch((e) => {
                console.log(e);
                swal("Oops something went wrong!", "" + e, "error");
            })
        });

        $(".decline").on("click", function(e) {
            $(".overlay").hide();
            $("body").removeClass("overlay-open");
            $(".confirm-delete-address").addClass("hidden");
        })

    })

    //------------------LOGOUT------------------------------
    $(".logout").on("click", function(e) {
        e.preventDefault();

        showLoader($(".overlay"));

        const logout_api = `https://yourstore-swe.herokuapp.com/user/logout`;

        let myHeaders = new Headers();
        myHeaders.append("Authorization", `${localStorage.getItem("authToken")}`);

        let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
        };

        fetch(logout_api, requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result);
            swal("Logged out successfuly!", "You're all set", "success");
            localStorage.removeItem("authToken");
            window.location.reload();
        })
        .catch(error => console.log('error', error));
        })
});