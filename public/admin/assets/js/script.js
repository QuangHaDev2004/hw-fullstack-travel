// Menu
const btnMenuMobile = document.querySelector(".inner-menu-mobile");
if (btnMenuMobile) {
  const sider = document.querySelector(".sider");
  const siderOverlay = document.querySelector(".sider-overlay");

  btnMenuMobile.addEventListener("click", () => {
    sider.classList.add("active");
    siderOverlay.classList.add("active");
  });

  siderOverlay.addEventListener("click", () => {
    sider.classList.remove("active");
    siderOverlay.classList.remove("active");
  });
}
// End Menu

// Section 8
const listSchedule = document.querySelector(".inner-schedule-list");
if (listSchedule) {
  // Tạo lịch trình
  const btnCreate = document.querySelector(".inner-schedule-create");
  btnCreate.addEventListener("click", () => {
    const firstItem = listSchedule.querySelector(".inner-schedule-item");
    const cloneItem = firstItem.cloneNode(true);
    cloneItem.querySelector("input").value = "";

    const id = `mce_${Date.now()}`;
    const body = cloneItem.querySelector(".inner-schedule-body");
    body.innerHTML = `<textarea id=${id}></textarea>`;
    listSchedule.appendChild(cloneItem);
    initTinyMCE(`#${id}`);
  });

  listSchedule.addEventListener("click", (e) => {
    // Đóng / Mở
    if (e.target.closest(".inner-more")) {
      const item = e.target.closest(".inner-schedule-item");
      item.classList.toggle("hidden");
    }

    // Xóa
    if (e.target.closest(".inner-remove")) {
      const item = e.target.closest(".inner-schedule-item");
      const totalItem = listSchedule.querySelectorAll(
        ".inner-schedule-item"
      ).length;
      if (totalItem > 1) {
        listSchedule.removeChild(item);
      }
    }
  });

  // Kéo thả
  new Sortable(listSchedule, {
    handle: ".inner-move", // handle's class
    animation: 150,
    onStart: (event) => {
      console.log(event);
      const textarea = event.item.querySelector(
        ".inner-schedule-body textarea"
      );
      const id = textarea.id;
      tinymce.get(id).remove();
    },
    onEnd: (event) => {
      const textarea = event.item.querySelector(
        ".inner-schedule-body textarea"
      );
      const id = textarea.id;
      initTinyMCE(`#${id}`);
    },
  });
}
// End Section 8

// Filepond
const listFilePondImage = document.querySelectorAll("[filepond-image]");
let filePond = {};
if (listFilePondImage.length > 0) {
  FilePond.registerPlugin(
    FilePondPluginFileValidateType,
    FilePondPluginImagePreview,
    FilePondPluginImageCrop,
    FilePondPluginImageResize
  );

  listFilePondImage.forEach((FilePondImage) => {
    let files = null;
    const elementImageDefault = FilePondImage.closest("[image-default]");
    if (elementImageDefault) {
      const imageDefault = elementImageDefault.getAttribute("image-default");
      if (imageDefault) {
        files = [
          {
            source: imageDefault,
          },
        ];
      }
    }

    filePond[FilePondImage.name] = FilePond.create(FilePondImage, {
      labelIdle: "+",
      files: files,
      imageCropAspectRatio: "1:1",
      imageResizeTargetWidth: 150,
      imageResizeTargetHeight: 150,
    });
  });
}
// End Filepond

// Filepond Image Multi
const listFilepondImageMulti = document.querySelectorAll(
  "[filepond-image-multi]"
);
let filePondMulti = {};
if (listFilepondImageMulti.length > 0) {
  listFilepondImageMulti.forEach((filepondImage) => {
    FilePond.registerPlugin(FilePondPluginImagePreview);
    FilePond.registerPlugin(FilePondPluginFileValidateType);

    let files = null;
    const elementListImageDefault = filepondImage.closest(
      "[list-image-default]"
    );
    if (elementListImageDefault) {
      let listImageDefault =
        elementListImageDefault.getAttribute("list-image-default");
      if (listImageDefault) {
        listImageDefault = JSON.parse(listImageDefault);
        files = [];
        listImageDefault.forEach((image) => {
          files.push({
            source: image,
          });
        });
      }
    }

    filePondMulti[filepondImage.name] = FilePond.create(filepondImage, {
      labelIdle: "+",
      files: files,
    });
  });
}
// End Filepond Image Multi

