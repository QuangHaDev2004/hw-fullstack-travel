// Đóng mở Menu
const buttonMenuMobile = document.querySelector(".header .inner-menu-mobile");
if (buttonMenuMobile) {
  // Mở Menu
  const menu = document.querySelector(".header .inner-menu");
  buttonMenuMobile.addEventListener("click", () => {
    menu.classList.add("active");
  });

  // Đóng Menu
  const overlay = document.querySelector(".header .inner-menu .inner-overlay");
  overlay.addEventListener("click", () => {
    menu.classList.remove("active");
  });

  // Đóng mở menu con
  const listButtonSubMenu = menu.querySelectorAll("ul li i");
  listButtonSubMenu.forEach((item) => {
    item.addEventListener("click", () => {
      const liParent = item.closest("li");
      liParent.classList.toggle("active");
    });
  });
}
// Hết Đóng mở Menu

// Box address section 1
const boxAddress = document.querySelector(
  ".section-1 .inner-form .inner-address"
);
if (boxAddress) {
  // Ẩn hiện box suggest
  const input = boxAddress.querySelector(".inner-input");
  input.addEventListener("focus", () => {
    boxAddress.classList.add("active");
  });

  input.addEventListener("blur", () => {
    boxAddress.classList.remove("active");
  });

  // Click vào từng item
  const listItem = boxAddress.querySelectorAll(
    ".inner-suggest-list .inner-item"
  );
  listItem.forEach((item) => {
    item.addEventListener("mousedown", () => {
      const title = item.querySelector(".inner-title").innerHTML.trim();
      input.value = title;
    });
  });
}
// End Box address section 1

// Box user section 1
const boxUser = document.querySelector(".section-1 .inner-form .inner-user");
if (boxUser) {
  // Ẩn hiện box user
  const input = boxUser.querySelector(".inner-input");
  input.addEventListener("focus", () => {
    boxUser.classList.add("active");
  });

  document.addEventListener("click", (event) => {
    if (!boxUser.contains(event.target)) {
      boxUser.classList.remove("active");
    }
  });

  // Thêm số lượng vào ô input
  const updateQuantityInput = () => {
    const listBoxNumber = boxUser.querySelectorAll(".inner-number");
    const listNumber = [];
    listBoxNumber.forEach((item) => {
      const number = item.innerHTML.trim();
      listNumber.push(number);
    });

    const value = `NL: ${listNumber[0]}, TE: ${listNumber[1]}, EB: ${listNumber[2]}`;
    input.value = value;
  };

  // Sự kiện click up
  const listButtonUp = boxUser.querySelectorAll(".inner-up");
  listButtonUp.forEach((button) => {
    button.addEventListener("click", () => {
      const parent = button.closest(".inner-count");
      const boxNumber = parent.querySelector(".inner-number");
      const number = parseInt(boxNumber.innerHTML.trim());
      const numberUpdate = number + 1;
      boxNumber.innerHTML = numberUpdate;
      updateQuantityInput();
    });
  });

  // Sự kiện click down
  const listButtonDown = boxUser.querySelectorAll(".inner-down");
  listButtonDown.forEach((button) => {
    button.addEventListener("click", () => {
      const parent = button.closest(".inner-count");
      const boxNumber = parent.querySelector(".inner-number");
      const number = parseInt(boxNumber.innerHTML.trim());
      if (number > 0) {
        const numberUpdate = number - 1;
        boxNumber.innerHTML = numberUpdate;
      }
      updateQuantityInput();
    });
  });
}
// End Box user section 1

