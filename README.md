# Moments - social_app

## BACKEND

django rest api


## FRONTEND

### React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list


### Packages

* `react-bootstrap` & `bootstrap`
* `axios`
* `react-router-dom v6`
* `react-infinite-scroll-component`
* `serve` - for hosting on Heroku


# Credits

* Design and styles: Code Institute
* Code Institute provided the basic structure for the app. However, I implemented several fundamental changes with the end result of a completely different code. The changes I made are as follows:
   - I added TypeScript, 
   - used @vite instead of react-create-app for setup,
   - react-router-dom v6 instead of v5 for routing (v6 was a major upgrade)
   - as my backend API uses django v4 instead of v3 and used newer versions for django-restframework as well as djangorestframework-simplejwt too, my API endpoints are different.
   - I used a completely different approach for authentication, login & logout.
   - I managed state values with reducers whenever it was necessary to avoid unneccessary re-renders instead of using several useState() values.
   - used Bootstrap 5 instead of 4 for styles


* Favicon generator: https://realfavicongenerator.net/
* Converting svg to png: https://svgtopng.com/