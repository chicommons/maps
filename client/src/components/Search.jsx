import React, { Component } from "react";
import "../Search.css";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      setSearchTerm: "",
      searchResults: [],
      setSearchResults: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const query = event.target.value;
    if (!query) {
      this.setState({ searchTerm: query, searchResults: [] });
    } else {
      this.setState({ searchTerm: query, loading: true }, () => {
        this.doSearch(query);
      });
    }
  }

  doSearch = (query) => {
    const searchUrl = "/coops/?contains=" + encodeURIComponent(query);
    fetch(searchUrl, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("query:" + query + " searchterm:" + this.state.searchTerm);
        console.log(data);
        if (query === this.state.searchTerm) {
          this.setState({
            searchResults: data,
            loading: false,
          });
        }
      });
  };

  renderSearchResults = () => {
    const { searchResults } = this.state;
    if (searchResults && searchResults.length) {
      return (
        <div>
          <div>Results</div>
          <ListGroup variant="flush">
            {searchResults.map((item) => (
              <ListGroupItem key={item.id} value={item.name}>
                {item.name}
              </ListGroupItem>
            ))}
          </ListGroup>
        </div>
      );
    }
  };

  render() {
    return (
      <div className="searchForm">
        <input
          type="text"
          placeholder="Search"
          value={this.state.searchTerm}
          onChange={this.handleChange}
        />
        {this.renderSearchResults()}
      </div>
    );
  }
}
