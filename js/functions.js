function changeMainColor(colorName) {
    let html = document.querySelector("html"),
        newColor = getComputedStyle(html).getPropertyValue(`--${colorName}-color`);

    html.style.setProperty("--main-color", newColor)
}


function updateImg(imgName, imgEle, commonName) {
    let currentSrc = imgEle.src,
        currentSrcArr = currentSrc.split("/"),
        newSrc;

    currentSrcArr[currentSrcArr.length - 1] = `${imgName}-${commonName}.png`;
    newSrc = currentSrcArr.join("/");
    imgEle.setAttribute("src", newSrc);
}


function updateIcon(imgName, icon) {
    let currentSrc = icon.href,
        currentSrcArr = currentSrc.split("/"),
        newSrc;

    currentSrcArr[currentSrcArr.length - 1] = `${imgName}-logo.png`;
    newSrc = currentSrcArr.join("/");
    console.log(newSrc)
    icon.setAttribute("href", newSrc);

}


function checkScrolledNav() {
    if (scrollY > 10) {
        navEle.classList.add("scrolled")
    } else {
        navEle.classList.remove("scrolled")
    }
}


function updateNavLink(sectionId) {
    let section = document.querySelector(`#${sectionId}`),
        sectionTop = section.offsetTop - navEle.clientHeight,
        sectionHeight = section.clientHeight,
        sectionBottom = sectionTop + sectionHeight;
    if (window.scrollY > sectionTop && window.scrollY < sectionBottom) {
        let sectionId = section.getAttribute("id"),
            navLinkOfSection = document.querySelector(`a[href = "#${sectionId}"]`),
            currentNavLink = navEle.querySelector(".nav-link.active");

        currentNavLink.classList.remove("active")
        navLinkOfSection.classList.add("active");
    }
}


function prepareLatestImagesList(imagesList, isProduct = false) {
    let liElements = "";

    imagesList.forEach(function (image) {
        liElements += `<li class="${(isProduct == true) ? '' : 'mainBorder rounded-3'} p-2 d-flex align-items-center justify-content-center" onclick ="changeSelectedImg('${image}' , this)"><img class="img-fluid" src="images_Nike/images/products/${image}" alt=""></li>`
    })

    return liElements
}


function preparePrice(price, discount) {
    // *we can make a var in string or call a fun or conditional operator
    return ` <p class="mb-0">
                    <span class="text-decoration-line-through mainColor ${(discount == 0) ? 'd-none' : ''}">${price} <sup>$</sup></span>
                    <span class="fw-semibold text-black">${(price * (1 - discount)).toFixed(2)} <sup>$</sup></span>
                </p>`
}


function prepareSizesList(sizesList , isProductIntoCart = null , productId) {
    let liElements = "";

    isProductIntoCart = checkProductIntoCart(productId)
    sizesList.forEach(function (size, index) {
        if(isProductIntoCart == null){
            liElements += `<li class="mainButton rounded-2  ${(index == 0) ? 'active' : ''}" onclick = "changeActive(this) ; updateSize('${size}' , this)"> ${size} </li>`
        } else{
            liElements += `<li class="mainButton rounded-2 mainSize ${(isProductIntoCart.size == size) ? 'active' : ''}"> ${size} </li>`
        }
    })

    return liElements
}


function prepareColorsList(colorsList , isProductIntoCart = null , productId) {
    let liElements = "";
    colorsList.forEach(function (color, index) {
        if(isProductIntoCart == null){
            liElements += `<li class="rounded-circle ${(index == 0)? 'active mainButton' : ''}" onclick="changeActive(this , true) ; updateColor('${color}' , this)"  style="background-color: ${color};"></li>`
        } else{
            liElements += `<li class="rounded-circle ${(isProductIntoCart.color == color)? 'active mainButton' : ''}" style="background-color: ${color};"></li>`
        }
    })

    return liElements
}


