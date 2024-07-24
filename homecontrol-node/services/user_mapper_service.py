from typing import Optional
from wireup import service
from entities.user import User, UserSecurityRole
from models.user import UserModel
from services.base import BaseService


@service
class UserMapperService(BaseService):

    def map_to_model(self, user: User, roles: Optional[list[UserSecurityRole]]) -> UserModel:
        # Map entity to model
        user_model = UserModel(id=user.id, userName=user.username, roles=[])

        if roles is not None:
            # Create a filter to get roles for just this user
            roles_filter = filter(
                lambda role: role.user_id == user.id, roles)

            # Create a map to select just the role name
            roles_map = map(lambda r: r.role, roles_filter)

            # Create a list of role names
            user_model.roles = list(roles_map)

        return user_model
