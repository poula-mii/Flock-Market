$(document).ready(function() {
    const sign_in_btn = $('#sign-in-btn');
    const sign_up_btn = $('#sign-up-btn');
    const container = $('.container');

    sign_up_btn.on('click', () => {
        container.addClass('sign-up-mode');
    })

    sign_in_btn.on('click', () => {
        container.removeClass('sign-up-mode');
    })

    // $('.sign-up-container').hide();
    // $('.sign-in-container').hide();
    // $('.overlay').hide();

    $('.sign-in-as-shop').on('click', function(e) {
        e.preventDefault();

        $('.overlay').addClass('open-overlay');
        $('.sign-in-container').addClass('open');
    })

    $('.sign-up-as-shop').on('click', function(e) {
        e.preventDefault();

        $('.overlay').addClass('open-overlay');
        $('.sign-up-container').addClass('open');
    })

    $('.cross').on('click', function(e) {
        e.preventDefault();

        $(this).parent().removeClass('open');
        $('.overlay').removeClass('open-overlay');
    })

    //-----------------LOCATION-----------------------

    let coords = [];

    $('#get-address').on('click', function(e) {
        coords = [];
        e.preventDefault();
         navigator.geolocation.getCurrentPosition(function(e) {
            const {longitude, latitude} = e.coords;
            coords.push(longitude);
            coords.push(latitude);
            $("#get-address").html("<i class='fas fa-check'></i> Located");
         });
    })

    //-----------------VALIDATION----------------------

    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


    $('#username-signup').on('keyup', validateClass);
    $('#email-signup').on('keyup', validateClass);
    $('#age-signup').on('keyup', validateClass);
    $('#password-signup').on('keyup', validateClass);
    $('#phone-signup').on('keyup', validateClass);

    $('#email-signin').on('keyup', validateClass);
    $('#password-signin').on('keyup', validateClass);

    $('#shop-name').on('keyup', validateClass);
    $('#shop-email').on('keyup', validateClass);
    $('#shop-password').on('keyup', validateClass);
    $('#shop-phone').on('keyup', validateClass);
    $('#shop-owner').on('keyup', validateClass);
    $('#shop-address').on('keyup', validateClass);
    $('#shop-landmark').on('keyup', validateClass);

    $('#shop-name-signin').on('keyup', validateClass);
    $('#shop-password-signin').on('keyup', validateClass);

    function validateClass(e) {
        let target = e.target;
        if(target.name == "username") {
            if(target.value.length < 3 || target.value == null) {
                $(this).parent('.input-field').addClass('invalid');
                $(this).parent('.input-field').removeClass('valid');
              
            } else {
                $(this).parent('.input-field').addClass('valid');
                $(this).parent('.input-field').removeClass('invalid');
            }
        }

        if(target.name == "email") {
            if(re.test(target.value) || target.value == null) {
                $(this).parent('.input-field').addClass('valid');
                $(this).parent('.input-field').removeClass('invalid');
            } else {
                $(this).parent('.input-field').addClass('invalid');
                $(this).parent('.input-field').removeClass('valid');
            
            }
        }

        if(target.name == "password") {
            if(target.value.length < 6 || target.value == null) {
                $(this).parent('.input-field').addClass('invalid');
                $(this).parent('.input-field').removeClass('valid');
              
            } else {
                $(this).parent('.input-field').addClass('valid');
                $(this).parent('.input-field').removeClass('invalid');
            }
        }

        if(target.name == "age") {
            if(target.value < 18 || target.value == null) {
                $(this).parent('.input-field').addClass('invalid');
                $(this).parent('.input-field').removeClass('valid');
          
            } else {
                $(this).parent('.input-field').addClass('valid');
                $(this).parent('.input-field').removeClass('invalid');
            }
        }

        if(target.name == "phone") {
            if(target.value.length != 10 || target.value == null) {
                $(this).parent('.input-field').addClass('invalid');
                $(this).parent('.input-field').removeClass('valid');
              
            } else {
                $(this).parent('.input-field').addClass('valid');
                $(this).parent('.input-field').removeClass('invalid');
            }
        }

        if(target.name == "owner") {
            if(target.value.length < 3 || target.value == null) {
                $(this).parent('.input-field').addClass('invalid');
                $(this).parent('.input-field').removeClass('valid');
              
            } else {
                $(this).parent('.input-field').addClass('valid');
                $(this).parent('.input-field').removeClass('invalid');
            }
        }

        if(target.name == "address") {
            if(target.value.length < 10 || target.value == null) {
                $(this).parent('.input-field').addClass('invalid');
                $(this).parent('.input-field').removeClass('valid');
              
            } else {
                $(this).parent('.input-field').addClass('valid');
                $(this).parent('.input-field').removeClass('invalid');
            }
        }

        if(target.name == "landmark") {
            if(target.value.length < 6 || target.value == null) {
                $(this).parent('.input-field').addClass('invalid');
                $(this).parent('.input-field').removeClass('valid');
              
            } else {
                $(this).parent('.input-field').addClass('valid');
                $(this).parent('.input-field').removeClass('invalid');
            }
        }
    }


    function clearClass() {
        $('#username-signup').removeClass('valid invalid');
        $('#email-signup').removeClass('valid invalid');
        $('#age-signup').removeClass('valid invalid');
        $('#password-signup').removeClass('valid invalid');
        $('#phone-signup').removeClass('valid invalid');

        $('#email-signin').removeClass('valid invalid');
        $('#password-signin').removeClass('valid invalid');

        $('#shop-name').removeClass('valid invalid');
        $('#shop-desc').removeClass('valid invalid');
        $('#shop-email').removeClass('valid invalid');
        $('#shop-password').removeClass('valid invalid');
        $('#shop-phone').removeClass('valid invalid');
        $('#shop-owner').removeClass('valid invalid');

        $('#shop-name-signin').removeClass('valid invalid');
        $('#shop-name-signin').removeClass('valid invalid');
    }


    function validate(element) {
        let name = element[0].name;
        if(name == "email") {
            if(!re.test(element[0].value) || element[0].value == "") {
                element.parent('.input-field').addClass('invalid');
                throw Error("email");
            }
        }
        if(name == "username") {
            if(element[0].value == "" || element[0].value.length < 3) {
                element.parent('.input-field').addClass('invalid');
                throw new Error("username");
            }
        }
        if(name == "age") {
            if(element[0].value == "" || element[0].value < 18) {
                element.parent('.input-field').addClass('invalid');
                throw Error("age");
            }
        }
        if(name == "phone") {
            if(element[0].value == "" || element[0].value.length != 10) {
                element.parent('.input-field').addClass('invalid');
                throw Error("phone");
            }
        }
        if(name == "password") {
            if(element[0].value == "" || element[0].value.length < 6) {
                element.parent('.input-field').addClass('invalid');
                throw Error("password");
            }
        }
        if(name == "owner") {
            if(element[0].value == "" || element[0].value.length < 3) {
                element.parent('.input-field').addClass('invalid');
                throw Error("owner name");
            }
        }
        if(name == "address") {
            if(element[0].value == "" || element[0].value.length < 10) {
                element.parent('.input-field').addClass('invalid');
                throw Error("address");
            }
        }
        if(name == "landmark") {
            if(element[0].value == "" || element[0].value.length < 6) {
                element.parent('.input-field').addClass('invalid');
                throw Error("landmark");
            }
        }
    }

    //-----------------INTEGRATION---------------------

    const login_url = 'https://yourstore-swe.herokuapp.com/user/login';
    const signup_url = 'https://yourstore-swe.herokuapp.com/user/signup';
    const shop_signup_url = 'https://yourstore-swe.herokuapp.com/store/register';
    const shop_signin_url = 'https://yourstore-swe.herokuapp.com/store/login';

    $('#user-signup').on('click', function(e) {
        e.preventDefault();

        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append("Access-Control-Allow-Origin", '*');

        const data = {
            name: $('#username-signup').val(),
            email: $('#email-signup').val(),
            age: $('#age-signup').val(),
            phone: $('#phone-signup').val(),
            password: $('#password-signup').val(),
            gender: $('#gender-signup').val(),
        }

        let json = JSON.stringify(data);

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: json,
        };

        try {
            validate($('#username-signup'));
            validate($('#email-signup'));
            validate($('#password-signup'));
            validate($('#age-signup'));
            validate($('#phone-signup'));

            try {
                fetch(signup_url, requestOptions)
                .then((response) => response.json())
                .then((result) => {

                if(result.error || result.status == "failure") {
                    swal("Check again!", "" ,"error");
                } else {
                    localStorage.setItem('authToken', result.data.token);
                    window.location.replace('./login.html');
                    $('#user-signup-form')[0].reset();
                    swal("Success", "You're all set!", "success");
                    clearClass();
                }
                })
            } catch (e) {
                swal("Oops something went wrong!", "some error occurred!", "error");
            }
        } catch (e) {
            swal("Oops you missed something", "Check " + e.message, "error");
        }
    })

    $('#user-signin').on('click', function(e) {
        e.preventDefault();

        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append("Access-Control-Allow-Origin", '*');

        const data = {
            email: $('#email-signin').val(),
            password: $('#password-signin').val(),
        }

        let json = JSON.stringify(data);

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: json,
        };

        try {
            validate($('#email-signin'));
            validate($('#password-signin'));

            try {
                fetch(login_url, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    if(result.error || result.status == "failure") {
                        swal("Check again!", "" ,"error");
                    } else {
                        localStorage.setItem('authToken', result.data.token);
                        window.location.replace('./home.html');
                        $('#user-signin-form')[0].reset();
                        swal("Success", "You're all set!", "success");
                        clearClass();
                    }
                })
            } catch (e) {
                swal("Oops something went wrong!", "some error occurred!", "error");
            }

        } catch(e) {
            swal("Oops you missed something", "Check " + e.message, "error");
        }

    })

    $('#shop-signup-btn').on('click', function(e) {
        e.preventDefault();

        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append("Access-Control-Allow-Origin", '*');

        const data = {
            shopName: $('#shop-name').val(),
            shopDescription: $('#shop-desc').val(),
            email: $('#shop-email').val(),
            password: $('#shop-password').val(),
            phone: $('#shop-phone').val(),
            shopOwner: $('#shop-owner').val(),
            location: {
                type: "Point",
                coordinates: coords,
                address: $('#shop-address').val(),
                landmark: $('#shop-landmark').val(),
            }
        }

        let json = JSON.stringify(data);

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: json,
        };

        try {

            validate($("#shop-name"));
            validate($("#shop-email"));
            validate($("#shop-password"));
            validate($("#shop-phone"));
            validate($("#shop-owner"));
            validate($("#shop-address"));
            validate($("#shop-landmark"));

            try {
                fetch(shop_signup_url, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    if(result.error || result.status == "failure") {
                        swal("Check again!", "" ,"error");
                    } else {
                        localStorage.setItem('shopAuth', result.data.token);
                        window.location.replace('./shop.html');
                        $('#shop-signup-form')[0].reset();
                        swal("Success", "You're all set!", "success");
                        clearClass();
                    }
                })
            } catch (e) {
                swal("Oops something went wrong!", "some error occurred!", "error");
            }

        } catch (e) {
            swal("Oops you missed something", "Check " + e.message, "error");
        }

    })

    $("#shop-signin-btn").on('click', function(e) {
        e.preventDefault();

        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append("Access-Control-Allow-Origin", '*');

        const data = {
            email: $('#shop-email-signin').val(),
            password: $('#shop-password-signin').val(),
        }

        let json = JSON.stringify(data);

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: json,
        };

        try {
            validate($("#shop-email-signin"));
            validate($("#shop-password-signin"));

            try {
                fetch(shop_signin_url, requestOptions) 
                .then((response) => response.json())
                .then((result) => {
                    if(result.error || result.status == "failure") {
                        swal("Check again!", "" ,"error");
                    } else {
                        localStorage.setItem('shopAuth', result.data.token);
                        window.location.replace('./shop.html');
                        $('#shop-signin-form')[0].reset();
                        swal("Success", "You're all set!", "success");
                        clearClass();
                    }
                })
            } catch (e) {
                swal("Oops something went wrong!", "some error occurred!", "error");
            }

        } catch (e) {
            swal("Oops you missed something", "Check " + e.message, "error");
        }
    })
})