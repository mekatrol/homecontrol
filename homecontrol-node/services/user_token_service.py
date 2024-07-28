from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Annotated, Optional
from flask_jwt_extended import create_access_token, create_refresh_token
from wireup import Inject, service
from services.base import BaseService
from services.data_service import DataService


@service
@dataclass
class UserTokenService(BaseService):
    data_service: DataService
    jwt_expiry_mins: Annotated[int, Inject(param="jwt_expiry_mins")]

    def get(self, user_name: str) -> Optional[dict]:
        with self.data_service:
            user_tokens = self.data_service.get_user_tokens_db().getBy(
                {"userName": user_name})

            if len(user_tokens) == 0:
                return None

            # Return user
            return user_tokens[0]

    def create(self, user_name: str) -> dict:
        with self.data_service:
            # Revoke any existing
            self.revoke(user_name)

            # Create access token and metadata
            access_token_expires = timedelta(minutes=10)
            access_token_expiry = datetime.now(
                timezone.utc) + access_token_expires
            access_token = create_access_token(
                identity=user_name, expires_delta=access_token_expires)

            # Create refresh token and metadata
            refresh_token = create_refresh_token(identity=user_name)
            refresh_token_expires = timedelta(minutes=self.jwt_expiry_mins)
            refresh_token_expiry = datetime.now(
                timezone.utc) + refresh_token_expires

            token = {
                "userName": user_name,
                "accessToken": access_token,
                "accessTokenExpiry": access_token_expiry.isoformat(),
                "refreshToken": refresh_token,
                "refreshTokenExpiry": refresh_token_expiry.isoformat()
            }

            self.data_service.get_user_tokens_db().add(token)

            # We don't want to include the ID of the token in the return value
            del token['id']

            return token

    def refresh(self, user_name: str) -> Optional[str]:
        # Get existing token
        token = self.get(user_name)

        if token is None:
            # The token has been revoked
            return None

        # Create access token
        access_token = create_access_token(identity=user_name)

        token_id = token["id"]

        self.data_service.get_user_tokens_db().updateById(
            token_id, {"accessToken": access_token})

        return access_token

    def revoke(self, user_name: str) -> None:
        with self.data_service:
            # Find existing tokens
            tokens = self.data_service.get_user_tokens_db().getBy(
                {"userName": user_name})

            # Revoke all found tokens
            for token in tokens:
                # Delete token from DB
                self.data_service.get_user_tokens_db().deleteById(token["id"])
