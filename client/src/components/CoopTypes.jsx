import React, { useState, useEffect } from 'react';
import { FormLabel } from 'react-bootstrap';
import { WithContext as ReactTags } from 'react-tag-input';
import './CoopTypes.css';

const KeyCodes = {
	comma: 188,
	enter: 13
};

const delimiters = [ KeyCodes.comma, KeyCodes.enter ];

const handleDrag = (tag, currPos, newPos) => {
	const tags = [ ...this.state.tags ];
	const newTags = tags.slice();

	newTags.splice(currPos, 1);
	newTags.splice(newPos, 0, tag);

	// re-render
	this.setState({ tags: newTags });
};

const CoopTypes = (props) => {
	const [ tags, setTags ] = React.useState(null);
	const [ suggestions, setSuggestions ] = React.useState(null);
	const handleAddition = props.handleAddition;
	const handleDeletion = props.handleDeletion;

	useEffect(
		() => {
			const s = props.suggestions
				? props.suggestions.map((result) => ({
						id: result.name,
						text: result.name
					}))
				: [];
			setSuggestions(s);
			const t = props.values
				? props.values.map((result) => ({
						id: result.name,
						text: result.name
					}))
				: [];
			setTags(t);
		},
		[ props ]
	);

	return (
		<div className="form-group">
			<FormLabel className={props.className} style={inputStyle}>Coop Type(s)</FormLabel>
			<ReactTags
				tags={tags ? tags : []}
				suggestions={suggestions ? suggestions : []}
				handleDelete={handleDeletion}
				handleAddition={handleAddition}
				handleDrag={handleDrag}
				delimiters={delimiters}
			/>
		</div>
	);
};
const inputStyle = {
	color: '#124E54'
};

export default CoopTypes;
