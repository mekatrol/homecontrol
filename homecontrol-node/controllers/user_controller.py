from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from wireup import container

from services.user_mapper_service import UserMapperService
from services.user_service import UserService

user_bp = Blueprint('users', __name__)


@user_bp.get('/all')
@jwt_required()
@container.autowire
def get_all_users(user_service: UserService, user_mapper_service: UserMapperService):
    users = user_service.get_all_users()
    user_security_roles = user_service.get_all_user_security_roles()
    user_models = []

    for user_entity in users:
        user_model = user_mapper_service.map_to_model(
            user_entity, user_security_roles)
        user_models.append(user_model)

    return jsonify({
        "users": user_models
    }), 200
