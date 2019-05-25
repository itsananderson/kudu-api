module.exports = {
    "env": {
        "node": true,
        "mocha": true
    },
    "parser": "@typescript-eslint/parser",
    "plugins": ["@typescript-eslint"],
    "extends": ["plugin:@typescript-eslint/recommended"],
    "rules": {
        "indent": [
            "error",
            4
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "curly": [
            "error",
            "all"
        ],
        "strict": [
            "error",
            "safe"
        ],
        "eqeqeq": [
            "error",
            "always"
        ],
        "one-var": [
            "error",
            "never"
        ],
        "multiline-ternary": [
            "error",
            "always"
        ]
    }
};
