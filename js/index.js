let navEle = document.querySelector("nav.navbar"),
    navLinks = navEle.querySelectorAll(".nav-link"),
    scCarousel = document.querySelector("#SC-Carousel"),
    nextCarousel = scCarousel.querySelector(".next"),
    prevCarousel = scCarousel.querySelector(".prev"),
    logoEle = document.querySelector("#Logo"),
    iconImg = document.querySelector("head link.icon"),
    correctImgs = document.querySelectorAll(".title img"),
    sectionArr = document.querySelectorAll("section , header"),
    latestContent = document.querySelector("#Latest .content"),
    featuresContent = document.querySelector("#Featured .content .row"),
    popupBoxes = document.querySelectorAll(".popup .box"),
    cartProducts = [],
    searchingForm = document.querySelector("form"),
    searchingInput = searchingForm.querySelector("input"),
    searchingValue = searchingInput.value.trim(),
    alert = document.querySelector("form+p.alert"),
    regexName = /^[0-9A-Z]?[\.A-Za-z0-9\-]{3,}$/,
    searchProducts,
    loadingPage = document.querySelector(".loading-page");


    if (localStorage.getItem('cartProducts') == null) {
         updateLocalStorage();
    } else {
        cartProducts = JSON.parse(localStorage.getItem('cartProducts'));
    }


checkScrolledNav();

nextCarousel.addEventListener("click", function () {
    let currentSlide = scCarousel.querySelector(".SC-Carousel-item.active"),
        newSlide = currentSlide.nextElementSibling ?? scCarousel.querySelector(".SC-Carousel-item:first-child"),
        currentName = newSlide.dataset.colorName;

    currentSlide.classList.remove("active");
    newSlide.classList.add("active");

    changeMainColor(currentName);
    localStorage.setItem("currentName", currentName)


    updateImg(currentName, logoEle, "logo");

    correctImgs.forEach(function (correctImg) {
        updateImg(currentName, correctImg, "correct")
    })

    updateIcon(currentName, iconImg);

}
)

prevCarousel.addEventListener("click", function () {
    let currentSlide = scCarousel.querySelector(".SC-Carousel-item.active"),
        newSlide = currentSlide.previousElementSibling ?? scCarousel.querySelector(".SC-Carousel-item:last-child"),
        currentName = newSlide.dataset.colorName;

    currentSlide.classList.remove("active");
    newSlide.classList.add("active");

    changeMainColor(currentName);
    localStorage.setItem("currentName", currentName)


    updateImg(currentName, logoEle, "logo");

    correctImgs.forEach(function (correctImg) {
        updateImg(currentName, correctImg, "correct")
    })

    updateIcon(currentName, iconImg);
}
)


window.addEventListener("scroll", function () {
    checkScrolledNav();

    sectionArr.forEach(function (section) {
        updateNavLink(section.id)
    })
})


navLinks.forEach(function (navLink) {
    navLink.addEventListener("click", function (e) {
        e.preventDefault();
        let currentNavLink = navEle.querySelector(".nav-link.active"),
            currentId = navLink.getAttribute("href"),
            currentSection = document.querySelector(currentId),
            topOfSection = currentSection.offsetTop;
        // window.scrollTo(0 , topOfSection - navEle.clientHeight)
        window.scrollTo({
            top: topOfSection - navEle.clientHeight,
            left: 0
        });
        currentNavLink.classList.remove("active");
        navLink.classList.add("active");
    })
})


window.addEventListener("DOMContentLoaded", function () {
    loadingPage.classList.add("hide");
    setTimeout(function () {
        loadingPage.classList.add("d-none");
    }, 2000)

    let currentName = localStorage.getItem("currentName");

    let currentSlide = scCarousel.querySelector(".SC-Carousel-item.active");

    if (currentName != null) {
        let newSlide = document.querySelector(`.SC-Carousel-item[data-color-name = "${currentName}"]`);

        currentSlide.classList.remove("active")
        newSlide.classList.add("active")

        changeMainColor(currentName);


        updateImg(currentName, logoEle, "logo");

        correctImgs.forEach(function (correctImg) {
            updateImg(currentName, correctImg, "correct")
        })

        updateIcon(currentName, iconImg);
    }
})


