import React from 'react';
import { FormLabel } from 'react-bootstrap';
import { WithContext as ReactTags } from 'react-tag-input';
import './CoopTypes.css';
 
const KeyCodes = {
  comma: 188,
  enter: 13,
};
 
const delimiters = [KeyCodes.comma, KeyCodes.enter];
 
class CoopTypes extends React.Component {
    constructor(props) {
        super(props);

        this.handleDeletion = props.handleDeletion;
        this.handleAddition = props.handleAddition;
        this.handleDrag = this.handleDrag.bind(this);
    }
 
    handleDeletion(i) {
        const { tags } = this.state;
        this.setState({
         tags: tags.filter((tag, index) => index !== i),
        });
    }
 
    handleAddition(tag) {
        console.log('added ...');
        console.log(tag);
        this.setState(state => ({ tags: [...state.tags, tag] }));
    }
 
    handleDrag(tag, currPos, newPos) {
        const tags = [...this.state.tags];
        const newTags = tags.slice();
 
        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);
 
        // re-render
        this.setState({ tags: newTags });
    }
 
    render() {
        const tags = this.props.values.map(result => (
            {
                id: result.name,
                text: result.name
            }));
        this.state = {
            tags: tags,
            suggestions: this.props.suggestions ? this.props.suggestions.map(result => ({
                id: result.name,
                text: result.name
            })) : []
        };

        return (
            <div className="form-group">
                <FormLabel>Coop Type(s)</FormLabel>
                <ReactTags tags={this.state.tags}
                    suggestions={this.state.suggestions}
                    handleDelete={this.handleDeletion}
                    handleAddition={this.handleAddition}
                    handleDrag={this.handleDrag}
                    delimiters={delimiters} />
            </div>
        )
    }
};

export default CoopTypes;
