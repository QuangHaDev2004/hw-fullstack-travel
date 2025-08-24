// Notyf
var notyf = new Notyf({
  duration: 3000,
  position: {
    x: "right",
    y: "top",
  },
});

let existNotify = sessionStorage.getItem("notify");
if (existNotify) {
  existNotify = JSON.parse(existNotify);
  if (existNotify.code == "error") {
    notyf.error(existNotify.message);
  }

  if (existNotify.code == "success") {
    notyf.success(existNotify.message);
  }

  sessionStorage.removeItem("notify");
}

const drawNotify = (code, message) => {
  sessionStorage.setItem(
    "notify",
    JSON.stringify({
      code: code,
      message: message,
    })
  );
};
// End Notyf