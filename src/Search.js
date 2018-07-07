import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import escapeRegExp from 'escape-string-regexp'
import Books, { BookCard, ButtonCont } from './Main'


class Search extends Component {

	/* classes constructor */
	constructor(props) {
		super(props);
		this.stopSearchfetch = false;
		this.counter = 0;
		this.optionsList = [
			{
				class: 'currentlyReading',
				title: 'Currently Reading'
			},
			{
				class: 'wantToRead',
				title: 'Want To Read',
			},
			{
				class: 'read',
				title: 'Already Read',
			},
			{
				class: 'none',
				title: 'None',
			},
			{
				class: 'moreInfo',
				title: 'Expand -->',
			},
		];
	}

	/* all required states of this component */
	state = {
		query: '',
		foundBooks: [],
		sortedBooks: [],
		expanded: false,
	}

	/* changes the query state based on the users input */
		changeQuery(letter) {
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

	/* fetches the search input from BooksAPI */
	checkBooks() {
		if (this.stopSearchfetch) {
			console.log('no new search fetches available');
			this.sortBooks();
			return;
		}
		BooksAPI.search(this.state.query).then(response => {
			console.log('new search fetch completed');
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

	/* handles the error if there are no books to fetch based on the input */
	handleError(t) {
		console.log('no new search fetches available');
		t.stopSearchfetch = true;
		t.sortBooks();
	}

	/* clears all of the data from the states of foundBooks and sortedBooks */
	clearBooks() {
		this.setState({
			foundBooks: [],
			sortedBooks: [],
		});
	}

	/* filters all of the fetched books based on the search input. Adds a book.shelf property */
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
		this.setState({
			foundBooks: resp,
		}, () => this.sortBooks());
	}

	/* sorts the books that best match the input */
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
			} else {
				sortedBooks = [];
			}
			this.setState({
				sortedBooks: sortedBooks,
			});
	}

	/* expands the options button on the book */
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

	/* changes the label of the book */
	changeLabel(book, checker) {
		if (book.shelf !== checker) {
			this.props.changeShelf(book, checker)
			if (checker === 'none') {
				const sorted = this.state.foundBooks.map(b => {
					if (b.id === book.id) {
						b.shelf = '';
						b.shelf = checker;
					}
					return b;
				});
				this.setState({
					foundBooks: sorted,
				}, () => {
					console.log('search books updated');
				});
			}
			console.log(book.shelf, book);
		}
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
						changeShelf={(book, checker) => this.changeLabel(book, checker)}
						view='search'
						optionsList={this.optionsList}
					/>
				</div>
			</div>
		)
	}
}

export default Search