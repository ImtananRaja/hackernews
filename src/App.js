import React, { Component } from 'react'
import './App.css'



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
      searchTerm: '',
    }

    //one way to bind to class
    this._onSearchChange = this._onSearchChange.bind(this)

    //this._onDismiss = this._onDismiss.bind(this)
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

  //another way to bing to the class
  _onDismiss = (id) => {
    const isNotId = (item) => (item.objectID !== id)
    const updatedList = this.state.list.filter(isNotId)
    this.setState({ list: updatedList})
  }

  showMe = () => {
    this.setState({ show: true })
  }

  hideMe = () => {
    this.setState({ show: false })
  }

  render() {
    const { person, list, searchTerm, show } = this.state
    const helloWorld = 'Welcome todse theade Rdoad tertao learn react';
    return (
      <div className="App">
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

        <Table
          list={list}
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
    <div>
      {
        list.filter(isSearched(pattern)).map(item =>
          <div key={item.objectID}>
            <span>
              <a href={item.url}>{item.title}</a>
            </span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
            <span>
              <Button onClick={() => _onDismiss(item.objectID)} className="dismiss">
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