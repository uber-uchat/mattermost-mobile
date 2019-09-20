import {PreferenceTypes} from 'mattermost-redux/action_types';
import {Preferences} from 'mattermost-redux/constants';

import themes from 'assets/themes.json';

export const defaultPrefs = [
  {
    name: '',
    category: Preferences.CATEGORY_THEME,
    data: state => {
      const currentUserId = state.entities.users.currentUserId;
      return {
        category: Preferences.CATEGORY_THEME,
        name: '',
        user_id: currentUserId,
        value: JSON.stringify(themes.default)
      };
    }
  }
];

function checkForPreference(name, category, data) {
	return data.find(pref => {
		if (`${pref.category}--${name}` === `${category}--${name}`) {
			return pref;
		}

		return false;
	});
}

// middleware that forces the displayname preference to be set to fullname if it's not set.
export function buildDefaultPreferenceMiddleware(defaultPreferences) {
	if (!Array.isArray(defaultPreferences)) {
		throw new Error(
			'defaultPreferencesMiddleware: defaultPreferences must be an array.'
		);
	}

	return ({ getState }) => next => action => {
		if (
			action.type === PreferenceTypes.RECEIVED_ALL_PREFERENCES &&
			!action.meta
		) {
			const data = [...action.data];

			defaultPreferences.forEach(pref => {
				const prefExists = checkForPreference(pref.name, pref.category, data);

				if (!prefExists) {
					const updatedPref =
						typeof pref.data === 'function' ? pref.data(getState()) : pref.data;

					data.push(updatedPref);
				}
			});

			return next({
				type: action.type,
				data
			});
		}

		return next(action);
	};
}