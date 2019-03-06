import React, { Component } from 'react'
import './App.css'

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

//const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

const list = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  }
]

const person = {
  name: 'John',
  age: 34,
  food: 'Chicken'
}

const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase()); 

export default class App extends Component {

  constructor(props){
    super(props)

    this.state = {
      list: list,
      person: person,
      show: false,
      searchTerm: DEFAULT_QUERY,
      result: null,
    }

    this._setSearchStories = this._setSearchStories.bind(this);

    //one way to bind to class
    this._onSearchChange = this._onSearchChange.bind(this)

    //this._onDismiss = this._onDismiss.bind(this)
  }

  _setSearchStories(result) {
    this.setState({ result })
  }

  componentDidMount() {
    const { searchTerm } = this.state;

    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
    .then(data => data.json())
    .then(result => this._setSearchStories(result))
    .then(error => error)
  }

  //_onDismiss(id) {
  //  const isNotId = (item) => {
  //    return item.objectID !== id
  //  }
  //  const updatedList = this.state.list.filter(isNotId)
  //  this.setState({ list: updatedList })
  //}

  _onSearchChange(event) {
    this.setState({ searchTerm : event.target.value })
  }

  //another way to bind to the class
  _onDismiss = (id) => {
    const isNotId = (item) => (item.objectID !== id)
    const updatedHits = this.state.result.hits.filter(isNotId)
    //this.setState({ result: Object.assign({}, this.state.result, { hits: updatedHits }) })
    this.setState({ 
      result: { ...this.state.result, hits: updatedHits } 
    })
  }

  showMe = () => {
    this.setState({ show: true })
  }

  hideMe = () => {
    this.setState({ show: false })
  }

  render() {
    const { result, searchTerm, show } = this.state
    const helloWorld = 'Welcome todse theade Rdoad tertao learn react';
    if (!result) { return null }
    return (
      <div className="page">
        <div className="interactions">
          <h2>{helloWorld}</h2>
          <p>{person.name}</p>
          <Search
            value={searchTerm}
            onChange={this._onSearchChange}
            testing="Hello"
          >
            //The children only holds jsx
            Search
          </Search>
        </div>
        <Table
          list={result.hits}
          pattern={searchTerm}
          _onDismiss={this._onDismiss}
        />
      </div>
    )
  }
}


const Search = ({ children, value, onChange }) => {
  return (
    <form>
      {children} <input
        type="text"
        value={value}
        onChange={onChange}
      />
    </form>
  );
}

const Table = ({ list, _onDismiss, pattern }) => {
  return (
    <div className="table">
      {
        list.filter(isSearched(pattern)).map(item =>
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