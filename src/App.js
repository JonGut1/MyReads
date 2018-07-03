import React, { Component } from 'react';
import './App.css';
import { Route } from 'react-router-dom'
import Main from './Main'
import * as BooksAPI from './BooksAPI'
import Header from './Header'

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
      if (book.shelf === 'currentlyReading') {
        this.setState(current => ({
          currentlyReading: current.currentlyReading.concat([ book ])
        }));
      } else if (book.shelf === 'wantToRead') {
        this.setState(current => ({
          wantToRead: current.wantToRead.concat([ book ])
        }));
      } else if (book.shelf === 'read') {
        this.setState(current => ({
          read: current.read.concat([ book ])
        }));
      }
    });
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
            />
          </div>
        )}
        />
      </div>
    );
  }
}

export default App;
