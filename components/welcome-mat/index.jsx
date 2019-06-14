/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

// Implements the [Welcome Mat design pattern](https://lightningdesignsystem.com/components/welcome-mat/) in React.
// Based on SLDS v2.4.0
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Modal from '~/components/modal';
import ProgressBar from '~/components/progress-bar';
import Checkbox from '~/components/checkbox';
// ### shortid
// [npmjs.com/package/shortid](https://www.npmjs.com/package/shortid)
// shortid is a short, non-sequential, url-friendly, unique id generator
import shortid from 'shortid';
import { WELCOME_MAT } from '../../utilities/constants';

const displayName = WELCOME_MAT;

const propTypes = {
	/**
	 *  **Assistive text for accessibility**
	 */
	assistiveText: PropTypes.shape({
		doNotShowAgain: PropTypes.string,
	}),
	/**
	 * CSS class names to be added to the container element. `array`, `object`, or `string` are accepted.
	 */
	className: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
		PropTypes.string,
	]),
	/**
	 * HTML id for component.
	 */
	id: PropTypes.string,
	/**
	 * **Weclome Mat labels for internationalization**
	 * This object is merged with the default props object on every render.
	 * * `title`: Title for the Welcome Mat
	 * * `description`: Label for the radio input
	 */
	labels: PropTypes.shape({
		title: PropTypes.string,
		description: PropTypes.string,
		doNotShowAgain: PropTypes.string,
	}),
	/**
	 *	Variant of the WelcomeMat
	 */
	variant: PropTypes.oneOf([
		'steps',
		'info-only',
		'splash',
		'trailhead-connected',
	]),
	/**
	 * Link to learn more button
	 */
	onRenderInfoActions: PropTypes.func,
};

const defaultProps = {
	variant: 'steps',
};

/**
 * A Welcome Mat provides a series of unordered items a user can click to learn about a thematic topic.
 */
class WelcomeMat extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			completedSteps: 0,
			totalSteps: 0,
			progress: 0,
		};
	}

	componentWillMount() {
		this.generatedId = shortid.generate();
		this.getCount();
	}

	/**
	 * Get the File's HTML id. Generate a new one if no ID present.
	 */
	getId() {
		return this.props.id || this.generatedId;
	}

	getCount() {
		const totalSteps = React.Children.count(this.props.children);
		const completedSteps = React.Children.toArray(this.props.children).filter(
			(c) => c.props.isComplete
		).length;
		const progress = completedSteps / totalSteps * 100;
		this.setState({
			totalSteps,
			completedSteps,
			progress,
		});
	}

	render() {
		const splash = (
			<div
				className={classNames(
					'slds-welcome-mat__info-content',
					this.props.className
				)}
				id={`${this.getId}-content`}
			>
				<h2 className="slds-welcome-mat__info-title" id={`${this.getId}-label`}>
					{this.props.labels.title}
				</h2>
				<div className="slds-welcome-mat__info-description slds-text-longform">
					<p>{this.props.labels.description}</p>
				</div>
				{this.props.variant !== 'steps' ? (
					<div className="slds-welcome-mat__info-actions">
						{this.props.onRenderInfoActions()
							? this.props.onRenderInfoActions()
							: null}
						<div className="slds-m-top_large">
							<Checkbox
								assistiveText={{
									label:
										this.props.assistiveText &&
										this.props.assistiveText.doNotShowAgain
											? this.props.assistiveText.doNotShowAgain
											: `Don't show this again`,
								}}
								id={`${this.getId()}-do-not-show-again-checkbox`}
								labels={{
									label: this.props.labels.doNotShowAgain
										? this.props.labels.doNotShowAgain
										: `Don't show this again`,
								}}
							/>
						</div>
					</div>
				) : null}
				{this.props.variant === 'steps' && this.props.children ? (
					<React.Fragment>
						<div className="slds-welcome-mat__info-progress">
							<p>
								<strong>
									{this.state.completedSteps}/{this.state.totalSteps} units
									completed
								</strong>
							</p>
						</div>
						<ProgressBar value={this.state.progress} radius="circular" />
					</React.Fragment>
				) : null}
			</div>
		);

		return (
			<Modal isOpen size="small" id={`${this.getId}-modal`}>
				<div
					className={classNames(
						'slds-welcome-mat',
						this.props.children ? null : 'slds-welcome-mat_splash'
					)}
				>
					<div className="slds-welcome-mat__content slds-grid">
						{this.props.children ? (
							<React.Fragment>
								<div className="slds-welcome-mat__info slds-size_1-of-2">
									{splash}
								</div>
								<div
									className={classNames(
										'slds-welcome-mat__tiles',
										'slds-size_1-of-2',
										this.props.variant === 'info-only'
											? 'slds-welcome-mat__tiles_info-only'
											: null
									)}
								>
									{React.Children.map(this.props.children, (child) =>
										React.cloneElement(child, {
											variant: this.props.variant,
										})
									)}
								</div>
							</React.Fragment>
						) : (
							<div className="slds-welcome-mat__info slds-size_1-of-1">
								{splash}
							</div>
						)}
					</div>
				</div>
			</Modal>
		);
	}
}

WelcomeMat.displayName = displayName;
WelcomeMat.propTypes = propTypes;
WelcomeMat.defaultProps = defaultProps;

export default WelcomeMat;
