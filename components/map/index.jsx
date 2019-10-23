/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

// Implements the [Map design pattern](https://lightningdesignsystem.com/components/map/) in React.
// Based on SLDS v2.4.0
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// ### shortid
// [npmjs.com/package/shortid](https://www.npmjs.com/package/shortid)
// shortid is a short, non-sequential, url-friendly, unique id generator
import shortid from 'shortid';

import Icon from '../icon';
import { MAP } from '../../utilities/constants';

const displayName = MAP;

const propTypes = {
	/**
	 * CSS class names to be added with `slds-map` class. `array`, `object`, or `string` are accepted.
	 */
	className: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
		PropTypes.string,
	]),
	/**
	 * CSS class names to be added to the container element. `array`, `object`, or `string` are accepted.
	 */
	classNameContainer: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
		PropTypes.string,
	]),
	/**
	 * HTML id for component.
	 */
	id: PropTypes.string,
	/**
	 *  Labels
	 *  * `title` - Title for the Map component.
	 */
	labels: PropTypes.shape({
		title: PropTypes.string,
	}),
	/**
	 * Array of locations objects for the Map component.**
	 * Each location object can contain:
	 *  * `id` : A unique identifier string for the location
	 *  * `name` : Name of the location
	 *  * `address` : Address of the location
	 */
	locations: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			address: PropTypes.string.isRequired,
		})
	).isRequired,
	/**
	 * Callback function triggered when a location is selected
	 */
	onClickLocation: PropTypes.func,
	/**
	 * Accepts a Google Map API Key that will be used for showing the map
	 */
	googleAPIKey: PropTypes.string.isRequired,
	/**
	 *  Accepts location object that will be selected to shown on load
	 *  * `id` : A unique identifier string for the location
	 *  * `name` : Name of the location
	 *  * `address` : Address of the location
	 */
	selection: PropTypes.shape({
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		address: PropTypes.string.isRequired,
	}),
};

const defaultProps = {
	labels: {
		title: 'Interactive Map',
	},
};

/**
 * A map component is used to find a location
 */
class Map extends React.Component {
	constructor(props) {
		super(props);
		this.generatedId = shortid.generate();
	}

	/**
	 * Get the Map's HTML id. Generate a new one if no ID present.
	 */
	getId() {
		return this.props.id || this.generatedId;
	}

	/**
	 * Handles clicking of a location
	 */
	handleClick = (event, i) => {
		if (typeof this.props.onClickLocation === 'function')
			this.props.onClickLocation(event, this.props.locations[i]);
		if (this.iframe) {
			this.iframe.focus();
		}
	};

	render() {
		const labels = { ...defaultProps.labels, ...this.props.labels };

		return (
			<div
				id={this.getId()}
				className={classNames(
					`slds-grid`,
					{ 'slds-has-coordinates': this.props.locations },
					this.props.classNameContainer
				)}
			>
				<div className="slds-map_container">
					<div className={classNames(`slds-map`, this.props.className)}>
						<iframe
							id={`${this.getId()}-google-map`}
							ref={(iframe) => {
								this.iframe = iframe;
							}}
							tabIndex={0} // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
							title={labels.title}
							src={`https://www.google.com/maps/embed/v1/place?key=${
								this.props.googleAPIKey
							}&q=${encodeURIComponent(
								this.props.selection ? this.props.selection.address : ''
							)}`}
						/>
					</div>
				</div>
				{this.props.locations.length > 1 ? (
					<div className="slds-coordinates">
						<div className="slds-coordinates__header">
							<h2 className="slds-coordinates__title">
								{`${labels.title} (${this.props.locations.length})`}
							</h2>
						</div>
						<ul className="slds-coordinates__list">
							{this.props.locations.map((location, i) => (
								<li key={location.id} className="slds-coordinates__item">
									<span className="slds-assistive-text" aria-live="polite">
										{`${location.name} is currently selected`}
									</span>
									<button
										type="button"
										onClick={(event) => this.handleClick(event, i)}
										className="slds-coordinates__item-action slds-button_reset slds-media"
										aria-pressed={this.props.selection.id === location.id}
									>
										<span className="slds-media__figure">
											<Icon category="standard" name="account" />
										</span>
										<span className="slds-media__body">
											<span className="slds-text-link">{location.name}</span>
											<span>{location.address}</span>
										</span>
									</button>
								</li>
							))}
						</ul>
					</div>
				) : null}
			</div>
		);
	}
}

Map.displayName = displayName;
Map.propTypes = propTypes;

export default Map;
