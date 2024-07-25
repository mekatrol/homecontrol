import bcrypt

from datetime import timedelta
from pysondb import db
from wireup import container
from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt, get_jwt_identity, jwt_required, current_user

from services.user_token_service import UserTokenService
from services.user_service import UserService

auth_bp = Blueprint('auth', __name__)


@auth_bp.post('/register')
def register_user():
    try:
        # Get body as JSON
        data = request.get_json()

        # Get user credentials from the request
        user_name = data.get("userName").strip()
        password = data.get("password").strip()

        users_db = db.getDb("./instance/users.json")

        # Locate user by user_name
        users = users_db.getBy({"userName": user_name})

        # Make sure not an existing user
        if (len(users) > 0):
            return jsonify({"message": "user already exists"}), 409  # Conflict

        password_bytes = password.encode('utf-8')
        password_salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(
            password_bytes, password_salt).decode('utf-8')

        new_user = {
            "userName": user_name,
            "password": hashed_password,
            "resetPassword": False
        }

        id = users_db.add(new_user)

        # Return created message with the new user ID
        return jsonify({"message": f"user created with ID: '{id}'"}), 201
    except Exception as ex:
        # Print exception for debugging use
        print(ex)

        # Internal server error
        return jsonify({"message": f"server error occurred"}), 500


@auth_bp.post('/login')
@container.autowire
def login_user(user_service: UserService, user_token_service: UserTokenService):
    try:
        # Get body as JSON
        data = request.get_json()

        # Get user credentials from the request
        user_name = data.get("userName").strip()
        password = data.get("password").strip()

        # Locate user by user_name
        user = user_service.get_user(user_name)

        if user is None:
            # A matching user_name was not found in the database
            return jsonify({"message": "invalid user_name or password"}), 401

        # Test password for match against database
        password_valid = user_service.validate_user_password(
            password, user["id"])

        if not password_valid:
            # Invalid password for the given user_name
            return jsonify({"message": f"invalid user_name or password"}), 401

        # Create access and refresh tokens
        token = user_token_service.create(user_name)

        # Return token to caller
        return jsonify(token), 200

    except Exception as ex:
        # Print exception for debugging use
        print(ex)

        # Internal server error
        return jsonify({"message": f"server error occurred"}), 500


@auth_bp.get('/logout')
@jwt_required(verify_type=False)
@container.autowire
def revoke_token(user_token_service: UserTokenService):
    jwt = get_jwt()

    user_token_service.revoke(jwt["sub"])

    # Always return success regardless of result
    return jsonify({"message": "user token revoked"}), 200


@auth_bp.get('/refresh-token')
@jwt_required(refresh=True)
@container.autowire
def refresh_token(user_token_service: UserTokenService):
    identity = get_jwt_identity()

    access_token = user_token_service.refresh(identity)

    if access_token is None:
        return jsonify({"message": "invalid or expired token"}), 401

    return jsonify({"access_token": access_token}), 200


@auth_bp.get('/me')
@jwt_required()
def get_user_detail():
    return jsonify({"user": current_user}), 200