// Chart 1 (Biểu đồ doanh thu)
const drawChart = (dateFilter) => {
  // Lấy ra ngày hiện tại
  const now = dateFilter;

  // Lấy ra thông tin tháng này
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // Lấy ra thông tin tháng trước
  const previousMonthDate = new Date(currentYear, now.getMonth() - 1, 1);
  const previousMonth = previousMonthDate.getMonth() + 1;
  const previousYear = previousMonthDate.getFullYear();

  // Lấy ra tổng số ngày
  const daysInCurrentMonth = new Date(currentYear, currentMonth, 0).getDate();
  const daysInPreviousMonth = new Date(
    previousYear,
    previousMonth,
    0
  ).getDate();
  const days =
    daysInCurrentMonth > daysInPreviousMonth
      ? daysInCurrentMonth
      : daysInPreviousMonth;
  const arrayDay = [];
  for (let i = 1; i <= days; i++) {
    arrayDay.push(i);
  }

  const dataFinal = {
    currentMonth: currentMonth,
    currentYear: currentYear,
    previousMonth: previousMonth,
    previousYear: previousYear,
    arrayDay: arrayDay,
  };

  fetch(`/${pathAdmin}/dashboard/revenue-chart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataFinal),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.code === "success") {
        const stringCanvas = `<canvas></canvas>`;
        const parentChart = document.querySelector(".section-2 .inner-chart");
        parentChart.innerHTML = stringCanvas;
        const canvas = parentChart.querySelector("canvas");

        new Chart(canvas, {
          type: "line",
          data: {
            labels: arrayDay,
            datasets: [
              {
                label: `Tháng ${currentMonth}/${currentYear}`,
                data: data.dataMonthCurrent,
                borderColor: "#36A2EB",
                borderWidth: 1.5,
              },
              {
                label: `Tháng ${previousMonth}/${previousYear}`,
                data: data.dataMonthPrevious,
                borderColor: "#FF7D98",
                borderWidth: 1.5,
              },
            ],
          },
          options: {
            plugins: {
              legend: {
                position: "bottom",
              },
            },
            scales: {
              x: {
                display: true,
                title: {
                  display: true,
                  text: "Ngày",
                },
              },
              y: {
                display: true,
                title: {
                  display: true,
                  text: "Doanh thu (VNĐ)",
                },
              },
            },
            maintainAspectRatio: false,
          },
        });
      }
    });
};

const char1 = document.querySelector("#chart1");
if (char1) {
  const now = new Date();
  drawChart(now);

  const inputFilterMonth = document.querySelector("[filter-month]");
  inputFilterMonth.value = now.toISOString().slice(0, 7);

  inputFilterMonth.addEventListener("change", () => {
    const value = inputFilterMonth.value;
    const dateFilter = new Date(value);
    drawChart(dateFilter);
  });
}
// End Chart 1 (Biểu đồ doanh thu)

// Category Create Form
const categoryCreateForm = document.querySelector("#category-create-form");
if (categoryCreateForm) {
  const validator = new JustValidate("#category-create-form");

  validator
    .addField("#name", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập tên danh mục!",
      },
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      const parent = event.target.parent.value;
      const position = event.target.position.value;
      const status = event.target.status.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if (avatars.length > 0) {
        avatar = avatars[0].file;
      }
      const description = tinymce.get("description").getContent();

      const formData = new FormData();
      formData.append("name", name);
      formData.append("parent", parent);
      formData.append("position", position);
      formData.append("status", status);
      formData.append("avatar", avatar);
      formData.append("description", description);

      const buttonSubmit = document.querySelector(".inner-button-2 button");
      buttonSubmit.setAttribute("type", "button");

      fetch(`/${pathAdmin}/category/create`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "error") {
            buttonSubmit.setAttribute("type", "");
            notyf.error(data.message);
          }

          if (data.code == "success") {
            drawNotify(data.code, data.message);
            window.location.reload();
          }
        });
    });
}
// End Category Create Form

// Category Edit Form
const categoryEditForm = document.querySelector("#category-edit-form");
if (categoryEditForm) {
  const validator = new JustValidate("#category-edit-form");

  validator
    .addField("#name", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập tên danh mục!",
      },
    ])
    .onSuccess((event) => {
      const id = event.target.id.value;
      const name = event.target.name.value;
      const parent = event.target.parent.value;
      const position = event.target.position.value;
      const status = event.target.status.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if (avatars.length > 0) {
        avatar = avatars[0].file;
        const elementImageDefault =
          event.target.avatar.closest("[image-default]");
        if (elementImageDefault) {
          const imageDefault =
            elementImageDefault.getAttribute("image-default");
          if (imageDefault.includes(avatar.name)) {
            avatar = undefined;
          }
        }
      }
      const description = tinymce.get("description").getContent();

      const formData = new FormData();
      formData.append("name", name);
      formData.append("parent", parent);
      formData.append("position", position);
      formData.append("status", status);
      formData.append("avatar", avatar);
      formData.append("description", description);

      const buttonSubmit = document.querySelector(".inner-button-2 button");
      buttonSubmit.setAttribute("type", "button");

      fetch(`/${pathAdmin}/category/edit/${id}`, {
        method: "PATCH",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          buttonSubmit.setAttribute("type", "");
          if (data.code == "error") {
            notyf.error(data.message);
          }

          if (data.code == "success") {
            notyf.success(data.message);
          }
        });
    });
}
// End Category Edit Form

// Tour Create Form
const tourCreateForm = document.querySelector("#tour-create-form");
if (tourCreateForm) {
  const autoNumericConfig = {
    digitGroupSeparator: ".",
    decimalCharacter: ",",
    decimalPlaces: 0,
  };

  document.querySelectorAll(".auto-money").forEach((input) => {
    new AutoNumeric(input, autoNumericConfig);
  });

  const validator = new JustValidate("#tour-create-form");

  validator
    .addField("#name", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập tên tour!",
      },
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      const category = event.target.category.value;
      const position = event.target.position.value;
      const status = event.target.status.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if (avatars.length > 0) {
        avatar = avatars[0].file;
      }
      const priceAdult = AutoNumeric.getNumber("#priceAdult");
      const priceChildren = AutoNumeric.getNumber("#priceChildren");
      const priceBaby = AutoNumeric.getNumber("#priceBaby");
      const priceNewAdult = AutoNumeric.getNumber("#priceNewAdult");
      const priceNewChildren = AutoNumeric.getNumber("#priceNewChildren");
      const priceNewBaby = AutoNumeric.getNumber("#priceNewBaby");
      const stockAdult = event.target.stockAdult.value;
      const stockChildren = event.target.stockChildren.value;
      const stockBaby = event.target.stockBaby.value;
      let locations = [];
      const time = event.target.time.value;
      const vehicle = event.target.vehicle.value;
      const departureDate = event.target.departureDate.value;
      const information = tinymce.get("information").getContent();
      let schedules = [];

      // Location
      const listLocation = tourCreateForm.querySelectorAll(
        'input[name="locations"]:checked'
      );
      listLocation.forEach((input) => {
        locations.push(input.value);
      });

      // Schedules
      const listScheduleItem = tourCreateForm.querySelectorAll(
        ".inner-schedule-item"
      );
      listScheduleItem.forEach((scheduleItem) => {
        const input = scheduleItem.querySelector("input");
        const title = input.value;

        const textarea = scheduleItem.querySelector("textarea");
        const idTextarea = textarea.id;
        const description = tinymce.get(idTextarea).getContent();

        schedules.push({
          title: title,
          description: description,
        });
      });

      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("position", position);
      formData.append("status", status);
      formData.append("avatar", avatar);
      formData.append("priceAdult", priceAdult);
      formData.append("priceChildren", priceChildren);
      formData.append("priceBaby", priceBaby);
      formData.append("priceNewAdult", priceNewAdult);
      formData.append("priceNewChildren", priceNewChildren);
      formData.append("priceNewBaby", priceNewBaby);
      formData.append("stockAdult", stockAdult);
      formData.append("stockChildren", stockChildren);
      formData.append("stockBaby", stockBaby);
      formData.append("locations", JSON.stringify(locations));
      formData.append("time", time);
      formData.append("vehicle", vehicle);
      formData.append("departureDate", departureDate);
      formData.append("information", information);
      formData.append("schedules", JSON.stringify(schedules));

      // Images
      if (filePondMulti.images.getFiles().length > 0) {
        filePondMulti.images.getFiles().forEach((item) => {
          formData.append("images", item.file);
        });
      }

      const buttonSubmit = document.querySelector(".inner-button-2 button");
      buttonSubmit.setAttribute("type", "button");

      fetch(`/${pathAdmin}/tour/create`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          buttonSubmit.setAttribute("type", "");
          if (data.code == "error") {
            notyf.error(data.message);
          }

          if (data.code == "success") {
            drawNotify(data.code, data.message);
            window.location.reload();
          }
        });
    });
}
// End Tour Create Form

// Tour Edit Form
const tourEditForm = document.querySelector("#tour-edit-form");
if (tourEditForm) {
  const autoNumericConfig = {
    digitGroupSeparator: ".",
    decimalCharacter: ",",
    decimalPlaces: 0,
  };

  document.querySelectorAll(".auto-money").forEach((input) => {
    const anElement = new AutoNumeric(input, autoNumericConfig);
    if (input.value) {
      anElement.set(input.value);
    }
  });

  const validator = new JustValidate("#tour-edit-form");

  validator
    .addField("#name", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập tên tour!",
      },
    ])
    .onSuccess((event) => {
      const id = event.target.id.value;
      const name = event.target.name.value;
      const category = event.target.category.value;
      const position = event.target.position.value;
      const status = event.target.status.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if (avatars.length > 0) {
        avatar = avatars[0].file;
        const elementImageDefault =
          event.target.avatar.closest("[image-default]");
        if (elementImageDefault) {
          const imageDefault =
            elementImageDefault.getAttribute("image-default");
          if (imageDefault.includes(avatar.name)) {
            avatar = undefined;
          }
        }
      }
      const priceAdult = AutoNumeric.getNumber("#priceAdult");
      const priceChildren = AutoNumeric.getNumber("#priceChildren");
      const priceBaby = AutoNumeric.getNumber("#priceBaby");
      const priceNewAdult = AutoNumeric.getNumber("#priceNewAdult");
      const priceNewChildren = AutoNumeric.getNumber("#priceNewChildren");
      const priceNewBaby = AutoNumeric.getNumber("#priceNewBaby");
      const stockAdult = event.target.stockAdult.value;
      const stockChildren = event.target.stockChildren.value;
      const stockBaby = event.target.stockBaby.value;
      let locations = [];
      const time = event.target.time.value;
      const vehicle = event.target.vehicle.value;
      const departureDate = event.target.departureDate.value;
      const information = tinymce.get("information").getContent();
      let schedules = [];

      // Location
      const listLocation = tourEditForm.querySelectorAll(
        'input[name="locations"]:checked'
      );
      listLocation.forEach((input) => {
        locations.push(input.value);
      });

      // Schedules
      const listScheduleItem = tourEditForm.querySelectorAll(
        ".inner-schedule-item"
      );
      listScheduleItem.forEach((scheduleItem) => {
        const input = scheduleItem.querySelector("input");
        const title = input.value;

        const textarea = scheduleItem.querySelector("textarea");
        const idTextarea = textarea.id;
        const description = tinymce.get(idTextarea).getContent();

        schedules.push({
          title: title,
          description: description,
        });
      });

      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("position", position);
      formData.append("status", status);
      formData.append("avatar", avatar);
      formData.append("priceAdult", priceAdult);
      formData.append("priceChildren", priceChildren);
      formData.append("priceBaby", priceBaby);
      formData.append("priceNewAdult", priceNewAdult);
      formData.append("priceNewChildren", priceNewChildren);
      formData.append("priceNewBaby", priceNewBaby);
      formData.append("stockAdult", stockAdult);
      formData.append("stockChildren", stockChildren);
      formData.append("stockBaby", stockBaby);
      formData.append("locations", JSON.stringify(locations));
      formData.append("time", time);
      formData.append("vehicle", vehicle);
      formData.append("departureDate", departureDate);
      formData.append("information", information);
      formData.append("schedules", JSON.stringify(schedules));

      // Images
      if (filePondMulti.images.getFiles().length > 0) {
        filePondMulti.images.getFiles().forEach((item) => {
          formData.append("images", item.file);
        });
      }

      const buttonSubmit = document.querySelector(".inner-button-2 button");
      buttonSubmit.setAttribute("type", "button");

      fetch(`/${pathAdmin}/tour/edit/${id}`, {
        method: "PATCH",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "error") {
            notyf.error(data.message);
            buttonSubmit.setAttribute("type", "");
          }

          if (data.code == "success") {
            notyf.success(data.message);
            buttonSubmit.setAttribute("type", "");
          }
        });
    });
}
// End Tour Edit Form

// Order Edit Form
const orderEditForm = document.querySelector("#order-edit-form");
if (orderEditForm) {
  const validator = new JustValidate("#order-edit-form");

  validator
    .addField("#fullName", [
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
    .addField("#phone", [
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
      const id = event.target.id.value;
      const fullName = event.target.fullName.value;
      const phone = event.target.phone.value;
      const note = event.target.note.value;
      const paymentMethod = event.target.paymentMethod.value;
      const paymentStatus = event.target.paymentStatus.value;
      const status = event.target.status.value;

      const dataFinal = {
        fullName: fullName,
        phone: phone,
        note: note,
        paymentMethod: paymentMethod,
        paymentStatus: paymentStatus,
        status: status,
      };

      const buttonSubmit = document.querySelector(".inner-button-2 button");
      buttonSubmit.setAttribute("type", "button");

      fetch(`/${pathAdmin}/order/edit/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataFinal),
      })
        .then((res) => res.json())
        .then((data) => {
          buttonSubmit.setAttribute("type", "");
          if (data.code == "error") {
            notyf.error(data.message);
          }

          if (data.code == "success") {
            notyf.success(data.message);
          }
        });
    });
}
// End Order Edit Form

