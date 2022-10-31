const fs = require('fs');
const path = require('path');

//const [locales, pluralRules] = loadLocales('../resources/locales');
let [locales, pluralRules] = [{}, {}];

function loadLocales(localesPath)
{
  const fsPath = path.resolve(__dirname, localesPath);
  const locales = {};
  const pluralRules = {};
  fs.readdirSync(fsPath).forEach(_filename => {
    const filePath = path.join(fsPath, _filename);
    const file = path.parse(filePath);
    if(fs.lstatSync(filePath).isFile() && file.ext === '.json')
    {
      locales[file.name] = require(filePath);
      pluralRules[file.name] = new Intl.PluralRules(file.name);
    }
    });
  return [locales, pluralRules];
}

function _(str, ...args) {
  return strProvider.get(str, ...args);
}

class StringProvider {
  constructor() {

    this.defaultLocale = 'en-US';
  }

  _insertArguments = (str, args) => {
    if (args === null || args === undefined) {
      return str;
    }
    if(Array.isArray(args))
    {
        return str.replace(/{([0-9]+)}|%([0-9]+)/g, function(wholeMatch, firstMatch, secondMatch)   // replace {i} or %i placeholders
  				{var i = +(firstMatch || secondMatch); return i < args.length ? args[i] : wholeMatch;}
			);
    }

    return str.replace(/{([dfis0-9]+)}|%([dfis0-9]+)/, args); // replace %s, %0, {s}, etc.
  };

  get = (str, ...inputArgs) => {
    let _locale = this.defaultLocale;
    let args;
    if(inputArgs){
      if(typeof inputArgs[0] === "string")
      {
        try {
          Intl.getCanonicalLocales(inputArgs[0]);
          _locale = inputArgs[0];
          args = inputArgs.slice(1);
        } catch (err) { args = inputArgs; }
      }
      else args = inputArgs;
      if(args.length === 1) args = args[0];
    }

    const [loaded, locale] = locales[_locale] ? [locales[_locale][str.trim()], _locale] : [locales[this.defaultLocale][str.trim()], this.defaultLocale];

    if (!loaded) {  // string does not exists in both request and default (fallback) locale
      return str;
    }

    if (typeof loaded === "string") {   // if no plurals are defined within locale's JSON file
      return this._insertArguments(loaded, args);
    }

    if (args === undefined || args === null) {  // since this point, some number, count must be specified to decide the resulting plural category
      throw new Error(`Missing argument(s) for plural string: ${str}`);
    }

    if (Array.isArray(args))  // it's better to cut the string under multiple IDs to avoid any confusion during decision of the plural category
      throw new Error(`Passing multiple arguments to a plural string is not supported: ${str}`);

    const pluralCategory = pluralRules[locale].select(args)
    const loadedPluralForm = loaded[pluralCategory];

    if(!loadedPluralForm) // Translator probably forgot to define the requested plural
      return this._insertArguments(locales[this.defaultLocale][str.trim()][pluralRules[this.defaultLocale].select(args)],
                                  args);  // => return fallback language

    return this._insertArguments(loadedPluralForm, args);
  };

  load = (localesPath) => {
    [locales, pluralRules] = loadLocales(localesPath);
    return this;
  }

  setDefault = (locale) => {  // fallback locale with full strings coverage
    try {
      Intl.getCanonicalLocales(locale);
      this.defaultLocale = locale;
    } catch (err) { throw new Error(`Invalid locale: ${locale} (${err})`) }
    return this;
  }
}

const strProvider = new StringProvider();

exports.StringProvider = strProvider;
exports._ = _;  // _() is shorthand alias for StringProvider.get()