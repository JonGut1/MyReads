import React, { Component } from 'react'
import * as BooksAPI from './BooksAPI'
import './MoreInfo.css';

/*
* A component for the right part of the More info page.
* it displays a book's description and some links.
*/
function MoreInfoRight(props) {
	return (
		<ul className='book-more-info-list-right'>
			<li className='description'><span>Description</span><p tabIndex='1'>{props.book.description}</p></li>
			<div className='linksCont'>
				<a href={props.book.previewLink}>Preview Link</a>
				<a href={props.book.infoLink}>Info Link</a>
			</div>
		</ul>
	)
}

/*
* A component for the left part of the More info page.
* it displays a book's image and a title and authors.
*/
function MoreInfoLeft(props) {
	return (
		<ul tabIndex='1' className='book-more-info-list-left'>
			<span className='title'>{props.book.title}</span>
			<li className='imageLinks'><img src={props.book.imageLinks && props.book.imageLinks.thumbnail && (
				props.book.imageLinks.thumbnail
				)} alt={`Cover of ${props.book.title} book`}/>
				<ul className='authorsCont'>
					{(() => {
						if (props.book.authors) {
							return props.book.authors.map(author => (
								<li key={author + props.book.title}>
									<span className='authors'>{author}</span>
								</li>
							));
						}
					})()}
				</ul>
				<span className='publisher'>{props.book.publisher && (props.book.publisher)}</span>
			</li>
		</ul>
	)
}

/*
* MoreInfo component. It is here where the route is redirected. And from this component
* the MoreInfo page is built
*/
class MoreInfo extends Component {
	/*
 	* the components states
	*/
	state = {
		book: '',
	}

	/*
	* executes just after the component mounts
	*/
	componentDidMount() {
		this.extractRegExp();
	}

	/*
	* extracts book's id from the url string
	*/
	extractRegExp() {
		let pathName = this.props.history.location.pathname;
		if (!pathName.startsWith('/MyReads/moreinfo')) {
			pathName = this.props.historyData;
		}
		const path = pathName.split('MyReads');
		const pathNameSplit = path[1].split(/\/(.*?)=/);
		console.log(pathNameSplit);
		const bookID = pathNameSplit[1].split(/\//);
		this.getBook(bookID[1]);
	}

	/*
	* gets the book based on the parameter. The parameter indicates,
	* the books id.
	*/
	getBook(bookId) {
		if (this.props.currentBook) {
			this.sortProperties(this.props.currentBook);
			return;
		}
		BooksAPI.get(bookId).then(response => {
			this.setState({
				book: response,
			});
		});
	}

	render() {
		const book = this.state.book;
		return (
			<div className='book-more-info'>
				<div className='backButtonCont'>
					<button arria-label='go back' arria-require='true' onClick={this.props.history.goBack} className='backButton'><span className='glyphicon glyphicon-arrow-left'></span></button>
				</div>
				<MoreInfoLeft book={book}/>
				<MoreInfoRight book={book}/>
			</div>
		);
	}
}

export default MoreInfo