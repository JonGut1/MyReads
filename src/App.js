import React, { Component } from 'react';
import './App.css';
import { Route } from 'react-router-dom'
import Main from './Main'
import * as BooksAPI from './BooksAPI'
import Header from './Header'
import Search from './Search'

class App extends Component {

  state = {
    allBooks: [],
    currentlyReading: [],
    wantToRead: [],
    read: [],
  }

  componentDidMount() {
    BooksAPI.getAll().then(response => {
      this.setState({
        allBooks: response,
      });
      this.sortBooks(response);
      console.log(this.state);
    });
  }

  sortBooks(response) {
    response.forEach(book => {
        this.setState(current => ({
          [book.shelf]: current[book.shelf].concat([ book ])
        }));
    });
  }

  changeShelf(book, checker) {
    if (book.shelf !== checker && book.shelf) {
      const index = this.state[book.shelf].indexOf(book);
      const copy = this.state[book.shelf];
      copy.splice(index, 1);

      const bookChange = book;
      bookChange.shelf = checker;
      if (checker === 'none') {
        this.setState(state => ({
          [book.shelf]: copy,
        }))
      } else {
        this.setState(state => ({
          [book.shelf]: copy,
          [checker]: state[checker].concat([ bookChange ]),
        }))
      }

      BooksAPI.update(book, checker).then(response => {
        console.log(response);
        console.log(this.state);
      });
    }
  }

  render() {
    return (
      <div>
        <Route exact path='/' render={() => (
          <div>
            <Header/>
            <Main
            allbooks={this.state.allBooks}
            currentlyReading={this.state.currentlyReading}
            wantToRead={this.state.wantToRead}
            read={this.state.read}
            changeShelf={(book, checker) => this.changeShelf(book, checker)}
            />
          </div>
        )}
        />
        <Route path='/search' render={() => (
          <div>
            <Header/>
            <Search
            changeShelf={(book, checker) => this.changeShelf(book, checker)}
            allBooks={this.state.allBooks}
            />
          </div>
        )}
        />
      </div>
    );
  }
}

export default App;