// Clock Expire
const clockExpire = document.querySelector("[clock-expire]");
if (clockExpire) {
  const expireTimeString = clockExpire.getAttribute("clock-expire");
  const expireDateTime = new Date(expireTimeString);

  const updateClock = () => {
    const now = new Date();
    const remainingTime = expireDateTime - now;

    if (remainingTime > 0) {
      const days = Math.floor(remainingTime / (24 * 60 * 60 * 1000));
      const hours = Math.floor((remainingTime / (60 * 60 * 1000)) % 24);
      const minutes = Math.floor((remainingTime / (60 * 1000)) % 60);
      const seconds = Math.floor((remainingTime / 1000) % 60);

      const listBoxNumber = clockExpire.querySelectorAll(".inner-number");
      listBoxNumber[0].innerHTML = days >= 10 ? days : `0${days}`;
      listBoxNumber[1].innerHTML = hours >= 10 ? hours : `0${hours}`;
      listBoxNumber[2].innerHTML = minutes >= 10 ? minutes : `0${minutes}`;
      listBoxNumber[3].innerHTML = seconds >= 10 ? seconds : `0${seconds}`;
    } else {
      clearInterval(intervalClock);
    }
  };

  const intervalClock = setInterval(updateClock, 1000);
}
// End Clock Expire

// Swiper Section 2
const swiperSection2 = document.querySelector(".swiper-section-2");
if (swiperSection2) {
  new Swiper(".swiper-section-2", {
    slidesPerView: 1,
    spaceBetween: 20,
    autoplay: {
      delay: 4000,
    },
    loop: true,
    breakpoints: {
      992: {
        slidesPerView: 2,
      },
      1200: {
        slidesPerView: 3,
      },
    },
    mousewheel: true,
    keyboard: true,
  });
}
// End Swiper Section 2

// Swiper Section 3
const swiperSection3 = document.querySelector(".swiper-section-3");
if (swiperSection3) {
  new Swiper(".swiper-section-3", {
    slidesPerView: 1,
    spaceBetween: 20,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      576: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
    },
    autoplay: {
      delay: 4000,
    },
    loop: true,
  });
}
// End Swiper Section 3

