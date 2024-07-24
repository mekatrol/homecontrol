from pydantic import BaseModel


class User(BaseModel):
    id: int
    username: str
    password: str


class UserSecurityRole(BaseModel):
    id: int
    user_id: int
    role: str
