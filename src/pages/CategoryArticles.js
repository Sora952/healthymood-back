
import React, { useState, useEffect } from 'react';
import useResourceCollection from '../hooks/useResourceCollection';
import useFormData from '../hooks/useFormData';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import API from '../services/API';
import '../Styles/Form.css';

function CategoryArticles () {
  const initialForm = ({
    name: ''
  });
  const { fields, setFields, handleFieldChange } = useFormData(initialForm);
  const { saveResource, newResourceIsSaving, newResourceSaveError, collection: categoryArticlesToShow, fetchCollectionError: fetchError, deleteResource } = useResourceCollection('/article_categories');

  const [categoryArticles, setcategoryArticles] = useState([categoryArticlesToShow]);
  const [totalCategoryArticles, setTotalCategoryArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const categoryArticlesPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const paginate = pageNumber => setCurrentPage(pageNumber);
  const pageNumbers = [];

  useEffect(() => {
    const fetchCategoryArticles = async () => {
      setLoading(true);
      const res = await API.get('/article_categories?per_page=' + categoryArticlesPerPage + '&page=' + currentPage);
      setcategoryArticles(res.data.data);
      setTotalCategoryArticles(res.data.total);
      setLoading(false);
    };
    fetchCategoryArticles();
  }, [currentPage, categoryArticlesToShow]);

  for (let i = 1; i <= Math.ceil(totalCategoryArticles / categoryArticlesPerPage); i++) { pageNumbers.push(i); }
  if (loading) { return <h2>Loading...</h2>; }

  const DeleteCategoryArticles = async (categoryArticles) => {
    if (window.confirm('Êtes vous sûr de vouloir supprimer cette catégorie d\'article?')) {
      deleteResource(categoryArticles.id, { optimistic: false });
    }
  };
  const SaveCategoryArticles = async (event) => {
    event.preventDefault();
    saveResource(fields, { optimistic: false });
    setFields(initialForm);
  };
  const fillForm = async categoryArticles => {
    setFields(categoryArticles);
  };
  if (fetchError) {
    return (
      <div>
        <p className='errorText'>Une erreur s'est produite lors de la récupération des catégories d'articles.</p>
      </div>
    );
  }
  if (!categoryArticlesToShow) return 'Chargement...';
  function Renderlist () {
    return (
      <>
        <h2>Catégorie d'articles</h2>
        <table className='render-list'>
          <thead>
            <tr>
              <td>Nom</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>

            {categoryArticles.map(t => {
              return (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td>
                    <EditOutlined className='edit-icon' onClick={() => fillForm(t)} />
                    <DeleteOutlined className='delete-icon' onClick={() => DeleteCategoryArticles(t)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <nav>
          <ul className='pagination'>
            {pageNumbers.map(number => (<li key={number}><Link onClick={() => paginate(number)} to='#' className='page-link'>{number}</Link></li>))}
          </ul>
        </nav>
      </>
    );
  }
  return (
    <>
      <div className='form-top'>
        <form className='form-inline' onSubmit={SaveCategoryArticles}>
          <input
            className='input-form-all'
            required
            name='name'
            id='name'
            minLength='3'
            placeholder="Nouvelle Catégorie d'article"
            value={fields.name}
            onChange={handleFieldChange}
          />
          <button
            className='form-button'
            onClick={SaveCategoryArticles}
            disabled={newResourceIsSaving || fields.name === ''}
          >
            Enregistrer
          </button>
          {newResourceSaveError && (
            <p className='errorText'>Une erreur lors de l'ajout de la catégorie</p>
          )}
        </form>
      </div>

      {Renderlist()}
    </>
  );
}

export default CategoryArticles;
