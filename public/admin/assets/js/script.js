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
  })

  listSchedule.addEventListener("click", (e) => {
    // Đóng / Mở
    if (e.target.closest(".inner-more")) {
      const item = e.target.closest(".inner-schedule-item");
      item.classList.toggle("hidden");
    }

    // Xóa
    if (e.target.closest(".inner-remove")) {
      const item = e.target.closest(".inner-schedule-item");
      const totalItem = listSchedule.querySelectorAll(".inner-schedule-item").length;
      if (totalItem > 1) {
        listSchedule.removeChild(item);
      }
    }
  })

  // Kéo thả
  new Sortable(listSchedule, {
    handle: '.inner-move', // handle's class
    animation: 150,
    onStart: (event) => {
      console.log(event);
      const textarea = event.item.querySelector(".inner-schedule-body textarea");
      const id = textarea.id;
      tinymce.get(id).remove();
    },
    onEnd: (event) => {
      const textarea = event.item.querySelector(".inner-schedule-body textarea");
      const id = textarea.id;
      initTinyMCE(`#${id}`);
    },
  });
}
// End Section 8

// Filepond
const listFilePondImage = document.querySelectorAll("[filepond-image]");
if (listFilePondImage.length > 0) {
  listFilePondImage.forEach(FilePondImage => {
    FilePond.registerPlugin(
      FilePondPluginFileValidateType,
      FilePondPluginImagePreview,
      FilePondPluginImageCrop,
      FilePondPluginImageResize,
    );

    FilePond.create(FilePondImage,
      {
        labelIdle: "+",
        imageCropAspectRatio: '1:1',
        imageResizeTargetWidth: 150,
        imageResizeTargetHeight: 150,
      }
    );
  })
}
// End Filepond

// Chart 1
const char1 = document.querySelector("#chart1");
if (char1) {
  new Chart(char1, {
    type: "line",
    data: {
      labels: ["01", "02", "03", "04", "05"],
      datasets: [
        {
          label: "Tháng 5/2025",
          data: ["500000", "2000000", "1200000", "1400000", "400000"],
          borderColor: "#36A2EB",
          borderWidth: 1.5
        },
        {
          label: "Tháng 6/2025",
          data: ["800000", "1600000", "1800000", "900000", "1000000"],
          borderColor: "#FF7D98",
          borderWidth: 1.5
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          position: "bottom"
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: "Ngày"
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: "Doanh thu (VNĐ)"
          }
        }
      },
      maintainAspectRatio: false
    }
  })
}
// End Chart 1

// Category Create Form
const categoryCreateForm = document.querySelector("#category-create-form");
if (categoryCreateForm) {
  const validator = new JustValidate("#category-create-form");

  validator
    .addField("#name", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập tên danh mục!"
      }
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      console.log(name);
    });
}
// End Category Create Form

// Tour Create Form
const tourCreateForm = document.querySelector("#tour-create-form");
if (tourCreateForm) {
  const validator = new JustValidate("#tour-create-form");

  validator
    .addField("#name", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập tên tour!"
      }
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      console.log(name);
    });
}
// End Tour Create Form

// Order Edit Form
const orderEditForm = document.querySelector("#order-edit-form");
if (orderEditForm) {
  const validator = new JustValidate("#order-edit-form");

  validator
    .addField("#name", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập họ tên!"
      },
      {
        rule: 'minLength',
        value: 5,
        errorMessage: "Họ tên phải có ít nhất 5 ký tự!"
      },
      {
        rule: 'maxLength',
        value: 50,
        errorMessage: "Họ tên không được vượt quá 50 ký tự!"
      }
    ])
    .addField("#phone", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập số điện thoại!"
      },
      {
        rule: 'customRegexp',
        value: /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-6|8|9]|9[0-9])[0-9]{7}$/,
        errorMessage: "Số điện thoại không đúng định dạng!"
      },
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      const phone = event.target.phone.value;
      console.log(name);
      console.log(phone);
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
        errorMessage: "Vui lòng nhập tên website!"
      },
    ])
    .addField("#email", [
      {
        rule: "email",
        errorMessage: "Email không đúng định dạng!"
      }
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      console.log(name);
    });
}
// End Website Info Form