// Email Form
const emailForm = document.querySelector("#email-form");
if (emailForm) {
  const validator = new JustValidate("#email-form");
  validator
    .addField("#email-input", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập email của bạn!",
      },
      {
        rule: "email",
        errorMessage: "Email không đúng định dạng!",
      },
    ])
    .onSuccess((event) => {
      const email = event.target.email.value;

      const dataFinal = {
        email: email,
      };

      fetch(`/contact/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataFinal),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "error") {
            notyf.error(data.message);
          }

          if (data.code == "success") {
            notyf.success(data.message);
            event.target.email.value = "";
          }
        });
    });
}
// End Email Form

// Box Filter
const buttonFilterMobile = document.querySelector(".inner-filter-mobile");
if (buttonFilterMobile) {
  const boxLeft = document.querySelector(".section-9 .inner-left");

  buttonFilterMobile.addEventListener("click", () => {
    boxLeft.classList.add("active");
  });

  const overlay = document.querySelector(
    ".section-9 .inner-left .inner-overlay "
  );
  overlay.addEventListener("click", () => {
    boxLeft.classList.remove("active");
  });
}
// End Box Filter

// Box Images
const boxImages = document.querySelector(".box-images");
if (boxImages) {
  const swiperBoxImagesThumb = new Swiper(".swiper-box-images-thumb", {
    spaceBetween: 5,
    slidesPerView: 4,
    freeMode: true,
    breakpoints: {
      576: {
        spaceBetween: 10,
      },
    },
  });
  const swiperBoxImagesMain = new Swiper(".swiper-box-images-main", {
    spaceBetween: 0,
    thumbs: {
      swiper: swiperBoxImagesThumb,
    },
  });
}
// End Box Images

// Zoom Box Images Main
const boxImageMain = document.querySelector(".box-images .inner-image-main");
if (boxImageMain) {
  new Viewer(boxImageMain);
}
// End Zoom Box Images Main

// Zoom Box Images Main
const boxTourSchedule = document.querySelector(".box-tour-schedule");
if (boxTourSchedule) {
  new Viewer(boxTourSchedule);
}
// End Zoom Box Images Main

// Coupon Form
const couponForm = document.querySelector("#coupon-form");
if (couponForm) {
  const validator = new JustValidate("#coupon-form");

  validator
    .addField("#coupon-input", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập mã giảm giá!",
      },
    ])
    .onSuccess((event) => {
      const coupon = event.target.coupon.value;
      console.log(coupon);
    });
}
// End Coupon Form

// Order Form
const orderForm = document.querySelector("#order-form");
if (orderForm) {
  const validator = new JustValidate("#order-form");

  validator
    .addField("#full-name-input", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập họ tên!",
      },
      {
        rule: "minLength",
        value: 5,
        errorMessage: "Họ tên phải có ít nhất 5 ký tự!",
      },
      {
        rule: "maxLength",
        value: 50,
        errorMessage: "Họ tên không được vượt quá 50 ký tự!",
      },
    ])
    .addField("#phone-input", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập số điện thoại!",
      },
      {
        rule: "customRegexp",
        value: /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-6|8|9]|9[0-9])[0-9]{7}$/,
        errorMessage: "Số điện thoại không đúng định dạng!",
      },
    ])
    .onSuccess((event) => {
      const fullName = event.target.fullname.value;
      const phone = event.target.phone.value;
      const note = event.target.note.value;
      const method = event.target.method.value;
      console.log(fullName);
      console.log(phone);
      console.log(note);
      console.log(method);
    });

  // Chọn phương thức thanh toán
  const listInputMethod = orderForm.querySelectorAll("input[name='method']");
  const elementInfoBank = orderForm.querySelector(
    ".section-12 .inner-method .inner-info-bank"
  );

  listInputMethod.forEach((input) => {
    input.addEventListener("change", () => {
      const value = input.value;
      if (value == "bank") {
        elementInfoBank.classList.add("active");
      } else {
        elementInfoBank.classList.remove("active");
      }
    });
  });
}
// End Order Form

// Box Tour Info
const boxTourInfo = document.querySelector(".box-tour-info");
if (boxTourInfo) {
  const buttonReadMore = boxTourInfo.querySelector(".button-outline");
  buttonReadMore.addEventListener("click", () => {
    if (boxTourInfo.classList.contains("active")) {
      boxTourInfo.classList.remove("active");
      buttonReadMore.innerHTML = "Xem tất cả";
    } else {
      boxTourInfo.classList.add("active");
      buttonReadMore.innerHTML = "Ẩn bớt";
    }
  });
}
// End Box Tour Info

// Box Filter
const boxFilter = document.querySelector(".box-filter");
if (boxFilter) {
  let url;
  if (window.location.pathname.includes("/search")) {
    url = new URL(window.location.href);
  } else {
    url = new URL(`${window.location.origin}/search`);
  }

  const button = boxFilter.querySelector(".button-filter");
  const filterList = [
    "locationFrom",
    "locationTo",
    "departureDate",
    "stockAdult",
    "stockChildren",
    "stockBaby",
    "price",
  ];

  button.addEventListener("click", () => {
    for (const item of filterList) {
      const value = boxFilter.querySelector(`[name="${item}"]`).value;
      if (value) {
        url.searchParams.set(item, value);
      } else {
        url.searchParams.delete(item);
      }
    }

    window.location.href = url.href;
  });

  // Hiển thị giá trị mặc định
  const urlCurrent = new URL(window.location.href);
  for (const item of filterList) {
    const valueCurrent = urlCurrent.searchParams.get(item);
    if (valueCurrent) {
      boxFilter.querySelector(`[name="${item}"]`).value = valueCurrent;
    }
  }

  // Validate Input Number
  const listInputNumber = boxFilter.querySelectorAll('[type="number"]');
  if (listInputNumber.length > 0) {
    listInputNumber.forEach((input) => {
      input.addEventListener("input", () => {
        if (input.value < 0) {
          input.value = 0;
        }
      });
    });
  }
}
// End Box Filter

// Form Search
const formSearch = document.querySelector("[form-search]");
if (formSearch) {
  const url = new URL(`${window.location.origin}/search`);

  formSearch.addEventListener("submit", (event) => {
    event.preventDefault();

    // Điểm đến
    const locationTo = formSearch.locationTo.value;
    if (locationTo) {
      url.searchParams.set("locationTo", locationTo);
    } else {
      url.searchParams.delete("locationTo");
    }

    // Số lượng
    const listQuantity = ["stockAdult", "stockChildren", "stockBaby"];
    for (const item of listQuantity) {
      const element = formSearch.querySelector(`[${item}]`);
      const value = element.innerHTML.trim();
      if (value) {
        url.searchParams.set(item, value);
      } else {
        url.searchParams.delete(item);
      }
    }

    // Ngày khởi hành
    const departureDate = formSearch.departureDate.value;
    if (departureDate) {
      url.searchParams.set("departureDate", departureDate);
    } else {
      url.searchParams.delete("departureDate");
    }

    window.location.href = url.href;
  });
}
// End Form Search

// Button Reset Filter
const buttonFilterReset = document.querySelector(".button-reset");
if (buttonFilterReset) {
  const url = new URL(window.location.href);

  buttonFilterReset.addEventListener("click", () => {
    url.search = "";
    window.location.href = url.href;
  });
}
// End Button Reset Filter

// Sort
const boxSort = document.querySelector("[sort]");
if (boxSort) {
  const url = new URL(window.location.href);
  const listButtonSort = boxSort.querySelectorAll(".inner-button");

  if (listButtonSort.length > 0) {
    listButtonSort.forEach((button) => {
      button.addEventListener("click", () => {
        const dataSort = button.getAttribute("data-sort").split("-");
        const [sortKey, sortValue] = dataSort;

        url.searchParams.set("sortKey", sortKey);
        url.searchParams.set("sortValue", sortValue);

        window.location.href = url.href;
      });
    });
  }

  // Hiển thị active
  const currentSortKey = url.searchParams.get("sortKey");
  const currentSortValue = url.searchParams.get("sortValue");
  if (currentSortKey && currentSortValue) {
    listButtonSort.forEach((button) => {
      const dataSort = button.getAttribute("data-sort").split("-");
      const [sortKey, sortValue] = dataSort;

      if (sortKey === currentSortKey && sortValue === currentSortValue) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  }
}
// End Sort

// Pagination
const boxPagination = document.querySelector(".box-pagination");
if (boxPagination) {
  const url = new URL(window.location.href);
  const listButtonPagination = boxPagination.querySelectorAll(
    "[button-pagination]"
  );

  if (listButtonPagination.length > 0) {
    listButtonPagination.forEach((button) => {
      button.addEventListener("click", () => {
        const page = button.getAttribute("button-pagination");
        if (page) {
          url.searchParams.set("page", page);
        }

        window.location.href = url.href;
      });
    });
  }
}
// End Pagination

// Initial Cart
const cart = localStorage.getItem("cartTour");
if (!cart) {
  localStorage.setItem("cartTour", JSON.stringify([]));
}
// End Initial Cart

// Box Tour Detail
const boxTourDetail = document.querySelector(".box-tour-detail");
if (boxTourDetail) {
  const listInputQuantity = boxTourDetail.querySelectorAll("[input-quantity]");
  const elementTotalPrice = boxTourDetail.querySelector("[totalPrice]");
  const buttonAddCart = boxTourDetail.querySelector("[button-add-cart]");
  const tourId = buttonAddCart.getAttribute("tour-id");

  // Hiển thị giá trị từ localStorage
  const cart = JSON.parse(localStorage.getItem("cartTour"));
  const existItem = cart.find((item) => item.tourId === tourId);

  const drawBoxTourDetail = () => {
    let totalPrice = 0;
    listInputQuantity.forEach((input) => {
      let quantity = parseInt(input.value);
      const fieldName = input.getAttribute("input-quantity");
      const price = parseInt(input.getAttribute("data-price"));
      const min = parseInt(input.getAttribute("min"));
      const max = parseInt(input.getAttribute("max"));

      if (quantity < min) {
        quantity = min;
        input.value = min;
        notyf.error(`Số lượng phải lớn >= ${min}`);
      }

      if (quantity > max) {
        quantity = max;
        input.value = max;
        notyf.error(`Số lượng phải nhỏ >= ${max}`);
      }

      const labelQuantity = boxTourDetail.querySelector(
        `[label-quantity="${fieldName}"]`
      );

      labelQuantity.innerHTML = quantity;

      totalPrice += price * quantity;
    });

    elementTotalPrice.innerHTML = totalPrice.toLocaleString("vi-VN");
  };

  listInputQuantity.forEach((input) => {
    input.addEventListener("change", () => {
      drawBoxTourDetail();
    });

    if (existItem) {
      const fieldName = input.getAttribute("input-quantity");
      if (fieldName === "stockAdult") {
        input.value = existItem.quantityAdult;
      }
      if (fieldName === "stockChildren") {
        input.value = existItem.quantityChildren;
      }
      if (fieldName === "stockBaby") {
        input.value = existItem.quantityBaby;
      }
      drawBoxTourDetail();
    }
  });

  buttonAddCart.addEventListener("click", () => {
    const locationFrom = boxTourDetail.querySelector(
      `[name="locationFrom"]`
    ).value;
    const quantityAdult = parseInt(
      boxTourDetail.querySelector(`[input-quantity="stockAdult"]`).value
    );
    const quantityChildren = parseInt(
      boxTourDetail.querySelector(`[input-quantity="stockChildren"]`).value
    );
    const quantityBaby = parseInt(
      boxTourDetail.querySelector(`[input-quantity="stockBaby"]`).value
    );

    if (quantityAdult > 0 || quantityChildren > 0 || quantityBaby > 0) {
      const item = {
        tourId: tourId,
        locationFrom: locationFrom,
        quantityAdult: quantityAdult,
        quantityChildren: quantityChildren,
        quantityBaby: quantityBaby,
      };
      const cart = JSON.parse(localStorage.getItem("cartTour"));
      const indexItemExist = cart.findIndex((item) => item.tourId === tourId);
      if (indexItemExist != -1) {
        cart[indexItemExist] = item;
      } else {
        cart.push(item);
      }

      localStorage.setItem("cartTour", JSON.stringify(cart));
      notyf.success("Đã thêm tour vào giỏ hàng!");
    } else {
      notyf.error("Số lượng phải >= 0");
    }
  });
}
// End Box Tour Detail

// Mini Cart
const miniCart = document.querySelector("[mini-cart]");
if (miniCart) {
  const cart = JSON.parse(localStorage.getItem("cartTour"));
  miniCart.innerHTML = cart.length;
}
// End Mini Cart

// Page Cart
const drawCart = () => {
  const cart = localStorage.getItem("cartTour");

  fetch(`/cart/detail`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: cart,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.code === "success") {
        let subTotal = 0;

        const htmlArray = data.cart.map((item) => {
          subTotal +=
            item.priceNewAdult * item.quantityAdult +
            item.priceNewChildren * item.quantityChildren +
            item.priceNewBaby * item.quantityBaby;

          return `
            <div class="inner-tour-item">
              <div class="inner-actions">
                <button class="inner-delete" type="button" aria-label="Xóa">
                  <i class="fa-solid fa-xmark" aria-hidden="true"></i>
                </button>

                <input class="custom-check" type="checkbox" id=${item.tourId} />
                <label class="custom-icon-checkbox" for=${
                  item.tourId
                } aria-hidden="true">
                  <i class="fa-solid fa-check"></i>
                </label>
              </div>

              <div class="inner-product">
                <div class="inner-image">
                  <a href="/tour/detail/${item.slug}">
                    <img
                      alt="${item.name}"
                      src="${item.avatar}"
                    />
                  </a>
                </div>

                <div class="inner-content">
                  <div class="inner-title">
                    <a href="/tour/detail/${item.slug}">${item.name}</a>
                  </div>

                  <div class="inner-meta">
                    <div class="inner-meta-item">
                      Ngày Khởi Hành: <b>${item.departureDate}</b>
                    </div>
                    <div class="inner-meta-item">
                      Khởi Hành Tại: <b>${item.cityName}</b>
                    </div>
                  </div>
                </div>
              </div>

              <div class="inner-quantity">
                <div class="inner-label">Số Lượng Hành Khách</div>

                <div class="inner-list">
                  <div class="inner-item">
                    <div class="inner-item-label">Người lớn:</div>
                    <input 
                      type="number" 
                      value="${item.quantityAdult}" 
                      min="0" 
                      max="${item.stockAdult}" 
                      input-quantity="quantityAdult" 
                      tour-id="${item.tourId}" 
                    />
                    <div class="inner-item-price">
                      <span>${item.quantityAdult}</span>
                      <span>x</span>
                      <span class="inner-highlight">${item.priceNewAdult.toLocaleString(
                        "vi-VN"
                      )}</span>
                    </div>
                  </div>

                  <div class="inner-item">
                    <div class="inner-item-label">Trẻ em:</div>
                    <input 
                      type="number" 
                      value="${item.quantityChildren}" 
                      min="0" 
                      max="${item.stockChildren}" 
                      input-quantity="quantityChildren" 
                      tour-id="${item.tourId}"  
                    />
                    <div class="inner-item-price">
                      <span>${item.quantityChildren}</span>
                      <span>x</span>
                      <span class="inner-highlight">${item.priceNewChildren.toLocaleString(
                        "vi-VN"
                      )}</span>
                    </div>
                  </div>

                  <div class="inner-item">
                    <div class="inner-item-label">Em bé:</div>
                    <input 
                      type="number" 
                      value="${item.quantityBaby}" 
                      min="0" 
                      max="${item.stockBaby}" 
                      input-quantity="quantityBaby" 
                      tour-id="${item.tourId}"  
                    />
                    <div class="inner-item-price">
                      <span>${item.quantityBaby}</span>
                      <span>x</span>
                      <span class="inner-highlight">${item.priceNewBaby.toLocaleString(
                        "vi-VN"
                      )}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
        });

        let discount = 0;
        let total = subTotal - discount;

        const elementCartList = document.querySelector("[cart-list]");
        elementCartList.innerHTML = htmlArray.join("");

        const elementCartSubTotal = document.querySelector("[cart-sub-total]");
        const elementCartTotal = document.querySelector("[cart-total]");
        elementCartSubTotal.innerHTML = subTotal.toLocaleString("vi-VN");
        elementCartTotal.innerHTML = total.toLocaleString("vi-VN");

        // Cập nhật số lượng
        const listInputQuantity = document.querySelectorAll("[input-quantity]");
        listInputQuantity.forEach((input) => {
          input.addEventListener("change", () => {
            const tourId = input.getAttribute("tour-id");
            const fieldName = input.getAttribute("input-quantity");
            let quantity = parseInt(input.value);
            const min = parseInt(input.getAttribute("min"));
            const max = parseInt(input.getAttribute("max"));

            if (quantity < min) {
              quantity = min;
              input.value = min;
              notyf.error(`Số lượng phải lớn >= ${min}`);
            }

            if (quantity > max) {
              quantity = max;
              input.value = max;
              notyf.error(`Số lượng phải nhỏ >= ${max}`);
            }

            const cart = JSON.parse(localStorage.getItem("cartTour"));
            const itemUpdate = cart.find((item) => item.tourId === tourId);
            if (itemUpdate) {
              itemUpdate[fieldName] = quantity;
              localStorage.setItem("cartTour", JSON.stringify(cart));
              drawCart();
            }
          });
        });
      }

      if (data.code === "error") {
        localStorage.setItem("cartTour", JSON.stringify([]));
      }
    });
};

const pageCart = document.querySelector("[page-cart]");
if (pageCart) {
  drawCart();
}
// End Page Cart

// Khởi tạo AOS
AOS.init();
// Hết Khởi tạo AOS
