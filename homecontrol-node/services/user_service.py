from dataclasses import dataclass
import bcrypt
from typing import Optional
from wireup import service
from entities.user import User, UserSecurityRole
from constants.user_security_roles import SECURITY_ROLE_ADMIN, SECURITY_ROLE_USER
from models.user import UserModel
from services.base import BaseService
from services.data_service import DataService


@service
@dataclass
class UserService(BaseService):
    data_service: DataService

    def get_all_users(self) -> list[User]:
        users_dict = self.data_service.get_users_db().getAll()
        users = list(map(lambda u: User(**u), users_dict))
        return users

    def get_all_user_security_roles(self) -> list[User]:
        roles_dict = self.data_service.get_user_security_roles_db().getAll()
        roles = list(map(lambda role: UserSecurityRole(**role), roles_dict))
        return roles

    def get_user(self, username: str) -> Optional[User]:
        users = self.data_service.get_users_db().getBy(
            {"username": username})

        if len(users) == 0:
            return None

        # Created user instance using the the first returned element
        return User(**users[0])

    def get_user_security_roles(self, user_id: int) -> list[UserSecurityRole]:
        # Get any roles for the specified user ID
        user_security_roles_dict = self.data_service.get_user_security_roles_db().getBy(
            {"user_id": user_id})

        # Map to classes
        user_security_roles = list(
            map(lambda role: UserSecurityRole(**role)), user_security_roles_dict)

        # Return list (which will be empty if the user has no security roles)
        return user_security_roles

    def validate_user_password(self, password: str, user: User) -> bool:
        bytes = password.encode('utf-8')
        result = bcrypt.checkpw(bytes, user.password.encode('utf-8'))
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

    def ensure_admin_user(self) -> Optional[User]:
        users_db = self.data_service.get_users_db()
        user_security_roles_db = self.data_service.get_user_security_roles_db()

        users = users_db.getAll()
        if len(users) > 0:
            return None  # No user created

        # Create a user with 'admin' as username and 'admin' as password
        admin = "admin"

        new_user = User(
            id=0,
            username=admin,
            password=UserService.generate_hashed_password(admin)
        )

        users_db.add(new_user.model_dump())

        users = users_db.getBy({"username": admin})

        user = User(**users[0])

        # Give the new admin user both the admin and user security roles
        adminSecurityRole = UserSecurityRole(
            id=0, user_id=user.id, role=SECURITY_ROLE_ADMIN)
        user_security_roles_db.add(adminSecurityRole.model_dump())

        userSecurityRole = UserSecurityRole(
            id=0, user_id=user.id, role=SECURITY_ROLE_USER)
        user_security_roles_db.add(userSecurityRole.model_dump())

        # Created user instance using the the first returned element
        return user