// Account Admin Create Form
const accountAdminCreateForm = document.querySelector("#account-admin-create-form");
if (accountAdminCreateForm) {
  const validator = new JustValidate("#account-admin-create-form");

  validator
    .addField("#name", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập họ tên!"
      },
      {
        rule: 'minLength',
        value: 5,
        errorMessage: "Họ tên phải có ít nhất 5 ký tự!"
      },
      {
        rule: 'maxLength',
        value: 50,
        errorMessage: "Họ tên không được vượt quá 50 ký tự!"
      }
    ])
    .addField("#email", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập email của bạn!"
      },
      {
        rule: "email",
        errorMessage: "Email không đúng định dạng!"
      }
    ])
    .addField("#phone", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập số điện thoại!"
      },
      {
        rule: 'customRegexp',
        value: /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-6|8|9]|9[0-9])[0-9]{7}$/,
        errorMessage: "Số điện thoại không đúng định dạng!"
      },
    ])
    .addField("#position", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập chức vụ!"
      }
    ])
    .addField("#password", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập mật khẩu!"
      },
      {
        rule: 'minLength',
        value: 8,
        errorMessage: "Họ tên phải có ít nhất 8 ký tự!"
      },
      {
        validator: (value) => {
          const regex = /[\s]/;
          const result = !regex.test(value);
          return result;
        },
        errorMessage: "Mật khẩu không được chứa khoảng trắng!"
      },
      {
        validator: (value) => {
          const regex = /[A-Z]/;
          const result = regex.test(value);
          return result;
        },
        errorMessage: "Mật khẩu phải chứa ký tự viết hoa!"
      },
      {
        validator: (value) => {
          const regex = /[a-z]/;
          const result = regex.test(value);
          return result;
        },
        errorMessage: "Mật khẩu phải chứa ký tự viết thường!"
      },
      {
        validator: (value) => {
          const regex = /[0-9]/;
          const result = regex.test(value);
          return result;
        },
        errorMessage: "Mật khẩu phải chứa chữ số!"
      },
      {
        validator: (value) => {
          const regex = /[^a-zA-Z0-9\s]/;
          const result = regex.test(value);
          return result;
        },
        errorMessage: "Mật khẩu phải chứa ký tự đặc biệt!"
      },
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      const email = event.target.email.value;
      const phone = event.target.phone.value;
      const position = event.target.position.value;
      const password = event.target.password.value;
      console.log(name);
      console.log(email);
      console.log(phone);
      console.log(position);
      console.log(password);
    });
}
// End Account Admin Create Form

// Role Create Form
const roleCreateForm = document.querySelector("#role-create-form");
if (roleCreateForm) {
  const validator = new JustValidate("#role-create-form");

  validator
    .addField("#name", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập nhóm quyền!"
      }
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      console.log(name);
    });
}
// End Role Create Form

// Profile Edit Form
const profileEditForm = document.querySelector("#profile-edit-form");
if (profileEditForm) {
  const validator = new JustValidate("#profile-edit-form");

  validator
    .addField("#name", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập họ tên!"
      },
      {
        rule: 'minLength',
        value: 5,
        errorMessage: "Họ tên phải có ít nhất 5 ký tự!"
      },
      {
        rule: 'maxLength',
        value: 50,
        errorMessage: "Họ tên không được vượt quá 50 ký tự!"
      }
    ])
    .addField("#email", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập email của bạn!"
      },
      {
        rule: "email",
        errorMessage: "Email không đúng định dạng!"
      }
    ])
    .addField("#phone", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập số điện thoại!"
      },
      {
        rule: 'customRegexp',
        value: /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-6|8|9]|9[0-9])[0-9]{7}$/,
        errorMessage: "Số điện thoại không đúng định dạng!"
      },
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      const email = event.target.email.value;
      const phone = event.target.phone.value;
      console.log(name);
      console.log(email);
      console.log(phone);
    });
}
// End Profile Edit Form

// Profile Change Password Form
const profileChangePasswordForm = document.querySelector("#profile-change-password-form");
if (profileChangePasswordForm) {
  const validator = new JustValidate("#profile-change-password-form");

  validator
    .addField("#password", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập mật khẩu!"
      },
      {
        rule: 'minLength',
        value: 8,
        errorMessage: "Họ tên phải có ít nhất 8 ký tự!"
      },
      {
        validator: (value) => {
          const regex = /[\s]/;
          const result = !regex.test(value);
          return result;
        },
        errorMessage: "Mật khẩu không được chứa khoảng trắng!"
      },
      {
        validator: (value) => {
          const regex = /[A-Z]/;
          const result = regex.test(value);
          return result;
        },
        errorMessage: "Mật khẩu phải chứa ký tự viết hoa!"
      },
      {
        validator: (value) => {
          const regex = /[a-z]/;
          const result = regex.test(value);
          return result;
        },
        errorMessage: "Mật khẩu phải chứa ký tự viết thường!"
      },
      {
        validator: (value) => {
          const regex = /[0-9]/;
          const result = regex.test(value);
          return result;
        },
        errorMessage: "Mật khẩu phải chứa chữ số!"
      },
      {
        validator: (value) => {
          const regex = /[^a-zA-Z0-9\s]/;
          const result = regex.test(value);
          return result;
        },
        errorMessage: "Mật khẩu phải chứa ký tự đặc biệt!"
      },
    ])
    .addField("#confirmPassword", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập xác nhận mật khẩu!"
      },
      {
        validator: (value, field) => {
          const password = field["#password"].elem.value;
          return value == password
        },
        errorMessage: "Mật khẩu xác nhận không khớp!"
      }
    ])
    .onSuccess((event) => {
      const password = event.target.password.value;
      console.log(password);
    });
}
// End Profile Change Password Form