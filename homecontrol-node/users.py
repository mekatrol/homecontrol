from flask import Blueprint, jsonify
from models.user import UserModel
from flask_jwt_extended import jwt_required
from wireup import container

from services.user_service import UserService

user_bp = Blueprint('users', __name__)


@user_bp.get('/all')
@jwt_required()
@container.autowire
def get_all_users(user_service: UserService):
    users = user_service.get_all_users()

    # Create JSON model without password
    user_models = UserModel().dump(users, many=True)

    return jsonify({
        "users": user_models
    }), 200
