$(document).ready(function () {
    $(".overlay").hide();
  
    let audioMode = "disabled";
  
    function playAudio(audioSrc) {
      if (audioMode == "enabled") {
        var sound = new Howl({
          src: [`${audioSrc}`],
        });
        sound.play();
      }
    }
  
    //   DarkMode.toggle("dark");
    //   DarkMode.ignore(["img", "button"]);
  
    // -------------------------VARS-------------------------------
  
    const location_btn = $("#location-btn");
    const location_sidebar = $(".location-sidebar");
    const cross = $(".cross");
    const overlay = $(".overlay");
  
    // ------------------- HANDLE AUDIO/THEME SESSION STORAGE ---------------------------
  
    if (sessionStorage.getItem("darkMode") == "true") {
      document.querySelector("body").classList.add("dark-mode");
      document.querySelector("#sun").style.display = "flex";
      document.querySelector("#moon").style.display = "none";
    } else {
      document.querySelector("body").classList.remove("dark-mode");
      document.querySelector("#sun").style.display = "none";
      document.querySelector("#moon").style.display = "flex";
    }
  
    if (sessionStorage.getItem("audioMode") == "enabled") {
      audioMode = "enabled";
      document.querySelector("#audio").style.display = "flex";
      document.querySelector("#no-audio").style.display = "none";
    } else {
      audioMode = "disabled";
      document.querySelector("#audio").style.display = "none";
      document.querySelector("#no-audio").style.display = "flex";
    }
  
    // ------------------------ HANDLE AUTH -------------------------------------------
  
    if (!localStorage.getItem("authToken")) {
      $("#profile-text").text("Profile");
      $("#profile").hide();
      $("#login-btn").show();
      hideLoader($(".overlay-white"));
      if (
        !sessionStorage.getItem("latitude") ||
        !sessionStorage.getItem("longitude")
      ) {
        openLocationSidebar();
      }
    } else {
      $("#login-btn").hide();
      $("#profile").show();
      if (
        !sessionStorage.getItem("latitude") ||
        !sessionStorage.getItem("longitude")
      ) {
        openLocationSidebar();
      }
      getProfile();
    }
  
    if (
      !sessionStorage.getItem("latitude") ||
      !sessionStorage.getItem("longitude")
    ) {
      const empty_text = `
              <div class="empty-text"> 
                  Please enter a valid location!
                  <img src="./Public/assets/map.svg" alt="Image not found">
              </div>
          `;
  
      $(".shops-container").empty();
      $(".shops-container").html(empty_text);
    } else {
      getShopsAround(
        sessionStorage.getItem("latitude"),
        sessionStorage.getItem("longitude")
      );
      $("#location-text").text(sessionStorage.getItem("recentLocation"));
    }
    getTrendingItems();
  
    // ----------------------------- DARK/LIGHT TOGGLE -------------------------------
  
    document.querySelector("#sun").addEventListener("click", function (e) {
      e.preventDefault();
      playAudio("./../../Public/assets/Sounds/Light Mode.mp3");
      document.querySelector("body").classList.remove("dark-mode");
      document.querySelector("#sun").style.display = "none";
      document.querySelector("#moon").style.display = "flex";
      sessionStorage.setItem("darkMode", "false");
    });
  
    document.querySelector("#moon").addEventListener("click", function (e) {
      e.preventDefault();
      playAudio("./../../Public/assets/Sounds/Dark Mode.mp3");
      document.querySelector("body").classList.add("dark-mode");
      document.querySelector("#moon").style.display = "none";
      document.querySelector("#sun").style.display = "flex";
      sessionStorage.setItem("darkMode", "true");
    });
  
    // -------------------------------- AUDIO TOGGLE -----------------------------------
  
    document.querySelector("#audio").addEventListener("click", function (e) {
      e.preventDefault();
      sessionStorage.setItem("audioMode", "disabled");
      audioMode = "disabled";
      var sound = new Howl({
        src: ["./../../Public/assets/Sounds/Audio Mode Disabled.mp3"],
      });
      sound.play();
      document.querySelector("#audio").style.display = "none";
      document.querySelector("#no-audio").style.display = "flex";
    });
  
    document.querySelector("#no-audio").addEventListener("click", function (e) {
      e.preventDefault();
      sessionStorage.setItem("audioMode", "enabled");
      audioMode = "enabled";
      var sound = new Howl({
        src: ["./../../Public/assets/Sounds/Audio Mode Enabled.mp3"],
      });
      sound.play();
      document.querySelector("#audio").style.display = "flex";
      document.querySelector("#no-audio").style.display = "none";
    });
  
    // ----------------------------- HANDLE HOVER SOUNDS -------------------------------
  
    document
      .querySelector("#profile")
      .addEventListener("mouseenter", function (e) {
        e.preventDefault();
        playAudio("./../../Public/assets/Sounds/Profile.mp3");
      });
  
    document.querySelector("#cart").addEventListener("mouseenter", function (e) {
      e.preventDefault();
      playAudio("./../../Public/assets/Sounds/Cart.mp3");
    });
  
    document.querySelector(".logo").addEventListener("mouseenter", function (e) {
      e.preventDefault();
      playAudio("./../../Public/assets/Sounds/Home.mp3");
    });
    //-----------------------CARD INFO DISPLAY---------------------
    $("body").on("click", ".info", function (e) {
      e.preventDefault();
      $(this)
        .parent()
        .parent()
        .parent()
        .children(".description")
        .removeClass("description-hidden");
  
      $(".cross").on("click", function (e) {
        e.preventDefault();
        $(this).parent().addClass("description-hidden");
      });
    });
  
    //-----------------------OVERLAY FUNCTIONS---------------------
  
    function showLoader(overlay) {
      overlay.show();
      $(".spinner").show();
      $("body").addClass("overlay-open");
    }
  
    function hideLoader(overlay) {
      overlay.hide();
      $(".spinner").hide();
      if (location_sidebar.hasClass("closed")) {
        $("body").removeClass("overlay-open");
      }
    }
  
    function hideOverlay(elementClass, classToHide) {
      overlay.parent().children(elementClass).addClass(classToHide);
      overlay.hide();
      $("body").removeClass("overlay-open");
    }
  
    function validate(element) {
      let name = element[0].name;
      if (name == "name") {
        if (element[0].value == "" || element[0].value.length == 0) {
          element.parent(".input-field").addClass("invalid");
          throw Error("name");
        }
      } else if (name == "desc") {
        if (element[0].value == "" || element[0].value.length == 0) {
          element.parent(".input-field").addClass("invalid");
          throw Error("desc");
        }
      } else if (name == "cost") {
        if (element[0].value == "" || element[0].value.length == 0) {
          element.parent(".input-field").addClass("invalid");
          throw Error("cost");
        }
      } else if (name == "quantity") {
        if (element[0].value == "" || element[0].value <= 0) {
          element.parent(".input-field").addClass("invalid");
          throw Error("quantity");
        }
      }
    }
  
    //--------------------------SIDEBAR---------------------------
  
    location_btn.on("click", function () {
      playAudio("./../../Public/assets/Sounds/Location.mp3");
      openLocationSidebar();
    });
  
    function openLocationSidebar() {
      location_sidebar.removeClass("closed");
      overlay.show();
      $("body").addClass("overlay-open");
  
      $(".location-buffer").empty();
      $("#location").val("");
      $(".gps-location-buffer").empty();
  
      cross.on("click", function () {
        $(this).parent().addClass("closed");
        overlay.hide();
        $("body").removeClass("overlay-open");
      });
    }
  
    //----------------REQUEST POPUP/ SEND REQUEST---------------
  
    $(".post-request-btn").on("click", function (e) {
      e.preventDefault();
  
      playAudio("./../../Public/assets/Sounds/Post a Request.mp3");
  
      if (!localStorage.getItem("authToken")) {
        swal("You're not logged in", "login to send a request", "error");
      } else {
        $(".overlay").show();
        $("body").addClass("overlay-open");
        $(".request-popup").removeClass("hidden");
      }
    });
  
    $(".cross-req").on("click", function (e) {
      e.preventDefault();
  
      $(".overlay").hide();
      $("body").removeClass("overlay-open");
      $(".request-popup").addClass("hidden");
    });
  
    $(".request-button").on("click", function (e) {
      e.preventDefault();
  
      playAudio("./../../Public/assets/Sounds/Send Request.mp3");
  
      const request_api = "https://yourstore-swe.herokuapp.com/user/requestItem";
  
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
        "Authorization",
        `Bearer ${localStorage.getItem("authToken")}`
      );
  
      let data = {
        prodName: $("#item-name").val(),
        desc: $("#item-desc").val(),
        qty: $("#item-quantity").val(),
      };
  
      let json = JSON.stringify(data);
  
      let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: json,
      };
  
      try {
        validate($("#item-name"));
        validate($("#item-desc"));
        validate($("#item-quantity"));
  
        try {
          fetch(request_api, requestOptions)
            .then((response) => response.json())
            .then((result) => {
              if (result.error || result.status == "failure") {
                console.log(result);
                swal("Check again!", "", "error");
              } else {
                $(".overlay").hide();
                $("body").removeClass("overlay-open");
                $(".request-popup").addClass("hidden");
                $(".request-form")[0].reset();
                swal("Success", "You're all set!", "success");
              }
            });
        } catch (e) {
          swal("Oops something went wrong!", "some error occurred!", "error");
        }
      } catch (e) {
        swal("Oops you missed something", "Check " + e.message, "error");
      }
    });
  
    //----------------GEOCODE---------------------------
  
    function geoCode(address) {
      // const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY'
  
      const url =
        "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
        encodeURIComponent(address) +
        ".json?access_token=pk.eyJ1Ijoic2F2aXRhcjAyIiwiYSI6ImNrOGM1ZXo5OTAyY3Yzbm9jdHJ1bTVyajcifQ.15iE2VXcOcKOI1w6_tU2UQ&limit=5";
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          $(".location-buffer").empty();
          $("body").addClass("overlay-open");
  
          if (data.features.length == 0) {
            let location_div = `
                  <div class="location-result-error"> <p> Please enter a valid location </p> </div>
                  `;
            $(".location-buffer").append(location_div);
          }
  
          for (let i = 0; i < data.features.length; i++) {
            const longitude = data.features[i].center[0];
            const latitude = data.features[i].center[1];
            const place_name = data.features[i].place_name;
  
            let location_div = `
                      <div class="location-result"> 
                          <p class="place-name"> ${place_name} </p>
                          <p class="latitude"> ${latitude} </p> 
                          <p class="longitude"> ${longitude} </p> 
                      </div>
                `;
            $(".location-buffer").append(location_div);
          }
  
          $(".location-result").on("click", function (e) {
            e.preventDefault();
            overlay.hide();
            $(this).parents(".location-sidebar").addClass("closed");
  
            $(this)
              .parents("body")
              .children(".navbar")
              .children("#location-btn")
              .children(".nav-link")
              .children(".link-text")
              .text($(this).text());
            $("body").removeClass("overlay-open");
  
            sessionStorage.setItem(
              "latitude",
              $(this).children(".latitude").text()
            );
            sessionStorage.setItem(
              "longitude",
              $(this).children(".longitude").text()
            );
            sessionStorage.setItem(
              "recentLocation",
              $(this).children(".place-name").text()
            );
  
            getShopsAround(
              sessionStorage.getItem("latitude"),
              sessionStorage.getItem("longitude")
            );
          });
        });
    }
  
    $(document).keyup(function (e) {
      if ($("#location").is(":focus") && e.keyCode == 13) {
        $(".search-location").click();
      }
    });
  
    $(".search-location").on("click", function () {
      $("body").addClass("overlay-open");
      let address = $("#location").val();
      let data = geoCode(address);
      $("body").removeClass("overlay-open");
    });
  
    //----------------REVERSE GEOCODE-------------------
  
    $(".current-location").on("click", function (e) {
      e.preventDefault();
      playAudio("./../../Public/assets/Sounds/Get Current Location.mp3");
      navigator.geolocation.getCurrentPosition(successfulLookup);
    });
  
    const successfulLookup = (position) => {
      const { longitude, latitude } = position.coords;
      const reverseUrl =
        "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
        encodeURIComponent(longitude) +
        "," +
        encodeURIComponent(latitude) +
        ".json?access_token=pk.eyJ1Ijoic2F2aXRhcjAyIiwiYSI6ImNrOGM1ZXo5OTAyY3Yzbm9jdHJ1bTVyajcifQ.15iE2VXcOcKOI1w6_tU2UQ";
  
      fetch(reverseUrl)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          $(".gps-location-buffer").empty();
          for (let i = 0; i < data.features.length; i++) {
            const longitude = data.features[i].center[0];
            const latitude = data.features[i].center[1];
            const place_name = data.features[i].place_name;
  
            let location_div = `
                      <div class="location-result"> 
                          <p class="place-name"> ${place_name} </p>
                          <p class="latitude"> ${latitude} </p> 
                          <p class="longitude"> ${longitude} </p>  
                      </div>
                  `;
            $(".gps-location-buffer").append(location_div);
          }
  
          $(".location-result").on("click", function (e) {
            e.preventDefault();
            overlay.hide();
            $(this).parents(".location-sidebar").addClass("closed");
  
            $(this)
              .parents("body")
              .children(".navbar")
              .children("#location-btn")
              .children(".nav-link")
              .children(".link-text")
              .text($(this).text());
            $("body").removeClass("overlay-open");
  
            sessionStorage.setItem(
              "latitude",
              $(this).children(".latitude").text()
            );
            sessionStorage.setItem(
              "longitude",
              $(this).children(".longitude").text()
            );
            sessionStorage.setItem(
              "recentLocation",
              $(this).children(".place-name").text()
            );
  
            getShopsAround(
              sessionStorage.getItem("latitude"),
              sessionStorage.getItem("longitude")
            );
          });
        });
    };
  
    //----------------SLICK-----------------------------
  
    $(".carousel").slick({
      autoplay: true,
      dots: true,
      arrows: false,
    });
  
    function slickInit() {
      $(".trending-carousel").slick({
        dots: false,
        infinite: false,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 2,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true,
            },
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
            },
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
          // You can unslick at a given breakpoint now by adding:
          // settings: "unslick"
          // instead of a settings object
        ],
      });
    }
  
    //----------------PROFILE---------------------------
  
    function getProfile() {
      const profile_api = "https://yourstore-swe.herokuapp.com/user/me";
  
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `${localStorage.getItem("authToken")}`);
  
      let requestOptions = {
        method: "GET",
        headers: myHeaders,
      };
  
      fetch(profile_api, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          let name = result.name.split(" ");
          $("#profile-text").text(name[0]);
          hideLoader($(".overlay-white"));
        });
    }
  
    //----------------SHOPS AROUND YOU------------------
    function getShopsAround(latitude, longitude) {
      showLoader($(".overlay"));
      let shops_around_api = `https://yourstore-swe.herokuapp.com/shops-within/10/center/${latitude}, ${longitude}/`;
  
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `${localStorage.getItem("authToken")}`);
  
      let requestOptions = {
        method: "GET",
        headers: myHeaders,
      };
  
      fetch(shops_around_api, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result.data.data);
  
          let output = ``;
  
          if (result.data.data.length == 0) {
            output += `
                  <div class="empty-text"> 
                      No shops around you 
                      <img src="./Public/assets/sad.svg" alt="Image not found">
                  </div>
                  `;
          } else {
            result.data.data.forEach((shop) => {
              if (!shop.picture) {
                img = "./Public/assets/default.jpg";
              } else {
                img = shop.picture;
              }
  
              let classToAdd = "";
  
              if (shop.shopRating <= 3.5 && shop.shopRating > 2) {
                classToAdd = "moderate";
              } else if (shop.shopRating <= 2) {
                classToAdd = "low";
              }
  
              output += `
                      <div class="shop-card">
                          <img src="${img}" alt="Image not found">
                          <div class="name-rating">
                              <div class="shop-name">${shop.shopName}</div>
                              
                          </div>
                          <div class="shopID">${shop._id}</div>
                          <div class="shop-distance"><span class="distance">10</span> km</div>
                          <button class="visit-shop">Visit Shop <i class="fas fa-store"></i></button>
                      </div>
                      `;
            });
          }
  
          $(".shops-container").empty();
          $(".shops-container").html(output);
  
          hideLoader($(".overlay"));
        });
    }
  
    //-----------------SEARCH ITEMS/SHOPS----------------
  
    $("#search-btn").on("click", function (e) {
      $(".search-section").removeClass("hidden");
      $(".main").addClass("hidden");
      $(".recent-tag").text(localStorage.getItem("recentSearch"));
      playAudio("./../../Public/assets/Sounds/Search.mp3");
    });
  
    $("#esc-btn").on("click", function (e) {
      $(".main").removeClass("hidden");
      $(".search-section").addClass("hidden");
    });
  
    $(document).on("keyup", function (e) {
      if (e.key == "Escape") $("#esc-btn").click();
    });
  
    $(document).keyup(function (e) {
      if ($("#search-input").is(":focus") && e.keyCode == 13) {
        $("#search-input-btn").click();
      }
    });
  
    $(".clear-btn").on("click", function (e) {
      e.preventDefault();
  
      $("#search-input").val("");
      $(".recent-search").removeClass("hidden");
      $(".search-options").addClass("hidden");
      $(".search-shop-results").addClass("hidden");
      $(".search-product-results").addClass("hidden");
    });
  
    $(".recent-tag").on("click", function (e) {
      e.preventDefault();
  
      $("#search-input").val($(this).text());
      $("#search-input-btn").click();
    });
  
    $("#shops-btn").on("click", function (e) {
      e.preventDefault();
  
      $("#shops-btn").addClass("active");
      $("#products-btn").removeClass("active");
      $(".search-product-results").addClass("hidden");
      $(".search-shop-results").show();
    });
  
    $("#products-btn").on("click", function (e) {
      e.preventDefault();
  
      $("#shops-btn").removeClass("active");
      $("#products-btn").addClass("active");
      $(".search-shop-results").hide();
      $(".search-product-results").removeClass("hidden");
    });
  
    $("#search-input-btn").on("click", function (e) {
      e.preventDefault();
  
      showLoader($(".overlay"));
  
      let searchQuery = $("#search-input").val();
  
      if (searchQuery == "" || searchQuery == " ") {
        $(".search-options").addClass("hidden");
        $(".search-shop-results").addClass("hidden");
        $(".search-product-results").addClass("hidden");
        $(".recent-search").removeClass("hidden");
        hideLoader($(".overlay"));
      } else {
        localStorage.setItem("recentSearch", searchQuery);
  
        $(".recent-search").addClass("hidden");
        $(".search-options").removeClass("hidden");
        $(".search-shop-results").removeClass("hidden");
  
        searchShops(searchQuery).then((result) => {
          console.log(result);
  
          if (result.data.shopData.length == 0) {
            $(".search-shop-results").empty();
            $(".search-shop-results").html(
              `<div class="no-results-found">No shops found, try a different search!</div>`
            );
            hideLoader($(".overlay"));
          } else {
            let output = ``;
            result.data.shopData.shops.forEach((shop) => {
              let img;
              if (!shop.picture) {
                img = "./Public/assets/default.jpg";
              } else {
                img = shop.picture;
              }
  
              let classToAdd = "";
  
              if (shop.shopRating <= 3.5 && shop.shopRating > 2) {
                classToAdd = "moderate";
              } else if (shop.shopRating <= 2) {
                classToAdd = "low";
              }
  
              output += `
                          <div class="shop-card">
                              <img src="${img}" alt="Image not found">
                              <div class="name-rating">
                                  <div class="shop-name">${shop.shopName}</div>
                                 
                              </div>
                              <div class="shopID">${shop._id}</div>
                              <div class="shop-distance"><span class="distance"><10</span> km</div>
                              <button class="visit-shop">Visit Shop <i class="fas fa-store"></i></button>
                          </div>
                          `;
            });
  
            $(".search-shop-results").empty();
            $(".search-shop-results").append(output);
            hideLoader($(".overlay"));
          }
  
          if (result.data.itemsData.length == 0) {
            $(".search-product-results").empty();
            $(".search-product-results").html(
              `<div class="no-results-found">No products found, try a different search!</div>`
            );
            hideLoader($(".overlay"));
          } else {
            $(".search-product-results").empty();
            result.data.itemsData.items.forEach((item) => {
              let output = ``;
              output += `
                              <div class="shop-item-card">
                              <div class="product-results-shop">
                                  <div class="shop-result-name">${item.shopName}</div>
                                  
                                  <div class="shopID">${item._id}</div>
                                  <button class="visit-shop">Visit Shop <i class="fas fa-store"></i></button>
                              </div>
                              <div class="product-results">
                          `;
              let matched = [];
              item.items.forEach((element) => {
                const regex = new RegExp(`${searchQuery}`, "i");
                if (regex.test(element.itemName)) {
                  matched.push(element);
                }
              });
  
              matched.forEach((item) => {
                let img = "./Public/assets/default.jpg";
                if (item.picture) {
                  img = item.picture;
                }
                output += `
                                  <div class="product-results-card">
                                      <img src="${img}" alt="">
                                      <div class="product-result-details">
                                          <div class="product-result-name">${item.itemName}</div>
                                          <div class="product-result-desc">${item.itemDesc}</div>
                                          <div class="product-result-cost">&#8377; ${item.cost}</div>
                                      </div>
                                  </div>
                                  `;
              });
  
              output += `
                                  </div>
                              </div>
                              `;
              console.log(matched);
  
              $(".search-product-results").append(output);
            });
          }
        });
      }
    });
  
    function searchShops(searchQuery) {
      const search_api = `https://yourstore-swe.herokuapp.com/searchShops?search=${searchQuery}`;
  
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
  
      let requestOptions = {
        method: "GET",
        headers: myHeaders,
      };
  
      return fetch(search_api, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          return result;
        })
        .catch((e) => {
          console.log(e);
        });
    }
  
    //------------------------VISIT SHOP---------------------------
  
    $("body").on("click", ".visit-shop", function (e) {
      e.preventDefault();
  
      let shopID = $(this).parent().children(".shopID").text();
      sessionStorage.setItem("shopID", shopID);
      window.location.replace("./products.html");
    });
  
    //------------------------TRENDING SHOPS-----------------------
    function getTrendingItems() {
      const trending_api = `https://yourstore-swe.herokuapp.com/trending`;
  
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
  
      let requestOptions = {
        method: "GET",
        headers: myHeaders,
      };
  
      fetch(trending_api, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          let output = ``;
          result.trending.forEach((item) => {
            let img = "./Public/assets/default.jpg";
            if (item.picture) {
              img = item.picture;
            }
            output += `
                  <div class="trending-card">
                      <img src="${img}" alt="" class="product-img">
                      <div class="product-details">
                          <div class="product-name">${item.itemName}</div>
                          <div class="product-cost">&#8377; ${item.cost}</div>
                          <div class="product-amount">1 kg <span class="info"><img src="https://img.icons8.com/cotton/64/000000/info--v5.png"/></span></div>
                          <div class="btn-container">
                              <div class="shopID">${item.shopID}</div>
                              <button class="visit-shop">Visit Shop <i class="fas fa-shopping-cart"></i></button>
                          </div>  
                      </div>
  
                      <div class="description description-hidden">
                          <span class="cross">
                              <img src="https://img.icons8.com/ios/50/000000/circled-x.png"/>
                          </span>
                          <p class="description-text">${item.itemDesc}</p>
                      </div>  
                  </div>
                  `;
          });
  
          $(".trending-carousel").html(output);
  
          slickInit();
        });
    }
  });