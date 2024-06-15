import { useState } from "react";
import "./ReviewForm.css";
import FileInput from "./\bFileInput";
import RatingInput from "./RatingInput";
import useAsync from "./hooks/useAsync";

const INITIAL_VALUES = {
  title: "",
  rating: 0,
  content: "",
  imgFile: null,
};
function ReviewForm({
  initailValues = "INITIAL_VALUES",
  onSubmitSuccess,
  onCancel,
  imgPreview,
  onSubmit,
}) {
  // const [title, setTitle] = useState("");
  // const [rating, setRating] = useState(0);
  // const [content, setContent] = useState("");

  const [values, setValues] = useState(initailValues);
  // const [isSubmitting, setIsSubmitting] = useState(false);
  // const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, submitError, createReviewsAsync] = useAsync(onSubmit);

  // const handleTitleChange = (e) => {
  //   setTitle(e.target.value);
  // };
  // const handleRatingChange = (e) => {
  //   const nextRating = Number(e.target.value) || 0;
  //   setRating(nextRating);
  // };
  // const handleContentChange = (e) => {
  //   setContent(e.target.value);
  // };

  const handleChange = (name, value) => {
    setValues((prevValues) => ({ ...prevValues, [name]: value })); //[프로퍼티 네임] : value값 / 자바스크립트에서 화살표함수가 객체를 반환활때 객체 리터럴을 소괄호로 감싸야함 안그러면 중괄호를 함수 본문으로 해석함.
  }; //name과 value값으로 실행

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("rating", values.rating);
    formData.append("content", values.content);
    formData.append("imgFile", values.imgFile);
    // let result;
    // try {
    //   setSubmitError(null);
    //   setIsSubmitting(true);
    //   result = await onSubmit(formData); //원래 createReview함수였는데 prop으로 다른 함수 내리기 위해 수정
    // } catch (error) {
    //   setSubmitError(error);
    //   return;
    // } finally {
    //   setIsSubmitting(false);
    // }
    const result = await createReviewsAsync(formData); //useAsync 만든 후 변경
    if (!result) return; //async함수에서 에러가 난 뒤에 리턴 값이 undefined이기 때문에

    const { review } = result;
    onSubmitSuccess(review); //작성 및 수정 완료 후 리스폰스가 도착한 데이터를 반영
    setValues(INITIAL_VALUES);
  };
  return (
    <div>
      <form className="reviewForm" onSubmit={handleSubmit}>
        <FileInput
          imgPreview={imgPreview}
          name="imgFile"
          value={values.imgFile}
          onChange={handleChange}
        />
        <input name="title" value={values.title} onChange={handleInputChange} />
        <RatingInput
          name="rating"
          type="number"
          value={values.rating}
          onChange={handleChange}
        />
        <textarea
          name="content"
          value={values.content}
          onChange={handleInputChange}
        />
        <button type="submit" disabled={isSubmitting}>
          확인
        </button>
        {onCancel && <button onClick={onCancel}>취소</button>}
        {submitError?.message && <div>{submitError.message}</div>}
      </form>
    </div>
  );
}

export default ReviewForm;
