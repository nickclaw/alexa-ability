/**
 * Internal events
 */

export const unhandledEvent = 'unhandledEvent';

export const unknownEvent = 'unknownEvent';

export const error = 'error';

export const launch = 'launch';

export const end = 'end';


/**
* The builtin Amazon intents
* Taken from: https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/implementing-the-built-in-intents
*/

/**
 * Let the user cancel a transaction or task (but remain in the skill)
 * or let the user completely exit the skill
 * Examples:
 *   cancel
 *   never mind
 *   forget it
 */
export const cancel = 'AMAZON.CancelIntent';

/**
 * Provide help about how to use the skill.
 *
 * Examples:
 *   help
 *   help me
 *   can you help me
 */
export const help = 'AMAZON.HelpIntent';

/**
 * Let the user provide a negative response to a yes/no question for confirmation.
 *
 * Examples:
 *   no
 *   no thanks
 */
export const no = 'AMAZON.NoIntent';

/**
 * Let the user provide a positive response to a yes/no question for confirmation.
 *
 * Examples:
 *   yes
 *   yes please
 *   sure
 */
export const yes = 'AMAZON.YesIntent';

/**
 * Let the user request to repeat the last action.
 *
 * Examples:
 *   repeat
 *   say that again
 *   repeat that
 */
export const repeat = 'AMAZON.RepeatIntent';

/**
 * Let the user request to restart an action, such as restarting a game or a transaction.
 *
 * Examples:
 *   start over
 *   restart
 *   start again
 */
export const restart = 'AMAZON.StartOverIntent';

/**
 * Let the user stop an action (but remain in the skill)
 * Let the user completely exit the skill
 *
 * Examples:
 *   stop
 *   off
 *   shut up
 */
export const stop = 'AMAZON.StopIntent';
