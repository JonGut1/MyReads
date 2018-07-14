/* Search.js */

import React, { Component } from 'react'
import * as BooksAPI from './BooksAPI'
import escapeRegExp from 'escape-string-regexp'
import { BookCard } from './Main'
import './Search.css';


/* input component responsible for the search input field */
function InputCont(props) {
	return (
		<div className='inputCont'>
			<input
				placeholder='search'
				type='text'
				className='inputField'
				onChange={(letter) => props.changeQuery(letter)}
				value={props.query}
			/>
		</div>
	)
}

/*
* Search component. It is here where the route is redirected. And from this component
* the search page is built.
*/
class Search extends Component {
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

	/*
	* functions executed just after component mounts
	*/
	componentDidMount() {
		this.initialSetUp();
	}

	/* all required states of this component */
	state = {
		query: '',
		foundBooks: [],
		sortedBooks: [],
		expanded: false,
	}

	/*
	* sets the query value based on the url
	*/
	initialSetUp() {
		let query = '';
		const que = this.props.history.location.search.split('?');
		if (que[1]) {
			if (que[1].includes('%')) {
			const qu = que[1].split('%');
			query = qu[0];
			} else {
				query = que[1].split(' ')[0];
			}
		}
		this.setState({
			query: query,
		}, () => {
			if (this.state.query && this.state.query.length > 0) {
				this.checkBooks();
			}
		});
	}

	/* changes the query state based on the users input */
	changeQuery(letter) {
		this.setState({
			query: letter.target.value,
		}, () => {
			if (this.state.query.length > 0) {
				this.checkBooks()
			} else if (this.state.query.length === 0) {
				this.clearBooks();
			}
			this.props.saveSearch(this.state.query);
		});
	}

	/* fetches the search input from BooksAPI */
	checkBooks() {
		if (this.stopSearchfetch) {
			console.log('no new search fetches available');
			this.sortBooks();
			return;
		}
		BooksAPI.search(this.state.query.trim()).then(response => {
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

	/* expands the options button on the book card */
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
	changeLabel(book, checker, e) {
		if (book.shelf !== checker) {
			this.props.changeShelf(book, checker, e)
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
		}
	}

	render() {
		return(
			<div>
				<InputCont query={this.state.query} changeQuery={(letter) => this.changeQuery(letter)}/>
				<div className='bookResults' onClick={ev => this.expand(false, false)}>
					<BookCard
						currentCheck={this.state.sortedBooks}
						expanded={this.state.expanded}
						expand={(id) => this.expand(id)}
						changeShelf={(book, checker, e) => this.changeLabel(book, checker, e)}
						view='search'
						optionsList={this.optionsList}
						saveURL={(pathname) => this.props.saveURL(pathname)}
					/>
				</div>
			</div>
		)
	}
}

export default Search