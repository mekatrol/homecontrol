from dataclasses import dataclass
import bcrypt
from typing import Optional
from wireup import service
from constants.user_security_roles import SECURITY_ROLE_ADMIN, SECURITY_ROLE_USER
from services.base import BaseService
from services.data_service import DataService
from services.user_mapper_service import UserMapperService


class UserExistsException(Exception):
    pass


class InvalidCredentialsException(Exception):
    pass


@service
@dataclass
class UserService(BaseService):
    data_service: DataService
    user_mapper_service: UserMapperService

    def create_user(self, user_name: str, password: str) -> dict:
        # Make sure white space stripped
        user_name = user_name.strip()
        password = password.strip()

        if len(user_name) == 0 or len(password) == 0:
            # Raise invalid credentials provided exception
            raise InvalidCredentialsException(
                "invalid user name or password provided")

        users_db = self.data_service.get_users_db()

        # Locate existing user by user_name
        users = users_db.getBy({"userName": user_name})

        # Make sure not an existing user
        if (len(users) > 0):
            raise UserExistsException("user already exists")

        password_bytes = password.encode('utf-8')
        password_salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(
            password_bytes, password_salt).decode('utf-8')

        new_user = {
            "userName": user_name,
            "password": hashed_password,
            "resetPassword": False
        }

        users_db.add(new_user)

        return new_user

    def get_all_users(self, include_roles: bool = False) -> list[dict]:
        with self.data_service:
            # Default to no roles
            user_security_roles = None

            # If the caller wants roles included then fetch all user security roles
            if include_roles:
                user_security_roles = self.get_all_user_security_roles()

            # Get all users (as dictionary objects)
            users_list = self.data_service.get_users_db().getAll()

            user_models = []

            # Iterate each entity
            for user_entity in users_list:
                # Convert to user model (including user roles if roles list populated)
                user_model = self.user_mapper_service.map_to_model(
                    user_entity, user_security_roles)

                user_models.append(user_model)

            # Return list of user models
            return user_models

    def get_all_user_security_roles(self) -> list[dict]:
        with self.data_service:
            roles = self.data_service.get_user_security_roles_db().getAll()
            return roles

    def get_user(self, user_name: str) -> Optional[dict]:
        with self.data_service:
            users = self.data_service.get_users_db().getBy(
                {"userName": user_name})

            if len(users) == 0:
                return None

            user_security_roles = self.get_user_security_roles(users[0]["id"])

            user_model = self.user_mapper_service.map_to_model(
                users[0], user_security_roles)

            # Created user instance using the the first returned element
            return user_model

    def get_user_security_roles(self, user_id: int) -> list[dict]:
        with self.data_service:
            # Get any roles for the specified user ID
            return self.data_service.get_user_security_roles_db().getBy(
                {"userId": user_id})

    def validate_user_password(self, password: str, user_id: int) -> bool:
        with self.data_service:
            # We need to refetch user including password
            users = self.data_service.get_users_db().getBy(
                {"id": user_id})

            if len(users) == 0:
                # Password not valid for unknown user
                return False

            bytes = password.encode('utf-8')
            result = bcrypt.checkpw(
                bytes, users[0]["password"].encode('utf-8'))
            return result

    @staticmethod
    def generate_hashed_password(password: str) -> str:
        password_bytes = password.encode('utf-8')
        password_salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(
            password_bytes,
            password_salt
        ).decode('utf-8')

        return hashed_password

    def ensure_admin_user(self) -> Optional[dict]:
        with self.data_service:
            users_db = self.data_service.get_users_db()
            user_security_roles_db = self.data_service.get_user_security_roles_db()

            users = users_db.getAll()
            if len(users) > 0:
                return None  # No user created

            # Create a user with 'admin' as user_name and 'admin' as password
            admin = "admin"

            new_user = {
                "userName": admin,
                "password": UserService.generate_hashed_password(admin),
                "resetPassword": True  # New users should reset password
            }

            users_db.add(new_user)

            users = users_db.getBy({"userName": admin})

            user = users[0]

            # Give the new admin user both the admin and user security roles
            adminSecurityRole = {
                "userId": user["id"],
                "role": SECURITY_ROLE_ADMIN
            }
            user_security_roles_db.add(adminSecurityRole)

            userSecurityRole = {
                "userId": user["id"],
                "role": SECURITY_ROLE_USER
            }
            user_security_roles_db.add(userSecurityRole)

            # Created user instance using the the first returned element
            return user
