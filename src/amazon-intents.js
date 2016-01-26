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
export const CANCEL = 'AMAZON.CancelIntent';

/**
 * Provide help about how to use the skill.
 *
 * Examples:
 *   help
 *   help me
 *   can you help me
 */
export const HELP = 'AMAZON.HelpIntent';

/**
 * Let the user provide a negative response to a yes/no question for confirmation.
 *
 * Examples:
 *   no
 *   no thanks
 */
export const NO = 'AMAZON.NoIntent';

/**
 * Let the user provide a positive response to a yes/no question for confirmation.
 *
 * Examples:
 *   yes
 *   yes please
 *   sure
 */
export const YES = 'AMAZON.YesIntent';

/**
 * Let the user request to repeat the last action.
 *
 * Examples:
 *   repeat
 *   say that again
 *   repeat that
 */
export const REPEAT = 'AMAZON.RepeatIntent';

/**
 * Let the user request to restart an action, such as restarting a game or a transaction.
 *
 * Examples:
 *   start over
 *   restart
 *   start again
 */
export const RESTART = 'AMAZON.StartOverIntent';

/**
 * Let the user stop an action (but remain in the skill)
 * Let the user completely exit the skill
 *
 * Examples:
 *   stop
 *   off
 *   shut up
 */
export const STOP = 'AMAZON.StopIntent';
