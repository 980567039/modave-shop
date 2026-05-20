import { useEffect } from "react";

export default function LayoutHandler({
  activeLayout,
  setActiveLayout,
  hasSidebar = false,
}) {
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200 && window.innerWidth > 767) {
        setActiveLayout((pre) => (pre > 3 ? 3 : pre));
      } else if (window.innerWidth < 768) {
        setActiveLayout((pre) => (pre > 2 ? 2 : pre));
      }
    };
    handleResize();
    // Add the resize event listener
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array ensures this runs only once

  return (
    <>
      <li
        className={`tf-view-layout-switch sw-layout-list list-layout ${
          activeLayout == 1 ? "active" : ""
        }`}
        onClick={() => setActiveLayout(1)}
        data-value-layout="list"
      >
        <div className="item">
          <svg
            className="icon"
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx={3} cy={6} r="2.5" stroke="#181818" />
            <rect
              x="7.5"
              y="3.5"
              width={12}
              height={5}
              rx="2.5"
              stroke="#181818"
            />
            <circle cx={3} cy={14} r="2.5" stroke="#181818" />
            <rect
              x="7.5"
              y="11.5"
              width={12}
              height={5}
              rx="2.5"
              stroke="#181818"
            />
          </svg>
        </div>
      </li>
      <li
        className={`tf-view-layout-switch sw-layout-2 ${
          activeLayout == 2 ? "active" : ""
        }`}
        onClick={() => setActiveLayout(2)}
        data-value-layout="tf-col-2"
      >
        <div className="item">
          <svg
            className="icon"
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx={6} cy={6} r="2.5" stroke="#181818" />
            <circle cx={14} cy={6} r="2.5" stroke="#181818" />
            <circle cx={6} cy={14} r="2.5" stroke="#181818" />
            <circle cx={14} cy={14} r="2.5" stroke="#181818" />
          </svg>
        </div>
      </li>
      <li
        className={`tf-view-layout-switch sw-layout-3 ${
          activeLayout == 3 ? "active" : ""
        }`}
        onClick={() => setActiveLayout(3)}
        data-value-layout="tf-col-3"
      >
        <div className="item">
          <svg
            className="icon"
            width={22}
            height={20}
            viewBox="0 0 22 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx={3} cy={6} r="2.5" stroke="#181818" />
            <circle cx={11} cy={6} r="2.5" stroke="#181818" />
            <circle cx={19} cy={6} r="2.5" stroke="#181818" />
            <circle cx={3} cy={14} r="2.5" stroke="#181818" />
            <circle cx={11} cy={14} r="2.5" stroke="#181818" />
            <circle cx={19} cy={14} r="2.5" stroke="#181818" />
          </svg>
        </div>
      </li>
      <li
        className={`tf-view-layout-switch sw-layout-4 ${
          activeLayout == 4 ? "active" : ""
        }`}
        onClick={() => setActiveLayout(4)}
        data-value-layout="tf-col-4"
      >
        <div className="item">
          <svg
            className="icon"
            width={30}
            height={20}
            viewBox="0 0 30 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx={3} cy={6} r="2.5" stroke="#181818" />
            <circle cx={11} cy={6} r="2.5" stroke="#181818" />
            <circle cx={19} cy={6} r="2.5" stroke="#181818" />
            <circle cx={27} cy={6} r="2.5" stroke="#181818" />
            <circle cx={3} cy={14} r="2.5" stroke="#181818" />
            <circle cx={11} cy={14} r="2.5" stroke="#181818" />
            <circle cx={19} cy={14} r="2.5" stroke="#181818" />
            <circle cx={27} cy={14} r="2.5" stroke="#181818" />
          </svg>
        </div>
      </li>
      {!hasSidebar ? (
        <li
          className={`tf-view-layout-switch sw-layout-5 ${
            activeLayout == 5 ? "active" : ""
          }`}
          onClick={() => setActiveLayout(5)}
          data-value-layout="tf-col-5"
        >
          <div className="item">
            <svg
              className="icon"
              width={38}
              height={20}
              viewBox="0 0 38 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx={3} cy={6} r="2.5" stroke="#181818" />
              <circle cx={11} cy={6} r="2.5" stroke="#181818" />
              <circle cx={19} cy={6} r="2.5" stroke="#181818" />
              <circle cx={27} cy={6} r="2.5" stroke="#181818" />
              <circle cx={35} cy={6} r="2.5" stroke="#181818" />
              <circle cx={3} cy={14} r="2.5" stroke="#181818" />
              <circle cx={11} cy={14} r="2.5" stroke="#181818" />
              <circle cx={19} cy={14} r="2.5" stroke="#181818" />
              <circle cx={27} cy={14} r="2.5" stroke="#181818" />
              <circle cx={35} cy={14} r="2.5" stroke="#181818" />
            </svg>
          </div>
        </li>
      ) : (
        ""
      )}
    </>
  );
}
