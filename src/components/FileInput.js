import { useEffect, useRef, useState } from "react";

export default function FileInput({ name, value, onChange, imgPreview }) {
  const [preview, setPreview] = useState(imgPreview);
  const inputRef = useRef();
  const handleChange = (e) => {
    const nextValues = e.target.files[0];
    onChange(name, nextValues);
  };
  const handleClearClick = () => {
    const inputNode = inputRef.current;
    if (!inputNode) return;

    inputNode.value = "";
    onChange(name, null);
  };

  useEffect(() => {
    if (!value) return;
    const nextPreview = URL.createObjectURL(value);
    setPreview(nextPreview);

    return () => {
      //사이드이펙트 정리함수 // 위의 사이드이펙트가 필요없는 시점에 정리
      setPreview(imgPreview);
      URL.revokeObjectURL(nextPreview);
    };
  }, [value, imgPreview]);
  return (
    <div>
      <img src={preview} alt="이미지 미리보기" />
      <input
        type="file"
        onChange={handleChange}
        ref={inputRef}
        accept="image/png, image/jpeg"
      />
      {value && <button onClick={handleClearClick}>X</button>}
    </div>
  );
}
