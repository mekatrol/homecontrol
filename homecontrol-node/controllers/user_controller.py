from dataclasses import asdict
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from wireup import container

from services.user_service import UserService

user_bp = Blueprint('users', __name__)


@user_bp.get('/all')
@jwt_required()
@container.autowire
def get_all_users(user_service: UserService):
    # Get all users including their roles
    users = user_service.get_all_users(include_roles=True)

    # Convert to serializable dictionary versions
    serializable_users = list(map(lambda u: asdict(u), users))

    # Return JSON response with user list
    return jsonify({
        "users": serializable_users
    }), 200
