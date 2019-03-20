import React, { Component } from 'react'
import './App.css'

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase()); 

export default class App extends Component {
  _isMounted = false;
  
  constructor(props){
    super(props)

    this.state = {
      show: false,
      searchTerm: DEFAULT_QUERY,
      searchKey: '',
      results: null,
      error: null,
    }

    this._setSearchStories = this._setSearchStories.bind(this);
    this.needsToSearchStories = this.needsToSearchStories.bind(this);
    //one way to bind to class
    this._onSearchChange = this._onSearchChange.bind(this)

    //this._onDismiss = this._onDismiss.bind(this)
  }

  needsToSearchStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  _setSearchStories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;

    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];

    const updatedHits = [
      ...oldHits,
      ...hits
    ];

    this.setState({ 
      results: {
        ...results,
        [searchKey]: { hits: updatedHits,
          page 
        }
      } 
    })
  }

  componentDidMount() {
    this._isMounted = true;

    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm })
    this.fetchSearchTopStories(searchTerm);
  }

  onSearchSubmit = (event) => {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm })

    if ( this.needsToSearchStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm)
    }

    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }

  fetchSearchTopStories = (searchTerm, page = 0) => {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result =>  this._isMounted && this._setSearchStories(result))
      .catch(error => this._isMounted && this.setState({ error }));
  }

  _onSearchChange(event) {
    this.setState({ searchTerm : event.target.value })
  }

  //another way to bind to the class
  _onDismiss = (id) => {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = (item) => (item.objectID !== id)
    const updatedHits = hits.filter(isNotId)
    //this.setState({ result: Object.assign({}, this.state.result, { hits: updatedHits }) })
      //object spread operator used here, because of the complex result object
    this.setState({ 
      results: {
        ...results,
        [searchKey]: { 
          hits: updatedHits,
          page 
        }
      }
    })
  }

  showMe = () => {
    this.setState({ show: true })
  }

  hideMe = () => {
    this.setState({ show: false })
  }

  render() {
    const { results, searchTerm, searchKey, error } = this.state
    const page = (
      results &&
      results[searchKey] &&
      results[searchKey].page
      ) || 0;

    const list = (
      results &&
      results[searchKey] &&
      results[searchKey].hits
    ) || [];

    if (error) { return <p>Something went wrong.</p>; }
    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this._onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            //The children only holds jsx
            Search
          </Search>
        </div>
          { error
            ? <div className="interactions">
              <p>Something went wrong.</p>
            </div>
            : <Table
              list={list}
              _onDismiss={this._onDismiss}
            />
          }
        
        <div className="interactions">
          <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
            More
          </Button>
        </div>
      </div>
    )
  }
}


const Search = ({ children, value, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={value}
        onChange={onChange}
      />
      <button type="submit">
        {children}
      </button>
    </form>
  );
}

const Table = ({ list, _onDismiss }) => {
  return (
    <div className="table">
      {
        list.map(item =>
          <div key={item.objectID} className="table-row">
            <span style={{ width: '40%'}}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={{ width: '30%'}}>{item.author}</span>
            <span style={{ width: '10%'}}>{item.num_comments}</span>
            <span style={{ width: '10%'}}>{item.points}</span>
            <span style={{ width: '10%'}}>
              <Button 
                onClick={() => _onDismiss(item.objectID)} 
                className="button-inline"
              >
                Dismiss
              </Button>  
            </span>
          </div>
        )
      }
    </div>
  );
}

const Button = ({ children, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={className}
      type="button">
      {children}
    </button>
  );
}