from dataclasses import dataclass
import bcrypt
from typing import Optional
from wireup import container
from wireup import service
from models.user import User
from services.base import BaseService
from services.data import DataService


@service
@dataclass
class UserService(BaseService):
    data_service: DataService

    def get_user(self, username: str) -> Optional[User]:
        users = self.data_service.get_users_db().getBy(
            {"username": username})

        if len(users) == 0:
            return None

        return User(**users[0])

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
        return User(**users[0])
