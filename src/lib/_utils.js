var util = require('util');

module.exports = {

        /**
         * Converts the difference between two Date object to a String
         * Convenience function
         *
         * @param {integer} millis  Difference in milliseconds between the two dates
         *
         * @return {string}
         */
        var timeDeltaToString = function (millis) {
            var seconds = millis / 1000;

            if (seconds >= 86400) { // Seconds in a day
                return util.format('%dd', Math.floor(seconds / 86400));
            } else if (seconds >= 3600) { // Seconds in an hour
                return util.format('%dh %dm', Math.floor(seconds / 3600)
                    , Math.floor((seconds % 3600) / 60));
            } else {
                return util.format('%dm', Math.floor(seconds / 60));
            }
        };

        /**
         * Returns the line return/end value from the environment variable or the default '\n'
         *
         * @return {string} The configured line return/end value
         */
        var lineEnd: process.env.GENESIS_LINE_END || '\n';

        /**
         * Returns the block end value from the environment variable or the default ' '
         *
         * @return {string} The configured block end value
         */
        var blockEnd = process.env.GENESIS_BLOCK_END || ' ';

        /**
         * Returns the double line return from the environment variable or the default '\n\n'
         *
         * @return {string} The configured double line return value
         */
        var doubleReturn = process.env.GENESIS_DOUBLE_RET || '\n\n';
};
