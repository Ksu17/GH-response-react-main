import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/RepositoryPage.css'
import {Link, useParams} from "react-router-dom";
import {isMobile} from 'react-device-detect';


const RepositoryPage = () => {
  const [repository, setRepository] = useState(null);
  const [contributors, setContributors] = useState(null);
  const { owner, id } = useParams();


  useEffect(() => {
    const fetchRepository = async () => {
      try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${id}`);
        const contributors_response = await axios.get(response.data.contributors_url);
        setContributors(Array.from({length: contributors_response.data.length > 10 ? 10 : contributors_response.data.length}, (_, index)=>{
          if(index<10){
            return(
                contributors_response.data[index]
            )
          }
        }))
        setRepository(response.data);
      } catch (error) {
        setRepository({name:`Ошибка: ${error}`})
        console.error(error);
      }
    };

    fetchRepository();
  }, [id]);

  return (
    <div className='Container flexed'>
        <Link to='/'>
            <button
                className='backButton mainlabel Counter'>
                Назад
            </button>
        </Link>
      <div className='banner'>
        {repository ? (
            <>
              <div className='mainInfo'>
                <h1 className='mainlabel'>{repository.name}</h1>
                {repository.stargazers_count && <p className='mainlabel Counter'>{repository.stargazers_count}⭐</p>}
                {repository.updated_at && <p className='mainlabel Counter'>Последний коммит: {new Date(repository.updated_at).toLocaleDateString()}</p>}
              </div>
              {repository.owner && (
                  <div className='flexed mainInfo'>
                    {repository.owner.avatar_url && (
                        <img className='avatar' src={repository.owner.avatar_url} alt={repository.owner.login} />
                    )}
                    <a className='mainlabel ownerLink' href={repository.owner.html_url} target="_blank" rel="noopener noreferrer">
                      👨‍💻 {repository.owner.login}
                    </a>
                  </div>
              )}
              <div className='flexed mainInfo'>
                {repository.language && <p className='mainlabel Counter'>Язык: {repository.language}</p>}
                {repository.description && <p className='mainlabel Counter'>Описание: {repository.description}</p>}
              </div>
              {contributors && <div className='mainInfo'>
                <h5 className='mainlabel Counter'>Топ контрибутеров</h5>
                <div className='flexed mainInfo contributorsBox'>
                  {contributors.map((contributor, key)=>{
                    return(
                      <div className='flexed' style={{margin:'20px'}} key={key}>
                        <p className='miniName'>{contributor.login}</p>
                        <img className='miniAvatar' src={contributor.avatar_url} alt={contributor.login}/>
                        <p className='miniName'>Контрибуций: {contributor.contributions}</p>
                      </div>)
                  })}
                </div>
              </div>}
            </>
        ) : (
            <h1 className='mainlabel'>Загрузка...</h1>
        )}
      </div>
    </div>
  );
};

export default RepositoryPage;
