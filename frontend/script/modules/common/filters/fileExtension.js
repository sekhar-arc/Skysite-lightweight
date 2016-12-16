module.exports = [
    function() {
        return function(text) {
            if (!text) {
                return;
            }
            text = text.split('.');
            if (text.length === 1) {
                return text[0].toUpperCase()
            }
            return text[1].toUpperCase();
        };
    }
]
