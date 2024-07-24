import yaml
from flask_jwt_extended import JWTManager
from flask import Flask, jsonify
from wireup import container, initialize_container
from pyaml_env import parse_config

from controllers.auth_controller import auth_bp
from controllers.user_controller import user_bp
import services
from services.revoked_token_service import RevokedTokenService
from services.user_service import UserService


def create_app():
    app = Flask(__name__)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(user_bp, url_prefix='/users')

    # Initialise configuration and DI
    all_config = parse_config("config/parameters.yaml", loader=yaml.Loader)
    container.params.update(all_config["app"])
    initialize_container(container, service_modules=[services])

    # Initialise JWT
    jwt = JWTManager()
    jwt.init_app(app)

    # Make sure there is at least one user who is the default admin user
    user_service = container.get(UserService)
    user_service.ensure_admin_user()

    app.config.from_prefixed_env()

    # User injection
    @ jwt.user_lookup_loader
    def inject_user(jwt_headers, jwt_data):
        username = jwt_data["sub"]

        if username is None:
            return None

        user = user_service.get_user(username=username)
        return user

    # JWT claims
    @ jwt.additional_claims_loader
    def inject_user_claims(identity):
        user = user_service.get_user(username=identity)
        if user and user.id == "cca7efea-7652-4486-b90c-63ab67a54c1a":
            return {"is_admin": True}

        return None

    # JWT error handling
    @ jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_data):
        return jsonify({"message": "Authorization header Bearer JWT has expired"}), 401

    @ jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({"message": "Authorization header Bearer JWT is invalid"}), 401

    @ jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({"message": "Authorization header Bearer JWT is missing"}), 401

    @ jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_data):
        return jsonify({"message": "Authorization header Bearer JWT has been revoked"}), 401

    @ jwt.token_in_blocklist_loader
    def check_token_revoked(jwt_header, jwt_data):
        revoked_token_service = container.get(RevokedTokenService)
        revoked_token = revoked_token_service.get_revoked_token(jwt_data)
        return revoked_token is not None

    return app


if __name__ == "__main__":
    app = create_app()
    app.run()