function prepareFeaturedImagesList(imagesList) {
    let liElements = "";

    imagesList.forEach(function (image, index) {
        liElements += `<li class="list-unstyled rounded-circle mainButton ${(index == 0) ? 'active' : ''}" onclick ="changeSelectedImg('${image}' , this) ; changeActive(this)"></li>`
    })
    return liElements
}


function changeSelectedImg(imgName, that) {
    let selectedImg = that.closest('.product').querySelector('.selectedImg img');
    srcArr = selectedImg.src.split('/')

    srcArr[srcArr.length - 1] = imgName;

    selectedImg.setAttribute('src', srcArr.join('/'))
}


function changeActive(that , color=false) {
    let currentActive = that.parentElement.querySelector(".active");

    currentActive.classList.remove('active');

    that.classList.add('active')

    if(color == true){
    currentActive.classList.remove('mainButton');
    that.classList.add("mainButton")

}}


function openPopup(popupName) {
    let popupEle = document.querySelector(`.popup[data-popup-name= '${popupName}']`);

    popupEle.classList.add("active");
    setTimeout(function () {
        popupEle.classList.add("show");
    }, 1);
}
  

function closePopup() {
    let popupEle = document.querySelector(`.popup.active`);

    popupEle.classList.remove("show");
    setTimeout(function () {
        popupEle.classList.remove("active");
    }, 1000);
}


function getProduct(productId) {
    return products.filter(function (product) {
        return (product.id == productId);
    })[0]
}



function showProduct(productId , isProductIntoCart) {
    
    let product = getProduct(productId),
    popUpProduct = document.querySelector(".popup[data-popup-name='product'] .box");
    isProductIntoCart = checkProductIntoCart(product.id);


    popUpProduct.innerHTML = `
    <div 
        class="row product"
        data-selected-size="${isProductIntoCart?.size ?? product.sizes[0]}"
        data-selected-color="${isProductIntoCart?.color ?? product.colors[0]}"
    >
        <div class="col-12 col-md-6 col-lg-6 col-xl-6">
            <div class="item">
                <div class="selectedImg">
                    <img src="images_Nike/images/products/${product.images[0]}" alt="" class="img-fluid">
                </div>
                <ul class="mb-0 d-flex column-gap-2">
                    ${prepareLatestImagesList(product.images, true)}
                </ul>
            </div>
        </div>
        <div class="col-12 col-md-6 col-lg-6 col-xl-6 pt-2">
            <div class="item">
                <h3>${(product.name)}</h3>
                ${(preparePrice(product.price , product.discount))}
                <hr>
                <p>${product.description}</p>

                <div class="size d-flex">
                    <div class="lable me-3">
                        <h6 class="fw-bolder">Size :</h6>
                    </div>
                    <div class="value">
                        <ul class="list-unstyled d-flex column-gap-2">
                            ${prepareSizesList(product.sizes , isProductIntoCart , product.id)}
                        </ul>
                    </div>
                </div>
                <div class="color d-flex">
                        <div class="lable me-3">
                            <h6 class="fw-bolder">Color :</h6>
                        </div>
                        <div class="value">
                            <ul class="list-unstyled d-flex column-gap-2">
                                ${prepareColorsList(product.colors ,isProductIntoCart)}
                            </ul>
                        </div>
                </div>
                    ${(isProductIntoCart == null)?
                        `<button class="btn mainButton rounded-3" onclick="addToCart(${product.id} , this)">Add To Cart</button>`
                        :
                        `<button class="btn mainButton rounded-3 remove" onclick="removeFromCart(${product.id} , this)">Remove From Cart</button>`
                    }
            </div>
        </div>
     </div>`
    openPopup('product')
}


function addToCart(productId , that){
    let productEle = that.closest(".product") 
    newOrder = {
        id: productId,
        size: productEle.dataset.selectedSize,
        color: productEle.dataset.selectedColor,
    }
    cartProducts.push(newOrder);
    updateLocalStorage();
    toggleOrderBtn(that , 'remove');
    that.setAttribute('onclick' , `removeFromCart(${productId} , this)`)
}


