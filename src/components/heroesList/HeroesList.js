

// Завдання для цього компонента: 
// При кліці на «хрестик» відбувається видалення персонажа із загального стану
// Ускладнене завдання:
// Видалення йде і з json файлу за допомогою методу DELETE


import {useHttp} from '../../hooks/http.hook';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup} from 'react-transition-group';
import { createSelector } from '@reduxjs/toolkit';

import { heroDeleted, fetchHeroes } from './heroesSlice';

import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

import './heroesList.scss';


const HeroesList = () => {
    //Використовую бібліотеку reselect
    // для мемоізації селекторів і зменшення ререндеру якщо данні не змінились
    const filteredHeroesSelector = createSelector(
        (state) => state.filters.activeFilter,
        (state) => state.heroes.heroes,
        (filter, heroes) => {
            if (filter === 'all') {
                return heroes;
            } else {
                return heroes.filter(item => item.element === filter);
            }
        }
    );


    const filteredHeroes = useSelector(filteredHeroesSelector);
    const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(fetchHeroes());
        // eslint-disable-next-line
    }, []);


        // Функція бере id і за ним видаляє непотрібного персонажа з store
        // ТІЛЬКИ якщо запит на видалення пройшов успішно

        const onDelete = useCallback((id) => {
        // Видалення персонажа за його id
        request(`http://localhost:3001/heroes/${id}`, "DELETE")
            .then(data => console.log(data, 'Deleted'))
            .then(dispatch(heroDeleted(id)))
            .catch(err => console.log(err));
        // eslint-disable-next-line  
    }, [request]);

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Помилка загрузки</h5>
    }



    //Цей фрагмент коду відповідає за відображення списку героїв у компоненті. Використовую анімацію
    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return (
                <CSSTransition
                    timeout={0}
                    classNames="hero">
                    <h5 className="text-center mt-5">Героїв поки нема</h5>
                </CSSTransition>
            )
        }

        return arr.map(({id, ...props}) => {
            return (
                <CSSTransition 
                    key={id}
                    timeout={500}
                    classNames="hero">
                    <HeroesListItem  {...props} onDelete={() => onDelete(id)}/>
                </CSSTransition>
            )
        })
    }

    const elements = renderHeroesList(filteredHeroes);
    return (
        <TransitionGroup component="ul">
            {elements}
        </TransitionGroup>
    )
}

export default HeroesList;





//------------------------------------------------------------------------------------
