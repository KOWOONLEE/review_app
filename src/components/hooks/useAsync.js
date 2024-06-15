import { useCallback, useState } from "react";

function useAsync(asyncFunction) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  const wrappedFunction = useCallback(
    async (...args) => {
      try {
        setError(null);
        setPending(true);
        return await asyncFunction(...args);
      } catch (error) {
        setError(error);
        return;
      } finally {
        setPending(false);
      }
    },
    [asyncFunction]
  );
  return [pending, error, wrappedFunction]; //로딩상태, 에러, 콜백을 실행할수 있는 함수를 배열 형태로 리턴
}
export default useAsync;
