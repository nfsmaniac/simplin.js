# simplin.js
 A simple, tiny Node.js module providing a basic multi-language system — dependency-free.
 
## Aim of the project
The primary goal of this project is to provide bare-basic solution for multi-language feature (app localization), mainly for purposes within smaller Node.js projects.
Conventional libraries might not be easy to learn and use, or they are just way too complex for a little hobby projects.

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
    
2. Where you are initializing your application, add
    ```js
    const { StringProvider } = require("simplin.js");
    ...
    class MyApp {
     constructor() {
         this.locales = StringProvider.load(path.resolve(__dirname, "../resources/locales"));
     }
    }
    ```
3. Anywhere in your app simply
    ```js
    const { _ } = require("simplin.js");
    ...
    console.log(_("MSG_HELLO_WORLD"));
    console.log(_("MSG_NEW_MESSAGE", 3)); // 3 new messages
    ```
Or, alternatively (without require()) 
    ```
    console.log(MyApp.locales.get("MSG_HELLO_WORLD");
    ```
