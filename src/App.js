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

/* all required states of this component */
  state = {
    allBooks: [],
    currentlyReading: [],
    wantToRead: [],
    read: [],
    recentlyDeleted: [],
    numberOfShelves: ['currentlyReading', 'wantToRead', 'read'],
    currentBook: [],
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
    this.listenHistory();
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

/* changes the shelves depending on the selected option.
* Function is responsible for the shelves changed from the !main! page.
*/
  changeShelf(book, checker) {
    console.log(book);
    if (checker === 'moreInfo') {
      this.setCurrentBook(book);
      return;
    }
    console.log(this.state.bookChange);
    if (book.shelf !== checker && book.shelf) {
      if (checker === 'none') {
        this.deleteBook(book.shelf, book, 'send');
      } else if (book.shelf === 'none') {
        const c =  this.ultimateDelete('recentlyDeleted', book);
        if (checker === 'deletion') {
          return;
        }
        console.log(c);
        if (c === true) {
          this.insertBook(checker, this.bookChange(book, checker));
        } else {
          this.getBook(book, checker);
        }
      } else {
        this.deleteBook(book.shelf, book);
        this.insertBook(checker, this.bookChange(book, checker));
      }
      this.updateBooks(book, checker);
    }
  }

  /* sets the current book */
  setCurrentBook(book) {
    this.setState({
      currentBook: book,
    });
  }

/* changes a book's shelf */
  bookChange(book, checker) {
    let bookShelf = book;
    bookShelf.shelf = checker;
    console.log(book.shelf, checker);
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
      console.log(bo.id === book.id);
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

  history = createHistory(this.props);

  listenHistory() {
    this.history.listen((location) => {
      console.log(location);
    });
  }

  pushHistory(pathname) {
    console.log(pathname);
    console.log(this.history);
    this.history.push(pathname);
  }

  pushSearch(query) {
    this.history.push({
      pathname: '/search',
      search: `?=${query}`
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
            changeShelf={(book, checker) => this.changeShelf(book, checker)}
            shelves={this.state.numberOfShelves}
            recentlyDeleted={this.state.recentlyDeleted}
            updateUrl={(pathname, action) => this.pushHistory(pathname, action)}
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
            addBooks={(book) => this.addBook(book)}
            getBook={(book, checker) => this.getBook(book, checker)}
            updateUrl={this.pushSearch}
            />
          </div>
        )}
        />
        <Route path='/deleted' render={() => (
          <div>
            <Header/>
            <Deleted
              recentlyDeleted={this.state.recentlyDeleted}
              changeShelf={(book, checker) => this.changeShelf(book, checker)}
            />
          </div>
        )}
        />
        <Route path='/moreinfo' render={() => (
          <div>
            <Header/>
            <MoreInfo
            currentBook={this.state.currentBook}
            history={this.history}
            />
          </div>
        )}
        />
      </div>
    );
  }
}

export default App;
