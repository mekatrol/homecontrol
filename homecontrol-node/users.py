from flask import Blueprint, jsonify
from schemas import UserSchema
from flask_jwt_extended import jwt_required
from wireup import container

from services.data_service import DataService

user_bp = Blueprint('users', __name__)


@user_bp.get('/all')
@jwt_required()
@container.autowire
def get_all_users(data_service: DataService):
    users_db = data_service.get_users_db()

    users = users_db.getAll()

    result = UserSchema().dump(users, many=True)

    return jsonify({
        "users": result,
    }), 200
