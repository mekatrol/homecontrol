from datetime import timedelta
import bcrypt
from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt, get_jwt_identity, jwt_required, current_user
from pysondb import db
from models.revoked_token import RevokedToken
from models.user import User
from wireup import container

from services.data import DataService
from services.user import UserService

auth_bp = Blueprint('auth', __name__)


@auth_bp.post('/register')
def register_user():
    try:
        # Get body as JSON
        data = request.get_json()

        username = data.get("username").strip()
        password = data.get("password").strip()

        users_db = db.getDb("./instance/users.json")

        # Locate user by username
        users = users_db.getBy({"username": username})

        # Make sure not an existing user
        if (len(users) > 0):
            return jsonify({"message": "user already exists"}), 409  # Conflict

        password_bytes = password.encode('utf-8')
        password_salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(
            password_bytes, password_salt).decode('utf-8')

        new_user = User(id=0, username=username, password=hashed_password)

        id = users_db.add(new_user.model_dump())

        # Return created message with the new user ID
        return jsonify({"message": f"user created with ID: '{id}'"}), 201
    except Exception as ex:
        # Print exception for debugging use
        print(ex)

        # Internal server error
        return jsonify({"message": f"server error occurred"}), 500


@auth_bp.post('/login')
@container.autowire
def login_user(user_service: UserService):
    try:
        # Get body as JSON
        data = request.get_json()

        # Locate user by username
        user = user_service.get_user(data.get('username'))

        if user is None:
            # Not found
            return jsonify({"message": "user does not exist"}), 404

        if user_service.validate_user_password(data.get('password'), user):
            expires = timedelta(minutes=10)
            username = user.username
            access_token = create_access_token(
                identity=username, expires_delta=expires)
            refresh_token = create_refresh_token(identity=user.username)

            return jsonify({"access_token": access_token, "refresh_token": refresh_token}), 200

        # User failed to login
        return jsonify({"message": f"invalid username or password"}), 401
    except Exception as ex:
        # Print exception for debugging use
        print(ex)

        # Internal server error
        return jsonify({"message": f"server error occurred"}), 500


@auth_bp.get('/logout')
@jwt_required(verify_type=False)
@container.autowire
def revoke_token(data_service: DataService):
    jwt = get_jwt()
    jti = jwt["jti"]
    token_type = jwt["type"]

    if jti is not None:
        revoked_token = RevokedToken(id=0, jti=jti, type=token_type)
        id = data_service.get_revoked_users_db().add(revoked_token)
        return jsonify({"message": f"'{token_type}' revoked with ID: '{id}'"}), 200

    return jsonify({"message": "invalid token"}), 400


@auth_bp.get('/refresh-token')
@jwt_required(refresh=True)
def refresh_token():
    identity = get_jwt_identity()

    access_token = create_access_token(identity=identity)

    return jsonify({"access_token": access_token})


@auth_bp.get('/who-am-i')
@jwt_required()
def get_user_detail():
    return jsonify({"message": f"{current_user.username}: {current_user.id}"})
