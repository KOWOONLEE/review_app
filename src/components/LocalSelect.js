import React from "react";
import { useLocale, useSetLocale } from "../context/LocaleContext";

export default function LocaleSelect() {
  const locale = useLocale();
  const setLocale = useSetLocale();
  const handleChange = (e) => {
    setLocale(e.target.value);
  };
  return (
    <div>
      <select value={locale} onChange={handleChange}>
        <option value="ko">한국어</option>
        <option value="en">영어</option>
      </select>
    </div>
  );
}