// Website Info Form
const websiteInfoForm = document.querySelector("#website-info-form");
if (websiteInfoForm) {
  const validator = new JustValidate("#website-info-form");

  validator
    .addField("#name", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập tên website!",
      },
    ])
    .addField("#email", [
      {
        rule: "email",
        errorMessage: "Email không đúng định dạng!",
      },
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      const phone = event.target.phone.value;
      const email = event.target.email.value;
      const address = event.target.address.value;
      const logos = filePond.logo.getFiles();
      let logo = null;
      if (logos.length > 0) {
        logo = logos[0].file;
      }
      const favicons = filePond.favicon.getFiles();
      let favicon = null;
      if (favicons.length > 0) {
        favicon = favicons[0].file;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("address", address);
      formData.append("logo", logo);
      formData.append("favicon", favicon);

      const buttonSubmit = document.querySelector(".inner-button-2 button");
      buttonSubmit.setAttribute("type", "button");

      fetch(`/${pathAdmin}/setting/website-info`, {
        method: "PATCH",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          buttonSubmit.setAttribute("type", "");
          if (data.code == "error") {
            notyf.error(data.message);
          }

          if (data.code == "success") {
            notyf.success(data.message);
          }
        });
    });
}
// End Website Info Form

// Account Admin Create Form
const accountAdminCreateForm = document.querySelector(
  "#account-admin-create-form"
);
if (accountAdminCreateForm) {
  const validator = new JustValidate("#account-admin-create-form");

  validator
    .addField("#fullName", [
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
    .addField("#email", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập email của bạn!",
      },
      {
        rule: "email",
        errorMessage: "Email không đúng định dạng!",
      },
    ])
    .addField("#phone", [
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
    .addField("#positionCompany", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập chức vụ!",
      },
    ])
    .addField("#password", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập mật khẩu!",
      },
      {
        rule: "minLength",
        value: 8,
        errorMessage: "Họ tên phải có ít nhất 8 ký tự!",
      },
      {
        validator: (value) => {
          const regex = /[\s]/;
          const result = !regex.test(value);
          return result;
        },
        errorMessage: "Mật khẩu không được chứa khoảng trắng!",
      },
      {
        validator: (value) => {
          const regex = /[A-Z]/;
          const result = regex.test(value);
          return result;
        },
        errorMessage: "Mật khẩu phải chứa ký tự viết hoa!",
      },
      {
        validator: (value) => {
          const regex = /[a-z]/;
          const result = regex.test(value);
          return result;
        },
        errorMessage: "Mật khẩu phải chứa ký tự viết thường!",
      },
      {
        validator: (value) => {
          const regex = /[0-9]/;
          const result = regex.test(value);
          return result;
        },
        errorMessage: "Mật khẩu phải chứa chữ số!",
      },
      {
        validator: (value) => {
          const regex = /[^a-zA-Z0-9\s]/;
          const result = regex.test(value);
          return result;
        },
        errorMessage: "Mật khẩu phải chứa ký tự đặc biệt!",
      },
    ])
    .onSuccess((event) => {
      const fullName = event.target.fullName.value;
      const email = event.target.email.value;
      const phone = event.target.phone.value;
      const role = event.target.role.value;
      const positionCompany = event.target.positionCompany.value;
      const status = event.target.status.value;
      const password = event.target.password.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if (avatars.length > 0) {
        avatar = avatars[0].file;
      }

      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("role", role);
      formData.append("positionCompany", positionCompany);
      formData.append("status", status);
      formData.append("password", password);
      formData.append("avatar", avatar);

      const buttonSubmit = document.querySelector(".inner-button-2 button");
      buttonSubmit.setAttribute("type", "button");

      fetch(`/${pathAdmin}/setting/account-admin/create`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          buttonSubmit.setAttribute("type", "");
          if (data.code == "error") {
            notyf.error(data.message);
          }

          if (data.code == "success") {
            drawNotify(data.code, data.message);
            window.location.reload();
          }
        });
    });
}
// End Account Admin Create Form

