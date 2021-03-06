import React from 'react'
import axios from 'axios';
import DeleteIcon from '@material-ui/icons/Delete';

const DeleteCategoryComponent = props => {
  const { categoryId, successCallback } = props;

  const deleteCategory = e => {
    axios
      .delete('http://localhost:8000/api/categories/' + categoryId, {
        withCredentials: true,
      })
      .then(res => {
        successCallback();
      })
      .catch();
  };
  return (
    <DeleteIcon
      aria-hidden='true'
      onClick={deleteCategory}
      style={{fontSize:24}}
    />
  )
}

export default DeleteCategoryComponent;

