# simplin.js
 A simple, tiny Node.js module providing a basic multi-language system — dependency-free.
 
## Aim of the project
 A primary goal of this project is to provide bare-basic solution for multi-language feature (app localization), mainly for purposes within smaller Node.js projects.
 Conventional libraries might not be easy to learn and use, or they are just way too complex for a little hobby projects.

## Installation
 ```
 npm i simplin.js
 ```

## How to start
1. Prepare `en-US.json`, that will serve both as default source of strings for your app, and as a template for the translators of your project.
    ```json
    {
     "MSG_HELLO_WORLD": "Hello, world!",
     "MSG_NEW_MESSAGE": {
                          "zero": "You have no new message.",
                          "one": "You have %i new message.",
                          "other": "You have {0} new messages."
                        }
    }
    ```
    **NOTICE:** `%i`, `%s`, `%0`, `{0}` are just placeholders to be filled-up by your app dynamically and can be combined freely. However, if you are intending to pass multiple variables to a single string, you should stick with form `%0`…`%9` or `{0}`…`{9}`.
    Translator can move them freely within the sentence, e.g. `{2} alpha beta {0} gamma {1} delta`, i.e. they don't have to be in ascending order.
    
    **ZERO:** Zero-forms are not used in some languages. Input argument `0` normally returns `other` string, unless you explicitely define special `0`-case, on top of standard.
    
2. Where you are initializing your application, add
    ```js
    const { StringProvider } = require("simplin.js");
    ...
    class MyApp {
     constructor() {
         this.locales = StringProvider
                        .load(path.resolve(__dirname, "../resources/locales")) //__dirname is pre-defined by your environment, similar to "pwd"
                        .setDefault("cs"); // you can omit setDefault(), in that case it's defaulted to 'en-US'
     }
    }
    ```
3. Anywhere in your app simply
    ```js
    const { _ } = require("simplin.js");
    ...
    console.log(_("MSG_HELLO_WORLD"));
    console.log(_("MSG_NEW_MESSAGE", "en-US", 3)); // You have 3 new messages.
    console.log(_("MSG_NEW_MESSAGE", 3)); // Máte 3 nové zprávy.
    ```
    Or, alternatively (without `require()` by referencing the previously initialized object) 
    ```js
    console.log(MyApp.locales.get("MSG_HELLO_WORLD");
    ```
4. Let translators to translate your project. Put all files to the same folder as `en-US.json`, they will be loaded automatically.

### Getting a string in every language
You may need to get a string for each locale within a single object.
```js
const { _A_ } = require("simplin.js");
...
const [localizedStrings, defaultLocaleString] = _A_("MSG_HELLO_WORLD");
////////////////////////////////////
console.log(localizedStrings)
=> {
     cs: "Ahoj, světe!",
     fr: "Bonjour le monde!"
   }
////////////////////////////////////
console.log(defaultLocaleString)
=> "Hello world!"
```
In case you'd need to concatenate the default language
```js
localizedStrings[StringProvider.defaultLocale] = defaultLocaleString;
```