// Account Admin Edit Form
const accountAdminEditForm = document.querySelector("#account-admin-edit-form");
if (accountAdminEditForm) {
  const validator = new JustValidate("#account-admin-edit-form");

  validator
    .addField("#fullName", [
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
    .addField("#email", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập email của bạn!",
      },
      {
        rule: "email",
        errorMessage: "Email không đúng định dạng!",
      },
    ])
    .addField("#phone", [
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
    .addField("#positionCompany", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập chức vụ!",
      },
    ])
    .onSuccess((event) => {
      const id = event.target.id.value;
      const fullName = event.target.fullName.value;
      const email = event.target.email.value;
      const phone = event.target.phone.value;
      const role = event.target.role.value;
      const positionCompany = event.target.positionCompany.value;
      const status = event.target.status.value;
      const password = event.target.password.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if (avatars.length > 0) {
        avatar = avatars[0].file;
        const elementImageDefault =
          event.target.avatar.closest("[image-default]");
        if (elementImageDefault) {
          const imageDefault =
            elementImageDefault.getAttribute("image-default");
          if (imageDefault.includes(avatar.name)) {
            avatar = undefined;
          }
        }
      }

      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("role", role);
      formData.append("positionCompany", positionCompany);
      formData.append("status", status);
      formData.append("password", password);
      formData.append("avatar", avatar);

      const buttonSubmit = document.querySelector(".inner-button-2 button");
      buttonSubmit.setAttribute("type", "button");

      fetch(`/${pathAdmin}/setting/account-admin/edit/${id}`, {
        method: "PATCH",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          buttonSubmit.setAttribute("type", "");
          if (data.code == "error") {
            notyf.error(data.message);
          }

          if (data.code == "success") {
            notyf.success(data.message);
          }
        });
    });
}
// End Account Admin Edit Form

