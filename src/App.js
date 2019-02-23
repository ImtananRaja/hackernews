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

export default class App extends Component {

  constructor(props){
    super(props)

    this.state = {
      list: list,
      person: person,
    }

    this.onDismiss = this._onDismiss.bind(this)
  }

  _onDismiss(id) {
    const isNotId = (item) => {
      return item.objectID !== id
    }

    const updatedList = this.state.list.filter(isNotId)

    this.setState({ list: updatedList })
  }


  render() {

    const helloWorld = 'Welcome todse theade Rdoad tertao learn react';
    return (
      <div className="App">
        <h2>{helloWorld}</h2>
        <p>{this.state.person.name}</p>
        {
          //if you were to get the rid of the this.state
          //and then click dismiss button it wouldn't work
          //because the list it is using now is the const list not state 
          this.state.list.map(item => {
            return (
              <div key={item.objectID}>
                <span>
                  <a href={item.url}>{item.title}</a>
                </span>
                <span>{item.author}</span>
                <span>{item.num_comments}</span>
                <span>{item.points}</span>
                <span>
                  <button
                    onClick={() => this._onDismiss(item.objectID)}
                    type="button"
                  >
                    Dismiss
                  </button>
                </span>
              </div>
            )
          })
        }
      </div>
    )
  }
}
