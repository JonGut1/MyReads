/* App.js */

import React, { Component } from 'react';
import './App.css';
import { Route } from 'react-router-dom'
import Main from './Main'
import * as BooksAPI from './BooksAPI'
import Header from './Header'
import Search from './Search'
import Deleted from './Deleted'
import MoreInfo from './MoreInfo'
import { createBrowserHistory as createHistory } from "history"

class App extends Component {
  constructor(props) {
    super(props);
    this.node = {
      id: '',
      target: '',
    };
    /* browser history create */
    this.history = createHistory(this.props);
  }

  /* all required states of this component */
  state = {
    allBooks: [],
    currentlyReading: [],
    wantToRead: [],
    read: [],
    recentlyDeleted: [],
    numberOfShelves: ['currentlyReading', 'wantToRead', 'read'],
    classNames: {
      id: '',
      action: '',
    },
    historyData: '',
    searchData: '',
    defaultUrl: '',
  }

  /* just after the component mounts all of the book are fetched */
  componentDidMount() {
    BooksAPI.getAll().then(response => {
      this.setState({
        allBooks: response,
      }, () => {
        console.log('received all my books');
      });
      this.sortBooks(response);

    });
  }

  /* sorts all of the received books into correct shelves based on individual book shelf */
  sortBooks(response) {
    response.forEach(book => {
      if (book.shelf !== 'none') {
        this.setState(current => ({
          [book.shelf]: current[book.shelf].concat([ book ])
        }));
      } else {
        this.changeShelf(book);
      }
    });
  }

  /* Changes the shelves depending on the selected option.
  * Function is responsible for the shelves changed from the !main! page.
  */
  changeShelf = (book, checker, e) => {
    this.node.target = e !== undefined ? e.target : 'search';
    this.node.id = book.id;
    if (checker === 'moreInfo') {
      return;
    }
    if (book.shelf !== checker && book.shelf) {
      if (checker === 'none') {
        this.changeClass(this.node, 'delete');
        this.timeout('delete', book.shelf, book, 'send');
      } else if (book.shelf === 'none') {
        this.changeClass(this.node, 'delete');
        const c = this.ultimateDelete('recentlyDeleted', book);
        if (checker === 'deletion') {
          return;
        }
        if (c === true) {
          this.timeout('insert', checker, this.bookChange(book, checker));
        } else {
          this.getBook(book, checker);
        }
      } else {
          this.changeClass(this.node, 'delete');
          this.timeout('delete', book.shelf, book);
          this.timeout('insert', checker, this.bookChange(book, checker));
      }
      this.updateBooks(book, checker);
    }
  }

  /* changes a book's shelf */
  bookChange(book, checker) {
    let bookShelf = book;
    bookShelf.shelf = checker;
    return bookShelf;
  }

  /* delete a book from a shelf */
  deleteBook(cont, book, check = null) {
    const deleted = (() => {
        const index = this.state[cont].indexOf(book);
        const delet = this.state[cont];
        delet.splice(index, 1);
        return delet;
    })();

    const deleteAllBooks = (() => {
        const index = this.state.allBooks.indexOf(book);
        const delet = this.state.allBooks;
        delet.splice(index, 1);
        return delet;
    })();
      if (check === 'send') {
        this.setState(state => ({
          [cont]: deleted,
          recentlyDeleted: state.recentlyDeleted.concat([ this.bookChange(book, 'none') ]),
          allBooks: deleteAllBooks,
        }), () => {
          console.log('book deleted');
        });
      } else {
        this.setState(state => ({
          [cont]: deleted,
          allBooks: deleteAllBooks,
        }), () => {
          console.log('book deleted');
        });
      }
  }

  /* deletes a book from the trashBin */
  ultimateDelete(cont, book) {
    let counter = 0;
    let bookCh;
    this.state.recentlyDeleted.forEach(bo => {
      if (bo.id === book.id) {
        bookCh = bo;
        counter++;
      }
    });
    if (counter !== 1) {
        return false;
    } else {
      const ultimateDelete = (() => {
          const index = this.state[cont].indexOf(bookCh);
          const delet = this.state[cont];
          delet.splice(index, 1);
          return delet;
      })();
        this.setState({
          recentlyDeleted: ultimateDelete,
        },() => {
          console.log('ultimate delete');
        });
      return true;
    }
  }

  /* insert a book */
  insertBook(cont, book) {
      this.setState(state => ({
        [cont]: state[cont].concat([ book ]),
        allBooks: state.allBooks.concat([ book ]),
      }), () => {
        console.log('book inserted');
      });
  }

  /* change book className */
  changeClass(e, type) {
    if (e === 'search') {
      return;
    }
      this.setState({
        classNames: {action: type, id: e.id},
      });
  }

  /* fetches a book from an api, selected in a search screen */
  getBook(book, checker) {
    BooksAPI.get(book.id).then(response => {
      console.log('received a new book');
      this.insertBook(checker, this.bookChange(book, checker));
    });
  }

  /* update function, updates a book in the api */
  updateBooks(book, checker) {
      BooksAPI.update(book, checker).then(response => {
        console.log('book api updated');
      });
  }

  /* saves the future pathname. The pathname that will soon be in the current url */
  saveHistory(pathname) {
    this.setState({
      historyData: pathname,
    });
  }

  /* saves the search query, and replaces an old pathname with a new pathname */
  saveSearch(query) {
    const url = `/search/query=?${query}`
    this.history.replace(url);
    this.setState({
      searchData: query,
    });
  }

  defaultUrl() {
    this.history.replace('/search');
  }

  /* synchronous timout function */
  timeout(func, parm1, parm2, parm3, duration = 300) {
    const t = this;
    if (func === 'delete') {
        setTimeout(() => {
          t.deleteBook(parm1, parm2, parm3);
        }, duration);
    }
    if (func === 'ultimateDelete') {
      setTimeout(() => {
          return t.ultimateDelete(parm1, parm2);
      }, duration);
    }
    if (func === 'insert') {
      setTimeout(() => {
        t.insertBook(parm1, parm2);
        setTimeout(() => {
          t.changeClass(this.node, 'insert');
        }, duration);
      }, duration);
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
            changeShelf={this.changeShelf}
            shelves={this.state.numberOfShelves}
            recentlyDeleted={this.state.recentlyDeleted}
            saveURL={(pathname) => this.saveHistory(pathname)}
            classNames={this.state.classNames}
            history={this.history}
            />
          </div>
        )}
        />
        <Route path='/search' render={() => (
          <div>
            <Header
            defaultUrl={() => this.defaultUrl()}/>
            <Search
            changeShelf={(book, checker) => this.changeShelf(book, checker)}
            allBooks={this.state.allBooks}
            addBooks={(book) => this.addBook(book)}
            shelves={this.state.numberOfShelves}
            recentlyDeleted={this.state.recentlyDeleted}
            getBook={(book, checker) => this.getBook(book, checker)}
            saveURL={(pathname) => this.saveHistory(pathname)}
            saveSearch={(search) => this.saveSearch(search)}
            history={this.history}
            />
          </div>
        )}
        />
        <Route path='/deleted' render={() => (
          <div>
            <Header/>
            <Deleted
              recentlyDeleted={this.state.recentlyDeleted}
              changeShelf={this.changeShelf}
            />
          </div>
        )}
        />
        <Route path='/moreinfo' render={() => (
          <div>
            <Header/>
            <MoreInfo
            history={this.history}
            historyData={this.state.historyData}
            />
          </div>
        )}
        />
      </div>
    );
  }
}

export default App;