// Role Create Form
const roleCreateForm = document.querySelector("#role-create-form");
if (roleCreateForm) {
  const validator = new JustValidate("#role-create-form");

  validator
    .addField("#name", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập nhóm quyền!",
      },
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      const description = event.target.description.value;
      const permissions = [];

      const listPermission = roleCreateForm.querySelectorAll(
        'input[name="permissions"]:checked'
      );
      listPermission.forEach((input) => {
        permissions.push(input.value);
      });

      const dataFinal = {
        name: name,
        description: description,
        permissions: permissions,
      };

      const buttonSubmit = document.querySelector(".inner-button-2 button");
      buttonSubmit.setAttribute("type", "button");

      fetch(`/${pathAdmin}/setting/role/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataFinal),
      })
        .then((res) => res.json())
        .then((data) => {
          buttonSubmit.setAttribute("type", "");
          if (data.code == "error") {
            notyf.error(data.message);
          }

          if (data.code == "success") {
            drawNotify(data.code, data.message);
            window.location.reload();
          }
        });
    });
}
// End Role Create Form

// Role Edit Form
const roleEditForm = document.querySelector("#role-edit-form");
if (roleEditForm) {
  const validator = new JustValidate("#role-edit-form");

  validator
    .addField("#name", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập nhóm quyền!",
      },
    ])
    .onSuccess((event) => {
      const id = event.target.id.value;
      const name = event.target.name.value;
      const description = event.target.description.value;
      const permissions = [];

      const listPermission = roleEditForm.querySelectorAll(
        'input[name="permissions"]:checked'
      );
      listPermission.forEach((input) => {
        permissions.push(input.value);
      });

      const dataFinal = {
        name: name,
        description: description,
        permissions: permissions,
      };

      const buttonSubmit = document.querySelector(".inner-button-2 button");
      buttonSubmit.setAttribute("type", "button");

      fetch(`/${pathAdmin}/setting/role/edit/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataFinal),
      })
        .then((res) => res.json())
        .then((data) => {
          buttonSubmit.setAttribute("type", "");
          if (data.code == "error") {
            notyf.error(data.message);
          }

          if (data.code == "success") {
            notyf.success(data.message);
          }
        });
    });
}
// End Role Edit Form

