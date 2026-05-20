import "../../public/scss/main.scss";
import "photoswipe/style.css";
import "react-range-slider-input/dist/style.css";
import "../../public/css/image-compare-viewer.min.css";
import ShopClientShell from "./ShopClientShell";

export default function ShopLayout({ children }) {
  return <ShopClientShell>{children}</ShopClientShell>;
}
