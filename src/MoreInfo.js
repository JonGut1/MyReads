import React, { Component } from 'react'
import * as BooksAPI from './BooksAPI'

class MoreInfo extends Component {
	constructor(props) {
		super(props);
		this.names = {
			title: 'Title',
			authors: 'Author',
			publishedDate: 'Published Date',
			publisher: 'Publisher',
			averageRating: 'Average Rating',
			language: 'Language',
			pageCount: 'Page Count',
			description: 'Description',
			infoLink: 'More Information',
			previewLink: 'Preview the book',
		}
		this.titles = {
			currentlyReading: 'Currently Reading',
			wantToRead: 'Want To Read',
			read: 'Already Read',
			none: 'None',
		};
		this.elementsFirst = {
			extraData: ['shelf', 'id'],
			header: ['title', 'authors', 'publishedDate', 'publisher'],
			main: ['imageLinks', 'averageRating', 'language', 'pageCount'],
		};
		this.elementsSecond = {
			main: ['description', 'infoLink', 'previewLink'],
		};
	}

	state = {
		firstPage: [],
		secondPage: [],
	}

	componentDidMount() {
		this.extractRegExp();
	}

	extractRegExp() {
		console.log(this.props.history);
		const pathName = this.props.history.location.pathname;
		const pathNameSplit = pathName.split(/\/(.*?)\=/);
		const bookID = pathNameSplit[1].split(/\//);
		this.getBook(bookID[1]);
	}

	getBook(bookId) {
		console.log(bookId);
		BooksAPI.get(bookId).then(response => {
			console.log(response);
			this.sortProperties(response);
		});
	}

	sortProperties(book) {
		const first = {
			extraData: [],
			header: [],
			main: [],
		};

		const second = {
			main: [],
		};

		for (let el in this.elementsFirst) {
				first[el] = this.elementsFirst[el].map(data => {
					if (book[data]) {
						console.log(el);
						if (book[data].thumbnail) {
							return [data, book[data].thumbnail];
						}
						if (book[data].length > 1 && data === 'authors') {
							let authors = '';
							this.names.authors = 'Authors'
							book[data].forEach(author => {
								authors += authors ? `, ${author}` : author;
							});

							return [data, authors];
						}
						return [data, book[data]];
					} else {
						return [data, 'Unavailable'];
					}
				});
		}

		for (let el in this.elementsSecond) {
				second[el] = this.elementsSecond[el].map(data => {
					if (book[data]) {
						return [data, book[data]];
					} else if (data === 'description') {
						return [data, 'Description Unavailable'];
					} else {
						return [data, 'Link could not be found']
					}
				});
		}

		console.log(first, second);

		this.setState({
			firstPage: first,
			secondPage: second,
		}, () => {
			console.log(this.state);
		});
	}

	render() {
		return (
			<div className='bookInfo'>
				<div className='firstPage'>
					{this.state.firstPage.header && (
						<ul className='bookHeaderLeft'>
							<div className='shelf'>{this.titles[this.state.firstPage.extraData[0][1]]}</div>
							{this.state.firstPage.header.map(el => (
								<li key={el[0]} className={el[0]}><span>{this.names[el[0]]}</span><p>{el[1]}</p></li>
							))}
						</ul>
					)}
					{this.state.firstPage.main && (
						<ul className='bookMainLeft'>
							{this.state.firstPage.main.map(el => {
								return el[0] === 'imageLinks' && el[1] !== 'Unavailable' ?
								<li key={el[0]} className={el[0]}><img src={el[1]}/></li>
								:
								<li key={el[0]} className={el[0]}><span>{this.names[el[0]]}</span><p>{el[1]}</p></li>
							})}
						</ul>
					)}
				</div>
				<div className='secondPage'>
					{this.state.secondPage.main && (
						<ul className='bookMainRight'>
							{this.state.secondPage.main.map(el => {
								return el[0] === 'infoLink' || el[0] === 'previewLink' ?
								<li key={el[0]} className={el[0]}><a href={el[1]}>{this.names[el[0]]}</a></li>
								:
								<li key={el[0]} className={el[0]}><span>{this.names[el[0]]}</span><p>{el[1]}</p></li>
							})}
						</ul>
					)}
				</div>
			</div>
		);
	}
}

export default MoreInfo