function removeFromCart(productId , that){
    cartProducts = cartProducts.filter((product) =>product.id != productId)
    updateLocalStorage();

    if(that != null){
        toggleOrderBtn(that , 'add')
        that.setAttribute('onclick' , `addToCart(${productId} , this)`)
    }
}


function toggleOrderBtn(btn , status){
    if(status == 'add'){
        btn.classList.remove('remove');
        btn.classList.add('add')
        btn.textContent = "Add To Cart"
    } else if(status == 'remove'){
        btn.classList.remove('add');
        btn.classList.add('remove')
        btn.textContent = "Remove From Cart"
    }
}


function updateSize(size , that){
    let productEle = that.closest(".product");
    productEle.dataset.selectedSize = size;
}


function updateColor(color , that){
    let productEle = that.closest(".product");
    productEle.dataset.selectedColor = color;

}


function updateLocalStorage(){
    localStorage.setItem("cartProducts" , JSON.stringify(cartProducts))
}


function checkProductIntoCart(productId){
    let result = cartProducts.filter((product) => product.id == productId);
    return result.length == 1? result[0] : null;
}


function showCart(){
    let contentEle = document.querySelector('.popup[data-popup-name="shop"] .row')
    if(cartProducts.length == 0){
        contentEle.innerHTML = `<p class ="alert alert-warning text-center px-3">There are no products</p>`
    }else{
    contentEle.innerHTML = "";

    cartProducts.forEach(function(cartProduct){
        let product = getProduct(cartProduct.id);

        contentEle.innerHTML += `
            <div class="col-sm-6 col-md-4 col-lg-4">
                <div class="item">
                    <div class="product bg-body p-3 rounded-3"  data-product-id='${product.id}'>
                        <img src="images_Nike/images/products/${product.images[0]}" class="img-fluid" alt="">
                        <h5 class="mb-3">${product.name.slice(0, 10)}...</h5>
                        <div class="price d-flex mb-3 mb-xl-2">
                            <div class="lable me-3"><h6 class="fw-bolder">Price :</h6></div>
                            <div class="value">
                                ${preparePrice(product.price , product.discount)}
                            </div>
                        </div>
                        <div class="size d-flex mb-3 mb-xl-2">
                            <div class="lable me-3">
                                <h6 class="fw-bolder">Size :</h6>
                            </div>
                            <div class="value">
                                <ul class="list-unstyled d-flex column-gap-2 mb-0">
                                    ${prepareSizesList([cartProduct.size] , null , product.id)}
                                </ul>
                            </div>
                        </div>
                        <div class="color d-flex align-items-center">
                            <div class="lable me-3">
                                <h6 class="fw-bolder">Color :</h6>
                            </div>
                            <div class="value">
                                <ul class="list-unstyled d-flex column-gap-2">
                                    ${prepareColorsList([cartProduct.color] , null , product.id)}
                                </ul>
                            </div>
                        </div>
                        <button class="btn btn-danger w-100 mt-3" onclick='removeFromShop(${product.id})'>Remove</button>
                    </div>
                </div>
            </div>
        `
    })}

    openPopup('shop')
}


function removeFromShop(productId){

    let productEle = document.querySelector(`.popup[data-popup-name="shop"] .row .product[data-product-id="${productId}"]`)
    console.log(productEle)
    
    let buttonOfLatestProduct = document.querySelector(`#Latest .product[data-product-id="${productId}"] button`);
    
    removeFromCart(productId , buttonOfLatestProduct);
    
    if(cartProducts.length == 0){
        let contentEle = document.querySelector('.popup[data-popup-name="shop"] .row')
        contentEle.innerHTML = `<p class ="alert alert-warning text-center px-3">There are no products</p>`
    }
    productEle.parentElement.parentElement.remove();
}