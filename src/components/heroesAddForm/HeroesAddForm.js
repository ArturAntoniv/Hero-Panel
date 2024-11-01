

// Завдання для цього компонента:
// 1) Реалізувати створення нового героя із введеними даними. Він має потрапляти у загальний стан і відображатися у списку + фільтруватися.
// Унікальний ідентифікатор персонажа можна згенерувати через uiid
// Ускладнене завдання:
// 2) Персонаж створюється в файлі json за допомогою методу POST
// Додатково:
// Елементи <option></option> бажано сформувати на базі даних із фільтрів


import {useHttp} from '../../hooks/http.hook';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { heroCreated } from '../heroesList/heroesSlice';

const HeroesAddForm = () => {
    // Стани для контролю форми
    const [heroName, setHeroName] = useState('');
    const [heroDescr, setHeroDescr] = useState('');
    const [heroElement, setHeroElement] = useState('');

    const {filters, filtersLoadingStatus} = useSelector(state => state.filters);
    const dispatch = useDispatch();
    const {request} = useHttp();

    // Отримую фільтри з JSON-файлу для подальшого використання в <option></option>


    // Обробка події для отримання даних
    const onSubmitHandler = (e) => {
        e.preventDefault();
        // Можна зробити й однакові назви станів,
        // хотів показати вам трохи наочніше
        // Генерація id через бібліотеку
        const newHero = {
            id: uuidv4(),
            name: heroName,
            description: heroDescr,
            element: heroElement
        }

        // Додавання нового героя до JSON-файлу
        // Надсилаємо дані на сервер у форматі JSON
        // ТІЛЬКИ якщо запит успішний - відправляємо персонажа в store
        request("http://localhost:3001/heroes", "POST", JSON.stringify(newHero))
            .then(res => console.log(res, 'Відправка успішна'))
            .then(dispatch(heroCreated(newHero)))
            .catch(err => console.log(err));

        // Очищаємо форму після відправлення
        setHeroName('');
        setHeroDescr('');
        setHeroElement('');
    }


    const renderFilters = (filters, status) => {
        if (status === "loading") {
            return <option>Загрузка елементів</option>
        } else if (status === "error") {
            return <option>Помилка загрузки</option>
        }
        
        // Якщо фільтри є, то рендеримо іх
        if (filters && filters.length > 0 ) {
            return filters.map(({name, label}) => {
                // Один із фільтрів нам тут не потрібен
                // eslint-disable-next-line
                if (name === 'all')  return;

                return <option key={name} value={name}>{label}</option>
            })
        }
    }



    return (
        <form className="border p-4 shadow-lg rounded" onSubmit={onSubmitHandler}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Імя нового героя</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Як моє імя?"
                    value={heroName}
                    onChange={(e) => setHeroName(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Опис</label>
                <textarea
                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="Що я вмію?"
                    style={{ height: '130px' }}
                    value={heroDescr}
                    onChange={(e) => setHeroDescr(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Вибрати елемент героя</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    name="element"
                    value={heroElement}
                    onChange={(e) => setHeroElement(e.target.value)}>
                    <option value="">Я володію елементом...</option>
                    {renderFilters(filters, filtersLoadingStatus)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Створити</button>
        </form>
    );
}

export default HeroesAddForm;