// Profile Edit Form
const profileEditForm = document.querySelector("#profile-edit-form");
if (profileEditForm) {
  const validator = new JustValidate("#profile-edit-form");

  validator
    .addField("#fullName", [
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
    .addField("#email", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập email của bạn!",
      },
      {
        rule: "email",
        errorMessage: "Email không đúng định dạng!",
      },
    ])
    .addField("#phone", [
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
      const fullName = event.target.fullName.value;
      const email = event.target.email.value;
      const phone = event.target.phone.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if (avatars.length > 0) {
        avatar = avatars[0].file;
        const elementImageDefault =
          event.target.avatar.closest("[image-default]");
        if (elementImageDefault) {
          const imageDefault =
            elementImageDefault.getAttribute("image-default");
          if (imageDefault.includes(avatar.name)) {
            avatar = undefined;
          }
        }
      }

      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("avatar", avatar);

      const buttonSubmit = document.querySelector(".inner-button-2 button");
      buttonSubmit.setAttribute("type", "button");

      fetch(`/${pathAdmin}/profile/edit`, {
        method: "PATCH",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          buttonSubmit.setAttribute("type", "");
          if (data.code == "error") {
            notyf.error(data.message);
          }

          if (data.code == "success") {
            drawNotify(data.code, data.message);
            window.location.reload();
          }
        });
    });
}
// End Profile Edit Form

