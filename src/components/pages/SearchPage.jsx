import React, {useEffect, useState} from 'react';
import Paginator from "../UI/Paginator";
import '../styles/SearchPage.css'
import {useDispatch} from "react-redux";
import {useSearch} from "../../hooks/use-search";
import {setPage, setSearch, setSearchSafer, setStatus} from "../../store/slices/userSlices";
import {fetchGithubRepositories} from "../API/fetchGithubRepositories";
import {isMobile} from 'react-device-detect';

const SearchPage = () => {
  const [repositories, setRepositories] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const dispatch = useDispatch();
  const SearchQ = useSearch();


    useEffect( ()=>{
        if(SearchQ.searchSafer){
            dispatch(setStatus({status:'Поиск сохранён'}))
            fetchRepositories(10, SearchQ.search, SearchQ.page)
        } else {
            dispatch(setStatus({status:'Давайте начнём поиск!'}))
            dispatch(setPage({page:1}))
        }
    },[])

    const fetchRepositories = async (perPage, search = SearchQ.search, page = 1) => {
        setRepositories([]);
        dispatch(setStatus({status:'Ищем...'}));
        if(!SearchQ.searchSafer){
            dispatch(setPage({page:1}))
        }
        try{
            const {items, ReducedTotalPages} = await fetchGithubRepositories(perPage, search, page)
            setRepositories(items);
            setTotalPages(ReducedTotalPages);
            if (items.length === 0) {
                dispatch(setStatus({status:'Ничего не найдено!'}));
            }
        } catch (error) {
            dispatch(setStatus({status:'Произошла ошибка =('}));
        }

    };


    return (
    <div className='Container flexed'>
      <div className='banner'>
          <h1 className='mainlabel'>Github Dashboard</h1>
          <div className='searchLine' style={isMobile ? {width:'100%'} : {}}>
              <input
                  type="text"
                  value={SearchQ.search}
                  onChange={(e)=>{
                      dispatch(setSearch({search:String(e.target.value)}))
                      dispatch(setPage({page:1}))
                  }}
                  placeholder="Поиск по репозиториям..."
                  className='searchbox'
                  style={isMobile ? {padding: '10px 50% 10px 10px'} : {}}
                  onKeyDown={(e)=>{ if (e.key === 'Enter') {
                      fetchRepositories(10);
                  }}}
              />
              <button className='searchbutton' onClick={()=>{fetchRepositories(10)}}>Поиск Github</button>
          </div>
          <div className='SafeHndlr'>
              <label className="toggler-wrapper style-1" style={{marginRight:'5px'}}>
                  <input
                      type="checkbox"
                      checked={SearchQ.searchSafer}
                      onChange={(e)=>{
                          dispatch(setSearchSafer({searchSafer: e.target.checked}))
                      }}
                  />
                  <div className="toggler-slider">
                      <div className="toggler-knob"></div>
                  </div>
              </label>
              <div className="mainlabel Counter">Сохранять поиск</div>
          </div>
      </div>
      <Paginator objects={repositories} pages={totalPages}/>
    </div>
  );
};

export default SearchPage;
