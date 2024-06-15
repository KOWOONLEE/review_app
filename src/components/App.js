import React, { useCallback, useEffect, useState } from "react";
import ReviewList from "./ReviewList";
import { getReviews, createReviews, updateReview, deleteReview } from "../api";
import ReviewForm from "./ReviewForm";
import useAsync from "./hooks/useAsync";
// import mockItems from "../mock.json";

const LIMIT = 6;

export default function App() {
  const [items, setItems] = useState([]);
  const [order, setOrder] = useState("createdAt");
  const [offset, setOffset] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const sortedItems = items.sort((a, b) => b[order] - a[order]); //프로퍼티 이름이 변수로 동적으로 결정될 때 사용. console.log(object[key]), 즉 여기서 key는 createdAt, rating 등등
  // const [isLoading, setIsLoading] = useState(false);
  // const [loadingError, setLoadingError] = useState(null);
  const [isLoading, loadingError, getReviewsAsync] = useAsync(getReviews);

  const handleClickCreatedAt = () => {
    setOrder("createdAt");
  };
  const handleClickRating = () => {
    setOrder("rating");
  };
  const handleDelete = async (id) => {
    const result = await deleteReview(id);
    if (!result) return;
    // const nextItems = items.filter((item) => item.id !== id);
    // setItems(nextItems);
    setItems((prevItems) => prevItems.filter((item) => item.id !== id)); //setter함수 비동기니까 콜백으로 사용
  };

  const handleLoad = useCallback(
    async (options) => {
      // let result;
      // try {
      //   setIsLoading(true);
      //   setLoadingError(null);
      //   result = await getReviews(options);
      // } catch (error) {
      //   setLoadingError(error);
      //   return;
      // } finally {
      //   setIsLoading(false);
      // }
      const result = await getReviewsAsync(options); //useAsync 만든 후 변경
      if (!result) return; //async함수에서 에러가 난 뒤에 값이 undefined이기 때문에

      const { paging, reviews } = result;
      if (options.offset === 0) {
        setItems(reviews);
      } else {
        // setItems([...items, ...reviews]);
        setItems((prevItems) => [...prevItems, ...reviews]); // 비동기 상황에서 state를 변경할 때 이전 state를 사용하려면 set함수에서 콜백을 사용해서 이전 state를 사용 -> 현재 시점의 state값 전달
      }
      setOffset(options.offset + reviews.length);
      setHasNext(paging.hasNext);
    },
    [getReviewsAsync]
  );
  useEffect(() => {
    handleLoad({ order, offset: 0, limit: LIMIT });
  }, [order, handleLoad]);

  const handleMore = () => {
    handleLoad({ order, offset, limit: LIMIT });
  };

  const handleCreateSuccess = (review) => {
    setItems((prevItems) => [review, ...prevItems]);
  };

  const handleUpdateSuccess = (review) => {
    //리뷰를 수정한 후 리스폰스로 도착한 데이터를 반영
    setItems((prevItems) => {
      const splitIdx = prevItems.findIndex((item) => item.id === review.id);
      return [
        ...prevItems.slice(0, splitIdx),
        review,
        ...prevItems.slice(splitIdx + 1),
      ];
    });
  };

  return (
    <div>
      <div>
        <button onClick={handleClickCreatedAt}>최신순</button>
        <button onClick={handleClickRating}>별점순</button>
      </div>
      <div>
        <ReviewForm
          onSubmit={createReviews}
          onSubmitSuccess={handleCreateSuccess}
        />
        <ReviewList
          items={sortedItems}
          onDelete={handleDelete}
          onUpdate={updateReview}
          onUpdateSuccess={handleUpdateSuccess}
        />
        {/* <button onClick={handleLoadClick}>불러오기</button> */}
        {hasNext && (
          <button disabled={isLoading} onClick={handleMore}>
            더보기
          </button>
        )}
      </div>
      {loadingError?.message && <span>{loadingError.message}</span>}
    </div>
  );
}
