
// Завдання для цього компонента:
// Фільтри повинні формуватися на підставі завантажених даних
// Фільтри повинні відображати тільки потрібних героїв при виборі
// Активний фільтр має клас active
// Можна змінювати json-файл

import {useHttp} from '../../hooks/http.hook';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { filtersChanged, fetchFilters } from './filtersSlice';
import Spinner from '../spinner/Spinner';

const HeroesFilters = () => {

    const {filters, filtersLoadingStatus, activeFilter} = useSelector(state => state.filters);
    const dispatch = useDispatch();
    const {request} = useHttp();
    // Запит на сервер для отримання фільтрів і послідовної зміни стану
    useEffect(() => {
        dispatch(fetchFilters(request));

        // eslint-disable-next-line
    }, []);

    if (filtersLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Помилка загрузки</h5>
    }

    const renderFilters = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Фільтри не знайдені</h5>
        }

        // Дані в json-файлі я розширив класами і текстом
        return arr.map(({name, className, label}) => {

            // Використовуємо бібліотеку classnames і формуємо класи динамічно
            const btnClass = classNames('btn', className, {
                'active': name === activeFilter
            });
            
            return <button 
                        key={name} 
                        id={name} 
                        className={btnClass}
                        onClick={() => dispatch(filtersChanged(name))}
                        >{label}</button>
        })
    }

    const elements = renderFilters(filters);

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Пофільтруйте героїв по елементах</p>
                <div className="btn-group">
                    {elements}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;