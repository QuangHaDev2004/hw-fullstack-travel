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
  const url = new URL(`${window.location.origin}/search`);

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

// Khởi tạo AOS
AOS.init();
// Hết Khởi tạo AOS
