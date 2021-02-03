import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import Container from '../components/Container';
import api from '../services/api';

 import { Loading ,Owner,IssuesList} from './styles';

export default class Repository extends Component {
  state = {
    repository: {},
    issues: [],
    loading: true,
  };

  async componentDidMount() {
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository)

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: 'open',
          per_page: 5,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  render() {
    const { repository, issues, loading } = this.state
    
    if(loading) {
      return <Loading>Carregando</Loading>
    }

    return (
      <>
<Container>
  <Owner>
    <Link to="/"> Voltar para repositórios</Link>
    <img src={repository.owner.avatar_url} alt={repository.owner.login} />
    <h1>{repository.name}</h1>
    <p>{repository.name}</p>
  </Owner>


<IssuesList>
  {issues.map( issues =>(
    <li key={String(issues.id)}>
      <img
       src={issues.user.avatar_url}
       alt={issues.user.login} 
       />
       <div>
         <strong>
           <a href={issues.html_url}>
             {issues.title}
           </a>
           {issues.labels.map(label => (
             <span key={String(label.id)}>{label.name}</span>
           ))}
         </strong>
         <p>{issues.user.login}</p>
       </div>
       </li>
  ))}
</IssuesList>
</Container>
      </>
    )
  }
}