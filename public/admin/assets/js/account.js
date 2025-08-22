// Login Form
const loginForm = document.querySelector("#login-form");
if (loginForm) {
  const validator = new JustValidate("#login-form");

  validator
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
    .addField('#password', [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập mật khẩu!"
      },
      {
        rule: "minLength",
        value: 8,
        errorMessage: "Mật khẩu phải chứa ít nhất 8 ký tự!"
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
      const email = event.target.email.value;
      const password = event.target.password.value;
      const rememberPassword = event.target.rememberPassword.checked;
      console.log(email);
      console.log(password);
      console.log(rememberPassword);
    })
}
// End Login Form

// Register Form 
const registerForm = document.querySelector("#register-form");
if (registerForm) {
  const validator = new JustValidate("#register-form");

  validator
    .addField("#fullname", [
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
      },
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
    .addField('#password', [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập mật khẩu!"
      },
      {
        rule: "minLength",
        value: 8,
        errorMessage: "Mật khẩu phải chứa ít nhất 8 ký tự!"
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
    .addField("#agree", [
      {
        rule: "required",
        errorMessage: "Bạn phải đồng ý với các điều khoản và điều kiện!"
      }
    ])
    .onSuccess((event) => {
      const fullname = event.target.fullname.value;
      const email = event.target.email.value;
      const password = event.target.password.value;
      const agree = event.target.agree.checked;
      console.log(fullname);
      console.log(email);
      console.log(password);
      console.log(agree);
    })
}
// End Register Form 

// Forgot Password Form
const forgotPasswordForm = document.querySelector("#forgot-password-form");
if (forgotPasswordForm) {
  const validator = new JustValidate("#forgot-password-form");

  validator
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
    .onSuccess((event) => {
      const email = event.target.email.value;
      console.log(email);
    })
}
// End Forgot Password Form

// OTP Password Form
const otpPasswordForm = document.querySelector("#otp-password-form");
if(otpPasswordForm) {
  const validator = new JustValidate("#otp-password-form");

  validator
    .addField("#otp", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập mã OTP!"
      }
    ])
    .onSuccess((event) => {
      const otp = event.target.otp.value;
      console.log(otp);
    })
}
// End OTP Password Form

// Reset Password Form
const resetPasswordForm = document.querySelector("#reset-password-form");
if(resetPasswordForm) {
  const validator = new JustValidate("#reset-password-form");

  validator
    .addField('#password', [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập mật khẩu!"
      },
      {
        rule: "minLength",
        value: 8,
        errorMessage: "Mật khẩu phải chứa ít nhất 8 ký tự!"
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
        errorMessage: "Vui lòng nhập mật khẩu xác nhận!"
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
    })
} 
// End Reset Password Form 