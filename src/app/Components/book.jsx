import { connect } from 'react-redux';
import React from 'react';
import PORT from '../../config/port';

var Book = React.createClass({
  addToList: function(ASIN) {
    // send the clicked book to the server to save on the user's gift list
    // should the req object just be Book's rendered view? this.props.book[0]

    var friendId = this.props.friend.friend[0].id;
    var userId = this.props.user.profile.identities[0].user_id;

    console.log(friendId, userId, ASIN)

    $.ajax({
      url: "http://localhost:" + PORT.PORT + "/api/friends/savegift",
      method: 'POST',
      data: {ASIN : ASIN,
            friendId : friendId,
            userId: userId}, // need to pass in the access token
      success: function(data) {
        console.log('GIFT SUCCESSFULLY SAVED TO DB')
        // = JSON.parse(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("http://localhost:" + PORT.PORT + "/api/friends", status, err.toString());
      }
    });
  },

  componentDidMount: function() {
  },

  render: function() {

    const {book} = this.props;

    var basedOn = book.basedOn;

    var missingBookCover = 'http://www.mbalit.co.uk/sites/default/files/imagecache/fullsize/imagefield_default_images/generic_book_cover_0.jpg';

    var bookDetails = {
      ASIN : book.details.ASIN,
      url: book.details.DetailPageURL || '',
      img: book.details.MediumImage.URL || missingBookCover,
      title: book.details.ItemAttributes.Title || 'NA',
      author: book.details.ItemAttributes.Author || 'NA',
      binding: book.details.ItemAttributes.Binding || 'NA',
      price: book.details.Offers.Offer.OfferListing.Price.FormattedPrice || 'NA',
      basedOn: book.basedOn.ItemAttributes.Title
    };

    var basedOnDetails = {
      img: basedOn.MediumImage.URL || missingBookCover,
      title: basedOn.ItemAttributes.Title || 'NA',
      author: basedOn.ItemAttributes.Author || 'NA',
    }

    return (
      <div className="container gift-detail-container">
        <div>
          <div className="add-to-list"><a href="#" onClick={this.addToList(bookDetails.ASIN)}><i className="glyphicon glyphicon-heart"></i></a></div>
          <div className="book-thumbnail"><a href={bookDetails.url}><img src={bookDetails.img} /></a></div>
        </div>

        <div className="book-title">{bookDetails.title}</div>

        <div className="book-author">{bookDetails.author}</div>
        <div className="book-binding">{bookDetails.binding}</div>
        <div className="book-price">{bookDetails.price}</div>
        <div className="based-on">
          <div> Based on: </div>
          <div className = "book-based-on-thumbnail"><img src={basedOnDetails.img} /></div>
          <div className = "book-title">{basedOnDetails.title}</div>
          <div className = "book-author">{basedOnDetails.author}</div>
        </div>
      </div>
    );
  }
});

var mapStateToProps = function(state) {
  return {
    friend : state.friend, // export the portion of the state from index.js Reducers
    user : state.user
  }
};

export default connect(mapStateToProps)(Book);
