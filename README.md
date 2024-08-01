# Moments - social_app

Live site: https://social-app-szilvia-8965907d743d.herokuapp.com/

![screenshot](image.png)

---

## BACKEND

**Back-end framework** is Django REST (`Django @4` & `Django Rest Framework @3`).

**Database** using `SQLITE3` in development and `PostgreSQL` in production, hosted on `ElephantSQL`.

**Authentication** with JSON Web Tokens, implemented with: `dj-rest-auth`, `django-allauth` and `djangorestframework-simplejwt`.

**Image** management with `Pillow`, stored on `Cloudinary`.

**Static files** storage with `Whitenoise`.

---

## FRONTEND

### React + TypeScript + Vite

### Packages

* `react-bootstrap` & `bootstrap`
* `axios`
* `react-router-dom v6`
* `react-infinite-scroll-component`
* `serve` - for hosting on Heroku

---

## CREDITS

* Design and styles: by Code Institute.
* The basis of this project was Code Institute's `Moments` app. While the look & feel of my app is very similar, the code is fundamentally different:

   * On the Frontend:
      - I used `TypeScript`, 
      - used `@vite` for setup,
      - `react-router-dom v6` is used which is a major upgrade from v5,
      - State management is implemented with reducers whenever it was necessary to avoid unneccessary re-renders instead of using several useState() values,
      - used Bootstrap v5 instead of v4,

   * On the Backend:
      - Django v4 was used as well as the newest versions for django-restframework and djangorestframework-simplejwt too,
      - my API endpoints are different,
      - I used a completely different approach for authentication, login & logout.
   

* Other resources:
   * Favicon generator: https://realfavicongenerator.net/
   * Converting svg to png: https://svgtopng.com/


# Local Development

To develop this project locally, the following steps are needed (steps are provided for Mac/Linux and VSCode setup):

0. Prerequisites: 
   - python (v3.10 or later) is installed
   - node (v18.12 or later) is installed
   - created an account with Cloudinary
   - created a postgresql database in ElephantSQL
1. Clone the repo into a folder on your local machine.
2. Next to the project's root folder, create a virtual environment: `python3 -m venv venv`.
3. `cd` into the project's root folder, then activate the virtual environment: `source venv/bin/activate`. If activation was successful, `venv` will appear in the front of the propt.
4. Install the required packages with `pip install -r requirements.txt`.
5. Create the `.env` file.
    
    ```
   SECRET_KEY=<your-secret-key>,
   CLOUDINARY_URL=<your-cloudinary-url>
   DATABASE_URL=<your-elephantsql-project-link>
   DEBUG=1
   CLIENT_ORIGIN=http://localhost:8000
    ```

6. Run migrations with `python manage.py migrate`

7. Create a superuser for your database with `python manage.py createsuperuser`

8. Start up the development server: `python manage.py runserver`

