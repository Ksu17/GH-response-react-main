import React, {useEffect, useState} from 'react';
import '../styles/Paginator.css'
import {fetchGithubRepositories} from "../API/fetchGithubRepositories";
import {useSearch} from "../../hooks/use-search";
import {setPage, setStatus} from "../../store/slices/userSlices";
import {useDispatch} from "react-redux";
import {isMobile} from 'react-device-detect';
import {Link} from "react-router-dom";

const Paginator = ({ objects, pages }) => {
    const [repositories, setRepositories] = useState([])
    const {search, status, page} = useSearch();

    const currentObjects = repositories.slice(0, 10);
    
    const dispatch = useDispatch();

    const ChangePage = async (pageNumber,perPage = 10, searchstroke = search) => {
        dispatch(setPage({page:pageNumber}))
        setRepositories([])
        dispatch(setStatus({status:'Загружаем следущую страницу...'}));
        try{
            const {items, totalPages} = await fetchGithubRepositories(perPage, searchstroke, pageNumber)
            setRepositories(items);
            if (items.length === 0) {
                dispatch(setStatus({status:'Ничего не найдено или страница неисправна!'}));
            }
        } catch (error) {
            dispatch(setStatus({status:'Произошла ошибка в странице =('}));
        }
    };

    const RenderButtons = (pages, current) => {
        if (pages < 11) {
            return Array.from({length: pages > 11 ? 10 : pages}, (_, index) =>
                <button
                    className={index + 1 === page ? 'pagerButton picked' : 'pagerButton'}
                    key={index}
                    onClick={() => ChangePage(index + 1)}
                >
                    {index + 1}
                </button>
            )
        } else {
            if (current < 5) {
                return Array.from({length: 10}, (_, index) => {
                    const refactoredIndex = index + pages-9;
                    if(index<5){
                        return (
                            <button
                                className={index + 1 === current ? 'pagerButton picked' : 'pagerButton'}
                                key={index}
                                onClick={() => ChangePage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        )
                    } else if (index > 5 && refactoredIndex < pages-2) {
                        return (
                            <button
                                className='pagerButton'
                                key={index}
                            >
                                {'...'}
                            </button>
                        )
                    } else if(index > 5 && refactoredIndex >= pages-3){
                        return (
                            <button
                                className='pagerButton'
                                key={index}
                                onClick={() => ChangePage(refactoredIndex)}
                            >
                                {refactoredIndex}
                            </button>
                        )
                    }
                });
            } else if (current >= 5 && current <= pages-4) {
                return Array.from({length: 10}, (_, index) => {
                    const refactoredIndex = index + pages-9;
                    if(index<2){
                        return (
                            <button
                                className='pagerButton'
                                key={index}
                                onClick={() => ChangePage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        )
                    } else if (index === 2) {
                        return (
                            <button
                                className='pagerButton'
                                key={index}
                            >
                                {'...'}
                            </button>
                        )
                    } else if(index > 2 && index < 7){
                        if(index === 3){
                            return(<button
                                className='pagerButton'
                                key={index}
                                onClick={() => ChangePage(current - 1)}
                            >
                                {current-1}
                            </button>)
                        } else if(index === 4){
                            return(<button
                                className='pagerButton picked'
                                key={index}
                                onClick={() => ChangePage(current)}
                            >
                                {current}
                            </button>)
                        } else if (index === 5){
                            return(<button
                                className='pagerButton'
                                key={index}
                                onClick={() => ChangePage(current+1)}
                            >
                                {current+1}
                            </button>)
                        } else if (index === 6) {
                            return (<button
                                className='pagerButton'
                                key={index}
                                onClick={() => ChangePage(current+2)}
                            >
                                {current+2}
                            </button>)
                        }
                    }else if(index === 7){
                        return (
                            <button
                                className='pagerButton'
                                key={index}
                            >
                                {'...'}
                            </button>
                        )
                    }else if(index > 7 && refactoredIndex >= pages-1){
                        return (
                            <button
                                className='pagerButton'
                                key={index}
                                onClick={() => ChangePage(refactoredIndex)}
                            >
                                {refactoredIndex}
                            </button>
                        )
                    }
                });
            } else if (current >= pages-5) {
                return Array.from({length: 10}, (_, index) => {
                    const refactoredIndex = index + pages-9;
                    if(index<2){
                        return (
                            <button
                                className={index + 1 === current ? 'pagerButton picked' : 'pagerButton'}
                                key={index}
                                onClick={() => ChangePage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        )
                    } else if (index === 3) {
                        return (
                            <button
                                className='pagerButton'
                                key={index}
                            >
                                {'...'}
                            </button>
                        )
                    } else if(index > 4 && refactoredIndex >= pages-5){
                        return (
                            <button
                                className={refactoredIndex === current ? 'pagerButton picked' : 'pagerButton'}
                                key={index}
                                onClick={() => ChangePage(refactoredIndex)}
                            >
                                {refactoredIndex}
                            </button>
                        )
                    }
                });
            }
        }
    }

    useEffect(() => {
        setRepositories(objects.slice(0, 10));
    }, [objects]);

    return (
        <div style={isMobile ? {width:'90%'} : {}} className='flexed PagBox'>
            {currentObjects.map((object) => (
                <div className='reposBlock' key={object.id}>
                    <div className='repTop'>
                        <Link to={`/repository/${object.owner.login}/${object.name}`} className='repText repName'>{object.name}</Link>
                        <p className='repText'>{object.stargazers_count}⭐</p>
                    </div>
                    <p className='repText'>Последний коммит: {new Date(object.pushed_at).toLocaleDateString("en-GB")+' '+new Date(object.pushed_at).toLocaleTimeString("en-GB")}</p>
                    <a target='_blank' className='repText repLink' href={object.html_url}>🔗Ссылка на репозиторий</a>
                </div>
            ))}

            <div className='PagButtons'>
                {/*может здесь понадобится длинну проверять по objects*/}
                {currentObjects.length > 0 ?
                    RenderButtons(pages, page).map((pageNumber,key) => (
                        <span key={key}>{pageNumber}</span>
                    )) :
                    <p className='statusRole'>
                        {status}
                    </p>}
            </div>
        </div>
    );
};

export default Paginator;