latest.forEach(function (product) {
    let isProductIntoCart = checkProductIntoCart(product.id);

    latestContent.innerHTML += ` 
    <div
        class="product mainBorder p-3 bg-body rounded-3 mb-3"
        data-product-id="${product.id}"
        data-selected-size="${isProductIntoCart?.size ?? product.sizes[0]}"
        data-selected-color="${isProductIntoCart?.color ?? product.colors[0]}"
        >
        <div class="row">
            <div class="col-lg-6 part1">
                <div class="item">
                    <div class="row">
                        <div class="col-md-2 col-lg-3 mb-md-4 col-xl-2 mb-lg-0 box1 ">
                            <ul class="my-auto list-unstyled d-flex flex-row column-gap-3 flex-md-column row-gap-3 column-gap-md-0">
                                ${prepareLatestImagesList(product.images)}
                            </ul>
                        </div>
                        <div class="col-md-10 col-lg-9 col-xl-10 box2">
                            <div class="item h-100 d-flex align-items-center justify-content-center">
                                <div class="selectedImg">
                                    <img class="img-fluid" src="images_Nike/images/products/${product.images[0]}" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-6 part2">
                <div class="item">
                    <h2 class="mainColor mb-2">${product.name}</h2>
                <p class="fw-light">${product.description}</p>
                    <div class="price d-flex">
                        <div class="lable me-3"><h6 class="fw-bolder">Price :</h6></div>
                        <div class="value">
                            ${preparePrice(product.price, product.discount)}
                        </div>
                    </div>
                    <div class="size d-flex">
                        <div class="lable me-3"><h6 class="fw-bolder">Size :</h6></div>
                        <div class="value">
                        <ul class="list-unstyled d-flex column-gap-2">
                            ${prepareSizesList(product.sizes, isProductIntoCart)}
                        </ul>
                        </div>
                    </div>
                    ${(isProductIntoCart == null) ?
            `<button onclick="addToCart(${product.id} , this)" class="btn mainButton rounded-3">Add To Cart</button>`
            :
            `<button onclick="removeFromCart(${product.id} , this)" class="btn mainButton rounded-3 remove">Remove From Cart</button>`
        }
                </div>
            </div>
        </div>
</div>`
})


features.forEach(function (product) {
    featuresContent.innerHTML += `
    <div class="col-sm-6 col-lg-3">
        <div class="product text-center bg-body rounded-3 px-3 py-4" data-id="${product.id}">
            <p class="discount ${(product.discount == 0) ? 'd-none' : ''}">-${product.discount * 100}%</p>
            <div class="head">
                <div class="selectedImg">
                    <img class="img-fluid" src="images_Nike/images/products/${product.images[0]}" alt="">
                </div>
                <i class="fa-solid fa-magnifying-glass rounded-circle d-flex align-items-center justify-content-center m-auto" onclick="showProduct(${product.id})"></i>
                <ul class="d-flex column-gap-2 justify-content-center p-0">
                        ${prepareFeaturedImagesList(product.images)}
                </ul>
            </div>
            <div class="body">
                <h5 class="fw-normal">${product.name}</h5>
                <p class="mb-0">
                    ${preparePrice(product.price, product.discount)}
                </p>
            </div>
        </div>
    </div>`
})


popupBoxes.forEach(function (box) {
    box.addEventListener('click', function (e) {
        e.stopPropagation();
    })
})


searchingForm.addEventListener("submit", function (e) {
    e.preventDefault();
    searchingValue = searchingInput.value.trim()
    searchingInput.value = searchingValue.trim();
    searchProducts = features.filter(function (product) {
        return product.name.toLowerCase().includes(searchingValue.trim().toLowerCase())
    })
    if (searchingValue == "") {
        alert.classList.remove("d-none");
        searchingInput.classList.add("is-invalid");
        alert.textContent = "Please write something to search"
        searchingInput.blur();
        return;
    } 

    if (! regexName.test(searchingValue) || searchProducts.length == 0) {
        alert.classList.remove("d-none");
        searchingInput.classList.add("is-invalid");
        alert.textContent = "Please try in different words"
        searchingInput.blur();
        return;
    }

    alert.classList.add("d-none");
    searchingInput.classList.add("is-valid");
    searchingInput.classList.remove("is-invalid");

    for (let i = 0; i < searchProducts.length; i++) {
        let id = searchProducts[i].id,
            product = featuresContent.querySelector(`div[data-id="${id}"]`),
            topOfProduct = product.parentElement.offsetTop;
        product.classList.add("search-product")
        console.log(topOfProduct)
        window.scrollTo({
            top: topOfProduct - navEle.clientHeight,
            left: 0
        });
        setTimeout(function () {
            product.classList.remove("search-product")
        }, 2000)
    }

    searchingForm.reset();
    searchingInput.classList.remove("is-valid");
    searchingInput.blur();
})