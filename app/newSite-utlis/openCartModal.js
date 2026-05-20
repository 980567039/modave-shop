export const openCartModal = () => {
  const bootstrap = require("bootstrap"); // dynamically import bootstrap
  const modalElements = document.querySelectorAll(".modal.show");
  modalElements.forEach((modal) => {
    const modalInstance = bootstrap.Modal.getInstance(modal);
    if (modalInstance) {
      modalInstance.hide();
    }
  });

  // Close any open offcanvas
  const offcanvasElements = document.querySelectorAll(".offcanvas.show");
  offcanvasElements.forEach((offcanvas) => {
    const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvas);
    if (offcanvasInstance) {
      offcanvasInstance.hide();
    }
  });
  var myModal = new bootstrap.Modal(document.getElementById("shoppingCart"), {
    keyboard: false,
  });

  myModal.show();
  document
    .getElementById("shoppingCart")
    .addEventListener("hidden.bs.modal", () => {
      myModal.hide();
    });
};
