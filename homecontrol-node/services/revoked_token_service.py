from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Optional
from wireup import service
from entities.revoked_token import RevokedToken
from services.base import BaseService
from services.data_service import DataService


@service
@dataclass
class RevokedTokenService(BaseService):
    data_service: DataService

    def get_revoked_token(self, jwt: dict) -> Optional[RevokedToken]:
        jti = jwt["jti"]

        revoked_tokens = self.data_service.get_user_revoked_tokens_db().getBy(
            {"jti": jti})

        if len(revoked_tokens) == 0:
            return None

        # Created revoked token instance using the the first returned element
        return RevokedToken(**revoked_tokens[0])

    def revoke_token(self, jwt: dict) -> Optional[RevokedToken]:
        jti = jwt["jti"]
        token_type = jwt["type"]

        # Token must have a JTI and a token type
        if jti is None or token_type is None:
            return None

        # Create token instance
        revoked_token = RevokedToken(
            id=0, jti=jti, type=token_type, created=datetime.now(timezone.utc).isoformat())

        # Add to DB (and set ID to DB generated ID that is returned)
        revoked_token.id = self.data_service.get_user_revoked_tokens_db().add(
            revoked_token.model_dump())

        # Return the created token instance
        return revoked_token
