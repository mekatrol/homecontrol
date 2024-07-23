from pydantic import BaseModel


class RevokedToken(BaseModel):
    id: int
    jti: str
    type: str
    created: str  # As an ISO formatted string