// Profile Change Password Form
const profileChangePasswordForm = document.querySelector(
  "#profile-change-password-form"
);
if (profileChangePasswordForm) {
  const validator = new JustValidate("#profile-change-password-form");

  validator
    .addField("#password", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập mật khẩu!",
      },
      {
        rule: "minLength",
        value: 8,
        errorMessage: "Họ tên phải có ít nhất 8 ký tự!",
      },
      {
        validator: (value) => {
          const regex = /[\s]/;
          const result = !regex.test(value);
          return result;
        },
        errorMessage: "Mật khẩu không được chứa khoảng trắng!",
      },
      {
        validator: (value) => {
          const regex = /[A-Z]/;
          const result = regex.test(value);
          return result;
        },
        errorMessage: "Mật khẩu phải chứa ký tự viết hoa!",
      },
      {
        validator: (value) => {
          const regex = /[a-z]/;
          const result = regex.test(value);
          return result;
        },
        errorMessage: "Mật khẩu phải chứa ký tự viết thường!",
      },
      {
        validator: (value) => {
          const regex = /[0-9]/;
          const result = regex.test(value);
          return result;
        },
        errorMessage: "Mật khẩu phải chứa chữ số!",
      },
      {
        validator: (value) => {
          const regex = /[^a-zA-Z0-9\s]/;
          const result = regex.test(value);
          return result;
        },
        errorMessage: "Mật khẩu phải chứa ký tự đặc biệt!",
      },
    ])
    .addField("#confirmPassword", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập xác nhận mật khẩu!",
      },
      {
        validator: (value, field) => {
          const password = field["#password"].elem.value;
          return value == password;
        },
        errorMessage: "Mật khẩu xác nhận không khớp!",
      },
    ])
    .onSuccess((event) => {
      const password = event.target.password.value;

      const dataFinal = {
        password: password,
      };

      const buttonSubmit = document.querySelector(".inner-button-2 button");
      buttonSubmit.setAttribute("type", "button");

      fetch(`/${pathAdmin}/profile/change-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataFinal),
      })
        .then((res) => res.json())
        .then((data) => {
          buttonSubmit.setAttribute("type", "");
          if (data.code == "error") {
            notyf.error(data.message);
          }

          if (data.code == "success") {
            drawNotify(data.code, data.message);
            window.location.href = `/${pathAdmin}/profile/edit`;
          }
        });
    });
}
// End Profile Change Password Form

// Sider
const sider = document.querySelector(".sider");
if (sider) {
  const splitPathNameCurrent = location.pathname.split("/");

  const menuList = document.querySelectorAll("a");
  menuList.forEach((item) => {
    const splitHref = item.getAttribute("href").split("/");
    if (
      splitPathNameCurrent[1] == splitHref[1] &&
      splitPathNameCurrent[2] == splitHref[2]
    ) {
      item.classList.add("active");
    }
  });
}
// End sider

// Logout
const buttonLogout = document.querySelector(".sider .inner-logout");
if (buttonLogout) {
  buttonLogout.addEventListener("click", () => {
    fetch(`/${pathAdmin}/account/logout`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "error") {
          notyf.error(data.message);
        }

        if (data.code == "success") {
          drawNotify(data.code, data.message);
          window.location.href = `/${pathAdmin}/account/login`;
        }
      });
  });
}
// End logout

// Button Delete
const listButtonDelete = document.querySelectorAll("[button-delete]");
if (listButtonDelete.length > 0) {
  listButtonDelete.forEach((button) => {
    button.addEventListener("click", () => {
      const dataApi = button.getAttribute("data-api");

      fetch(dataApi, {
        method: "PATCH",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "error") {
            notyf.error(data.message);
          }

          if (data.code == "success") {
            drawNotify(data.code, data.message);
            window.location.reload();
          }
        });
    });
  });
}
// End Button Delete

// Filter Status
const filterStatus = document.querySelector("[filter-status]");
if (filterStatus) {
  const url = new URL(window.location.href);

  filterStatus.addEventListener("change", () => {
    const value = filterStatus.value;
    if (value) {
      url.searchParams.set("status", value);
    } else {
      url.searchParams.delete("status");
    }

    window.location.href = url.href;
  });

  // Default Option
  const valueCurrent = url.searchParams.get("status");
  if (valueCurrent) {
    filterStatus.value = valueCurrent;
  }
}
// End Filter Status

// Filter Created By
const filterCreatedBy = document.querySelector("[filter-created-by]");
if (filterCreatedBy) {
  const url = new URL(window.location.href);

  filterCreatedBy.addEventListener("change", () => {
    const value = filterCreatedBy.value;
    if (value) {
      url.searchParams.set("createdBy", value);
    } else {
      url.searchParams.delete("createdBy");
    }

    window.location.href = url.href;
  });

  // Default Option
  const valueCurrent = url.searchParams.get("createdBy");
  if (valueCurrent) {
    filterCreatedBy.value = valueCurrent;
  }
}
// End Filter Created By

// Filter Start Date
const filterStartDate = document.querySelector("[filter-start-date]");
if (filterStartDate) {
  const url = new URL(window.location.href);

  filterStartDate.addEventListener("change", () => {
    const value = filterStartDate.value;
    if (value) {
      url.searchParams.set("startDate", value);
    } else {
      url.searchParams.delete("startDate");
    }

    window.location.href = url.href;
  });

  // Default Option
  const valueCurrent = url.searchParams.get("startDate");
  if (valueCurrent) {
    filterStartDate.value = valueCurrent;
  }
}
// End Filter Start Date

// Filter End Date
const filterEndDate = document.querySelector("[filter-end-date]");
if (filterEndDate) {
  const url = new URL(window.location.href);

  filterEndDate.addEventListener("change", () => {
    const value = filterEndDate.value;
    if (value) {
      url.searchParams.set("endDate", value);
    } else {
      url.searchParams.delete("endDate");
    }

    window.location.href = url.href;
  });

  // Default Option
  const valueCurrent = url.searchParams.get("endDate");
  if (valueCurrent) {
    filterEndDate.value = valueCurrent;
  }
}
// End Filter End Date

// Filter Reset
const filterReset = document.querySelector("[filter-reset]");
if (filterReset) {
  const url = new URL(window.location.href);

  filterReset.addEventListener("click", () => {
    url.search = "";
    window.location.href = url.href;
  });
}
// End Filter Reset

// Check All
const checkAll = document.querySelector("[check-all]");
if (checkAll) {
  checkAll.addEventListener("click", () => {
    const listCheckItem = document.querySelectorAll("[check-item]");
    listCheckItem.forEach((item) => {
      item.checked = checkAll.checked;
    });
  });
}
// End Check All

// Change Multi
const changeMulti = document.querySelector("[change-multi]");
if (changeMulti) {
  const api = changeMulti.getAttribute("data-api");
  const select = changeMulti.querySelector("select");
  const button = changeMulti.querySelector("button");

  button.addEventListener("click", () => {
    const option = select.value;
    const listInputChecked = document.querySelectorAll("[check-item]:checked");

    if (option && listInputChecked.length > 0) {
      const ids = [];
      listInputChecked.forEach((input) => {
        const id = input.getAttribute("check-item");
        ids.push(id);
      });

      const dataFinal = {
        option: option,
        ids: ids,
      };

      const fetchApiChangeMulti = () => {
        fetch(api, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataFinal),
        })
          .then((res) => res.json())
          .then((data) => {
            drawNotify(data.code, data.message);
            window.location.reload();
          });
      };

      if (option == "destroy") {
        Swal.fire({
          title: "Bạn có chắc chắn muốn xóa?",
          text: "Hành động này của bạn sẽ không thể khôi phục lại.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Vẫn xóa",
          cancelButtonText: "Hủy",
        }).then((result) => {
          if (result.isConfirmed) {
            fetchApiChangeMulti();
          }
        });
      } else {
        fetchApiChangeMulti();
      }
    }
  });
}
// End Change Multi

// Search
const search = document.querySelector("[search]");
if (search) {
  const url = new URL(window.location.href);

  search.addEventListener("keyup", (event) => {
    if (event.code == "Enter") {
      const value = search.value;
      if (value) {
        url.searchParams.set("keyword", value);
      } else {
        url.searchParams.delete("keyword");
      }

      window.location.href = url.href;
    }
  });

  // Default Option
  const valueCurrent = url.searchParams.get("keyword");
  if (valueCurrent) {
    search.value = valueCurrent;
  }
}
// End Search

// Box Pagination
const boxPagination = document.querySelector("[box-pagination]");
if (boxPagination) {
  const url = new URL(window.location.href);

  boxPagination.addEventListener("change", () => {
    const value = boxPagination.value;
    if (value) {
      url.searchParams.set("page", value);
    } else {
      url.searchParams.delete("page");
    }

    window.location.href = url.href;
  });

  // Default Option
  const valueCurrent = url.searchParams.get("page");
  if (valueCurrent) {
    boxPagination.value = valueCurrent;
  }
}
// End Box Pagination

// Button Undo
const listButtonUndo = document.querySelectorAll("[button-undo]");
if (listButtonUndo.length > 0) {
  listButtonUndo.forEach((button) => {
    button.addEventListener("click", () => {
      const dataApi = button.getAttribute("data-api");

      fetch(dataApi, {
        method: "PATCH",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "error") {
            notyf.error(data.message);
          }

          if (data.code == "success") {
            drawNotify(data.code, data.message);
            window.location.reload();
          }
        });
    });
  });
}
// End Button Undo

// Button Destroy
const listButtonDestroy = document.querySelectorAll("[button-destroy]");
if (listButtonDestroy.length > 0) {
  listButtonDestroy.forEach((button) => {
    button.addEventListener("click", () => {
      Swal.fire({
        title: "Bạn có chắc chắn muốn xóa?",
        text: "Hành động này của bạn sẽ không thể khôi phục lại.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Vẫn xóa",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          const dataApi = button.getAttribute("data-api");

          fetch(dataApi, {
            method: "DELETE",
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.code == "error") {
                notyf.error(data.message);
              }

              if (data.code == "success") {
                drawNotify(data.code, data.message);
                window.location.reload();
              }
            });
        }
      });
    });
  });
}
// End Button Destroy

// Filter Role
const filterRole = document.querySelector("[filter-role]");
if (filterRole) {
  const url = new URL(window.location.href);

  filterRole.addEventListener("change", () => {
    const value = filterRole.value;
    if (value) {
      url.searchParams.set("role", value);
    } else {
      url.searchParams.delete("role");
    }

    window.location.href = url.href;
  });

  // Default Option
  const valueCurrent = url.searchParams.get("role");
  if (valueCurrent) {
    filterRole.value = valueCurrent;
  }
}
// End Filter Role

// Template Form
const templateForm = document.querySelector("#template-form");
if (templateForm) {
  const validator = new JustValidate("#template-form");

  validator.onSuccess((event) => {
    const dataSection4 = event.target.dataSection4.value;
    const dataSection6 = event.target.dataSection6.value;

    const dataFinal = {
      dataSection4: dataSection4,
      dataSection6: dataSection6,
    };

    const buttonSubmit = document.querySelector(".inner-button-2 button");
    buttonSubmit.setAttribute("type", "button");

    fetch(`/${pathAdmin}/template/edit`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataFinal),
    })
      .then((res) => res.json())
      .then((data) => {
        buttonSubmit.setAttribute("type", "");
        if (data.code == "error") {
          notyf.error(data.message);
        }

        if (data.code == "success") {
          drawNotify(data.code, data.message);
          window.location.reload();
        }
      });
  });
}
// End Template Form

// Button Copy Email
const listButtonCopy = document.querySelectorAll("[copy-email]");
if (listButtonCopy.length > 0) {
  listButtonCopy.forEach((button) => {
    button.addEventListener("click", () => {
      const email = button.getAttribute("data-email");
      navigator.clipboard.writeText(email).then(() => {
        notyf.success("Copy email thành công!");
      });

      const icon = button.querySelector("i");
      if (icon) {
        icon.classList.remove("fa-clipboard");
        icon.classList.add("fa-square-check");

        setTimeout(() => {
          icon.classList.remove("fa-square-check");
          icon.classList.add("fa-clipboard");
        }, 1000);
      }
    });
  });
}
// End Button Copy Email

// Filter Payment Method
const filterPaymentMethod = document.querySelector("[filter-payment-method]");
if (filterPaymentMethod) {
  const url = new URL(window.location.href);

  filterPaymentMethod.addEventListener("change", () => {
    const value = filterPaymentMethod.value;
    if (value) {
      url.searchParams.set("paymentMethod", value);
    } else {
      url.searchParams.delete("paymentMethod");
    }

    window.location.href = url.href;
  });

  // Default Option
  const valueCurrent = url.searchParams.get("paymentMethod");
  if (valueCurrent) {
    filterPaymentMethod.value = valueCurrent;
  }
}
// End Filter Payment Method

// Filter Payment Status
const filterPaymentStatus = document.querySelector("[filter-payment-status]");
if (filterPaymentStatus) {
  const url = new URL(window.location.href);

  filterPaymentStatus.addEventListener("change", () => {
    const value = filterPaymentStatus.value;
    if (value) {
      url.searchParams.set("paymentStatus", value);
    } else {
      url.searchParams.delete("paymentStatus");
    }

    window.location.href = url.href;
  });

  // Default Option
  const valueCurrent = url.searchParams.get("paymentStatus");
  if (valueCurrent) {
    filterPaymentStatus.value = valueCurrent;
  }
}
// End Filter Payment Status

// Filter Price
const filterPrice = document.querySelector("[filter-price]");
if (filterPrice) {
  const url = new URL(window.location.href);

  filterPrice.addEventListener("change", () => {
    const value = filterPrice.value;
    if (value) {
      url.searchParams.set("price", value);
    } else {
      url.searchParams.delete("price");
    }

    window.location.href = url.href;
  });

  // Default Option
  const valueCurrent = url.searchParams.get("price");
  if (valueCurrent) {
    filterPrice.value = valueCurrent;
  }
}
// End Filter Price

// Filter Category
const filterCategory = document.querySelector("[filter-category]");
if (filterCategory) {
  const url = new URL(window.location.href);

  filterCategory.addEventListener("change", () => {
    const value = filterCategory.value;
    if (value) {
      url.searchParams.set("categoryId", value);
    } else {
      url.searchParams.delete("categoryId");
    }

    window.location.href = url.href;
  });

  // Default Option
  const valueCurrent = url.searchParams.get("categoryId");
  if (valueCurrent) {
    filterCategory.value = valueCurrent;
  }
}
// End Filter Category
