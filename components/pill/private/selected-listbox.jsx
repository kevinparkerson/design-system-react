/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import isReactComponent from '~/utilities/isReactComponent';

import Avatar from '~/components/avatar';
import Icon from '~/components/icon';
import Pill from '../../utilities/pill';

const propTypes = {
	/*
	 * The option object within the selection prop that should have focus.
	 */
	activeOption: PropTypes.object,
	/*
	 * The index of the option object within the selection prop that should have focus.
	 */
	activeOptionIndex: PropTypes.number,
	/**
	 * **Assistive text for accessibility**
	 * This object is merged with the default props object on every render.
	 * * `label`: This is used as a visually hidden label if, no `labels.label` is provided.
	 * * `removePill`: Aids in keyboard interaction with Pills.
	 * * `selectedListboxLabel`: Used to identify the listbox
	 */
	assistiveText: PropTypes.shape({
		label: PropTypes.string,
		removePill: PropTypes.string,
		selectedListboxLabel: PropTypes.string,
	}),
	/*
	 * Callback called when pill is clicked, delete is pressed, or backspace is pressed.
	 */
	events: PropTypes.shape({
		onClickPill: PropTypes.func.isRequired,
		onRequestFocus: PropTypes.func.isRequired,
		onRequestFocusOnNextPill: PropTypes.func.isRequired,
		onRequestFocusOnPreviousPill: PropTypes.func.isRequired,
		onRequestRemove: PropTypes.func.isRequired,
	}),
	/**
	 * HTML id for component main container
	 */
	id: PropTypes.string,
	/**
	 * Adds inline (inside of input) styling
	 */
	isInline: PropTypes.bool,
	/**
	 * Determines whether component renders as a pill container with associated styling and behavior
	 */
	isPillContainer: PropTypes.bool,
	/*
	 * Pill Label
	 */
	labels: PropTypes.shape({
		label: PropTypes.string,
		remove: PropTypes.string,
		title: PropTypes.string,
	}),
	/**
	 * Changes styles of the input. Currently `entity` is not supported.
	 */
	renderAtSelectionLength: PropTypes.number,
	/**
	 * This callback exposes the selected listbox reference / DOM node to parent components.
	 */
	selectedListboxRef: PropTypes.func,
	/**
	 * Accepts an array of item objects.
	 */
	selection: PropTypes.array,
	/**
	 * Requests that the active option set focus on render
	 */
	listboxHasFocus: PropTypes.bool,
	/**
	 * Changes styles of the input. Currently `entity` is not supported.
	 */
	variant: PropTypes.oneOf(['base', 'inline-listbox', 'readonly']),
};

const defaultProps = {
	renderAtSelectionLength: 1,
};

const getAvatar = (option) => {
	const avatarObject = option.avatar;
	let avatar = null;

	if (avatarObject) {
		if (isReactComponent(avatarObject)) {
			avatar = React.cloneElement(avatarObject, {
				containerClassName: 'slds-pill__icon_container',
			});
		} else if (avatarObject.imgSrc) {
			avatar = (
				<Avatar
					imgSrc={avatarObject.imgSrc}
					title={avatarObject.title || option.label}
					variant={avatarObject.variant || 'user'}
				/>
			);
		}
	}

	return avatar;
};

const getIcon = (option) => {
	const iconObject = option.icon;
	let icon = null;

	if (iconObject) {
		if (isReactComponent(iconObject)) {
			icon = React.cloneElement(iconObject, {
				containerClassName: 'slds-pill__icon_container',
			});
		} else if (iconObject.category && iconObject.name) {
			icon = (
				<Icon
					category={iconObject.category}
					name={iconObject.name}
					title={iconObject.title || option.label}
				/>
			);
		}
	}

	return icon;
};

const SelectedListBox = (props) =>
	props.selection.length >= props.renderAtSelectionLength ? (
		<div // eslint-disable-line jsx-a11y/role-supports-aria-props
			className={
				classNames({ 'slds-pill_container': props.isPillContainer }) ||
				undefined
			}
			id={props.id}
			ref={(ref) => {
				if (props.selectedListboxRef) {
					props.selectedListboxRef(ref);
				}
			}}
			role="listbox"
			aria-orientation="horizontal"
		>
			<ul
				className={classNames('slds-listbox', {
					'slds-listbox_inline': props.isInline,
					'slds-listbox_horizontal': !props.isInline,
					'slds-p-top_xxx-small': !props.isInline,
				})}
				role="group"
				aria-label={props.assistiveText.selectedListboxLabel}
			>
				{props.selection.map((option, renderIndex) => {
					const setActiveBasedOnstateFromParent =
						renderIndex === props.activeOptionIndex;
					const listboxRenderedForFirstTime =
						(props.activeOptionIndex === -1 && renderIndex === 0) ||
						(props.variant === 'readonly' &&
							props.selection.length !== 1 &&
							renderIndex === 0);
					const active =
						setActiveBasedOnstateFromParent || listboxRenderedForFirstTime;
					const icon = getIcon(option);
					const avatar = !icon ? getAvatar(option) : null;

					return (
						<li
							role="presentation"
							className="slds-listbox__item"
							key={`${props.id}-list-item-${option.id}`}
						>
							<Pill
								active={active}
								assistiveText={{
									remove: props.assistiveText.removePill,
								}}
								avatar={avatar}
								events={{
									onBlur: props.events.onBlurPill,
									onClick: (event, data) => {
										props.events.onClickPill(event, {
											...data,
											index: renderIndex,
										});
									},
									onRequestFocusOnNextPill:
										props.events.onRequestFocusOnNextPill,
									onRequestFocusOnPreviousPill:
										props.events.onRequestFocusOnPreviousPill,
									onRequestRemove: (event, data) => {
										props.events.onRequestRemove(event, {
											...data,
											index: renderIndex,
										});
									},
									onRequestFocus: props.events.onRequestFocus,
								}}
								eventData={{ option }}
								icon={icon}
								labels={{
									label: option.label,
									removeTitle: props.labels.removePillTitle,
								}}
								requestFocus={props.listboxHasFocus}
								tabIndex={active ? 0 : -1}
							/>
						</li>
					);
				})}
			</ul>
		</div>
	) : null;

SelectedListBox.displayName = 'SelectedListBox';
SelectedListBox.propTypes = propTypes;
SelectedListBox.defaultProps = defaultProps;

export default SelectedListBox;