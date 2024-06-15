import React, { useState } from "react";
import "./ReviewList.css";
import Rating from "./Rating";
import ReviewForm from "./ReviewForm";

function formatDate(value) {
  const date = new Date(value);
  return `${date.getFullYear()}.${date.getMonth()}. ${date.getDate()}`;
}
function ReviewListItem({ item, onDelete, onEdit }) {
  const handleDeleteClick = () => onDelete(item.id);

  const handleEditClick = () => {
    onEdit(item.id);
  };

  return (
    <div className="reviewListItem">
      <img className="reviewListItemImg" src={item.imgUrl} alt={item.title} />
      <div>
        <h1>{item.title}</h1>
        <Rating value={item.rating} />
        <p>{formatDate(item.createdAt)}</p>
        <p>{item.content}</p>
        <button onClick={handleEditClick}>수정</button>
        <button onClick={handleDeleteClick}>삭제</button>
      </div>
    </div>
  );
}

export default function ReviewList({
  items,
  onDelete,
  onUpdate,
  onUpdateSuccess,
}) {
  const [editingId, setEditingId] = useState(null);

  const handleCancel = () => {
    setEditingId(null);
  };
  return (
    <div>
      <ul>
        {items.map((item) => {
          if (item.id === editingId) {
            const { id, imgUrl, title, rating, content } = item;
            const initailValues = { title, rating, content };

            const handleSubmit = (formData) => onUpdate(id, formData);
            const handleSubmitSuccess = (review) => {
              onUpdateSuccess(review);
              setEditingId(null);
            };
            return (
              <li key={item.id}>
                <ReviewForm
                  initailValues={initailValues}
                  imgPreview={imgUrl}
                  onCancel={handleCancel}
                  onSubmit={handleSubmit}
                  onSubmitSuccess={handleSubmitSuccess}
                />
              </li>
            );
          }
          return (
            <li key={item.id}>
              <ReviewListItem
                item={item}
                onDelete={onDelete}
                onEdit={setEditingId}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
