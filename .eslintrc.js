module.exports = {
    "env": {
        "node": true,
        "mocha": true
    },
    "parser": "@typescript-eslint/parser",
    "plugins": ["@typescript-eslint", "prettier"],
    "extends": ["plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
    "rules": {

        // Conflicts with Prettier
        "@typescript-eslint/indent": "off",

        // Conflicts with some rest API parameters
        "@typescript-eslint/camelcase": "off",

        "eqeqeq": [
            "error",
            "always"
        ],

        "one-var": [
            "error",
            "never"
        ],
    }
};
