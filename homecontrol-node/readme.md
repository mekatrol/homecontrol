# Stuff

## Running app

```bash
flask --app main.py run
```

## Start flask shell

```bash
flask --app main.py shell
```

## Set up secrets

> The following commands are executed from the python shell

```python
import secrets

secrets.token_hex(24)

```

## Run production server

```bash
waitress-serve --port=8080 --call main:create_app
```
