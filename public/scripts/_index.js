//PayPal Code

let items = 0;

const item = {
  name: "",
  quantity: "",
  unit_amount: {
    currency_code: "",
    value: "",
  },
};

// items: [
//   {
//     name: "Red Bull",
//     quantity: "2",
//     unit_amount: {
//       currency_code: "BRL",
//       value: "50.00",
//     },
//   },
function changeCart() {
  items++;
  console.log(items);
}

document.addEventListener("DOMContentLoaded", function () {
  // paypal
  //   .Buttons({
  //     onInit(data, actions) {
  //       actions.disable();
  //       if (items > 0) {
  //         actions.enable();
  //       }
  //     },
  //     onClick(actions) {},
  //   })
  //   .render("#paypal-btn-container");
});
