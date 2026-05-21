"use client";
import React, { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
const languageOptions = [
  { id: "en", labelKey: "english" },
  { id: "zh", labelKey: "chinese" },
];

export default function LanguageSelect({
  parentClassName = "image-select center style-default type-languages",
  topStart = false,
}) {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("language");
  const [selected, setSelected] = useState(
    languageOptions.find((option) => option.id === locale) || languageOptions[0]
  );
  const [isDDOpen, setIsDDOpen] = useState(false);
  const languageSelect = useRef();

  useEffect(() => {
    setSelected(languageOptions.find((option) => option.id === locale) || languageOptions[0]);
  }, [locale]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        languageSelect.current &&
        !languageSelect.current.contains(event.target)
      ) {
        setIsDDOpen(false); // Close the dropdown if click is outside
      }
    };
    // Add the event listener when the component mounts
    document.addEventListener("click", handleClickOutside);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    setSelected(option);
    setIsDDOpen(false);
    document.cookie = `NEXT_LOCALE=${option.id}; path=/; max-age=31536000; SameSite=Lax`;
    localStorage.setItem("NEXT_LOCALE", option.id);
    router.refresh();
  };

  return (
    <>
      <div
        className={`dropdown bootstrap-select ${parentClassName}  dropup `}
        onClick={() => setIsDDOpen((pre) => !pre)}
        ref={languageSelect}
      >
        <select
          className="image-select center style-default type-languages"
          tabIndex="null"
        >
          {languageOptions.map((option, i) => (
            <option key={i} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          tabIndex={-1}
          className={`btn dropdown-toggle btn-light  ${
            isDDOpen ? "show" : ""
          } `}
        >
            <div className="filter-option">
              <div className="filter-option-inner">
              <div className="filter-option-inner-inner">{t(selected.labelKey)}</div>
            </div>
          </div>
        </button>
        <div
          className={`dropdown-menu ${isDDOpen ? "show" : ""} `}
          style={{
            maxHeight: "899.688px",
            overflow: "hidden",
            minHeight: 0,
            position: "absolute",
            inset: topStart ? "" : "auto auto 0px 0px",
            margin: 0,
            transform: `translate(0px, ${topStart ? 22 : -20}px)`,
          }}
          data-popper-placement={`${!topStart ? "top" : "bottom"}-start`}
        >
          <div
            className="inner show"
            style={{
              maxHeight: "869.688px",
              overflowY: "auto",
              minHeight: 0,
            }}
          >
            <ul
              className="dropdown-menu inner show"
              role="presentation"
              style={{ marginTop: 0, marginBottom: 0 }}
            >
              {languageOptions.map((elm, i) => (
                <li
                  key={i}
                  onClick={() => handleSelect(elm)}
                  className={`selected ${selected == elm ? "active" : ""}`}
                >
                  <a
                    className={`dropdown-item ${
                      selected == elm ? "active selected" : ""
                    }`}
                  >
                    <span className="text">{t(elm.labelKey)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
