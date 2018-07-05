import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import escapeRegExp from 'escape-string-regexp'
import Books, { BookCard, ButtonCont } from './Main'


class Search extends Component {
	constructor(props) {
		super(props);
		this.stopSearchfetch = false;
		this.counter = 0;
	}

	state = {
		query: '',
		foundBooks: [],
		sortedBooks: [],
		expanded: false,
	}

	expand(id, checker) {
		if (checker === false && this.state.expanded === false) {
			return;
		}
		if (this.state.expanded !== false) {
			this.setState({
				expanded: false,
			});
		} else {
			this.setState({
				expanded: id,
			});
		}
	}

	changeQuery(letter) {
		console.log(this.state.query.length);
		this.setState({
			query: letter.target.value.trim(),
		}, () => {
			if (this.state.query.length > 0) {
				this.checkBooks()
			} else if (this.state.query.length === 0) {
				this.clearBooks();
			}
		});
	}

	clearBooks() {
		this.setState({
			foundBooks: [],
			sortedBooks: [],
		});
	}

	filterBookResponse(response) {
		const resp = response.map(book => {
			book.shelf = '';
			book.shelf = 'none';
			this.props.allBooks.forEach(b => {
				if (book.id === b.id) {
					book.shelf = b.shelf;
				}
			});
			return book;
		});

		console.log(resp);

		this.setState({
			foundBooks: resp,
		}, () => this.sortBooks());
	}

	checkBooks() {
		if (this.stopSearchfetch) {
			this.sortBooks();
			return;
		}
		BooksAPI.search(this.state.query).then(response => {
			console.log(response);
			if (this.state.query.length === 0) {
				this.stopSearchfetch = false;
				return;
			}
			this.counter++;
			this.filterBookResponse(response);
		}).catch(() => {
			const t = this;
			this.handleError(t);
		});
	}

	handleError(t) {
		t.stopSearchfetch = true;
		t.sortBooks();
		console.log(t.stopSearchfetch);
	}

	addBook(book, checker) {
		BooksAPI.get(book.id).then(response => {
			console.log(response);
			BooksAPI.update(book, checker).then(response => {
				console.log(response);
			});
		});
	}

	sortBooks() {
			let sortedBooks;
			const results = this.state.foundBooks;
			const match = new RegExp(escapeRegExp(this.state.query), 'i');
			if (this.state.foundBooks.length > 0 && this.state.query.length > 0) {
				sortedBooks = results.filter(book => match.test(book.title));
				if (this.state.query.length === this.counter || this.state.query.length < this.counter) {
					this.counter = 0;
					this.stopSearchfetch = false;
				}
				console.log(this.stopSearchfetch);
			} else {
				sortedBooks = [];
			}
			this.setState({
				sortedBooks: sortedBooks,
			});
	}

	render() {
		return(
			<div>
				<div className='inputCont'>
					<input
						placeholder='search'
						type='text'
						className='inputField'
						onChange={(letter) => this.changeQuery(letter)}
					/>
				</div>
				<div className='bookResults' onClick={ev => this.expand(false, false)}>
					<BookCard
						currentCheck={this.state.sortedBooks}
						expanded={this.state.expanded}
						expand={(id) => this.expand(id)}
						changeShelf={(book, checker) => this.addBook(book, checker)}
						view='search'
					/>
				</div>
			</div>
		)
	}
}

export default Search