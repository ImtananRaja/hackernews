import React, { Component } from 'react'
import { sortBy } from 'lodash'; 
import classNames from 'classnames'
import './App.css'

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase()); 


const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

const updateSearchStoriesState = (hits, page) => (prevState) => {
    const { searchKey, results } = prevState;

    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];

    const updatedHits = [
      ...oldHits,
      ...hits
    ];

    return {
      results: {
        ...results,
        [searchKey]: { 
          hits: updatedHits,
          page 
        },
      }, 
      isLoading: false,
    };
  };

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
      check: 'john',
      isLoading: false,
      sortKey: 'NONE',
      isSortReverse: false
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

  onSort = (sortKey) => {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse })
  }

  _setSearchStories(result) {
    const { hits, page } = result;
    this.setState(updateSearchStoriesState(hits, page));
  }

 
  componentDidMount() {
    this._isMounted = true;

    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm.toLowerCase() })
    this.fetchSearchTopStories(searchTerm);
  }

  onSearchSubmit = (event) => {
    const { searchTerm } = this.state;
    this.setState({ 
      searchKey: searchTerm.toLowerCase(),
      show: false,
      check: ''
     })

    if ( this.needsToSearchStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm)
    }

    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }

  whatAmI = (event) => {
    const { check, results } = this.state;
    if (results.hasOwnProperty(check)){
      this.setState({ show: true })
      if(event) { event.preventDefault()}
      return;
    }
    this.setState({ show: false })
    if(event) { event.preventDefault()}
    return;
  }

  _onSearchKeyChange = (event) => {
      this.setState({ check : event.target.value.toLowerCase() })
  }

  fetchSearchTopStories = (searchTerm, page = 0) => {
    this.setState({ isLoading: true })
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

  //showMe = () => {
  //  this.setState({ show: true })
  //}

  //hideMe = () => {
  //  this.setState({ show: false })
  //}

  render() {
    const { 
      results, 
      searchTerm, 
      searchKey, 
      error, 
      check, 
      show, 
      isLoading, 
      sortKey,
      isSortReverse
    } = this.state
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

          <Search
            onSubmit={this.whatAmI}
            onChange={this._onSearchKeyChange}
            value={check}
          >
            Search key
          </Search>
        </div>
          { error
            ? <div className="interactions">
                <p>Something went wrong.</p>
              </div>
            : show
            ? 
              <div className="interactions">
                <p>Key checked.</p>
              </div>
            :
            <Table
              list={list}
              sortKey={sortKey}
              onSort={this.onSort}
              _onDismiss={this._onDismiss}
              isSortReverse={isSortReverse}
            />
          }
        
        <div className="interactions">
        { isLoading
          ? <Loading />
          : <Button 
             onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
            >
            More
          </Button>
        }
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

const Table = ({ list, _onDismiss, sortKey, onSort, isSortReverse }) => {

  const sortedList = SORTS[sortKey](list);
  const reverseSortedList = isSortReverse
    ? sortedList.reverse()
    : sortedList;

  return (
    <div className="table">
      <div className="table-header">
        <span style={{ width: '40%' }}>
          <Sort
            sortKey={'TITLE'}
            onSort={onSort}
            activeSortKey={sortKey}
          >
            Title
          </Sort>
        </span>
        <span style={{ width: '30%' }}>
          <Sort
            sortKey={'AUTHOR'}
            onSort={onSort}
            activeSortKey={sortKey}
          >
          >
            Author
          </Sort>
        </span>
        <span style={{ width: '10%' }}>
          <Sort
            sortKey={'COMMENTS'}
            onSort={onSort}
            activeSortKey={sortKey}
          >
          >
            Comments
          </Sort>
        </span>
        <span style={{ width: '10%' }}>
          <Sort
            sortKey={'POINTS'}
            onSort={onSort}
            activeSortKey={sortKey}
          >
          >
            Points
          </Sort>
        </span>
        <span style={{ width: '10%' }}>
          Archive
        </span>
      </div>

      {
        reverseSortedList.map(item =>
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

const Loading = () =>{
  return <div>Loading...</div>
}


const Sort = ({ onSort, sortKey, children, activeSortKey }) => {
  const sortClass = classNames(
    'button-inline',
    { 'button-active': sortKey === activeSortKey }
  );

  return (
    <Button 
      onClick={() => onSort(sortKey)}
      className={sortClass}
    >
      {children}
    </Button>
  );
}